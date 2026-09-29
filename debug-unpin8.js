const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await ctx.addInitScript(() => {
    localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' }));
  });

  await page.goto('http://127.0.0.1:4173/');
  await page.waitForTimeout(300);
  console.log('Initial quick-access:', await page.evaluate(() => !!document.querySelector('.quick-access')));

  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(500);

  console.log('prefs after unpin:', await page.evaluate(() => localStorage.getItem('memofun:prefs')));

  // Test with ?t= cache-bust
  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForTimeout(300);
  console.log('After goto(/?t=): quick-access:', await page.evaluate(() => !!document.querySelector('.quick-access')));
  console.log('After goto(/?t=): prefs:', await page.evaluate(() => localStorage.getItem('memofun:prefs')));

  await browser.close();
  process.exit(0);
})();
