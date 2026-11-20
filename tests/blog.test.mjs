import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, cp, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { blogMetadataErrors, filterBlogPosts, formatBlogDate } from '../src/utils/blog.js';
import { readBlogContent, blogContentPlugin } from '../scripts/lib/blog-content.mjs';

const metadata = { title: 'Arquitetura de integração', excerpt: 'Conectando sistemas com segurança', date: '2026-11-20', category: 'Arquitetura', tags: ['Salesforce', 'API'], author: 'Autor de teste', language: 'pt', status: 'published' };

test('blog metadata rejects impossible dates, traversal, missing fields and invalid publishing states', () => {
  assert.deepEqual(blogMetadataErrors(metadata, 'meu-artigo'), []);
  for (const date of ['2026-02-30', '2026-13-02', '20/11/2026']) assert(blogMetadataErrors({ ...metadata, date }, 'post').length);
  for (const slug of ['../post', 'UPPER', 'a--b', '-a', 'a/child']) assert(blogMetadataErrors(metadata, slug).length);
  for (const change of [{ title: '' }, { status: 'publishd' }, { tags: 'CRM' }, { language: 'xx' }, { date: null }]) assert(blogMetadataErrors({ ...metadata, ...change }, 'post').length);
  assert(blogMetadataErrors(null, 'post').length);
});

test('blog search combines category and accent-insensitive terms without matching unrelated posts', () => {
  const posts = [metadata, { ...metadata, title: 'Service Cloud', excerpt: 'Atendimento ao cliente', category: 'Operações', tags: ['Service'] }];
  assert.equal(filterBlogPosts(posts, 'INTEGRACAO API', 'Arquitetura').length, 1);
  assert.equal(filterBlogPosts(posts, 'integracao', 'Operações').length, 0);
  assert.equal(filterBlogPosts(posts, '  ').length, 2);
  assert.equal(filterBlogPosts(posts, 'zzzzz').length, 0);
  assert.match(formatBlogDate('2026-11-20', 'pt'), /20.*novembro.*2026/);
});

test('article creation generates a draft and refuses overwrite and invalid paths', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'hm-blog-cli-'));
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
    assert.equal(JSON.parse(await readFile(path.join(root, 'content/blog/artigo-novo/metadata.json'))).status, 'draft');
    assert.equal(run('artigo-novo').status, 1);
    assert.equal(await readFile(article, 'utf8'), saved);
    assert.equal(run('../fora').status, 1);
  } finally {
    if (!path.resolve(root).startsWith(`${path.resolve(os.tmpdir())}${path.sep}`) || !path.basename(root).startsWith('hm-blog-cli-')) throw new Error('Unexpected temporary directory');
    await rm(root, { recursive: true, force: true });
  }
});

test('content discovery sorts articles, ignores templates and excludes drafts from the built manifest', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'hm-blog-unit-'));
  try {
    for (const [slug, status, date] of [['antigo', 'published', '2026-10-01'], ['novo', 'published', '2026-11-20'], ['privado', 'draft', '2026-11-21']]) {
      const folder = path.join(root, 'content/blog', slug);
      await mkdir(folder, { recursive: true });
      await writeFile(path.join(folder, 'metadata.json'), JSON.stringify({ ...metadata, status, date }));
      await writeFile(path.join(folder, 'article.md'), '# Texto\n\nConteúdo do artigo.');
    }
    await mkdir(path.join(root, 'content/blog/_modelo'));
    const posts = await readBlogContent(root);
    assert.deepEqual(posts.map(post => post.slug), ['privado', 'novo', 'antigo']);
    const plugin = blogContentPlugin();
    plugin.configResolved({ root });
    const manifest = await plugin.load(plugin.resolveId('virtual:blog'));
    assert.match(manifest, /novo/);
    assert.match(manifest, /antigo/);
    assert.doesNotMatch(manifest, /privado|_modelo/);
    await writeFile(path.join(root, 'content/blog/novo/article.md'), '');
    await assert.rejects(readBlogContent(root), /article.md está vazio/);
  } finally {
    if (!path.resolve(root).startsWith(`${path.resolve(os.tmpdir())}${path.sep}`) || !path.basename(root).startsWith('hm-blog-unit-')) throw new Error('Unexpected temporary directory');
    await rm(root, { recursive: true, force: true });
  }
});
