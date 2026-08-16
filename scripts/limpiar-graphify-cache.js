#!/usr/bin/env node
/*
 * scripts/limpiar-graphify-cache.js — housekeeping for Memofun's
 * local graphify build output.
 *
 * The `graphify` AI agent tool (see CLAUDE.md and `.graphifyignore`)
 * writes a knowledge graph + reports under `graphify-out/`. None of
 * that is shipped content — it's a workshop artefact for the AI agent
 * to navigate the repo. The directory is already in .gitignore, so
 * it doesn't pollute commits, but it does accumulate over time and
 * gets stale relative to the source tree.
 *
 * Removing `graphify-out/` is safe: the next time the agent runs
 * graphify, it regenerates the whole thing from scratch. Unlike
 * sinonimia's `scripts/limpiar-cache.js` (which also handles
 * `scripts/.cache/`), memofun has no other regenerable caches —
 * `node_modules/` is gitignored and shouldn't exist anyway (the
 * project has no npm dependencies).
 *
 * Usage:
 *   node scripts/limpiar-graphify-cache.js            # dry-run (default): shows what would be removed
 *   node scripts/limpiar-graphify-cache.js --apply    # actually removes the directory
 *   node scripts/limpiar-graphify-cache.js --help
 *
 * Why a dry-run by default: deleting is irreversible, and a maintainer
 * who runs this from muscle memory shouldn't have to think twice.
 * Same pattern as `git clean`'s default and sinonimia's
 * scripts/limpiar-cache.js.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGET = path.join(ROOT, 'graphify-out');

function bytesHuman(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KiB';
  return (n / (1024 * 1024)).toFixed(2) + ' MiB';
}

function listDirRecursive(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(full);
    }
  })(dir);
  return out;
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      emptyDir(full);
      fs.rmdirSync(full);
    } else if (entry.isFile()) {
      fs.unlinkSync(full);
    }
  }
  // Also remove the root itself so the directory disappears entirely.
  fs.rmdirSync(dir);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(
    'Usage:\n' +
    '  node scripts/limpiar-graphify-cache.js            # dry-run (default): shows what would be removed\n' +
    '  node scripts/limpiar-graphify-cache.js --apply    # actually removes graphify-out/\n' +
    '  node scripts/limpiar-graphify-cache.js --help\n'
  );
  process.exit(0);
}
const apply = args.includes('--apply');

const files = listDirRecursive(TARGET);
const bytes = files.reduce((sum, f) => sum + fs.statSync(f).size, 0);

console.log('=== Memofun — graphify-out cleanup ===\n');

if (files.length === 0) {
  console.log('graphify-out/ is already empty or absent. Nothing to remove.');
  process.exit(0);
}

const rel = path.relative(ROOT, TARGET);
console.log(rel + '/  (' + files.length + ' file(s), ' + bytesHuman(bytes) + ')');
console.log('  Workshop artefact from the graphify AI agent tool.');
console.log('  Regenerated automatically next time graphify runs.\n');

if (!apply) {
  console.log(
    'DRY RUN — nothing was removed. Re-run with --apply to actually delete the directory.\n' +
    'Total: ' + files.length + ' file(s), ' + bytesHuman(bytes) + '.'
  );
  process.exit(0);
}

emptyDir(TARGET);

console.log(
  'Removed ' + files.length + ' file(s) (' + bytesHuman(bytes) + ') from graphify-out/.\n' +
  "It will be rebuilt automatically the next time the graphify agent tool runs."
);