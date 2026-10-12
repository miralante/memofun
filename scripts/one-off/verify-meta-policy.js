/* Confirms the deck-meta policy on each level of the navigation
   tree matches what the user asked for ("temas por asignatura, no
   recuento de secciones/tarjetas"):

   - Course card                   -> keeps "X asignaturas" (count)
   - Subject card (has topics)     -> shows "N temas"
   - Subject card (no topics)      -> NO deck-meta (deck count is dropped)
   - Topic card                    -> NO deck-meta (parent already counts)
   - Section/deck card             -> keeps "X tarjetas" (per-deck size)

   Each test case walks the routing map (renderCourseLevel ->
   renderSubjectLevel -> renderTopicLevel -> renderSectionLevel)
   and checks the expected meta on the cards it finds. The "no
   meta" levels are the same level after the change, so the route
   to find the right card is part of the test. */
'use strict';
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8090';

const cases = [
  /* ?course= is the SUBJECT level — shows the subject cards,
     one per subject within this course. Open subjects (IPE, TA)
     carry the topic count; closed ones render as --soon cards
     without a meta line. We verify the open ones specifically. */
  {
    label: 'Subject level (?course= only) — IPE + TA',
    url: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos',
    /* policy: every OPEN subject card must say "N temas"; closed
       subject cards omit the meta line entirely. */
    policy: function (cards) {
      const open = cards.filter(c => c.href);                       // <a class="deck-card" href="...">
      const closed = cards.filter(c => !c.href);                     // <div class="deck-card ..."> (--soon)
      const ok = open.every(c => c.meta && /tema/i.test(c.meta));
      const okClosed = closed.every(c => c.meta === null);
      return { ok: ok && okClosed, detail:
        'open meta: ' + JSON.stringify(open.map(c => c.meta)) +
        ' / closed meta: ' + JSON.stringify(closed.map(c => c.meta)) };
    }
  },
  /* ?course=&subject= is the TOPIC level. Topic cards should have
     no deck-meta: the topic count already lives on the parent
     subject card. */
  {
    label: 'Topic level (?course=&subject=) — IPE',
    url: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=Itinerario%20Personal%20para%20la%20Empleabilidad',
    policy: function (cards) {
      const all = cards.every(c => c.meta === null);
      return { ok: all, detail: 'all topic cards: ' + JSON.stringify(cards.map(c => c.meta)) };
    }
  },
  /* ?course=&subject=&topicGroup= is the SECTION level. Each card
     is a single deck, and per-deck cards keep their "X tarjetas"
     count — that is the actual study size, not an aggregated
     sibling of the topic count above. */
  {
    label: 'Section level (?topicGroup=…) — Tema 5 IPE',
    url: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=Itinerario%20Personal%20para%20la%20Empleabilidad' +
      '&topicGroup=Tema%205%20%C2%B7%20Habilidades%20personales',
    policy: function (cards) {
      const all = cards.every(c => c.meta && /tarjeta/i.test(c.meta));
      return { ok: all, detail: 'per-deck meta: ' + JSON.stringify(cards.map(c => c.meta)) };
    }
  },
  /* Flat-deck subject (?course=&subject= for a non-topic subject)
     drops down to a section-level deck grid. The deck cards
     themselves keep the per-deck tarjeta count as usual. The
     earlier "Subject card (no topics)" deck-meta line was the
     one we removed entirely (handled at the SUBJECT level). */
  {
    label: 'Flat subject page (no topics) — Atención al Cliente',
    url: BASE + '/?course=1%C2%BA%20de%20FP%20B%C3%A1sica%20Servicios%20Administrativos' +
      '&subject=Atenci%C3%B3n%20al%20Cliente',
    policy: function (cards) {
      const all = cards.every(c => c.meta && /tarjeta/i.test(c.meta));
      return { ok: all, detail: 'per-deck meta: ' + JSON.stringify(cards.map(c => c.meta)) };
    }
  },
  /* Also confirm the COURSE card still counts: it sits above the
     subject level and uses a different aggregate ("X asignaturas",
     not "X temas") per the user's "subjects are fine, sections
     and cards are not" wording. */
  {
    label: 'Course level (home) — counts unchanged',
    url: BASE + '/',
    policy: function (cards) {
      const all = cards.every(c => c.meta && /asignatura/i.test(c.meta));
      return { ok: all, detail: 'course meta: ' + JSON.stringify(cards.map(c => c.meta)) };
    }
  }
];

(async () => {
  const browser = await chromium.launch();
  let fail = 0;
  try {
    for (const c of cases) {
      const page = await browser.newPage();
      await page.goto(c.url, { waitUntil: 'networkidle' });
      await page.waitForSelector('.deck-card');
      const cards = await page.$$eval('.deck-card', els => els.map(e => ({
        title: e.querySelector('h3').textContent,
        meta:  (e.querySelector('.deck-meta') || {}).textContent || null,
        href:  e.getAttribute('href') || ''
      })));
      console.log('\n== ' + c.label + ' (' + cards.length + ' cards) ==');
      cards.forEach(card => {
        const tag = card.meta === null ? '(no meta)' : '"' + card.meta + '"';
        console.log('  ' + tag.padEnd(28) + '  ' + card.title);
      });
      const r = c.policy(cards);
      if (r.ok) console.log('  OK');
      else { console.log('  FAIL: ' + r.detail); fail += 1; }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (fail) {
    console.error('\nFAIL: ' + fail + ' level(s) broke the meta policy');
    process.exit(1);
  }
  console.log('\nOK: meta policy holds on every level');
})().catch(e => { console.error('FAIL:', e.message); process.exit(2); });
