const fs = require('fs');
const file = 'D:/apps/onedrive/jrodriguezgar/OneDrive/dev/git/Miralante/memofun/tests/app.spec.js';
let content = fs.readFileSync(file, 'utf8');

// ===== FIX TEST 12: remove debug logging, keep clean structure =====
const debugLoop = `  // Click through cards until the end screen appears.
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

const cleanLoop = `  // Click through all 14 cards until the end screen appears.
  for (let i = 0; i < 20; i++) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-next').click();
    // Wait for the flip animation to fully complete before the next click.
    try {
      await page.waitForFunction(() => !window.__studyFlipping(), { timeout: 6000 });
    } catch { /* timeout: fall through */ }
    await page.waitForTimeout(500);

    // End screen shows after the last card's flip animation settles
    const endScreenVisible = await page.locator('#end-screen').isVisible();
    if (endScreenVisible) break;
  }
  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
});`;

if (content.includes(debugLoop)) {
    content = content.replace(debugLoop, cleanLoop);
    console.log('Replaced test 12 debug loop with clean version');
} else {
    console.log('Could not find debug loop in test 12');
}

// ===== FIX TEST 13: replace waitForFlipDone with __studyFlipping polling =====
const old13Loop = `  while (true) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
    await page.locator('#btn-next').click();
    await waitForFlipDone(page);

    // Poll until end screen is visible (it may still be animating in)
    try {
      await expect(page.locator('#end-screen')).toBeVisible({ timeout: 500 });
      // End screen appeared — deck is complete.
      break;
    } catch {
      // Not visible yet — keep waiting
      await waitForFlipDone(page);
      await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
      // End screen now visible after waiting.
      break;
    }
  }

  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
  // Stars should show ⭐ 1
  const starsText = await page.locator('#stars-total').textContent();
  expect(starsText).toMatch(/1/);
});`;

const new13Loop = `  for (let i = 0; i < 20; i++) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-next').click();
    try {
      await page.waitForFunction(() => !window.__studyFlipping(), { timeout: 6000 });
    } catch { /* timeout: fall through */ }
    await page.waitForTimeout(500);

    const endScreenVisible = await page.locator('#end-screen').isVisible();
    if (endScreenVisible) break;
  }
  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
  // Stars should show ⭐ 1
  const starsText = await page.locator('#stars-total').textContent();
  expect(starsText).toMatch(/1/);
});`;

if (content.includes(old13Loop)) {
    content = content.replace(old13Loop, new13Loop);
    console.log('Replaced test 13 loop');
} else {
    console.log('Could not find old test 13 loop');
}

// ===== FIX TEST 14: replace waitForFlipDone with __studyFlipping polling =====
const old14Loop = `  while (true) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });
    await page.locator('#btn-next').click();
    await waitForFlipDone(page);

    // Poll until end screen is visible (it may still be animating in)
    try {
      await expect(page.locator('#end-screen')).toBeVisible({ timeout: 500 });
      // End screen appeared — deck is complete.
      break;
    } catch {
      // Not visible yet — keep waiting
      await waitForFlipDone(page);
      await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
      // End screen now visible after waiting.
      break;
    }
  }
  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });

  // Click "Repasar otra vez"
  await page.locator('#btn-study-again').click();
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#flashcard')).toBeVisible();
  await expect(page.locator('#end-screen')).toBeHidden();
});`;

const new14Loop = `  for (let i = 0; i < 20; i++) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-next').click();
    try {
      await page.waitForFunction(() => !window.__studyFlipping(), { timeout: 6000 });
    } catch { /* timeout: fall through */ }
    await page.waitForTimeout(500);

    const endScreenVisible = await page.locator('#end-screen').isVisible();
    if (endScreenVisible) break;
  }
  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });

  // Click "Repasar otra vez"
  await page.locator('#btn-study-again').click();
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#flashcard')).toBeVisible();
  await expect(page.locator('#end-screen')).toBeHidden();
});`;

if (content.includes(old14Loop)) {
    content = content.replace(old14Loop, new14Loop);
    console.log('Replaced test 14 loop');
} else {
    console.log('Could not find old test 14 loop');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');
