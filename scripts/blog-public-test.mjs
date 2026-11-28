import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { readBlogContent } from './lib/blog-content.mjs';
import { startTestServer } from './lib/test-server.mjs';
import { isPublicPost } from '../src/utils/blog.js';
import { markdownOutline } from '../src/utils/blog-markdown.js';

const { chromium } = await import(process.env.HM_PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.HM_TEST_OUTPUT || 'test-results';
await mkdir(output, { recursive: true });
const posts = (await readBlogContent(process.cwd())).filter(isPublicPost);
const initial = posts.filter(post => /^HM-0(?:0[1-9]|1[0-8])$/.test(post.id));
const report = { date: new Date().toISOString(), checks: [], errors: [] };
let browser, production, development;
try {
  assert.equal(initial.length, 18, 'Os 18 artigos iniciais devem estar disponíveis no catálogo público, sem depender da prévia editorial.');
  production = await startTestServer();
  development = await createServer({ mode: 'development', logLevel: 'error', server: { host: '127.0.0.1', port: 0, strictPort: false, watch: null } });
  await development.listen();
  browser = await chromium.launch({ headless: true, ...(process.env.HM_BROWSER_PATH ? { executablePath: process.env.HM_BROWSER_PATH } : {}) });
  const targets = [
    { name: 'build de produção', origin: production.origin, base: '/crm-specialist' },
    { name: 'desenvolvimento normal', origin: `http://127.0.0.1:${development.httpServer.address().port}`, base: '' },
  ];
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  for (const post of posts) assert(sitemap.includes(`/blog/${post.slug}</loc>`));
  report.checks.push(`${posts.length} artigos reais presentes no sitemap de produção`);
  for (const target of targets) for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: 'pt-BR', reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === target.origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.stack));
    const blog = `${target.origin}${target.base}/blog`;
    await page.goto(blog);
    await page.getByRole('status').filter({ hasText: `${posts.length} artigos encontrados` }).waitFor();
    assert.equal(await page.getByText(/Prévia editorial local/).count(), 0);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index, follow');
    await page.getByRole('link', { name: 'Ver todos os artigos', exact: true }).click();
    await page.getByRole('button', { name: 'Ir para página 2', exact: true }).click();
    assert.equal(await page.locator('#blog-main article').count(), Math.min(12, posts.length - 12));
    await page.goto(blog);
    await page.getByRole('link', { name: initial[0].title.pt, exact: true }).first().click();
    await page.locator('.blog-prose h2').first().waitFor();
    assert.equal(await page.locator('h1').innerText(), initial[0].title.pt);
    await page.goBack(); await page.locator('#blog-library').waitFor();
    if (width === 1440) for (const post of posts) {
      const response = await page.goto(`${blog}/${post.slug}`);
      assert.equal(response.status(), 200);
      if (target.base) assert((await response.text()).includes('class="blog-prose"'), 'O corpo do artigo deve existir no HTML recebido, antes do JavaScript.');
      await page.locator('.blog-prose h2').first().waitFor();
      assert.equal(await page.locator('h1').innerText(), post.title.pt);
      assert.equal((await page.locator('.blog-prose').innerText()).replace(/\s/g, ''), markdownOutline(post.bodies.pt).text.replace(/\s/g, ''), `${post.slug}: corpo completo`);
      const schema = JSON.parse(await page.locator('script[data-blog-seo]').textContent());
      assert(schema.some(item => item['@type'] === 'BlogPosting' && item.datePublished === post.publishedAt));
    }
    await page.goto(`${blog}/categoria/salesforce`);
    await page.getByRole('status').filter({ hasText: `${posts.filter(post => post.category === 'salesforce').length} artigos encontrados` }).waitFor();
    await page.reload(); await page.locator('#blog-main article').first().waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    if (target.base) {
      await page.goto(blog); await page.locator('#blog-library').waitFor();
      await page.screenshot({ path: path.join(output, `blog-public-${width}.png`), fullPage: true });
    }
    report.checks.push(`${target.name}, ${width}px: biblioteca pública preenchida, paginação, abertura pelo card, histórico, categoria e refresh${width === 1440 ? `; ${posts.length} artigos lidos integralmente` : ''}`);
    await context.close();
  }
  assert.equal(report.errors.length, 0);
  report.status = 'passed';
} catch (error) { report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1; }
finally {
  await browser?.close(); await production?.close(); await development?.close();
  await writeFile(path.join(output, 'blog-public-results.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
