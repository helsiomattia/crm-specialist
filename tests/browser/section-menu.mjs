import assert from 'node:assert/strict';

export async function verifySectionMenu(context, origin, results, base = '/crm-specialist/') {
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`${origin}${base}projects`);
    await page.locator('#contact').waitFor();
    const nav = page.getByRole('navigation', { name: 'Navegação entre seções' });
    const trigger = nav.locator('button[aria-expanded]');
    const panel = page.locator('#section-navigation-menu');
    const expanded = value => page.waitForFunction(expected => document.querySelector('[aria-controls="section-navigation-menu"]')?.getAttribute('aria-expanded') === String(expected), value);
    const width = page.viewportSize().width;

    await trigger.hover();
    await expanded(true);
    await page.waitForTimeout(220);
    const buttonBounds = await trigger.boundingBox();
    const panelBounds = await panel.boundingBox();
    const gap = width >= 1200
      ? { x: (buttonBounds.x + panelBounds.x + panelBounds.width) / 2, y: buttonBounds.y + buttonBounds.height / 2 }
      : { x: buttonBounds.x + buttonBounds.width / 2, y: (buttonBounds.y + buttonBounds.height + panelBounds.y) / 2 };
    await page.mouse.move(gap.x, gap.y, { steps: 20 });
    // Pausing longer than the close delay proves that the gap itself is hoverable.
    await page.waitForTimeout(450);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await panel.getByRole('button', { name: 'Blog', exact: true }).hover();
    await page.mouse.move(100, 750);
    await page.waitForTimeout(100);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await panel.getByRole('button', { name: 'Blog', exact: true }).hover();
    await page.waitForTimeout(400);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await page.mouse.move(100, 750);
    await expanded(false);
    assert.equal(await panel.isVisible(), false);
    assert(await panel.locator('button').evaluateAll(buttons => buttons.every(button => button.tabIndex === -1)));
    results.push(`${width}px: passagem lenta pelo espaço do menu, retorno rápido e fechamento após saída aprovados`);

    await trigger.hover();
    await expanded(true);
    await page.keyboard.press('Escape');
    await expanded(false);
    await page.mouse.move(100, 750);
    await page.keyboard.press('Tab');
    await trigger.focus();
    await expanded(true);
    await panel.getByRole('button', { name: 'Blog', exact: true }).focus();
    await page.waitForTimeout(400);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    await expanded(false);
    assert(await trigger.evaluate(element => element === document.activeElement));
    await page.keyboard.press('Enter');
    await expanded(true);
    await page.getByRole('button', { name: 'English', exact: true }).focus();
    await expanded(false);
    results.push(`${width}px: foco no menu, Escape, Enter e saída por teclado aprovados`);

    await trigger.hover();
    await expanded(true);
    await page.mouse.click(100, 750);
    await expanded(false);
    await trigger.hover();
    await expanded(true);
    const destination = panel.getByRole('button', { name: '01 Sobre', exact: true });
    const bounds = await destination.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, { steps: 30 });
    await page.waitForTimeout(400);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForFunction(() => Math.abs(document.getElementById('about').getBoundingClientRect().top) < 130);
    assert.equal(new URL(page.url()).pathname, `${base}about`);
    await expanded(false);
    results.push(`${width}px: clique fora fecha; trajeto diagonal permite selecionar Sobre e navegar`);
  } finally { await page.close(); }
}

export async function verifySectionMenuTouch(browser, origin, results, width = 390) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, locale: 'pt-BR', isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`${origin}/crm-specialist/projects`);
    await page.locator('#contact').waitFor();
    const trigger = page.locator('[aria-controls="section-navigation-menu"]');
    await trigger.tap();
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await trigger.tap();
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await trigger.tap();
    await page.touchscreen.tap(20, 200);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await trigger.tap();
    await page.locator('#section-navigation-menu').getByRole('button', { name: 'Blog', exact: true }).tap();
    await page.locator('#blog-main').waitFor();
    assert.equal(new URL(page.url()).pathname, '/crm-specialist/blog');
    results.push(`${width}px com toque: primeiro toque abre, segundo fecha, toque fora fecha e seleção abre Blog`);
  } finally { await context.close(); }
}
