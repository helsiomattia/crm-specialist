import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, cp, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { blogMetadataErrors, filterBlogPosts, formatBlogDate, isPublicPost } from '../src/utils/blog.js';
import { MarkdownContent, markdownOutline } from '../src/utils/blog-markdown.js';
import { readBlogContent, blogContentPlugin, validateEditorial } from '../scripts/lib/blog-content.mjs';
import { blogFixture } from './helpers/blog-fixture.mjs';
import { publishBlogPost } from '../scripts/publish-blog-post.mjs';

const metadata = blogFixture('meu-artigo');
async function fixtureRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'hm-blog-unit-'));
  await mkdir(path.join(root, 'content/editorial'), { recursive: true });
  await cp('content/editorial/taxonomy.json', path.join(root, 'content/editorial/taxonomy.json'));
  return root;
}
async function save(root, metadata, body = '## Contexto\n\nUm corpo de artigo com referências e exemplos.') {
  const folder = path.join(root, 'content/blog', metadata.slug);
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, 'metadata.json'), JSON.stringify(metadata));
  await writeFile(path.join(folder, 'article.md'), body);
}
async function cleanup(root) {
  if (!path.resolve(root).startsWith(`${path.resolve(os.tmpdir())}${path.sep}`) || !path.basename(root).startsWith('hm-blog-')) throw new Error('Unexpected temporary directory');
  await rm(root, { recursive: true, force: true });
}

test('editorial metadata rejects malformed dates, slugs, languages and incomplete approval', () => {
  assert.deepEqual(blogMetadataErrors(metadata, 'meu-artigo'), []);
  for (const publishedAt of ['2026-02-30', '2026-13-02', '20/11/2026']) assert(blogMetadataErrors({ ...metadata, publishedAt }, metadata.slug).length);
  for (const slug of ['../post', 'UPPER', 'a--b', '-a', 'a/child']) assert(blogMetadataErrors(metadata, slug).length);
  for (const change of [{ title: '' }, { status: 'publishd' }, { tags: 'CRM' }, { language: 'xx' }, { publishedAt: null }, { approvedBy: null }, { reviewedAt: null }, { confidentialityStatus: 'review' }, { factualStatus: 'review' }, { languages: ['en'] }, { updatedAt: '2026-11-19' }, { sources: [{ ...metadata.sources[0], url: 'https://' }] }, { sources: [...metadata.sources, ...metadata.sources] }]) assert(blogMetadataErrors({ ...metadata, ...change }, metadata.slug).length);
  assert(blogMetadataErrors(null, metadata.slug).length);
  assert(!isPublicPost({ ...metadata, status: 'ready' }));
  assert(!isPublicPost({ ...metadata, editorialStatus: 'confidentiality-review' }));
});

test('search combines translated metadata, full body, category and tag without accents', () => {
  const posts = [{ ...metadata, searchText: 'Observabilidade e reconciliação' }, blogFixture('segundo', { category: 'processos', tags: ['indicadores'] })];
  assert.equal(filterBlogPosts(posts, 'RECONCILIACAO integration', 'salesforce', 'crm').length, 1);
  assert.equal(filterBlogPosts(posts, 'reconciliacao', 'processos').length, 0);
  assert.equal(filterBlogPosts(posts, '  ').length, 2);
  assert.equal(filterBlogPosts(posts, 'zzzzz').length, 0);
  assert.match(formatBlogDate('2026-11-20', 'pt'), /20.*novembro.*2026/);
});

test('new article is an unpublished draft and creation refuses overwrite or traversal', async () => {
  const root = await fixtureRoot();
  try {
    await mkdir(path.join(root, 'scripts'), { recursive: true });
    await mkdir(path.join(root, 'src/utils'), { recursive: true });
    await writeFile(path.join(root, 'package.json'), '{"type":"module"}');
    await cp('scripts/create-blog-post.mjs', path.join(root, 'scripts/create-blog-post.mjs'));
    await cp('src/utils/blog.js', path.join(root, 'src/utils/blog.js'));
    await cp('content/blog/_modelo', path.join(root, 'content/blog/_modelo'), { recursive: true });
    const run = slug => spawnSync(process.execPath, [path.join(root, 'scripts/create-blog-post.mjs'), slug], { encoding: 'utf8' });
    assert.equal(run('artigo-novo').status, 0);
    const article = path.join(root, 'content/blog/artigo-novo/article.md');
    const saved = await readFile(article, 'utf8');
    assert(saved.includes('## O contexto'));
    const created = JSON.parse(await readFile(path.join(root, 'content/blog/artigo-novo/metadata.json')));
    assert.equal(created.status, 'draft'); assert.equal(created.publishedAt, null);
    assert.deepEqual(blogMetadataErrors(created, 'artigo-novo'), []);
    assert.equal(run('artigo-novo').status, 1);
    assert.equal(await readFile(article, 'utf8'), saved);
    assert.equal(run('../fora').status, 1);
  } finally { await cleanup(root); }
});

test('production manifest excludes draft and ready metadata, bodies and search text', async () => {
  const root = await fixtureRoot();
  try {
    await save(root, blogFixture('publico', { internalNotes: 'UNLISTED_PRIVATE_NOTE' }));
    await save(root, blogFixture('privado', { status: 'draft', editorialStatus: 'draft', publishedAt: null, approvedBy: null }), 'PRIVATE_BODY');
    await save(root, blogFixture('revisao', { status: 'ready', editorialStatus: 'public-validated', publishedAt: null, approvedBy: null }), 'REVIEW_BODY');
    const plugin = blogContentPlugin(); plugin.configResolved({ root, command: 'build', mode: 'production' });
    const manifest = await plugin.load(plugin.resolveId('virtual:blog'));
    assert.match(manifest, /publico/); assert.doesNotMatch(manifest, /privado|revisao|PRIVATE_BODY|REVIEW_BODY|UNLISTED_PRIVATE_NOTE/);
    assert.throws(() => plugin.configResolved({ root, command: 'build', mode: 'editorial' }), /bloqueado/);
    plugin.configResolved({ root, command: 'serve', mode: 'editorial' });
    assert.match(await plugin.load(plugin.resolveId('virtual:blog')), /PRIVATE_BODY/);
  } finally { await cleanup(root); }
});

test('publication requires review, records the named approval and uses the actual Sao Paulo date', async () => {
  const root = await fixtureRoot();
  try {
    const ready = blogFixture('revisado', { status: 'ready', editorialStatus: 'public-validated', publishedAt: null, approvedBy: null });
    await save(root, ready);
    await assert.rejects(publishBlogPost(root, ready.slug, ''), /revisor/);
    await publishBlogPost(root, ready.slug, 'Revisor identificado', new Date('2026-11-21T01:30:00Z'));
    const published = (await readBlogContent(root))[0];
    assert(isPublicPost(published)); assert.equal(published.publishedAt, '2026-11-20'); assert.equal(published.approvedBy, 'Revisor identificado');
    await assert.rejects(publishBlogPost(root, ready.slug, 'Outro revisor'), /ready/);
    await save(root, { ...ready, status: 'draft', editorialStatus: 'confidentiality-review', confidentialityStatus: 'review' });
    await assert.rejects(publishBlogPost(root, ready.slug, 'Revisor'), /ready/);
    assert.equal((await readBlogContent(root))[0].publishedAt, null);
  } finally { await cleanup(root); }
});

test('catalog rejects duplicate identifiers, unknown taxonomy, missing relations and translations', async () => {
  const root = await fixtureRoot();
  try {
    await save(root, metadata);
    for (const change of [{ id: metadata.id }, { category: 'unknown' }, { tags: ['unknown'] }, { relatedArticles: ['missing'] }, { languages: ['pt', 'en'] }, { publishedAt: '2099-01-01' }]) {
      await save(root, blogFixture('segundo', change));
      await assert.rejects(readBlogContent(root));
    }
    await save(root, blogFixture('segundo'), '## Referência\n\n[Inexistente](/blog/nao-existe)');
    await assert.rejects(readBlogContent(root), /link interno inexistente/);
    await save(root, blogFixture('segundo'), '');
    await assert.rejects(readBlogContent(root), /article.md está vazio/);
  } finally { await cleanup(root); }
});

test('Markdown blocks executable HTML and unsafe URLs; heading anchors are stable and unique', () => {
  const markdown = '## Contexto\n\n<script>alert(1)</script>\n\n[Inseguro](javascript:alert%281%29)\n\n[Local](/blog)\n\n## Contexto\n\n```\n## Não é título\n```\n\n[Privado](/blog/privado)';
  const outline = markdownOutline(markdown);
  assert.deepEqual(outline.headings.map(item => item.id), ['blog-contexto', 'blog-contexto-2']);
  const html = renderToStaticMarkup(React.createElement(MarkdownContent, { content: markdown, base: '/crm-specialist', availableSlugs: [] }));
  assert.doesNotMatch(html, /<script|href="javascript:|href="[^\"]*privado/);
  assert.match(html, /href="\/crm-specialist\/blog"/);
  assert.match(html, /id="blog-contexto-2"/);
});

test('initial editorial library retains its eighteen full originals and allows new articles and ideas', async () => {
  const posts = await readBlogContent(process.cwd());
  const report = await validateEditorial(process.cwd(), posts);
  assert(report.articles >= 18); assert(report.backlog >= 60); assert.equal(report.categories.length, 6);
  for (const category of report.categories) { assert(category.articles >= 3); assert(category.ideas >= 10); }
  const initial = posts.filter(post => /^HM-0(?:0[1-9]|1[0-8])$/.test(post.id));
  assert.equal(initial.length, 18);
  for (const post of initial) {
    assert(post.wordCounts.pt >= 900 && post.wordCounts.pt <= 1600); assert.equal(post.language, 'pt'); assert(post.sources.length);
    assert(isPublicPost(post), `${post.slug}: o artigo inicial precisa aparecer no site normal, além da prévia editorial.`);
  }
});

test('knowledge expansion maps every supplied line to complete public articles', async () => {
  const root = process.cwd();
  const coverage = JSON.parse(await readFile(path.join(root, 'content/editorial/coverage-2026-11-28.json'), 'utf8'));
  const supplied = (await readFile(path.join(root, 'content/editorial', coverage.source), 'utf8')).split(/\r?\n/)
    .filter(line => line.includes('\t') && !line.startsWith('Linha de conhecimento') && !line.startsWith('Ideia ou iniciativa'));
  const posts = await readBlogContent(root);
  const bySlug = new Map(posts.map(post => [post.slug, post]));
  assert.equal(coverage.rows.length, supplied.length);
  assert.equal(new Set(coverage.rows.map(row => row.id)).size, supplied.length);
  assert(posts.filter(isPublicPost).length >= coverage.totalArticles);
  for (const [index, row] of coverage.rows.entries()) {
    assert.equal(`${row.topic}\t${row.requestedTopics}`, supplied[index]);
    assert(row.after.scope && row.after.articles.length);
    for (const slug of row.after.articles) {
      const post = bySlug.get(slug);
      assert(post && isPublicPost(post), `${row.id}: ${slug} precisa estar disponível`);
      assert(post.wordCounts.pt >= 500 && post.sources.length, `${slug}: corpo e referências necessários`);
      assert(!post.bodies.pt.includes('[['), `${slug}: referência não resolvida`);
    }
  }
});
