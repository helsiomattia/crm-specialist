import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import viteConfig from '../vite.config.js';
import { blogContentPlugin } from './lib/blog-content.mjs';
import { startTestServer } from './lib/test-server.mjs';

const { chromium } = await import(process.env.HM_PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.HM_TEST_OUTPUT || 'test-results';
await mkdir(output, { recursive: true });
const root = process.cwd();
const fixture = await mkdtemp(path.join(root, 'node_modules/.hm-blog-test-'));
const report = { date: new Date().toISOString(), checks: [], errors: [] };
let server, browser;
try {
  const contentDirectory = path.join(fixture, 'content');
  const sample = `Introdução do artigo de teste.\n\n## Contexto e decisões\n\n**Conteúdo em destaque**, com [documentação](https://example.com) e [link local](/blog).\n\n- Primeiro item\n- Segundo item\n\n> Uma observação importante.\n\n\`\`\`javascript\nconst valor = '${'exemplo-longo-'.repeat(25)}';\n\`\`\`\n\n<script>window.__blogUnsafe = true</script>\n\n[link inseguro](javascript:alert%281%29)\n`;
  for (const [slug, title, category, date, status] of [
    ['integracao-crm', 'Integração e arquitetura CRM', 'Arquitetura', '2026-11-20', 'published'],
    ['service-cloud', 'Operações com Service Cloud', 'Salesforce', '2026-10-10', 'published'],
    ['rascunho-reservado', 'RASCUNHO_NAO_PUBLICAR_7128', 'Interno', '2026-11-21', 'draft'],
  ]) {
    const folder = path.join(contentDirectory, slug);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, 'metadata.json'), JSON.stringify({ title, excerpt: 'Conteúdo de teste para validar busca e publicação.', category, tags: ['CRM'], author: 'Autor de teste', date, status, language: 'pt' }));
    await writeFile(path.join(folder, 'article.md'), status === 'draft' ? 'CORPO_PRIVADO_NAO_PUBLICAR_7128' : sample);
  }
  const dist = path.join(fixture, 'dist');
  const config = viteConfig({ command: 'build' });
  await build({ ...config, configFile: false, logLevel: 'error', plugins: [react(), blogContentPlugin({ directory: contentDirectory })], build: { ...config.build, outDir: dist } });
  for (const file of await readdir(path.join(dist, 'assets'))) {
    if (!file.endsWith('.js')) continue;
    assert.doesNotMatch(await readFile(path.join(dist, 'assets', file), 'utf8'), /RASCUNHO_NAO_PUBLICAR_7128|CORPO_PRIVADO_NAO_PUBLICAR_7128/);
  }
  report.checks.push('Build isolado contém os artigos publicados e exclui título e corpo do rascunho');
  const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /blog\/integracao-crm/);
  assert.match(sitemap, /blog\/service-cloud/);
  assert.doesNotMatch(sitemap, /rascunho-reservado/);
  report.checks.push('Sitemap inclui automaticamente os artigos publicados e exclui rascunhos');
  server = await startTestServer(dist);
  browser = await chromium.launch({ headless: true, ...(process.env.HM_BROWSER_PATH ? { executablePath: process.env.HM_BROWSER_PATH } : {}) });
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: 'pt-BR', reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === server.origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.stack));
    await page.goto(`${server.origin}/crm-specialist/blog`);
    await page.getByRole('heading', { name: 'Integração e arquitetura CRM' }).waitFor();
    assert.equal(await page.locator('#blog-main article').count(), 2);
    assert.match(await page.locator('#blog-main article').first().innerText(), /Integração e arquitetura/);
    await page.screenshot({ path: `${output}/blog-list-${width}.png` });
    await page.getByLabel('Buscar artigos', { exact: true }).fill('INTEGRACAO');
    assert.equal(await page.locator('#blog-main article').count(), 1);
    await page.getByRole('button', { name: 'Salesforce', exact: true }).click();
    await page.getByText('Nenhum artigo encontrado.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    assert.equal(await page.locator('#blog-main article').count(), 2);
    await page.getByRole('button', { name: 'Arquitetura', exact: true }).click();
    await page.reload();
    await page.getByRole('heading', { name: 'Integração e arquitetura CRM' }).waitFor();
    assert.equal(await page.locator('#blog-main article').count(), 1);
    const articleLink = page.getByRole('link', { name: 'Integração e arquitetura CRM', exact: true });
    await articleLink.focus();
    await page.keyboard.press('Enter');
    await page.locator('.blog-prose pre').waitFor();
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.blog-prose strong').innerText(), 'Conteúdo em destaque');
    assert.equal(await page.locator('.blog-prose script').count(), 0);
    assert.equal(await page.evaluate(() => window.__blogUnsafe), undefined);
    assert(!((await page.getByRole('link', { name: 'link inseguro' }).getAttribute('href')) || '').startsWith('javascript:'));
    assert.equal(await page.getByRole('link', { name: 'link local' }).getAttribute('href'), '/crm-specialist/blog');
    assert.equal(await page.title(), 'Integração e arquitetura CRM | HM.crm');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://helsiomattia.github.io/crm-specialist/blog/integracao-crm');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({ path: `${output}/blog-article-${width}.png` });
    await page.reload();
    await page.locator('.blog-prose pre').waitFor();
    await page.goBack();
    await page.getByRole('heading', { name: 'Integração e arquitetura CRM' }).waitFor();
    assert.equal(await page.locator('#blog-main article').count(), 1);
    for (const [language, expected] of [['English', 'Ideas put into practice.'], ['Español', 'Ideas que se llevan a la práctica.'], ['Português', 'Ideias que viram prática.']]) {
      await page.getByRole('button', { name: language, exact: true }).click();
      await page.getByRole('heading', { name: expected, exact: true }).waitFor();
    }
    await page.goto(`${server.origin}/crm-specialist/blog/rascunho-reservado`);
    await page.getByRole('heading', { name: 'Artigo não encontrado', exact: true }).waitFor();
    report.checks.push(`${width}px: lista, ordenação, busca sem acentos, filtro, estado vazio, refresh, leitura por teclado, histórico, Markdown seguro, links, metadados, idiomas e rascunho inacessível`);
    await context.close();
  }
  assert.equal(report.errors.length, 0);
  report.status = 'passed';
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1; }
finally {
  await browser?.close();
  await server?.close();
  // Only remove this run's uniquely created directory under the workspace.
  const allowed = `${path.resolve(root, 'node_modules')}${path.sep}`;
  if (!path.resolve(fixture).startsWith(allowed) || !path.basename(fixture).startsWith('.hm-blog-test-')) throw new Error('Unexpected fixture cleanup path');
  await rm(fixture, { recursive: true, force: true });
  await writeFile(`${output}/blog-results.json`, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
