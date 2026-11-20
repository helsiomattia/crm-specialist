import assert from 'node:assert/strict';

export async function verifyRoutes(context, origin, results, basePath = '/crm-specialist/') {
  const page = await context.newPage();
  const base = origin + basePath;
  async function section(id) {
    await page.locator(`#${id}`).waitFor();
    await page.waitForFunction(target => {
      const element = document.getElementById(target);
      return element && Math.abs(element.getBoundingClientRect().top) < 130;
    }, id, { timeout: 12000 });
  }
  for (const [route, id] of [['', 'home'], ['expertise', 'expertise'], ['projects', 'projects'], ['contact', 'contact'], ['skills', 'expertise'], ['inexistente', 'home'], ['#skills', 'expertise']]) {
    await page.goto(base + route);
    await section(id);
    assert.ok(!page.url().includes('__hm_route='));
    results.push(`Rota ${route || '/'} chega a ${id}`);
  }
  await page.goto(`${base}expertise?campaign=a%26b`);
  await section('expertise');
  assert.equal(new URL(page.url()).searchParams.get('campaign'), 'a&b');
  await page.reload();
  await section('expertise');
  results.push('Refresh direto preserva seção e parâmetros');

  await page.goto(`${base}about-project`);
  await page.locator('main').waitFor();
  assert.equal(await page.locator('#home').count(), 0);
  await page.goto(`${base}projects/crm-customer-360`);
  await page.locator('iframe').waitFor();
  await page.reload();
  await page.locator('iframe').waitFor();
  await page.locator('a[aria-label="Ir para o início"]').click();
  await section('home');
  await page.goBack();
  await page.locator('iframe').waitFor();
  await page.goForward();
  await section('home');
  results.push('Projeto: refresh, marca, Back e Forward mantêm conteúdo e URL');

  await page.goto(`${base}projects/id-inexistente`);
  await page.getByText('Projeto não encontrado', { exact: true }).waitFor();
  await page.goto(`${base}projects`);
  await section('projects');
  const link = page.locator('a[href*="/projects/crm-customer-360"]').first();
  const [newTab] = await Promise.all([context.waitForEvent('page'), link.click({ modifiers: ['Control'] })]);
  await newTab.locator('iframe').waitFor();
  await newTab.close();
  results.push('ID desconhecido tem fallback; Ctrl+clique abre demo em nova aba');
  await page.close();
}
