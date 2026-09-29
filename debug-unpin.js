// debug-unpin.js — replicate test 18 exactly
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // 1. Start with 1º de ESO already pinned (same as test)
  await ctx.addInitScript(() => {
    localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' }));
  });

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('[BROWSER ERROR]', msg.text());
    else console.log('[BROWSER]', msg.text());
  });

  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  // Check quick-access BEFORE navigating to subject level
  let qa = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('HOME (initial) - quick-access exists:', qa);

  // Navigate to 1º de ESO (click first deck card with that text)
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  qa = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('SUBJECT LEVEL - quick-access exists:', qa);

  // Check localStorage BEFORE unpin
  let prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('BEFORE unpin - prefs:', prefs);

  // Unpin
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(500);

  // Check localStorage AFTER unpin
  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('AFTER unpin - prefs:', prefs);

  qa = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('SUBJECT LEVEL after unpin - quick-access exists:', qa);

  // Navigate to home with cache-bust
  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  // Check localStorage on home
  prefs = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('HOME after cache-bust - prefs:', prefs);

  qa = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('HOME after cache-bust - quick-access exists:', qa);

  await browser.close();
  console.log('Done');
})();
