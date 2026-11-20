import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { build, createServer } from 'vite';
import react from '@vitejs/plugin-react';
import viteConfig from '../vite.config.js';
import { blogContentPlugin, readBlogContent } from './lib/blog-content.mjs';
import { startTestServer } from './lib/test-server.mjs';
import { blogFixture } from '../tests/helpers/blog-fixture.mjs';

const { chromium } = await import(process.env.HM_PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.HM_TEST_OUTPUT || 'test-results';
await mkdir(output, { recursive: true });
const root = process.cwd();
const fixture = await mkdtemp(path.join(root, 'node_modules/.hm-blog-test-'));
const report = { date: new Date().toISOString(), checks: [], errors: [] };
let server, browser, preview;
const note = message => { report.checks.push(message); console.log(message); };
const noOverflow = async page => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
try {
  const contentDirectory = path.join(fixture, 'content');
  const sample = `Introdução do artigo de teste. A palavra observabilidade aparece somente no corpo.\n\n## Contexto e decisões\n\n**Conteúdo em destaque**, com [documentação](https://example.com) e [link local](/blog).\n\n- Primeiro item\n- Segundo item\n\n> Uma observação importante.\n\n\`\`\`javascript\nconst valor = '${'exemplo-longo-'.repeat(25)}';\n\`\`\`\n\n<script>window.__blogUnsafe = true</script>\n\n[link inseguro](javascript:alert%281%29)\n\n## Contexto e decisões\n\nSegundo contexto com um identificador diferente.\n`;
  const fixturePosts = [
    blogFixture('integracao-crm', { title: { pt: 'Integração e arquitetura CRM', en: 'CRM integration and architecture', es: 'Integración y arquitectura CRM' }, relatedArticles: ['service-cloud'], series: 'arquitetura-salesforce', seriesOrder: 1, languages: ['pt', 'en'] }),
    blogFixture('service-cloud', { title: { pt: 'Operações com Service Cloud', en: 'Service Cloud operations', es: 'Operaciones con Service Cloud' }, category: 'processos', publishedAt: '2026-10-10', series: 'arquitetura-salesforce', seriesOrder: 2 }),
    blogFixture('rascunho-reservado', { title: { pt: 'PRIVATE_MARKER_7128', en: 'PRIVATE_MARKER_7128', es: 'PRIVATE_MARKER_7128' }, status: 'draft', editorialStatus: 'confidentiality-review', confidentialityStatus: 'review', publishedAt: null, approvedBy: null }),
    blogFixture('pronto-em-revisao', { title: { pt: 'READY_MARKER_7128', en: 'READY_MARKER_7128', es: 'READY_MARKER_7128' }, status: 'ready', editorialStatus: 'public-validated', publishedAt: null, approvedBy: null }),
  ];
  for (const post of fixturePosts) {
    const folder = path.join(contentDirectory, post.slug);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, 'metadata.json'), JSON.stringify(post));
    await writeFile(path.join(folder, 'article.md'), post.status === 'published' ? sample : `${post.status === 'draft' ? 'PRIVATE' : 'READY'}_BODY_7128`);
    if (post.languages.includes('en')) await writeFile(path.join(folder, 'article.en.md'), '## Context and decisions\n\nComplete English content for an isolated translation test.');
  }
  const dist = path.join(fixture, 'dist');
  const config = viteConfig({ command: 'build' });
  await build({ ...config, configFile: false, logLevel: 'error', plugins: [react(), blogContentPlugin({ directory: contentDirectory })], build: { ...config.build, outDir: dist } });
  for (const file of await readdir(dist, { recursive: true })) {
    if (!/\.(js|html|xml|json)$/.test(file)) continue;
    assert.doesNotMatch(await readFile(path.join(dist, file), 'utf8'), /PRIVATE_(?:MARKER|BODY)_7128|READY_(?:MARKER|BODY)_7128/);
  }
  const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /blog\/integracao-crm/); assert.match(sitemap, /blog\/idioma\/en\/integracao-crm/);
  assert.doesNotMatch(sitemap, /rascunho-reservado|pronto-em-revisao/);
  note('Build e sitemap excluem títulos, corpo e busca de rascunhos/confidenciais e artigos ainda em revisão');
  server = await startTestServer(dist);
  browser = await chromium.launch({ headless: true, ...(process.env.HM_BROWSER_PATH ? { executablePath: process.env.HM_BROWSER_PATH } : {}) });
  const base = `${server.origin}/crm-specialist`;
  const plain = await browser.newContext({ javaScriptEnabled: false, locale: 'pt-BR' });
  const staticPage = await plain.newPage();
  for (const route of ['blog', 'blog/categoria/salesforce', 'blog/tag/crm', 'blog/serie/arquitetura-salesforce', 'blog/integracao-crm', 'blog/idioma/en/integracao-crm']) {
    const response = await staticPage.goto(`${base}/${route}`);
    assert.equal(response.status(), 200); assert.equal(await staticPage.locator('h1').count(), 1);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://helsiomattia.github.io/crm-specialist/${route}`);
    assert((await staticPage.locator('main').innerText()).length > 100);
    const schema = JSON.parse(await staticPage.locator('script[data-blog-seo]').textContent());
    assert(schema.some(item => item['@type'] === 'BreadcrumbList'));
    if (route.endsWith('/integracao-crm')) {
      assert(schema.some(item => item['@type'] === 'BlogPosting'));
      assert.equal(await staticPage.locator('link[hreflang]').count(), 2);
    }
    assert.equal(await staticPage.locator('.blog-prose script').count(), 0);
  }
  await staticPage.goto(`${base}/blog/service-cloud`);
  assert.equal(await staticPage.locator('link[hreflang]').count(), 1);
  await plain.close();
  note('Sem JavaScript: biblioteca, categoria, tag, série, artigo e tradução retornam HTML 200 completo, canonical e schema; hreflang somente para traduções existentes');

  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: 'pt-BR', reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === server.origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.stack));
    await page.goto(`${base}/blog`);
    await page.locator('#blog-main h1').waitFor();
    assert.equal(await page.locator('#blog-main article').count(), 2);
    await page.getByLabel('Buscar artigos', { exact: true }).fill('OBSERVABILIDADE');
    assert.equal(await page.locator('#blog-main article').count(), 2);
    await page.getByLabel('Buscar artigos', { exact: true }).fill('INTEGRACAO');
    assert.equal(await page.locator('#blog-main article').count(), 1);
    await page.getByRole('combobox', { name: 'Filtrar por tema', exact: true }).click();
    await page.getByRole('option', { name: 'Processos & Operações', exact: true }).click();
    await page.getByText('Nenhum artigo encontrado.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    assert.equal(await page.locator('#blog-main article').count(), 2);
    await page.getByRole('combobox', { name: 'Filtrar por tag', exact: true }).click();
    await page.getByRole('option', { name: 'CRM', exact: true }).click();
    await page.reload(); await page.locator('#blog-main h1').waitFor();
    assert.equal(new URL(page.url()).searchParams.get('tag'), 'crm');
    const articleLink = page.getByRole('link', { name: 'Integração e arquitetura CRM', exact: true });
    await articleLink.focus(); await page.keyboard.press('Enter');
    await page.locator('.blog-prose pre').waitFor();
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.blog-prose strong').innerText(), 'Conteúdo em destaque');
    assert.equal(await page.locator('.blog-prose script').count(), 0);
    assert.equal(await page.evaluate(() => window.__blogUnsafe), undefined);
    assert(!((await page.getByRole('link', { name: 'link inseguro' }).getAttribute('href')) || '').startsWith('javascript:'));
    assert.equal(await page.getByRole('link', { name: 'link local' }).getAttribute('href'), '/crm-specialist/blog');
    assert.equal(await page.title(), 'Integração e arquitetura CRM | HM.crm');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://helsiomattia.github.io/crm-specialist/blog/integracao-crm');
    const toc = page.getByRole('navigation', { name: 'Neste artigo', exact: true });
    assert.equal(await toc.getByRole('link').count(), 2);
    await toc.getByRole('link').last().click();
    assert.equal(new URL(page.url()).hash, '#blog-contexto-e-decisoes-2');
    await page.reload(); await page.locator('.blog-prose pre').waitFor();
    await noOverflow(page);
    await page.getByRole('button', { name: 'Copiar link', exact: true }).click();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('#blog-main [role="status"]')).some(node => node.textContent.trim()));
    const seriesNext = page.getByRole('link').filter({ hasText: /^Próxima leitura/ });
    await seriesNext.click(); await page.locator('.blog-prose pre').waitFor();
    assert.match(page.url(), /blog\/service-cloud/);
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await page.getByText(/This article is available in full in Portuguese/).waitFor();
    assert.equal(await page.locator('h1').innerText(), 'Operações com Service Cloud');
    await page.getByRole('button', { name: 'Español', exact: true }).click();
    await page.getByText(/Este artículo está disponible íntegramente/).waitFor();
    await page.getByRole('button', { name: 'Português', exact: true }).click();
    for (const route of ['blog/categoria/salesforce', 'blog/tag/crm', 'blog/serie/arquitetura-salesforce']) {
      await page.goto(`${base}/${route}`); await page.locator('#blog-main h1').waitFor(); await noOverflow(page);
      assert((await page.locator('#blog-main article').count()) > 0);
    }
    await page.goto(`${base}/blog/idioma/en/integracao-crm`); await page.locator('.blog-prose h2').waitFor();
    assert.equal(await page.locator('h1').innerText(), 'CRM integration and architecture');
    for (const route of ['blog/rascunho-reservado', 'blog/pronto-em-revisao', 'blog/idioma/es/integracao-crm']) {
      await page.goto(`${base}/${route}`); await page.getByRole('heading', { name: 'Artigo não encontrado', exact: true }).waitFor();
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
    }
    await page.goto(`${base}/blog/categoria/inexistente`); await page.getByRole('heading', { name: 'Coleção não encontrada', exact: true }).waitFor();
    await page.goto(`${base}/blog`); await page.locator('#blog-main h1').waitFor();
    await page.getByRole('link', { name: 'Voltar ao portfólio', exact: true }).click(); await page.locator('#home').waitFor();
    assert.equal(await page.title(), 'Helsio Mattia | Salesforce CRM & Solution Architecture');
    assert.equal(await page.locator('script[data-blog-seo]').count(), 0);
    note(`${width}px: busca no corpo/sem acentos, filtros e refresh, leitura por teclado, TOC, link compartilhável, série, tags, idiomas/fallback, Markdown seguro, metadados e estados inválidos`);
    await context.close();
  }

  preview = await createServer({ logLevel: 'error', mode: 'editorial', server: { host: '127.0.0.1', port: 0, strictPort: false, watch: null }, optimizeDeps: { force: true } });
  await preview.listen();
  const local = `http://127.0.0.1:${preview.httpServer.address().port}`;
  const realPosts = await readBlogContent(root);
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: 'pt-BR', reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === local ? route.continue() : route.abort());
    const page = await context.newPage(); page.on('pageerror', error => report.errors.push(error.stack));
    await page.goto(`${local}/blog`); await page.getByRole('status').filter({ hasText: '18 artigos encontrados' }).waitFor();
    assert.equal(await page.locator('#blog-main article').count(), 13);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
    await noOverflow(page);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/editorial-index-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Ir para página 2', exact: true }).click();
    assert.equal(await page.locator('#blog-main article').count(), 6);
    if (width === 1440) for (const post of realPosts) {
      await page.goto(`${local}/blog/${post.slug}`); await page.locator('.blog-prose h2').first().waitFor();
      assert.equal(await page.locator('h1').count(), 1); assert((await page.locator('.blog-prose').innerText()).length > 4000);
      const ids = await page.locator('.blog-prose [id]').evaluateAll(nodes => nodes.map(node => node.id)); assert.equal(new Set(ids).size, ids.length);
      await noOverflow(page);
    }
    await page.goto(`${local}/blog/salesforce-arquitetura-operacional`); await page.locator('.blog-prose h2').first().waitFor(); await noOverflow(page);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/editorial-article-${width}.png`, fullPage: true });
    note(`${width}px: conteúdo real, prévia identificada/noindex, paginação 12+6, leitura responsiva${width === 1440 ? ' e todos os 18 artigos carregados' : ''}`);
    await context.close();
  }
  assert.equal(report.errors.length, 0);
  report.status = 'passed';
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1; }
finally {
  await preview?.close(); await browser?.close(); await server?.close();
  await writeFile(path.join(output, 'blog-browser-results.json'), JSON.stringify(report, null, 2) + '\n');
  if (!path.resolve(fixture).startsWith(`${path.resolve(root, 'node_modules')}${path.sep}`) || !path.basename(fixture).startsWith('.hm-blog-test-')) throw new Error('Unexpected fixture directory');
  await rm(fixture, { recursive: true, force: true });
}
console.log(JSON.stringify(report, null, 2));
