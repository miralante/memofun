const fs = require('fs');
const file = 'D:/apps/onedrive/jrodriguezgar/OneDrive/dev/git/Miralante/memofun/tests/app.spec.js';
let content = fs.readFileSync(file, 'utf8');

// Fix test 13 loop: replace the waitForFlipDone call with __studyFlipping polling
const old13 = `  while (true) {
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

const new13 = `  while (true) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-next').click();
    // Wait for flip animation to fully complete before the next click.
    try {
      await page.waitForFunction(() => !window.__studyFlipping(), { timeout: 6000 });
    } catch { /* timeout: fall through */ }
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

  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });
  // Stars should show ⭐ 1
  const starsText = await page.locator('#stars-total').textContent();
  expect(starsText).toMatch(/1/);
});`;

if (content.includes(old13)) {
    content = content.replace(old13, new13);
    console.log('Replaced test 13 loop');
} else {
    console.log('Could not find test 13 old block');
}

// Fix test 14 loop
const old14 = `  while (true) {
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

const new14 = `  while (true) {
    await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 3000 });
    await page.locator('#btn-reveal').click();
    await expect(page.locator('#flashcard.revealed')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-next').click();
    // Wait for flip animation to fully complete before the next click.
    try {
      await page.waitForFunction(() => !window.__studyFlipping(), { timeout: 6000 });
    } catch { /* timeout: fall through */ }
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
  await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });

  // Click "Repasar otra vez"
  await page.locator('#btn-study-again').click();
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#flashcard')).toBeVisible();
  await expect(page.locator('#end-screen')).toBeHidden();
});`;

if (content.includes(old14)) {
    content = content.replace(old14, new14);
    console.log('Replaced test 14 loop');
} else {
    console.log('Could not find test 14 old block');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');
