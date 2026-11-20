import assert from 'node:assert/strict';

export async function verifyBlogNavigation(context, origin, results, base = '/crm-specialist/') {
  const page = await context.newPage();
  await page.goto(`${origin}${base}`);
  const link = page.locator('nav[aria-label="HM.crm"] a').filter({ hasText: /^Blog$/ });
  await link.click();
  await page.locator('#blog-main h1').waitFor();
  assert.equal(new URL(page.url()).pathname, `${base}blog`);
  assert.equal(await page.locator('nav a[aria-current="page"]').innerText(), 'Blog');
  await page.reload();
  await page.locator('#blog-main h1').waitFor();
  await page.getByRole('link', { name: 'Voltar ao portfólio' }).click();
  await page.locator('#home').waitFor();
  await page.goBack();
  await page.locator('#blog-main h1').waitFor();
  await page.goto(`${origin}${base}blog/constructor`);
  await page.getByRole('heading', { name: 'Artigo não encontrado', exact: true }).waitFor();
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
  await page.getByRole('link', { name: 'Todos os artigos' }).first().click();
  await page.locator('#blog-main h1').waitFor();
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index, follow');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  results.push('Blog: acesso pela aba, refresh, retorno, histórico e artigo inexistente aprovados');
  await page.close();
}
