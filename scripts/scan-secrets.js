#!/usr/bin/env node
/*
 * Memofun — scripts/scan-secrets.js
 *
 * Best-effort scan for accidentally committed secrets (API keys,
 * tokens, private keys, etc.). Pattern-based grep over the working
 * tree; not a substitute for GitHub's native push protection
 * (https://docs.github.com/code-security/secret-scanning) but a fast
 * pre-commit / pre-push check that catches the most obvious mistakes
 * (Gemini key, GitHub PAT, AWS access key, PEM private key, generic
 * api/secret/private_key=bearer token literals).
 *
 * Run manually: node scripts/scan-secrets.js
 *
 * Also wired into the `secrets-scan` job in
 * .github/workflows/ci.yml so every push and PR is checked with the
 * exact same logic. Same shape as the sibling project
 * apptonomia's scripts/scan-secrets.js.
 *
 * Exit 0 if nothing was found, 1 if anything matched. Output:
 *   - matched files printed as `[smoke] possibly-leaked secret match in <path>`
 *   - summary at the end: "N secret(s) found" / "no secrets found"
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PATTERNS = [
  'api[_-]?key',
  'secret[_-]?key',
  'private[_-]?key',
  'bearer',
  'aws_access',
  'ghp_',
  'sk-[A-Za-z0-9]{20,}',
  '-----BEGIN [A-Z ]+PRIVATE KEY-----'
];
const PATTERN_RE = new RegExp(PATTERNS.join('|'), 'i');

// Files that legitimately look like a pattern but are not secrets —
// the scanner itself and the CI workflow that runs it. Without this
// exclusion any `api_key`/`secret_key`/`private_key`/`bearer`/
// `aws_access`/`ghp_`/OpenAI-key literal in their own body matches.
//
// `EXEMPT_FILES` is matched against the path relative to the repo
// root using a few common path separators — both `/` (the normal
// form when the agent is on POSIX) and `\` (Windows). New entries
// should be added here if you intentionally keep a pattern-bearing
// string in a script or workflow.
const PRUNED_DIRS = ['.git', 'node_modules', 'graphify-out', 'decks/concepts'];
const EXEMPT_FILES = [
  '.github/workflows/ci.yml',         // defines PATTERNS as a bash string
  'scripts/scan-secrets.js',          // defines PATTERNS as a Node array
  '.github/workflows/ci.yml',
  'scripts/scan-secrets.js'
].map((p) => p.toLowerCase());

// Skip binary files whose content we'd otherwise dump noise from. The
// list is intentionally short; the secret scanner's job is to flag
// plaintext patterns, so anything that can't contain plaintext is
// ignored.
const BINARY_EXT_RE = /\.(png|jpg|jpeg|gif|webp|svg|woff2?|eot|ttf|ico|pdf|zip|tar|gz|br|exe|dll|bin)$/i;

function* walk(current) {
  const stat = fs.statSync(current);
  if (stat.isFile()) {
    yield current;
    return;
  }
  const entries = fs.readdirSync(current, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) {
      if (PRUNED_DIRS.includes(entry.name)) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

const hits = [];
const candidates = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  // Normalise path separators so EXEMPT_FILES matches both '/' and '\\'.
  const relNormalised = rel.split(path.sep).join('/').toLowerCase();
  if (rel.split(path.sep).some((seg) => PRUNED_DIRS.includes(seg))) continue;
  if (BINARY_EXT_RE.test(file)) continue;
  if (EXEMPT_FILES.includes(relNormalised) || EXEMPT_FILES.includes(rel.toLowerCase())) {
    candidates.push(file);
    continue;
  }
  candidates.push(file);
  let body;
  try {
    body = fs.readFileSync(file, 'utf8');
  } catch (e) {
    continue;
  }
  if (PATTERN_RE.test(body)) {
    hits.push(rel);
  }
}

if (hits.length === 0) {
  console.log('scan-secrets: no secrets found across ' + candidates.length + ' file(s).');
  process.exit(0);
}

for (const h of hits) {
  console.error('::error::possibly-leaked secret match in ' + h);
}
console.error('\nscan-secrets: ' + hits.length + ' file(s) contained a suspicious pattern. Review and remove before pushing.');
process.exit(1);