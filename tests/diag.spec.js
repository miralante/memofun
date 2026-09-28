const { test, expect, _electronApp } = require('@playwright/test');

const BASE = 'http://127.0.0.1:4173/';
const ESO1_BIO_DECK_FILE = 'eso_1_biologia-geologia.json';
const ESO1_BIO_DECK_ID = 'ESO1-BIO-2024';

async function openWithStorage(browser, modifyStorage) {
  const context = await browser.newContext();
  const page = await context.newPage();
  // Give the page a blank origin so storage operations are allowed
  await page.goto('about:blank');
  if (modifyStorage) await modifyStorage(page);
  return page;
}

test('diagnostic — check app state after load', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {});
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await page.waitForTimeout(2000);

  // Check what's visible
  const studyAreaVisible = await page.locator('#study-area').isVisible();
  const endScreenVisible = await page.locator('#end-screen').isVisible();
  const btnRevealHidden = await page.evaluate(() => document.querySelector('#btn-reveal')?.classList.contains('hidden'));
  const flipping = await page.evaluate(() => window.__studyFlipping && window.__studyFlipping());
  const index = await page.evaluate(() => window._studyIndex && window._studyIndex());
  const cardsLen = await page.evaluate(() => window._studyCardsLen && window._studyCardsLen());

  console.log('study-area visible:', studyAreaVisible);
  console.log('end-screen visible:', endScreenVisible);
  console.log('btn-reveal hidden:', btnRevealHidden);
  console.log('flipping:', flipping);
  console.log('index:', index);
  console.log('cards.length:', cardsLen);

  // Check for errors in console
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.waitForTimeout(1000);
  console.log('console errors:', errors);

  expect(studyAreaVisible).toBe(true);
});
