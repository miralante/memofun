// debug-unpin3.js — test if SW is the culprit
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await ctx.addInitScript(() => {
    localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' }));
  });

  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  // Unpin from subject level
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(300);

  let prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('AFTER unpin - prefs:', prefs);

  // Use page.goto with cache bypass headers to try to avoid SW
  await page.goto('http://127.0.0.1:4173/?t=' + Date.now(), {
    waitUntil: 'networkidle',
    extraHTTPHeaders: { 'Cache-Control': 'no-cache' }
  });
  await page.waitForTimeout(500);

  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  const qa = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('HOME (networkidle) - prefs:', prefs, '| quick-access:', qa);

  // Now try: unregister SW, then navigate
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(300);
  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('2ND: AFTER unpin - prefs:', prefs);

  // Unregister SW
  await page.evaluate(async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const r of regs) await r.unregister();
  });
  await page.waitForTimeout(200);

  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  const qa2 = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('HOME (no SW) - prefs:', prefs, '| quick-access:', qa2);

  await browser.close();
  console.log('Done');
})();
