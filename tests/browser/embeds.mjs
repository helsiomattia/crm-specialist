import assert from 'node:assert/strict';
import { PROJECT_EMBED_LOADERS } from '../../src/data/projectEmbeds.js';

export async function verifyEmbeds(context, origin, results) {
  const page = await context.newPage();
  const base = `${origin}/crm-specialist/projects/`;
  for (const id of Object.keys(PROJECT_EMBED_LOADERS)) {
    await page.goto(base + id);
    const iframe = page.locator('iframe');
    await iframe.waitFor();
    assert.equal(await iframe.getAttribute('sandbox'), 'allow-scripts');
    const frame = await (await iframe.elementHandle()).contentFrame();
    await frame.waitForFunction(() => document.body && document.body.innerText.length > 100);
    await page.waitForTimeout(200);
    const access = await frame.evaluate(() => {
      const blocked = fn => { try { fn(); return false; } catch (error) { return error.name === 'SecurityError'; } };
      return { dom: blocked(() => parent.document.body), storage: blocked(() => parent.localStorage.getItem('i18nextLng')), ownStorage: blocked(() => localStorage.length) };
    });
    assert.deepEqual(access, { dom: true, storage: true, ownStorage: true }, `${id}: isolation`);

    const tabs = frame.locator('button[data-view], button[data-tab], .tab[data-id]');
    if (await tabs.count() > 1) {
      for (let index = 1; index < await tabs.count(); index++) {
        const tab = tabs.nth(index);
        const target = await tab.getAttribute('data-view') || await tab.getAttribute('data-tab') || await tab.getAttribute('data-id');
        await tab.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        if (page.viewportSize().width < 600 && await tab.evaluate(element => element.tagName === 'BUTTON')) await tab.press('Enter');
        else await tab.click();
        assert.match(await tab.getAttribute('class'), /active/, `${id}: tab ${target}`);
        assert.ok(await frame.locator(`[id="${target}"]`).isVisible(), `${id}: panel ${target}`);
      }
    } else {
      const row = frame.locator('[onclick^="openDetail("], #rows .go').first();
      assert.ok(await row.count(), `${id}: expected interactive detail`);
      await row.click();
      assert.match(await frame.locator('#drawer').getAttribute('class'), /open/);
      if (id === 'lwc-omni-transfer-intelligence') await frame.locator('#close').press('Enter');
      else await frame.locator('#drawer').press('Escape');
      assert.ok(!(await frame.locator('#drawer').getAttribute('class')).includes('open'));
      const search = frame.locator('input').first();
      await search.fill('__hm_no_match__');
      assert.equal(await frame.locator('#rows > :visible').count(), 0, `${id}: search filters rows`);
      await search.fill('');
      assert.ok(await frame.locator('#rows > :visible').count() > 0);
    }

    await page.waitForTimeout(200);
    const dimensions = await iframe.evaluate(element => ({ height: element.clientHeight, width: element.clientWidth }));
    const contentHeight = await frame.evaluate(() => document.body.scrollHeight);
    assert.ok(contentHeight <= dimensions.height + 2, `${id}: content ${contentHeight} clipped at ${dimensions.height}`);
    assert.ok(dimensions.height > 0 && dimensions.height <= 20000);

    const srcdoc = await iframe.getAttribute('srcdoc');
    const token = srcdoc.match(/"token":"([a-f0-9]{32})"/)[1];
    const before = await iframe.evaluate(element => element.clientHeight);
    await frame.evaluate(({ token, origin }) => {
      const base = { channel: 'hm-crm-embed-v1', token, type: 'height' };
      for (const invalid of [{ ...base, height: -1 }, { ...base, height: 1e9 }, { ...base, height: '9999' }, { ...base, height: 9999, extra: true }, { ...base, token: 'stale', height: 9999 }, { ...base, type: 'eval', height: 9999 }]) parent.postMessage(invalid, origin);
    }, { token, origin });
    await page.evaluate(token => window.postMessage({ channel: 'hm-crm-embed-v1', token, type: 'height', height: 9999 }, window.location.origin), token);
    await page.waitForTimeout(100);
    assert.equal(await iframe.evaluate(element => element.clientHeight), before, `${id}: invalid messages`);

    await page.evaluate(() => window.scrollTo(0, 0));
    const box = await iframe.boundingBox();
    await page.mouse.move(box.x + 30, Math.min(850, box.y + 25));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(150);
    assert.ok(await page.evaluate(() => window.scrollY) > scrollBefore, `${id}: wheel forwarding`);
    results.push(`${id}: isolamento, interação, altura, mensagens inválidas e wheel aprovados`);
    console.log(`embed ${id}`);
  }
  await page.goto(base + 'lwc');
  const menu = page.getByRole('navigation', { name: 'Demonstrações LWC' });
  await menu.waitFor();
  const buttons = menu.locator('button');
  assert.equal(await buttons.count(), 10);
  for (let index = 0; index < 10; index++) {
    const button = buttons.nth(index);
    const title = (await button.innerText()).split('\n')[0];
    await button.click();
    await page.waitForFunction(expected => document.querySelector('iframe')?.title === `${expected} preview`, title);
    assert.equal(await button.getAttribute('aria-current'), 'page');
  }
  results.push('Coleção LWC: dez seleções atualizam iframe e estado ativo');
  await page.close();
}

export async function verifyEmbedFailure(context, origin, results) {
  const page = await context.newPage();
  await page.route('**/assets/customer360_generico_interativo_v4-*.js', route => route.abort());
  await page.goto(`${origin}/crm-specialist/projects/crm-customer-360`);
  await page.getByText('Demo indisponível.', { exact: true }).waitFor();
  assert.equal(await page.locator('iframe').count(), 0);
  assert.ok(await page.getByRole('link', { name: 'Voltar para projetos' }).count());
  results.push('Falha de import de demo exibe indisponibilidade e preserva retorno');
  await page.close();

  const timeoutPage = await context.newPage();
  await timeoutPage.addInitScript(() => {
    if (window === window.parent) window.addEventListener('message', event => {
      if (event.data?.channel === 'hm-crm-embed-v1' && event.data.type === 'height') event.stopImmediatePropagation();
    });
  });
  await timeoutPage.goto(`${origin}/crm-specialist/projects/crm-customer-360`);
  await timeoutPage.locator('iframe').waitFor();
  await timeoutPage.getByText('Demo indisponível.', { exact: true }).waitFor({ timeout: 15000 });
  results.push('Frame sem handshake de altura falha de forma controlada após timeout');
  await timeoutPage.close();
}
