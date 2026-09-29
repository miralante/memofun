// Minimal debug script for test 12
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ launchOptions: { slowMo: 0 } });
  const page = await ctx.newPage();

  // Capture ALL console output
  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('1. Navigating to study app...');
    await page.goto('http://127.0.0.1:4173/tools/study/index.html?deck=eso_1_biologia-geologia.json&id=eso1bg&titulo=Biologia', { timeout: 10000 });
    console.log('2. Page loaded');

    console.log('3. Waiting for #study-area...');
    await page.waitForSelector('#study-area', { timeout: 10000 });
    console.log('4. #study-area visible');

    console.log('5. Waiting for #btn-reveal not.hidden...');
    await page.waitForFunction(
      () => !document.querySelector('#btn-reveal.hidden'),
      { timeout: 10000 }
    );
    console.log('6. #btn-reveal visible');

    console.log('6b. Checking end screen...');
    const endVisible = await page.locator('#end-screen').isVisible();
    console.log('   end screen visible?', endVisible);

    console.log('7. First card - clicking #btn-reveal...');
    await page.locator('#btn-reveal').click();
    console.log('8. Clicked, waiting for .revealed...');
    await page.waitForSelector('#flashcard.revealed', { timeout: 5000 });
    console.log('9. Card revealed');

    console.log('10. Clicking #btn-next...');
    await page.locator('#btn-next').click();
    console.log('11. Clicked #btn-next');

    console.log('12. Waiting 3s...');
    await page.waitForTimeout(3000);
    console.log('13. Done waiting');

    console.log('14. Checking end screen...');
    const end2 = await page.locator('#end-screen').isVisible();
    console.log('   end screen visible?', end2);

    console.log('SUCCESS - all steps completed');
  } catch (err) {
    console.log('ERROR:', err.message);
  }

  await browser.close();
})();
