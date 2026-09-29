const fs = require('fs');
const file = 'D:/apps/onedrive/jrodriguezgar/OneDrive/dev/git/Miralante/memofun/tests/app.spec.js';
let content = fs.readFileSync(file, 'utf8');

// Replace test 12 loop with a debug version
const old12Loop = `  // Click through cards until the end screen appears.
  while (true) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-next').click();
    // Wait for the flip animation to fully complete before the next click.
    // __studyFlipping() returns the internal 'flipping' flag; poll until false.
    try {
      await page.waitForFunction(() => !window.__studyFlipping(), { timeout: 6000 });
    } catch { /* timeout: fall through to fixed wait */ }
    await page.waitForTimeout(500);

    // Poll until end screen is visible (it may still be animating in)
    try {
      await expect(page.locator('#end-screen')).toBeVisible({ timeout: 500 });
      break;
    } catch {
      await page.waitForTimeout(1000);
      try {
        await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
        break;
      } catch {
        // Keep going — card is still animating
      }
    }
  }
});`;

const new12Loop = `  // Click through cards until the end screen appears.
  let iterations = 0;
  while (iterations < 20) {
    iterations++;
    const iter = iterations;
    console.log('=== ITERATION', iter, '===');

    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });

    // Log state before clicking next
    const stateBefore = await page.evaluate(() => ({
      index: window._studyIndex(),
      cardsLen: window._studyCardsLen(),
      flipping: window.__studyFlipping ? window.__studyFlipping() : 'N/A',
      goNextCalls: window._goNextCalls
    }));
    console.log('Before click: state=', JSON.stringify(stateBefore));

    await page.locator('#btn-next').click();

    // Wait for flipping to finish
    try {
      await page.waitForFunction(() => !window.__studyFlipping(), { timeout: 6000 });
      console.log('flipping became false');
    } catch (e) {
      console.log('flipping TIMEOUT, flipping=',
        await page.evaluate(() => window.__studyFlipping()));
    }
    await page.waitForTimeout(500);

    // Check end screen
    const endScreenVisible = await page.locator('#end-screen').isVisible();
    console.log('After wait: endScreenVisible=', endScreenVisible,
      'index=', await page.evaluate(() => window._studyIndex()));

    if (endScreenVisible) {
      console.log('End screen found at iteration', iter);
      break;
    }
  }
  expect(iterations).toBeLessThan(20);
});`;

if (content.includes(old12Loop)) {
    content = content.replace(old12Loop, new12Loop);
    console.log('Replaced test 12 loop');
} else {
    console.log('Could not find old test 12 loop - showing context');
    const idx = content.indexOf('// Click through cards until the end screen appears');
    console.log(JSON.stringify(content.substring(idx, idx + 500)));
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
