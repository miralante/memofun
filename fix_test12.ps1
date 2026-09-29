$file = 'D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\memofun\tests\app.spec.js'
$content = Get-Content $file -Raw -Encoding UTF8

$oldBlock = @'
  const page = await openWithStorage(browser, () => {});
  page.on('console', msg => { if (msg.type() === 'log') console.log('PAGE LOG:', msg.text()); });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto(BASE + 'tools/study/index.html?deck=' + ESO1_BIO_DECK_FILE + '&id=' + ESO1_BIO_DECK_ID + '&titulo=Biologia');
  await expect(page.locator('#study-area')).toBeVisible({ timeout: 10000 });

  // Click through cards until the end screen appears.
  // waitForFlipDone is a fixed 2s timeout — it may resolve before the
  // showEndScreen() flip animation finishes.  We poll until the end screen
  // is actually visible before checking the loop condition again.
  while (true) {
    // DEBUG: log app state from page
    await page.waitForTimeout(500);
    const state = await page.evaluate(() => ({ index: window._studyIndex(), cardsLen: window._studyCardsLen(), goNextCalls: window._goNextCalls }));
    console.log('DEBUG before click: state=', JSON.stringify(state));
    // Track btn-next clicks from Playwright side
    let clickCount = 0;
    page.on('click', () => { clickCount++; console.log('PW CLICK count=' + clickCount); });
    console.log('DEBUG before click: state=', JSON.stringify(state));

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
});
'@

$newBlock = @'
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
    // __studyFlipping() returns the internal `flipping` flag; poll until false.
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
'@

if ($content.Contains($oldBlock)) {
    $newContent = $content.Replace($oldBlock, $newBlock)
    [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Replaced successfully"
} else {
    Write-Host "Old block NOT found"
    # Try to find a partial match
    $lines = Get-Content $file
    Write-Host "File has $($lines.Count) lines"
    Write-Host "Line 306: $($lines[305])"
}
