import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { verifyRoutes } from './routes.mjs';
import { verifyBlogNavigation } from './blog.mjs';

export async function verifyDevelopment(browser, results, errors) {
  const server = await createServer({ logLevel: 'warn', optimizeDeps: { entries: ['index.html'], force: true }, server: { host: '127.0.0.1', port: 0, strictPort: false, watch: null } });
  let context;
  try {
    await server.listen();
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR', reducedMotion: 'no-preference' });
    await context.addInitScript(() => {
      for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(window, name, { get() { throw new DOMException('Blocked', 'SecurityError'); } });
    });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    context.on('page', page => page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack}`)));
    await verifyRoutes(context, origin, results, '/');
    await verifyBlogNavigation(context, origin, results, '/');
    results.push('Desenvolvimento com React StrictMode: rotas e histórico com ambos os storages bloqueados');
    const page = await context.newPage();
    await page.goto(origin);
    await page.locator('#contact').waitFor();
    async function section(id) {
      await page.waitForFunction(target => Math.abs(document.getElementById(target).getBoundingClientRect().top) < 130 && !document.documentElement.classList.contains('is-programmatic-scroll'), id);
      await page.waitForTimeout(80);
    }
    await section('home');
    await page.keyboard.press('PageDown');
    await section('about');
    await page.keyboard.press('End');
    await section('contact');
    await page.keyboard.press('Home');
    await section('home');
    await page.mouse.move(200, 500);
    await page.mouse.wheel(0, 180);
    await section('about');
    const next = page.getByRole('button', { name: 'Ir para próxima seção', exact: true });
    await next.focus();
    await page.keyboard.press('Enter');
    await section('experience');
    assert.match(page.url(), /\/experience$/);
    results.push('Teclado PageDown/End/Home/Enter e wheel mantêm navegação com animações ativas');
    await page.close();
  } finally {
    await context?.close();
    await server.close();
  }
}
