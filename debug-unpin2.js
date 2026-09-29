// debug-unpin2.js — test if the issue is page.goto vs location.href
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Set initial localStorage via addInitScript (same as test)
  await ctx.addInitScript(() => {
    localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' }));
  });

  // First, go to home to install SW
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  // Navigate to subject level via link click (simulate real user)
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  // Unpin
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(500);

  let prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('AFTER unpin - prefs:', prefs);

  // Instead of page.goto, use location.href assignment (no SW intercept?)
  await page.evaluate(() => { location.href = 'http://127.0.0.1:4173/?t=' + Date.now(); });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  const qa = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('HOME (location.href) - prefs:', prefs, '| quick-access:', qa);

  // ALSO test with page.goto for comparison
  await page.evaluate(() => { localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' })); });
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(300);
  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('BEFORE page.goto - prefs:', prefs);

  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  const qa2 = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('HOME (page.goto) - prefs:', prefs, '| quick-access:', qa2);

  await browser.close();
  console.log('Done');
})();
