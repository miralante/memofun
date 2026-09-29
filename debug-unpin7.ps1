$ErrorActionPreference = 'Stop'

function Get-CdpErrors($page) {
    $errors = @()
    try {
        $cdp = $page.Context.NewCDPSession($page)
        $cdp.On('Runtime.consoleAPICalled', { $errors.Append($_.Params) } )
    } catch {}
    $errors
}

$watches = @()

$script = @'
const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Track localStorage writes
  const writes = [];
  await ctx.addInitScript(() => {
    const orig = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = function(k, v) {
      writes.push({ key: k, value: typeof v === 'string' ? v : JSON.stringify(v) });
      orig(k, v);
    };
  });

  await page.goto('http://127.0.0.1:4173/');
  await page.waitForTimeout(300);
  console.log('After initial load, writes:', JSON.stringify(writes));

  // Navigate to 1º de ESO
  await page.locator('#deck-grid .deck-card', { hasText: '1º de ESO' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  // Unpin
  await page.locator('#btn-pin-course').click();
  await page.waitForTimeout(500);

  const prefsAfterUnpin = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('prefs after unpin (before navigation):', prefsAfterUnpin);
  console.log('Total writes so far:', writes.length, writes.map(w => w.key + '=' + (w.value.length > 30 ? w.value.slice(0,30)+'...' : w.value)).join(', '));

  // Navigate home - addInitScript runs BEFORE page load
  // This re-injects cursoFijado='1º de ESO' into localStorage
  console.log('--- Navigating home via page.goto("/") ---');
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForTimeout(300);

  const prefsAfterNav = await page.evaluate(() => localStorage.getItem('memofun:prefs'));
  console.log('prefs after home navigation:', prefsAfterNav);
  const quickAccess = await page.evaluate(() => !!document.querySelector('.quick-access'));
  console.log('quick-access present:', quickAccess);
  console.log('All writes:', JSON.stringify(writes));

  await browser.close();
})();
'@

$tempFile = [System.IO.Path]::GetTempFileName() + '.js'
Set-Content -Path $tempFile -Value $script -Encoding UTF8

node $tempFile 2>&1
Remove-Item $tempFile -Force
