/* The asymmetry the user reported: shortcut entries (single-deck topic,
   single-topic subject, single-deck flat-deck subject) used to leave
   the user with a "Volver" that landed on the never-visited listing
   page. The fix is a studyUrl-level `back` URL the study tool honors
   when present; this test walks three shortcut paths and asserts the
   resulting btn-back lands on the level the user was actually on
   a step ago, not the listing level.

   Each case:
     1. Open the parent level with a real navigation (wait for
        `.deck-card` so the JS has actually painted).
     2. Click the shortcut card.
     3. Wait for the study tool's title to appear.
     4. Read btn-back's href.
     5. Visit it and check the page actually shows the expected level
        shape (topic cards, deck cards, or whatever — the *listing
        level* would render the wrong shape and fail this).
*/
'use strict';
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8090';

const cases = [
  {
    label: 'TA Tema 5 (single deck) — shortcut then back',
    parentUrl: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=T%C3%A9cnicas%20Administrativas%20B%C3%A1sicas',
    flow: ['shortcut'],
    clickTitle: /Tema 5 · Material de oficina/,
    /* Subject-level shortcut: back must land on the SUBJECT page
       (8 topicCard-shaped cards, *no* `topicGroup=` in the URL — the
       listing we're trying to skip would be `?topicGroup=Tema 5…`,
       which renderSectionLevel handles and which shows exactly ONE
       `.deck-card` because the topic has one section). */
    expectUrlContains: '?course=',
    expectUrlNotContains: '&topicGroup=',
    expectOnPage: {
      minCards: 6,
      allCardsHaveNoMeta: true
    }
  },
  {
    label: 'TA Tema 2 (single deck) — shortcut then back',
    parentUrl: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=T%C3%A9cnicas%20Administrativas%20B%C3%A1sicas',
    flow: ['shortcut'],
    clickTitle: /Tema 2 · Áreas funcionales/,
    expectUrlContains: '?course=',
    expectUrlNotContains: '&topicGroup=',
    expectOnPage: {
      minCards: 6,
      allCardsHaveNoMeta: true
    }
  },
  /* The non-shortcut path (multi-section topic) must NOT regress:
     the inferred back to the topic listing is exactly right here.
     Two-step flow: first the topic listing card (no shortcut), then
     the first deck in the listing. */
  {
    label: 'TA Tema 1 (5 decks) — drill through, then back lands on listing',
    parentUrl: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=T%C3%A9cnicas%20Administrativas%20B%C3%A1sicas',
    flow: ['listing', 'first-deck'],
    clickTitle: /Tema 1 · La empresa/,
    expectUrlContains: 'topicGroup=',
    expectUrlNotContains: null,
    expectOnPage: {
      minCards: 5,
      allCardsHaveNoMeta: false
    }
  }
];

async function clickByTitle(page, re) {
  return page.evaluate((src) => {
    const t = new RegExp(src);
    const card = [...document.querySelectorAll('.deck-card')]
      .find(el => t.test(el.querySelector('h3').textContent));
    if (!card) return null;
    card.click();
    return true;
  }, re.source);
}

async function clickFirstDeck(page) {
  return page.evaluate(() => {
    const card = document.querySelector('.deck-card');
    if (!card) return null;
    card.click();
    return true;
  });
}

(async () => {
  const browser = await chromium.launch();
  let fail = 0;
  try {
    for (const c of cases) {
      const page = await browser.newPage();
      await page.goto(c.parentUrl, { waitUntil: 'networkidle' });
      await page.waitForSelector('.deck-card');
      const steps = c.flow || ['shortcut'];
      /* Drill into the study tool along the chosen flow. */
      for (const step of steps) {
        let clicked;
        if (step === 'shortcut') {
          clicked = await clickByTitle(page, c.clickTitle);
        } else if (step === 'listing') {
          clicked = await clickByTitle(page, c.clickTitle);
        } else if (step === 'first-deck') {
          clicked = await clickFirstDeck(page);
        }
        if (!clicked) { fail++; console.log('FAIL: ' + c.label + ' — no matching card at step "' + step + '"'); break; }
        if (step === 'listing') {
          await page.waitForSelector('.deck-card');
        }
      }
      /* Wait for the study tool. */
      try {
        await page.waitForSelector('#deck-title', { timeout: 5000 });
      } catch (e) {
        fail++; console.log('FAIL: ' + c.label + ' — never reached study screen'); await page.close(); continue;
      }
      /* Read btn-back's href. */
      const back = await page.$eval('#btn-back', el => el.getAttribute('href'));
      console.log('\n== ' + c.label + ' ==');
      console.log('  back href: ' + back);
      if (c.expectUrlContains && !back.includes(c.expectUrlContains)) {
        console.log('  FAIL: back missing "' + c.expectUrlContains + '"'); fail++;
      } else if (c.expectUrlNotContains && back.includes(c.expectUrlNotContains)) {
        console.log('  FAIL: back unexpectedly contained "' + c.expectUrlNotContains + '"'); fail++;
      } else {
        console.log('  OK href shape');
      }
      /* Visit the back URL through the same server and confirm the
         result isn't the listing we were trying to skip. */
      const full = new URL(back, BASE).href;
      const p2 = await browser.newPage();
      await p2.goto(full, { waitUntil: 'networkidle' });
      await p2.waitForSelector('.deck-card');
      const cards = await p2.$$eval('.deck-card', els => els.map(e => ({
        title: e.querySelector('h3').textContent,
        meta:  (e.querySelector('.deck-meta') || {}).textContent || null
      })));
      console.log('  back page cards: ' + cards.length);
      if (cards.length < c.expectOnPage.minCards) {
        console.log('  FAIL: expected at least ' + c.expectOnPage.minCards + ' cards, got ' + cards.length);
        fail++;
      } else if (c.expectOnPage.allCardsHaveNoMeta && cards.some(x => x.meta !== null)) {
        console.log('  FAIL: cards on the back page should have no deck-meta (this is the subject listing, not the section listing)');
        fail++;
      } else {
        console.log('  OK back page shape (' + cards.length + ' cards)');
      }
      await p2.close();
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (fail) {
    console.error('\nFAIL: ' + fail + ' shortcut/back pair(s) still wrong');
    process.exit(1);
  }
  console.log('\nOK: every shortcut back-link lands on the level the user came from');
})().catch(e => { console.error('FAIL:', e.message); process.exit(2); });