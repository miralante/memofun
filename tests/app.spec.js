'use strict';

const { test, expect } = require('playwright/test');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
// Representative deck chosen for smoke tests: 1º de ESO / Biología y Geología.
// The deck is the same mechanic across all decks, so one deck is sufficient.
const ESO1_BIO_DECK_FILE = 'eso_1_biologia-geologia.json';
const ESO1_BIO_DECK_ID = 'eso-1-biologia-geologia'; // id in manifest.json

const BASE = `http://127.0.0.1:${process.env.PORT || 4173}/`;

// ---------------------------------------------------------------------------
// Module-level browser reference — set in beforeEach before each test
// ---------------------------------------------------------------------------
let _lastCtx = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Open the Memofun home screen using a brand-new browser context so no
    residual localStorage state from previous tests affects the current run.
    Returns the new Page. */
async function openFreshApp(browser) {
  const ctx = await browser.newContext();
  _lastCtx = ctx;
  const newPage = await ctx.newPage();
  await newPage.goto(BASE);
  return newPage;
}

/** Open home with localStorage pre-seeded (before any page JS runs).
    @param {number} [slowMo] — override slowMo for this context only (ms).
    Passing 0 disables slowMo for this run; omitting uses global default. */
async function openWithStorage(browser, storageSeed, slowMo) {
  const launchOpts = slowMo !== undefined ? { slowMo } : {};
  const ctx = await browser.newContext(launchOpts);
  _lastCtx = ctx;
  const newPage = await ctx.newPage();
  // page.addInitScript runs before any page JS (before App.init, before loadDecks).
  // Pass null/undefined/empty for storageSeed → no-op (still calls addInitScript).
  if (storageSeed) {
    await newPage.addInitScript(`(${storageSeed})()`);
  }
  await newPage.goto(BASE);
  return newPage;
}

async function waitForFlipDone(page) {
  await page.waitForTimeout(2500);
  // Safety net: confirm btn-reveal is visible (evaluate-based, not locator)
  try {
    await page.waitForFunction(
      () => !document.querySelector('#btn-reveal.hidden'),
      { timeout: 3000, polling: 100 }
    );
  } catch { /* safety net: ignore timeout */ }
}

// waitForFlipDone but with a fixed 500ms wait — for use when we need to
// guarantee the page has settled before the next action (e.g. before advanceCard).
async function waitForFlipDone500(page) {
  await page.waitForTimeout(500);
}

// ===========================================================================
// HOME SCREEN
// ===========================================================================

test('1 — home loads with deck grid and stars counter', async ({ browser }) => {
  // Open WITHOUT addInitScript — add debug hooks after page loads
  const ctx = await browser.newContext();
  _lastCtx = ctx;
  const page = await ctx.newPage();

  // Intercept ALL console messages and page errors
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text().slice(0, 200) }));
  page.on('pageerror', err => consoleMessages.push({ type: 'pageerror', text: err.message }));

  // Inject a debug hook BEFORE page.goto to catch the very first moments
  await ctx.addInitScript(() => {
    window.__debugLog = [];
    const origFetch = window.fetch;
    window.fetch = function(...args) {
      window.__debugLog.push({ event: 'fetch-start', url: args[0] });
      return origFetch.apply(this, args).then(r => {
        window.__debugLog.push({ event: 'fetch-end', url: args[0], ok: r.ok, status: r.status });
        return r;
      }).catch(e => {
        window.__debugLog.push({ event: 'fetch-error', url: args[0], error: e.message });
        throw e;
      });
    };
    window.addEventListener('error', e => {
      window.__debugLog.push({ event: 'window-error', msg: e.message, filename: e.filename, lineno: e.lineno });
    });
  });

  try {
    await page.goto(BASE);
    await page.waitForLoadState('domcontentloaded').catch(() => null);

    // Wait 8s for loadDecks() to complete (it is async but called immediately)
    await page.waitForTimeout(8000);

    // Pull debug log and DOM state in one evaluate
    const state = await page.evaluate(() => {
      const grid = document.getElementById('deck-grid');
      const manifestReqs = window.__debugLog ? window.__debugLog.filter(l => l.url && l.url.includes('manifest')) : [];
      const allFetchEvents = window.__debugLog ? window.__debugLog.filter(l => l.event && l.event.startsWith('fetch')) : [];
      return {
        debugLog: window.__debugLog || [],
        manifestEvents: manifestReqs,
        gridInnerHTML: grid ? grid.innerHTML.slice(0, 500) : 'NOT FOUND',
        deckCardCount: grid ? grid.querySelectorAll('.deck-card').length : 0,
        mainHTML: (document.querySelector('main') || {}).innerHTML.slice(0, 300),
        appExists: typeof App !== 'undefined',
        appLocale: (typeof App !== 'undefined' && App.i18n) ? App.i18n.locale() : 'N/A',
      };
    });

    const errors = consoleMessages.filter(m => m.type === 'error' || m.type === 'pageerror');
    console.error('=== DEBUG STATE ===');
    console.error('All fetch events:', JSON.stringify(state.debugLog.filter(l => l.event && l.event.startsWith('fetch')), null, 2));
    console.error('Grid innerHTML:', state.gridInnerHTML);
    console.error('Deck card count:', state.deckCardCount);
    if (errors.length) {
      console.error('Page errors:', JSON.stringify(errors, null, 2));
    } else {
      console.error('No page errors captured');
    }
    console.error('===================');

    // Assert deck cards exist
    await expect(page.locator('#deck-grid .deck-card').first()).toBeVisible();
    await expect(page.locator('#stars-total')).toBeVisible();
  } finally {
    // Clean up page event listeners and close resources to prevent state leakage
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    await page.close();
    await ctx.close();
  }
});

test('2 — deck cards are links pointing to the study tool', async ({ browser }) => {
  const page = await openFreshApp(browser);
  // Navigate: home → 1º de ESO → Biología y Geología → first deck
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.locator('#deck-grid .deck-card', { hasText: 'Biología y Geología' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  // The first deck card (not a course/subject) should link to the study tool
  const deckCard = page.locator('#deck-grid .deck-card').first();
  await expect(deckCard).toBeVisible();
  const href = await deckCard.getAttribute('href');
  expect(href).toMatch(/tools\/study\/index\.html\?deck=/);
});

test('3 — locale picker is present in the header', async ({ browser }) => {
  const page = await openFreshApp(browser);
  await expect(page.locator('#locale-picker')).toBeVisible();
});

// ===========================================================================
// NAVIGATION: HOME → COURSE → SUBJECT → DECK
// ===========================================================================

test('4 — clicking a course shows the subject list', async ({ browser }) => {
  const page = await openFreshApp(browser);
  // The manifest renders courses; click "1º de ESO" course
  const esoLink = page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first();
  await esoLink.click();
  await page.waitForLoadState('domcontentloaded');
  // Should now show subject cards (e.g. Biología y Geología)
  await expect(page.locator('#deck-grid .deck-card').first()).toBeVisible();
  // And a back link
  await expect(page.locator('.heading-with-back')).toBeVisible();
});

test('5 — clicking a subject shows the deck list', async ({ browser }) => {
  const page = await openFreshApp(browser);
  // Navigate to 1º de ESO course
  const esoLink = page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first();
  await esoLink.click();
  await page.waitForLoadState('domcontentloaded');
  // Click Biología y Geología subject
  const bioLink = page.locator('#deck-grid .deck-card', { hasText: 'Biología y Geología' }).first();
  await bioLink.click();
  await page.waitForLoadState('domcontentloaded');
  // Should show deck cards
  await expect(page.locator('#deck-grid .deck-card').first()).toBeVisible();
});

test('6 — clicking a deck card opens the study tool', async ({ browser }) => {
  const page = await openFreshApp(browser);
  // Navigate: home → 1º de ESO → Biología y Geología → first deck
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.locator('#deck-grid .deck-card', { hasText: 'Biología y Geología' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  // Click first deck card
  await page.locator('#deck-grid .deck-card').first().click();
  // Should navigate to the study tool
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#flashcard')).toBeVisible();
});

// ===========================================================================
// STUDY SCREEN: CARD INTERACTION
// ===========================================================================

test('7 — study screen shows flashcard and reveal button', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  // Navigate directly to study tool via URL
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#flashcard')).toBeVisible();
  await expect(page.locator('#btn-reveal')).toBeVisible();
});

test('8 — reveal button shows the answer', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  // Collect responses and console messages for debugging
  const deckResponses = [];
  const consoleLogs = [];
  page.on('response', r => {
    if (r.url().includes('.json')) deckResponses.push({ url: r.url(), status: r.status() });
  });
  page.on('console', msg => {
    if (msg.type() === 'error') consoleLogs.push('[ERROR] ' + msg.text());
  });
  page.on('pageerror', err => consoleLogs.push('[PAGEERROR] ' + err.message));
  try {
    const gotoUrl = BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia';
    await page.goto(gotoUrl);
    console.log('Current URL after goto:', page.url());
    console.log('Deck responses captured:', JSON.stringify(deckResponses));
    console.log('Console errors:', JSON.stringify(consoleLogs));
    await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
    /* The card renders with class "flip-out" while its initial flip runs, and
       the app's animation guard correctly refuses to reveal mid-flip. Clicking
       before the flip settles made this test fail intermittently depending on
       machine speed — the same race the other card tests already guard against
       with waitForFlipDone. */
    await waitForFlipDone(page);
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
  } finally {
    // Clean up page event listeners and close resources to prevent state leakage
    page.removeAllListeners('response');
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    await page.close();
    await ctx.close();
  }
});

test('9 — next button advances to the next card', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  // Reveal card 0
  await page.locator('#btn-reveal').click();
  await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
  // Wait for the reveal flip to finish before navigating — with slowMo: 0
  // the evaluate click fires immediately, so goNext()'s flipping-guard would
  // block navigation unless flipping is already false.
  await waitForFlipDone500(page);
  // Navigate to card 1
  await page.evaluate(() => document.querySelector('#btn-next').click());
  await waitForFlipDone(page);
  // Check #flashcard is visible AND does NOT have .revealed class
  await expect(page.locator('#flashcard')).toBeVisible();
  const hasRevealed = await page.locator('#flashcard').evaluate(el => el.classList.contains('revealed'));
  expect(hasRevealed).toBeFalsy();
});

test('10 — prev button returns to the previous card (after reveal)', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  // Reveal card 0 (locator.click for proper actionability checks)
  await page.locator('#btn-reveal').click();
  await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
  // Wait for reveal flip to finish before navigating (same flipping-guard issue
  // as test 9 — evaluate click fires immediately with slowMo:0).
  await waitForFlipDone500(page);
  // Go to card 1 (evaluate click for reliability with slowMo)
  await page.evaluate(() => document.querySelector('#btn-next').click());
  await waitForFlipDone(page);
  await expect(page.locator('#flashcard')).toBeVisible();
  let hasRevealed = await page.locator('#flashcard').evaluate(el => el.classList.contains('revealed'));
  expect(hasRevealed).toBeFalsy();
  // Reveal card 1 (locator.click)
  await page.locator('#btn-reveal').click();
  await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
  // Wait for reveal flip to finish before navigating (same flipping-guard issue
  // as test 9 — evaluate click fires immediately with slowMo:0).
  await waitForFlipDone500(page);
  // Go back to card 0 (evaluate click)
  await page.evaluate(() => document.querySelector('#btn-prev').click());
  await waitForFlipDone(page);
  // With slowMo compounding, the classList update can lag the flip signal.
  // Explicitly wait for .revealed to be absent before asserting.
  try {
    await page.waitForFunction(
      () => !document.querySelector('#flashcard.revealed'),
      { timeout: 5000 }
    );
  } catch { /* safety net */ }
  await expect(page.locator('#flashcard')).toBeVisible();
  hasRevealed = await page.locator('#flashcard').evaluate(el => el.classList.contains('revealed'));
  expect(hasRevealed).toBeFalsy();
  // After goPrev() from revealed, btn-reveal is shown immediately (the flip
  // animation runs in parallel). Wait for it to become visible before clicking.
  await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 5000 });
});

test('11 — arrow keys navigate cards (keyboard accessibility)', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  // Reveal card 0 via button click (study tool uses ArrowRight for navigation, not reveal)
  await page.locator('#btn-reveal').click();
  await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
  // Wait for reveal flip to finish before navigating (same flipping-guard issue
  // as tests 9 and 10 — keyboard.press fires immediately with slowMo:0).
  await waitForFlipDone500(page);
  // ArrowRight moves to card 1
  await page.keyboard.press('ArrowRight');
  await waitForFlipDone(page);
  // Check #flashcard is visible AND does NOT have .revealed class
  await expect(page.locator('#flashcard')).toBeVisible();
  const hasRevealed = await page.locator('#flashcard').evaluate(el => el.classList.contains('revealed'));
  expect(hasRevealed).toBeFalsy();
});

// ===========================================================================
// DECK COMPLETION & STARS
// ===========================================================================

/**
 * Advances to the next card by clicking btn-next, handling the case where
 * goNext() is blocked by flipping=true from the reveal animation.
 *
 * Key insight: when on the last card (index === cards.length - 1), goNext()
 * calls showEndScreen() WITHOUT calling paintQuestion() — the counter never
 * changes from the last card number. We detect "last card" by checking whether
 * the card counter already shows the last card BEFORE clicking. If it does,
 * we click and wait for the end screen directly.
 *
 * For non-last cards, we poll the #card-counter text (e.g. "Tarjeta 2 de 14")
 * as the authoritative signal that paintQuestion() ran for the next card.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>} true = advanced to next card, false = at end screen
 */
async function advanceCard(page) {
  // The card counter lives in #progress (sr-only), e.g. "Tarjeta 2 de 14"
  const getCardNum = () => {
    const el = document.querySelector('#progress');
    if (!el) return { current: -1, total: -1 };
    const m = el.textContent.match(/Tarjeta (\d+) de (\d+)/);
    return m ? { current: parseInt(m[1], 10), total: parseInt(m[2], 10) } : { current: -1, total: -1 };
  };

  const before = await page.evaluate(getCardNum);

  // If already on the last card, goNext() shows the end screen directly
  // (paintQuestion is NOT called, so the counter does not change).
  if (before.current === before.total) {
    await page.locator('#btn-next').click();
    // showEndScreen() runs asynchronously; wait for the end screen to appear.
    await page.waitForSelector('#end-screen:not(.hidden)', { timeout: 15000 });
    return false;
  }

  await page.locator('#btn-next').click();

  // Poll until the card number increments (paintQuestion ran for the next card).
  // The entrance/reveal animations set flipping=true; onceSquashed resets it to
  // false ~350 ms after the CSS transition.  With slowMo:0 the whole cycle is
  // well under 2 s, so a 10 s timeout is generous.
  let newCard = before.current;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(250);
    newCard = (await page.evaluate(getCardNum)).current;
    if (newCard > before.current) break;
  }

  // Check if we reached the end screen
  const atEnd = await page.locator('#end-screen:not(.hidden)').isVisible();
  if (atEnd) return false;

  if (newCard > before.current) {
    // Wait for btn-reveal on the new card to appear
    await page.waitForSelector('#btn-reveal:not(.hidden)', { timeout: 10000 });
    return true;
  }

  // Card number didn't change — goNext() was blocked by flipping=true.
  // Retry up to 2 more times.
  for (let retry = 0; retry < 2; retry++) {
    await page.waitForTimeout(500);
    await page.locator('#btn-next').click();
    const endNow = await page.locator('#end-screen:not(.hidden)').isVisible();
    if (endNow) return false;
    const numNow = (await page.evaluate(getCardNum)).current;
    if (numNow > before.current) {
      await page.waitForSelector('#btn-reveal:not(.hidden)', { timeout: 10000 });
      return true;
    }
  }
  return false;
}

test('12 — completing all cards shows the end screen', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1200); // wait for entrance animation

  // Click through all 14 cards.
  for (let i = 0; i < 20; i++) {
    await page.waitForSelector('#btn-reveal:not(.hidden)', { timeout: 15000 });
    await page.evaluate(() => document.querySelector('#btn-reveal').click());
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
    // Wait for entrance animation to settle before advancing
    await page.waitForTimeout(400);
    const advanced = await advanceCard(page);
    if (!advanced) break; // end screen reached
  }

  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
});

test('13 — completing a deck earns one star', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1200); // wait for entrance animation

  // Click through all 14 cards.
  for (let i = 0; i < 20; i++) {
    await page.waitForSelector('#btn-reveal:not(.hidden)', { timeout: 15000 });
    await page.evaluate(() => document.querySelector('#btn-reveal').click());
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
    // Wait for entrance animation to settle before advancing
    await page.waitForTimeout(400);
    const advanced = await advanceCard(page);
    if (!advanced) break; // end screen reached
  }

  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
  // Stars should show ⭐ 1
  const starsText = await page.locator('#stars-total').textContent();
  expect(starsText).toMatch(/1/);
});

test('14 — "study again" restarts the same deck', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1200); // wait for entrance animation

  // Click through all 14 cards.
  for (let i = 0; i < 20; i++) {
    await page.waitForSelector('#btn-reveal:not(.hidden)', { timeout: 15000 });
    await page.evaluate(() => document.querySelector('#btn-reveal').click());
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
    // Wait for entrance animation to settle before advancing
    await page.waitForTimeout(400);
    const advanced = await advanceCard(page);
    if (!advanced) break; // end screen reached
  }

  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });

  // Click "Repasar otra vez"
  await page.locator('#btn-study-again').click();
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#flashcard')).toBeVisible();
  await expect(page.locator('#end-screen')).toBeHidden();
});

test('15 — completed deck shows stamp on home screen', async ({ browser }) => {
  // Start with progress: deck already completed
  const page = await openWithStorage(browser, () => {
    localStorage.setItem('memofun:progress', JSON.stringify({
      stars: 1,
      completed: { 'eso-1-biologia-geologia': true }
    }));
  });

  // Navigate to the deck through the hierarchy
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.locator('#deck-grid .deck-card', { hasText: 'Biología y Geología' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  // First deck card should have a stamp
  await expect(page.locator('#deck-grid .deck-card .deck-stamp').first()).toBeVisible();
});

test('16 — star count persists after page reload', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {
    localStorage.setItem('memofun:progress', JSON.stringify({
      stars: 3,
      completed: { 'eso-1-biologia-geologia': true }
    }));
  });
  // Stars should show ⭐ 3 without any navigation
  const starsText = await page.locator('#stars-total').textContent();
  expect(starsText).toMatch(/3/);

  // Reload and check again
  await page.reload();
  const starsTextAfter = await page.locator('#stars-total').textContent();
  expect(starsTextAfter).toMatch(/3/);
});

// ===========================================================================
// COURSE PINNING
// ===========================================================================

test('17 — pinning a course shows it in quick-access on home', async ({ browser }) => {
  const page = await openFreshApp(browser);
  // Navigate to 1º de ESO
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  // Pin the course
  await page.locator('#btn-pin-course').click();
  // Wait for re-render
  await page.waitForTimeout(300);
  // Go back home
  await page.locator('.heading-with-back a').first().click();
  await page.waitForLoadState('domcontentloaded');
  // Quick-access section should appear
  await expect(page.locator('.quick-access')).toBeVisible();
  await expect(page.locator('.quick-access', { hasText: '1º de ESO' })).toBeVisible();
});

test('18 — unpinning removes quick-access', async ({ page }) => {
  // Set the initial pinned state directly via page.evaluate (not addInitScript),
  // so the value persists across navigations instead of being re-injected on each goto.
  await page.goto(BASE);
  await page.evaluate(() =>
    localStorage.setItem('memofun:prefs', JSON.stringify({ cursoFijado: '1º de ESO' }))
  );
  // Navigate to 1º de ESO (subject list)
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  // Unpin — this sets prefs.cursoFijado = null and re-renders subject level
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(500);
  // Navigate directly to home (not via back link, which goes to course level)
  // After unpin, prefs.cursoFijado is null so home will NOT render .quick-access.
  // Add a cache-bust query param so the SW fetch bypasses the stale cached index.html
  // (the cache was pre-filled with the initialcursoFijado='1º de ESO' state).
  await page.goto(BASE + '?t=' + Date.now());
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  // .quick-access must not be in the DOM
  const quickAccessExists = await page.evaluate(
    () => !!document.querySelector('.quick-access')
  );
  expect(quickAccessExists).toBe(false);
});

// ===========================================================================
// LOCALE SWITCHING
// ===========================================================================

test('19 — switching locale to English changes the UI text', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {
    localStorage.setItem('memofun:locale', JSON.stringify('en'));
  });
  await page.reload();
  // Header tagline should be in English
  await expect(page.locator('.tagline')).toBeVisible();
  const taglineText = await page.locator('.tagline').textContent();
  // The English tagline invites to choose a deck
  expect(taglineText.trim().length).toBeGreaterThan(0);
  // The page title should be in English (Memofun or similar)
  const title = await page.title();
  expect(title.trim().length).toBeGreaterThan(0);
});

test('19a — the settings language picker switches to English and persists', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-ES' });
  _lastCtx = context;
  const page = await context.newPage();
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    const spanishTagline = (await page.locator('.tagline').textContent()).trim();

    await page.locator('.locale-settings-trigger').click();
    const drawer = page.locator('#accessibility-settings');
    await drawer.locator('.locale-picker-btn').click();
    await drawer.locator('.locale-picker-panel li[data-locale="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.locale-picker-current')).toHaveText('EN');
    expect(await page.evaluate(() => localStorage.getItem('memofun:locale'))).toBe('en');
    expect((await page.locator('.tagline').textContent()).trim()).not.toBe(spanishTagline);
  } finally {
    await context.close();
  }
});

test('19b — unsupported browser language falls back to English', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'fr-FR' });
  const page = await context.newPage();
  try {
    await page.addInitScript(() => localStorage.clear());
    await page.goto(BASE);
    await expect(page.locator('#locale-picker')).toBeVisible();
    await expect(page.locator('.locale-picker-current')).toHaveText('EN');
    expect(await page.locator('html').getAttribute('lang')).toBe('en');
    expect(await page.evaluate(() => window.App.i18n.locale())).toBe('en');
  } finally {
    await context.close();
  }
});

// ===========================================================================
// BACK NAVIGATION
// ===========================================================================

test('20 — back button returns to subject list from deck list', async ({ browser }) => {
  const page = await openFreshApp(browser);
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.locator('#deck-grid .deck-card', { hasText: 'Biología y Geología' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  // Click back — should return to subject list (still on 1º de ESO)
  await page.locator('.heading-with-back a').first().click();
  await page.waitForLoadState('domcontentloaded');
  // Should still show 1º de ESO heading
  await expect(page.locator('#deck-grid .deck-card', { hasText: 'Biología y Geología' }).first()).toBeVisible();
});

test('21 — study tool back button respects course param', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {}, 0);
  // Open study tool with course param so "Volver" returns to the course screen
  await page.goto(
    BASE + 'tools/study/index.html' +
    '?deck=' + ESO1_BIO_DECK_FILE +
    '&id=' + ESO1_BIO_DECK_ID +
    '&titulo=Biologia' +
    '&course=' + encodeURIComponent('1º de ESO') +
    '&subject=' + encodeURIComponent('Biología y Geología')
  );
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });
  const backHref = await page.locator('#btn-back').getAttribute('href');
  // btn-back should point back to the course page, not just index.html
  expect(backHref).toContain('course=');
});
