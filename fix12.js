const fs = require('fs');
const file = 'D:/apps/onedrive/jrodriguezgar/OneDrive/dev/git/Miralante/memofun/tests/app.spec.js';
const content = fs.readFileSync(file, 'utf8');

const startMarker = "test('12";
const startIdx = content.indexOf(startMarker);
console.log('test 12 starts at:', startIdx);

const test13Marker = "test('13";
const endIdx = content.indexOf(test13Marker, startIdx);
console.log('test 13 starts at:', endIdx);

const block12 = content.substring(startIdx, endIdx);
console.log('Block length:', block12.length);

const newBlock = `test('12 — completing all cards shows the end screen', async ({ browser }) => {
  const page = await openWithStorage(browser, () => {});
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });

  // Click through cards until the end screen appears.
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
});

`;

const newContent = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
fs.writeFileSync(file, newContent, 'utf8');
console.log('Done!');
