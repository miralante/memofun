// debug-unpin5.js — compare addInitScript vs page.evaluate setItem
const { chromium } = require('@playwright/test');

async function run(name, { useAddInitScript }) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  if (useAddInitScript) {
    await ctx.addInitScript(() => {
      localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' }));
    });
  }

  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  if (!useAddInitScript) {
    await page.evaluate(() => localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' })));
  }

  // Navigate to subject level via click
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  // Unpin
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(300);

  const prefsAfterUnpin = await page.evaluate(() => localStorage.getItem('memofun:prefs'));

  // Navigate to home
  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  const prefsAtHome = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  const qa = await page.evaluate(() => !!document.querySelector('.quick-access'));

  console.log(`[${name}] prefs after unpin: ${prefsAfterUnpin} | prefs at home: ${prefsAtHome} | quick-access: ${qa}`);

  await browser.close();
}

(async () => {
  await run('addInitScript', { useAddInitScript: true });
  await run('page.evaluate', { useAddInitScript: false });
})();
