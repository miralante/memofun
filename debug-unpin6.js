// debug-unpin6.js — check SW cache contents at each step
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
  await page.waitForTimeout(300);

  // Check SW cache keys after initial load
  const cacheKeys = await page.evaluate(async () => {
    const keys = await caches.keys();
    return keys;
  });
  console.log('SW cache keys after initial load:', cacheKeys);

  // Check if navigation request was cached
  const navCached = await page.evaluate(async () => {
    const cache = await caches.open('memofun-v75');
    const req = new Request('http://127.0.0.1:4173/');
    const cached = await cache.match(req);
    return cached ? 'YES' : 'NO';
  });
  console.log('Nav (/) cached after initial load:', navCached);

  // Now navigate to subject level
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  // Unpin
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(300);

  const prefsAfterUnpin = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('prefs after unpin:', prefsAfterUnpin);

  // Check if nav was cached AGAIN after unpinning (different URL)
  const navCachedAfterUnpin = await page.evaluate(async () => {
    const cache = await caches.open('memofun-v75');
    const req = new Request('http://127.0.0.1:4173/');
    const cached = await cache.match(req);
    return cached ? 'YES' : 'NO';
  });
  console.log('Nav (/) cached after unpin:', navCachedAfterUnpin);

  // Now do page.goto
  console.log('--- page.goto home ---');
  const navReq = await page.evaluate(() => new Request(location.origin + '/?t=' + Date.now()));
  console.log('Cache-bust nav URL:', navReq.url);

  await page.goto('http://127.0.0.1:4173/?t=' + Date.now());
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  const prefsAtHome = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('prefs at home:', prefsAtHome);

  // Check SW cache again
  const cacheKeysFinal = await page.evaluate(async () => {
    const keys = await caches.keys();
    return keys;
  });
  console.log('SW cache keys at home:', cacheKeysFinal);

  await browser.close();
  console.log('Done');
})();
