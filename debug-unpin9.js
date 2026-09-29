const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Use page.evaluate (NOT addInitScript) for initial state
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() =>
    localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' }))
  );

  console.log('After evaluate, quick-access:', await page.evaluate(() => !!document.querySelector('.quick-access')));

  // Navigate to 1º de ESO
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  // Unpin
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(500);

  const prefsAfterUnpin = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('prefs after unpin:', prefsAfterUnpin);

  // Navigate home with ?t= cache-bust
  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForTimeout(500);

  const quickAccess = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('quick-access after goto(/?t=):', quickAccess);
  console.log('prefs after goto:', await page.evaluate(() => localStorage.getItem('memofun:prefs')));

  await browser.close();
  process.exit(0);
})();
