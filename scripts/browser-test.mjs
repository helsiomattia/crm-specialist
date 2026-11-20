import { mkdir, writeFile } from 'node:fs/promises';
import { startTestServer } from './lib/test-server.mjs';
import { verifyRoutes } from '../tests/browser/routes.mjs';
import { verifyEmbeds, verifyEmbedFailure } from '../tests/browser/embeds.mjs';
import { verifyDevelopment } from '../tests/browser/development.mjs';

const { chromium } = await import(process.env.HM_PLAYWRIGHT_MODULE || 'playwright');
const server = await startTestServer();
const browser = await chromium.launch({ headless: true, ...(process.env.HM_BROWSER_PATH ? { executablePath: process.env.HM_BROWSER_PATH } : {}) });
const output = process.env.HM_TEST_OUTPUT || 'test-results';
const report = { date: new Date().toISOString(), checks: [], errors: [] };
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, locale: 'pt-BR', reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === server.origin ? route.continue() : route.abort());
    context.on('page', page => page.on('pageerror', error => report.errors.push(`${page.url()}: ${error.stack}`)));
    if (!process.argv.includes('--embeds')) {
      await verifyRoutes(context, server.origin, report.checks);
      console.log(`Rotas verificadas em ${width}px.`);
    }
    if (!process.argv.includes('--routes')) await verifyEmbeds(context, server.origin, report.checks);
    if (width === 1440 && !process.argv.includes('--routes')) await verifyEmbedFailure(context, server.origin, report.checks);
    await context.close();
  }
  const blocked = await browser.newContext({ locale: 'pt-BR', reducedMotion: 'reduce' });
  blocked.on('page', page => page.on('pageerror', error => report.errors.push(`${page.url()}: ${error.stack}`)));
  await blocked.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }); });
  await blocked.route('**/*', route => new URL(route.request().url()).origin === server.origin ? route.continue() : route.abort());
  if (!process.argv.includes('--embeds')) {
    await verifyRoutes(blocked, server.origin, report.checks);
    report.checks.push('Rotas e histórico também passam com sessionStorage indisponível');
  }
  await blocked.close();
  if (!process.argv.includes('--embeds')) await verifyDevelopment(browser, report.checks, report.errors);
  if (report.errors.length) throw new Error(report.errors.join('\n'));
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.errors.push(error.stack);
  process.exitCode = 1;
} finally {
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/browser-results.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
  await server.close();
}
console.log(JSON.stringify(report, null, 2));
