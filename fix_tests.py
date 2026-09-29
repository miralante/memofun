import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('tests/app.spec.js', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

def dump_range(start, count, label):
    print(f"\n=== {label} (lines {start}-{start+count-1}) ===")
    for i in range(start-1, start-1+count):
        print(f"  {i+1}: {repr(lines[i])}")

def replace_block(start, end, new_lines):
    """Replace 1-indexed start..end with new_lines."""
    return lines[:start-1] + new_lines + lines[end:]

# =============================================================
# Find all test loops by searching for the for loop lines
# =============================================================
# Test 12: find 'test(' and its 'for (let i = 0; i < 20; i++)'
# We'll edit by searching for the specific comment blocks

# Helper: find line containing text
def find_line(pattern, start=0):
    for i in range(start, len(lines)):
        if pattern in lines[i]:
            return i + 1  # 1-indexed
    return None

# =============================================================
# TEST 12 FIX
# =============================================================
# The for loop starts at line 353, wait lines are 361 and 370
# Strategy: replace lines 361-375 (the body inside the loop)
# but we need to be careful about the end-screen check placement

# First fixed wait (line 361) -> waitForFunction
# Second fixed wait (line 370) -> end-screen check + wait pattern
# Lines 361-375 = [wait, blank, expect, click, expect, blank, click, comment, comment, wait, blank, comment, end-screen, if-break, close]

t12_new_loop_body = [
    '    // Wait for btn-reveal to be visible before interacting.  Use waitForFunction',
    '    // (not a fixed timeout) because the squash/paintQuestion duration varies in',
    '    // headless and can exceed 10s.  The poll checks btn-reveal exists AND is not',
    '    // hidden.  Timeout of 20s covers the slowest realistic squash.',
    '    await page.waitForFunction(',
    '      () => {',
    '        const btn = document.querySelector(\'#btn-reveal\');',
    '        return btn && !btn.classList.contains(\'hidden\');',
    '      },',
    '      { timeout: 20000 }',
    '    );',
    '',
    '    await page.locator(\'#btn-reveal\').click();',
    '    await expect(page.locator(\'#flashcard.revealed\')).toBeVisible({ timeout: 5000 });',
    '',
    '    await page.locator(\'#btn-next\').click();',
    '',
    '    // End screen shows after the last card; break early so we don\'t wait for',
    '    // btn-reveal on a non-existent next card.',
    '    const endScreenVisible = await page.locator(\'#end-screen\').isVisible();',
    '    if (endScreenVisible) break;',
    '',
    '    // After clicking btn-next, wait for btn-reveal to be hidden (confirms the',
    '    // next card\'s paintQuestion has started), then wait for it to be visible',
    '    // again (confirms squash animation for the new card has settled).',
    '    await page.waitForSelector(\'#btn-reveal\', { state: \'hidden\', timeout: 5000 });',
    '    await page.waitForFunction(',
    '      () => {',
    '        const btn = document.querySelector(\'#btn-reveal\');',
    '        return btn && !btn.classList.contains(\'hidden\');',
    '      },',
    '      { timeout: 20000 }',
    '    );',
]

# Replace the ENTIRE for loop body (lines 354-375, the 22 lines inside the for)
lines = replace_block(354, 375, t12_new_loop_body)
print("Test 12 loop body replaced")

# =============================================================
# TEST 13 FIX - find by searching after test 12's end
# =============================================================
# Find test 13's for loop
idx12_end = find_line("await expect(page.locator('#end-screen')).toBeVisible({ timeout: 5000 });",
                        find_line("test('13", 0) or 0)
# Find the for loop in test 13 (should be around line 419 now after test 12 expansion)
t13_for = find_line('for (let i = 0; i < 20; i++)', find_line("test('13"))
print(f"Test 13 for loop starts at line {t13_for}")

# Test 13 structure: line 405 (wait), 407 (expect), 411 (click), 414 (wait)
# After test 12 fix (+22 lines), these shift by ~+22
# But let's just search dynamically

# Find the two waitForTimeout(5000) inside test 13's loop
# Search between test 13's for line and its closing brace
t13_for_idx = t13_for - 1  # 0-indexed
t13_end_idx = None
# Find matching closing brace (count curly braces)
depth = 0
for i in range(t13_for_idx, len(lines)):
    if '{' in lines[i]: depth += lines[i].count('{')
    if '}' in lines[i]: depth -= lines[i].count('}')
    if depth == 0 and i > t13_for_idx:
        t13_end_idx = i
        break
print(f"Test 13 loop ends at line {t13_end_idx+1}")

# Find the two waitForTimeout(5000) in test 13 loop
t13_waits = []
for i in range(t13_for_idx, t13_end_idx+1):
    if 'await page.waitForTimeout(5000)' in lines[i]:
        t13_waits.append(i+1)  # 1-indexed
print(f"Test 13 wait lines: {t13_waits}")

# First wait (earlier in loop) -> waitForFunction before expect
# Second wait (later in loop) -> end-screen check + wait pattern
t13_first_wait = t13_waits[0]
t13_second_wait = t13_waits[1]

# Find the expect line after first wait (should be 2 lines after)
t13_expect = find_line("await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 5000 });",
                        t13_first_wait)
print(f"Test 13 expect line: {t13_expect}")

# Build replacement for first wait -> waitForFunction + expect
t13_first_new = [
    '    // Wait for btn-reveal to be visible before interacting.',
    '    await page.waitForFunction(',
    '      () => {',
    '        const btn = document.querySelector(\'#btn-reveal\');',
    '        return btn && !btn.classList.contains(\'hidden\');',
    '      },',
    '      { timeout: 20000 }',
    '    );',
    '',
    '    await expect(page.locator(\'#btn-reveal\')).toBeVisible({ timeout: 5000 });',
]
lines = replace_block(t13_first_wait, t13_expect, t13_first_new)
# After this replacement, lines shift by delta = len(t13_first_new) - (t13_expect - t13_first_wait + 1)
delta13a = len(t13_first_new) - (t13_expect - t13_first_wait + 1)
print(f"Delta after first wait replacement: {delta13a}")

# Recalculate second wait line (shifted)
t13_second_wait_shifted = t13_second_wait + delta13a
# Find end-screen check line
t13_endscreen = find_line('const endScreenVisible = await page.locator(\'#end-screen\').isVisible();',
                           t13_second_wait_shifted)
t13_break = find_line('if (endScreenVisible) break;', t13_second_wait_shifted)
t13_close = find_line('}', t13_break)
print(f"Test 13 second wait shifted: {t13_second_wait_shifted}, end-screen: {t13_endscreen}, break: {t13_break}, close: {t13_close}")

# Build replacement for second wait -> end-screen check + wait pattern
t13_second_new = [
    '    await page.locator(\'#btn-next\').click();',
    '',
    '    const endScreenVisible = await page.locator(\'#end-screen\').isVisible();',
    '    if (endScreenVisible) break;',
    '',
    '    await page.waitForSelector(\'#btn-reveal\', { state: \'hidden\', timeout: 5000 });',
    '    await page.waitForFunction(',
    '      () => {',
    '        const btn = document.querySelector(\'#btn-reveal\');',
    '        return btn && !btn.classList.contains(\'hidden\');',
    '      },',
    '      { timeout: 20000 }',
    '    );',
]
# Replace lines from second wait through the closing brace of the for loop
lines = replace_block(t13_second_wait_shifted, t13_close, t13_second_new)
delta13b = len(t13_second_new) - (t13_close - t13_second_wait_shifted + 1)
print(f"Delta after second wait replacement: {delta13b}")

print("Test 13 loop body replaced")

# =============================================================
# TEST 14 FIX
# =============================================================
t14_for = find_line('for (let i = 0; i < 20; i++)', find_line("test('14"))
print(f"\nTest 14 for loop starts at line {t14_for}")

# Find the two waitForTimeout(5000) in test 14's loop
t14_for_idx = t14_for - 1
t14_end_idx = None
depth = 0
for i in range(t14_for_idx, len(lines)):
    if '{' in lines[i]: depth += lines[i].count('{')
    if '}' in lines[i]: depth -= lines[i].count('}')
    if depth == 0 and i > t14_for_idx:
        t14_end_idx = i
        break
print(f"Test 14 loop ends at line {t14_end_idx+1}")

t14_waits = []
for i in range(t14_for_idx, t14_end_idx+1):
    if 'await page.waitForTimeout(5000)' in lines[i]:
        t14_waits.append(i+1)
print(f"Test 14 wait lines: {t14_waits}")

t14_first_wait = t14_waits[0]
t14_second_wait = t14_waits[1]

t14_expect = find_line("await expect(page.locator('#btn-reveal')).toBeVisible({ timeout: 5000 });",
                        t14_first_wait)
print(f"Test 14 expect line: {t14_expect}")

t14_first_new = [
    '    // Wait for btn-reveal to be visible before interacting.',
    '    await page.waitForFunction(',
    '      () => {',
    '        const btn = document.querySelector(\'#btn-reveal\');',
    '        return btn && !btn.classList.contains(\'hidden\');',
    '      },',
    '      { timeout: 20000 }',
    '    );',
    '',
    '    await expect(page.locator(\'#btn-reveal\')).toBeVisible({ timeout: 5000 });',
]
lines = replace_block(t14_first_wait, t14_expect, t14_first_new)
delta14a = len(t14_first_new) - (t14_expect - t14_first_wait + 1)
print(f"Delta after first wait replacement: {delta14a}")

t14_second_wait_shifted = t14_second_wait + delta14a
t14_endscreen = find_line('endScreenVisible = await page.locator(\'#end-screen\').isVisible();',
                           t14_second_wait_shifted)
t14_break = find_line('if (endScreenVisible) break;', t14_second_wait_shifted)
t14_close = find_line('}', t14_break)
print(f"Test 14 second wait shifted: {t14_second_wait_shifted}, end-screen: {t14_endscreen}, break: {t14_break}, close: {t14_close}")

t14_second_new = [
    '    await page.locator(\'#btn-next\').click();',
    '',
    '    endScreenVisible = await page.locator(\'#end-screen\').isVisible();',
    '    if (endScreenVisible) break;',
    '',
    '    await page.waitForSelector(\'#btn-reveal\', { state: \'hidden\', timeout: 5000 });',
    '    await page.waitForFunction(',
    '      () => {',
    '        const btn = document.querySelector(\'#btn-reveal\');',
    '        return btn && !btn.classList.contains(\'hidden\');',
    '      },',
    '      { timeout: 20000 }',
    '    );',
]
lines = replace_block(t14_second_wait_shifted, t14_close, t14_second_new)
print("Test 14 loop body replaced")

# =============================================================
# Write final result
# =============================================================
with open('tests/app.spec.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print("\nAll replacements done! File written.")
