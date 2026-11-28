import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { startTestServer } from './lib/test-server.mjs';
import { readBlogContent } from './lib/blog-content.mjs';
import { isPublicPost } from '../src/utils/blog.js';

const { chromium } = await import(process.env.HM_PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.HM_TEST_OUTPUT || 'test-results/blog-redesign';
await mkdir(output, { recursive: true });
const report = { date: new Date().toISOString(), checks: [], errors: [] };
const posts = (await readBlogContent(process.cwd())).filter(isPublicPost);
let browser, server;
const capture = async (page, name) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  });
  await page.screenshot({ path: path.join(output, name), fullPage: true });
};
try {
  server = await startTestServer();
  browser = await chromium.launch({ headless: true, ...(process.env.HM_BROWSER_PATH ? { executablePath: process.env.HM_BROWSER_PATH } : {}) });
  const blog = `${server.origin}/crm-specialist/blog`;
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: 'pt-BR', reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.stack));
    await page.goto(blog);
    await page.locator('.blog-feature h3').waitFor();
    assert.equal(await page.locator('#blog-main article').count(), 4);
    const articleUrls = await page.locator('#blog-main article h3 a').evaluateAll(links => links.map(link => link.href));
    assert.equal(new Set(articleUrls).size, 4, 'Destaque não pode reaparecer nos recentes.');
    assert.equal(await page.getByRole('searchbox').count(), 1);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('header').count(), 1);
    assert.equal(await page.locator('footer').count(), 1);
    assert.equal(await page.locator('.blog-series-card').count(), 6);
    await page.getByRole('button', { name: 'Ver todas as séries (9)', exact: true }).click();
    assert.equal(await page.locator('.blog-series-card').count(), 9);
    await page.getByRole('button', { name: 'Mostrar menos séries', exact: true }).click();
    await page.keyboard.press('Control+k');
    assert(await page.getByRole('searchbox').evaluate(node => node === document.activeElement));
    assert((await page.getByRole('searchbox').boundingBox()).height >= 40);
    await page.getByRole('searchbox').fill('integração');
    assert.equal(new URL(page.url()).searchParams.get('q'), 'integração');
    if (width < 1100) await page.locator('.blog-sidebar summary').click();
    await page.locator('.blog-sidebar').getByRole('button', { name: /Processos & Operações/ }).click();
    assert.equal(new URL(page.url()).searchParams.get('category'), 'processos');
    await page.reload();
    await page.getByRole('searchbox').waitFor();
    assert.equal(await page.getByRole('searchbox').inputValue(), 'integração');
    if (width < 1100) await page.locator('.blog-sidebar summary').click();
    assert.equal(await page.locator('.blog-sidebar').getByRole('button', { name: /Processos & Operações/ }).getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
    await page.locator('.blog-feature').waitFor();
    await page.getByRole('button', { name: 'Ativar tema escuro', exact: true }).click();
    await page.reload();
    await page.locator('.blog-shell[data-theme="dark"]').waitFor();
    await page.getByRole('combobox', { name: 'Filtrar por tag', exact: true }).click();
    const menuColors = await page.getByRole('listbox').evaluate(node => {
      const style = getComputedStyle(node.closest('.MuiPaper-root'));
      return { background: style.backgroundColor, color: style.color };
    });
    assert.equal(menuColors.background, 'rgb(23, 36, 59)');
    await page.keyboard.press('Escape');
    await page.evaluate(() => document.activeElement.blur());
    for (const language of ['English', 'Español', 'Português']) {
      await page.getByRole('button', { name: language, exact: true }).click();
      assert(!(await page.locator('#blog-main').innerText()).includes('blog.editorial.'));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px ${language}: overflow`);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    if ([390, 1440].includes(width)) await capture(page, `blog-dark-${width}.png`);
    await page.getByRole('button', { name: 'Ativar tema claro', exact: true }).click();
    await page.evaluate(() => document.activeElement.blur());
    if ([390, 1440].includes(width)) await capture(page, `blog-light-${width}.png`);
    await page.getByRole('link', { name: 'Ver todos os artigos', exact: true }).click();
    assert.equal(await page.locator('#blog-main article').count(), 12);
    assert.equal(await page.locator('.blog-feature').count(), 0);
    await page.getByRole('button', { name: 'Ir para página 2', exact: true }).click();
    assert.equal(await page.locator('#blog-main article').count(), Math.min(12, posts.length - 12));
    await page.reload();
    await page.getByRole('button', { name: 'Ir para página 2', exact: true }).waitFor();
    assert.equal(new URL(page.url()).searchParams.get('page'), '2');
    await page.goto(`${blog}/categoria/salesforce`);
    await page.locator('.blog-sidebar').waitFor();
    if (width < 1100) await page.locator('.blog-sidebar summary').click();
    await page.getByRole('link', { name: 'Séries e coleções', exact: true }).click();
    await page.waitForFunction(() => document.getElementById('blog-series')?.getBoundingClientRect().top < innerHeight);
    assert.equal(new URL(page.url()).hash, '#blog-series');
    report.checks.push(`${width}px: destaque único, busca única/Ctrl K, filtros combinados persistentes, menu responsivo, 9 séries acessíveis, temas persistentes, seletor escuro, PT/EN/ES sem overflow e biblioteca com ${posts.length} artigos.`);
    await context.close();
  }
  assert.equal(report.errors.length, 0);
  report.status = 'passed';
} catch (error) {
  report.status = 'failed'; report.errors.push(error.stack); process.exitCode = 1;
} finally {
  await browser?.close(); await server?.close();
  await writeFile(path.join(output, 'blog-editorial-results.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
