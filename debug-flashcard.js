// Debug script to trace the flashcard button visibility issue
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Intercept all console messages
  page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGE ERROR]', err.message));

  const BASE = 'http://127.0.0.1:4173/';
  const ESO1_BIO_DECK_FILE = 'eso_1_biologia-geologia.json';
  const ESO1_BIO_DECK_ID = 'eso-1-biologia-geologia';

  // Go to home first (like openWithStorage does in the tests)
  await page.goto(BASE);
  await page.waitForLoadState('domcontentloaded');

  // Now navigate to study tool (same as test 10)
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await page.waitForSelector('#study-area', { timeout: 10000 });
  console.log('✓ Study area loaded');

  // Check initial state
  const btnRevealHidden0 = await page.$eval('#btn-reveal', el => el.classList.contains('hidden'));
  console.log('Initial #btn-reveal .hidden:', btnRevealHidden0);

  // Step 1: Reveal card 0
  console.log('\n--- Step 1: Reveal card 0 ---');
  const btnRevealHiddenBefore = await page.$eval('#btn-reveal', el => el.classList.contains('hidden'));
  console.log('Before click - #btn-reveal .hidden:', btnRevealHiddenBefore);
  await page.click('#btn-reveal');
  console.log('Clicked #btn-reveal');

  try {
    await page.waitForSelector('#flashcard.revealed', { timeout: 5000 });
    console.log('✓ Card 0 revealed');
  } catch (e) {
    console.log('✗ Card 0 NOT revealed within 5s');
    const flashcardClass = await page.$eval('#flashcard', el => el.className);
    console.log('Current #flashcard class:', flashcardClass);
    const btnRevealHiddenAfter = await page.$eval('#btn-reveal', el => el.classList.contains('hidden'));
    console.log('After click - #btn-reveal .hidden:', btnRevealHiddenAfter);
    await browser.close();
    return;
  }

  // Step 2: Go to card 1
  console.log('\n--- Step 2: Go to card 1 ---');
  await page.click('#btn-next');
  await page.waitForTimeout(600);
  const card1HasRevealed = await page.$eval('#flashcard', el => el.classList.contains('revealed'));
  const btnReveal1Hidden = await page.$eval('#btn-reveal', el => el.classList.contains('hidden'));
  console.log('Card 1 .revealed:', card1HasRevealed);
  console.log('#btn-reveal .hidden:', btnReveal1Hidden);

  // Step 3: Reveal card 1
  console.log('\n--- Step 3: Reveal card 1 ---');
  if (!btnReveal1Hidden) {
    await page.click('#btn-reveal');
    await page.waitForSelector('#flashcard.revealed', { timeout: 5000 });
    console.log('✓ Card 1 revealed');
  } else {
    console.log('✗ #btn-reveal is hidden — cannot click!');
  }

  // Step 4: Go back to card 0
  console.log('\n--- Step 4: Go back to card 0 ---');
  await page.click('#btn-prev');
  await page.waitForTimeout(600);
  const card0HasRevealed = await page.$eval('#flashcard', el => el.classList.contains('revealed'));
  const btnReveal0Hidden = await page.$eval('#btn-reveal', el => el.classList.contains('hidden'));
  console.log('Card 0 .revealed:', card0HasRevealed);
  console.log('#btn-reveal .hidden:', btnReveal0Hidden);

  await browser.close();
  console.log('\nDone');
})();
