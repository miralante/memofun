// debug-nav.js — replicate exact test 10 flow
// 1. Reveal card 0
// 2. Next → card 1
// 3. Reveal card 1
// 4. Prev → card 1 question
// 5. Prev → card 0
// 6. Try to click #btn-reveal on card 0
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('[BROWSER ERROR]', msg.text());
  });

  const url = 'http://127.0.0.1:4173/tools/study/index.html' +
    '?deck=eso_1_biologia-geologia.json' +
    '&id=eso-1-biologia-geologia' +
    '&titulo=Biologia';

  await page.goto(url);
  await page.waitForTimeout(1500);

  async function snap(label) {
    const info = await page.evaluate(function(_label) {
      var btnReveal = document.getElementById('btn-reveal');
      var cardEl = document.getElementById('flashcard');
      return {
        label: _label,
        cardClasses: cardEl ? cardEl.className : 'CARD_MISSING',
        btnRevealInDOM: !!btnReveal,
        btnRevealVisible: btnReveal ? window.getComputedStyle(btnReveal).display !== 'none' : false,
        btnRevealHidden: btnReveal ? btnReveal.classList.contains('hidden') : 'N/A'
      };
    }, label);
    console.log('STEP', info.label, '→', JSON.stringify(info));
  }

  async function doClick(selector, actionLabel) {
    console.log('ACTION click', selector, '(' + actionLabel + ')');
    try {
      await page.click(selector, { timeout: 5000 });
      console.log('RESULT click OK');
    } catch(e) {
      console.log('RESULT click FAILED:', e.message.split('\n')[0]);
    }
    await page.waitForTimeout(700);
  }

  // Step 1: Reveal card 0
  await snap('1-START card 0 question');
  await doClick('#btn-reveal', 'reveal card 0');
  await snap('2-AFTER reveal card 0');

  // Step 2: Next → card 1
  await doClick('#btn-next', 'goNext card 0→1');
  await page.waitForTimeout(700);
  await snap('3-AFTER next to card 1 (should be question)');

  // Step 3: Reveal card 1
  await doClick('#btn-reveal', 'reveal card 1');
  await snap('4-AFTER reveal card 1');

  // Step 4: Prev from revealed card 1 → card 1 question
  await doClick('#btn-prev', 'goPrev from revealed card 1 → card 1 question');
  await page.waitForTimeout(700);
  await snap('5-AFTER first prev (card 1 question)');

  // Step 5: Prev again → card 0
  await doClick('#btn-prev', 'goPrev from card 1 question → card 0');
  await page.waitForTimeout(700);
  await snap('6-AFTER second prev (card 0)');

  // Step 6: Try to click #btn-reveal on card 0
  console.log('ACTION click #btn-reveal on card 0');
  try {
    await page.click('#btn-reveal', { timeout: 5000 });
    console.log('RESULT click #btn-reveal OK');
  } catch(e) {
    console.log('RESULT click #btn-reveal FAILED:', e.message.split('\n')[0]);
  }
  await page.waitForTimeout(500);
  await snap('7-AFTER second reveal attempt');

  const btnCount = await page.locator('#btn-reveal').count();
  console.log('FINAL #btn-reveal count in DOM:', btnCount);

  await browser.close();
  console.log('Done');
})();
