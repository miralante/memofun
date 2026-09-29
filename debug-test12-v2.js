// Detailed debug script matching test 12's logic step by step
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ launchOptions: { slowMo: 0 } });
  const page = await ctx.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
    else console.log('BROWSER:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  const startTime = Date.now();
  function elapsed() { return ((Date.now() - startTime) / 1000).toFixed(1) + 's'; }

  try {
    console.log('[' + elapsed() + '] 1. goto...');
    await page.goto('http://127.0.0.1:4173/tools/study/index.html?deck=eso_1_biologia-geologia.json&id=eso1bg&titulo=Biologia', { timeout: 10000 });
    console.log('[' + elapsed() + '] 2. goto done');

    console.log('[' + elapsed() + '] 3. waitForSelector #study-area...');
    await page.waitForSelector('#study-area', { timeout: 10000 });
    console.log('[' + elapsed() + '] 4. #study-area visible');

    console.log('[' + elapsed() + '] 5. Pre-loop waitForFunction #btn-reveal not.hidden...');
    await page.waitForFunction(
      () => !document.querySelector('#btn-reveal.hidden'),
      { timeout: 10000 }
    );
    console.log('[' + elapsed() + '] 6. #btn-reveal visible - entering loop');

    console.log('[' + elapsed() + '] 7. Waiting 3s for entrance flip...');
    await page.waitForTimeout(3000);
    console.log('[' + elapsed() + '] 8. Done waiting, starting loop');

    for (let i = 0; i < 20; i++) {
      console.log('[' + elapsed() + '] Loop ' + i + ': start iteration');

      console.log('[' + elapsed() + '] Loop ' + i + ': waiting for #btn-reveal not.hidden...');
      await page.waitForFunction(
        () => !document.querySelector('#btn-reveal.hidden'),
        { timeout: 10000 }
      );
      console.log('[' + elapsed() + '] Loop ' + i + ': #btn-reveal visible');

      const btnVisible = await page.locator('#btn-reveal').isVisible();
      console.log('[' + elapsed() + '] Loop ' + i + ': #btn-reveal isVisible=' + btnVisible);

      console.log('[' + elapsed() + '] Loop ' + i + ': clicking #btn-reveal...');
      await page.locator('#btn-reveal').click();
      console.log('[' + elapsed() + '] Loop ' + i + ': clicked');

      console.log('[' + elapsed() + '] Loop ' + i + ': waiting for .revealed...');
      await page.waitForSelector('#flashcard.revealed', { timeout: 5000 });
      console.log('[' + elapsed() + '] Loop ' + i + ': .revealed visible');

      console.log('[' + elapsed() + '] Loop ' + i + ': clicking #btn-next...');
      await page.locator('#btn-next').click();
      console.log('[' + elapsed() + '] Loop ' + i + ': clicked #btn-next');

      console.log('[' + elapsed() + '] Loop ' + i + ': waiting 3s...');
      await page.waitForTimeout(3000);
      console.log('[' + elapsed() + '] Loop ' + i + ': done waiting');

      const endVisible = await page.locator('#end-screen').isVisible();
      console.log('[' + elapsed() + '] Loop ' + i + ': end screen=' + endVisible);
      if (endVisible) {
        console.log('[' + elapsed() + '] Loop ' + i + ': END SCREEN FOUND!');
        break;
      }
    }

    console.log('[' + elapsed() + '] Final check: #end-screen visible?');
    const endFinal = await page.locator('#end-screen').isVisible();
    console.log('[' + elapsed() + '] end screen = ' + endFinal);
    console.log('SUCCESS');

  } catch (err) {
    console.log('[' + elapsed() + '] ERROR:', err.message);
  }

  await browser.close();
})();
