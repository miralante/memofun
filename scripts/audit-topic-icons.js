#!/usr/bin/env node
/* Audit: every `topicGroup` in decks/manifest.json must have an entry in
   app.js's TOPIC_ICONS map. Mismatches fall through to the generic 📂
   in renderTopicLevel / renderSectionLevel, which is exactly the
   "icono gris" the suite tries to avoid — so this script exists to
   catch the drift before a manual review does.

   The map is hand-maintained (one icon per known topic), so any new
   `topicGroup` (or any rename of an existing one) shows here as a
   mismatch with no other code changes needed.

   Usage:  node scripts/audit-topic-icons.js
   Exit 0 = green; exit 1 = at least one mismatch (with listing).
*/
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var manifestPath = path.join(ROOT, 'decks', 'manifest.json');
var appJsPath = path.join(ROOT, 'app.js');

var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
var appJs = fs.readFileSync(appJsPath, 'utf8');

/* Keys are the literal `topicGroup` strings, values the icon char.
   Same shape as app.js's TOPIC_ICONS, so the audit matches the code. */
var iconEntries = {};
var re = /'\s*(Tema\s+\d+\s+·\s+[^']+)'\s*:\s*'([\u{1F000}-\u{1FFFF}\u2600}-\u27BF][\u{FE00}-\u{FEFF}]?)'/gu;
var m;
while ((m = re.exec(appJs)) !== null) {
  iconEntries[m[1]] = m[2];
}

var seen = new Set();
manifest.forEach(function (d) {
  if (d.topicGroup) seen.add(d.topicGroup);
});

var mismatches = [];
seen.forEach(function (t) {
  if (!iconEntries[t]) mismatches.push(t);
});

var dead = [];
Object.keys(iconEntries).forEach(function (k) {
  if (!seen.has(k)) dead.push(k);
});

if (mismatches.length) {
  console.error('FALTA icono para estos topicGroups (caen a \ud83d\udcc2):');
  mismatches.sort().forEach(function (t) { console.error('  - ' + JSON.stringify(t)); });
}
if (dead.length) {
  console.error('Entradas hu\u00e9rfanas en TOPIC_ICONS (ninguna baraja las usa):');
  dead.sort().forEach(function (t) { console.error('  - ' + JSON.stringify(t) + ' = ' + iconEntries[t]); });
}
if (mismatches.length || dead.length) {
  process.exitCode = 1;
  return;
}
console.log('OK  ' + seen.size + ' topicGroups, todos con icono.');
