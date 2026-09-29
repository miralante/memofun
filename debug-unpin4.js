// debug-unpin4.js — trace all localStorage changes and network requests
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await ctx.addInitScript(() => {
    // Monkey-patch localStorage.setItem to track all writes
    const rawSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function(key, value) {
      console.log('[LS WRITE]', key, '=', value.substring(0, 100));
      rawSetItem(key, value);
    };
  });

  page.on('console', msg => {
    if (msg.type() !== 'warning') console.log('[BROWSER]', msg.text());
  });
  page.on('request', req => {
    if (req.url().includes('127.0.0.1:4173')) {
      console.log('[NET]', req.method(), req.url().replace('http://127.0.0.1:4173', ''));
    }
  });

  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  // Set pinned locally first (simulate already-pinned state)
  await page.evaluate(() => localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' })));
  console.log('--- Set pinned manually ---');

  // Navigate to subject level
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  console.log('--- About to unpin ---');
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(300);

  let prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('AFTER unpin - prefs:', prefs);

  console.log('--- About to page.goto home ---');
  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('HOME - prefs:', prefs, '| quick-access:', await page.evaluate(() => !!document.querySelector('.quick-access')));

  await browser.close();
  console.log('Done');
})();
