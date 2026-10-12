/* One-off verification: render the IPE and TA subject pages through a
   headless Playwright Chromium and read the icon glyph each topic
   card ended up with. Pre-fix, Tema 5 of IPE rendered as 📂 (the
   fallback) and all six TA topic cards rendered as 📂; post-fix
   every card should EITHER match TOPIC_ICONS[topicGroup] OR the per-deck
   `icon` value (for topics with only one section, which is the design's
   single-deck shortcut — topicCardHtml prefers `deck.icon` over the
   topic icon in that one case).

   The bug we're guarding against is the fallback 📂. So the real
   invariant is: no card renders 📂. The exact icon per card is a
   secondary check, derived from app.js's own topicCardHtml rules. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8080';

const cases = [
  {
    label: 'IPE subject page',
    url: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=Itinerario%20Personal%20para%20la%20Empleabilidad'
  },
  {
    label: 'TA subject page',
    url: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=T%C3%A9cnicas%20Administrativas%20B%C3%A1sicas'
  }
];

(async () => {
  const browser = await chromium.launch();
  let fallback = 0;
  try {
    for (const c of cases) {
      const page = await browser.newPage();
      await page.goto(c.url, { waitUntil: 'networkidle' });
      await page.waitForSelector('.deck-card');
      const rows = await page.$$eval('.deck-card', els => els.map(e => ({
        title: e.querySelector('h3').textContent,
        icon:  e.querySelector('.deck-icon').textContent,
        href:  e.getAttribute('href') || ''
      })));
      const topicCount = rows.filter(r => /topicGroup=/.test(r.href)).length;
      console.log('\n== ' + c.label + ' (' + topicCount + ' topic cards) ==');
      for (const r of rows) {
        const isTopic = /topicGroup=/.test(r.href);
        if (!isTopic) continue;     // subject-level card uses SUBJECT_ICONS, not TOPIC_ICONS
        if (r.icon === '\ud83d\udcc2') {
          console.log('  [FALLBACK] ' + r.icon + '  ' + r.title);
          fallback++;
        } else {
          console.log('  [OK]       ' + r.icon + '  ' + r.title);
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (fallback) {
    console.error('\nFAIL ' + fallback + ' topic card(s) still render the \ud83d\udcc2 fallback');
    process.exit(1);
  } else {
    console.log('\nOK every topic card has a non-fallback icon');
  }
})().catch(e => { console.error('FAIL:', e.message); process.exit(2); });
