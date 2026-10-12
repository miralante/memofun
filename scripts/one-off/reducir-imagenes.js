/* One-off helper: walk the list of oversized JPEG image paths emitted
   by the Node audit (printed above) and feed them one-by-one to
   recodificar-imagenes.ps1. The PS1 script handles the
   System.Drawing round-trip; this wrapper just sequences it and
   tracks which files still overflow after the last variant. */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');   // scripts/one-off -> repo root
const PS1  = path.join(__dirname, 'recodificar-imagenes.ps1');

const paths = process.argv.slice(2);
if (!paths.length) {
  console.error('Usage: node reducir-imagenes.js <path1> [path2 ...]');
  process.exit(2);
}

const LIMIT = 200 * 1024;
const SEP   = '\u2550'.repeat(60);

const ok = [];
const fail = [];

for (const rel of paths) {
  const abs = path.isAbsolute(rel) ? rel : path.join(REPO, rel);
  const before = fs.statSync(abs).size;
  console.log('\n' + SEP);
  console.log('-> ' + rel + '  (' + Math.round(before/1024) + ' KB)');
  const r = cp.spawnSync('powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', PS1, abs],
    { cwd: REPO, encoding: 'utf8' });
  process.stdout.write(r.stdout || '');
  if (r.status !== 0) {
    process.stderr.write(r.stderr || '');
    fail.push({ rel, before });
    continue;
  }
  const after = fs.statSync(abs).size;
  if (after <= LIMIT) ok.push({ rel, before, after });
  else fail.push({ rel, before, after });
}

console.log('\n' + SEP);
console.log('Resumen:');
ok.sort((a,b)=>b.before-a.before).forEach(f =>
  console.log('  OK       ' + Math.round(f.before/1024) + ' KB -> ' + Math.round(f.after/1024) + ' KB  ' + f.rel));
fail.forEach(f =>
  console.log('  STILL > ' + (f.after ? Math.round(f.after/1024) : '?') + ' KB              ' + f.rel));

if (fail.length) {
  console.error('FAIL: ' + fail.length + ' image(s) still over 200 KB');
  process.exit(1);
}
console.log('All ' + ok.length + ' image(s) under 200 KB.');
