#!/usr/bin/env node
/*
 * scripts/i18n-keys-smoke.js — i18n key usage vs. registration smoke
 * for Memofun.
 *
 * Walks every page (root index.html, settings/, tools/study/) and
 * collects every data-i18n / data-i18n-aria / data-i18n-meta /
 * data-i18n-title attribute plus every App.i18n.t('...') call
 * reachable from that page's own <script src=...> bundle. Then it
 * reports per-locale missing keys. It does NOT fail by default —
 * missing keys are content gaps to be fixed in the strings.<locale>.js
 * file, not a CI gate (use --strict to fail on missing keys, like
 * the sibling apptonomia's scripts/i18n-keys-smoke.js does).
 *
 * The structural "missing key" check that DOES fail is already in
 * scripts/check.js — this script is the wider, informational version
 * that also covers the less-common locales a fork might add.
 *
 * Run over every locale dir:
 *   node scripts/i18n-keys-smoke.js
 *
 * Or fail the job on missing keys:
 *   node scripts/i18n-keys-smoke.js --strict
 *
 * Default locale set matches the i18n module's `SUPPORTED` list; if
 * you add a new locale to assets/js/i18n.js's SUPPORTED array, add
 * it here too. This script is intentionally a smoke (informational),
 * not a gate, so the bar for adding locales stays low.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const SUPPORTED = ['es', 'en'];

const HTML_PAGES = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'settings', 'index.html'),
  path.join(ROOT, 'tools', 'study', 'index.html')
].filter((f) => fs.existsSync(f));

function extractRegisterCalls(file) {
  const result = { es: {}, en: {} };
  const sandbox = {
    App: { i18n: { register: function (dict, loc) {
      if (!dict || typeof dict !== 'object') return;
      if (loc !== 'es' && loc !== 'en') return;
      Object.keys(dict).forEach(function (k) { result[loc][k] = dict[k]; });
    } } },
    window: {}
  };
  sandbox.window = sandbox;
  try {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file, timeout: 2000 });
  } catch (e) { /* file may lean on browser globals we don't stub — ignore */ }
  return result;
}

function extractScriptSrcs(htmlFile) {
  const src = fs.readFileSync(htmlFile, 'utf8');
  const out = [];
  const re = /<script\s+[^>]*\bsrc=(["'])([^"']+)\1[^>]*>\s*<\/script>/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!/^https?:\/\//i.test(m[2])) out.push(m[2]);
  }
  return out;
}

function collectAttrKeys(text, attr) {
  const keys = [];
  const re = new RegExp(attr + '="([^"]+)"', 'g');
  let m;
  while ((m = re.exec(text)) !== null) keys.push(m[1]);
  return keys;
}

function collectCallKeys(text) {
  const keys = [];
  const re = /App\.i18n\.t\(\s*(['"])([^'"]+)\1/g;
  let m;
  while ((m = re.exec(text)) !== null) keys.push(m[2]);
  return keys;
}

function flattenKeys(obj, prefix, out) {
  out = out || [];
  Object.keys(obj || {}).forEach(function (k) {
    const key = prefix ? prefix + '.' + k : k;
    const v = obj[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) flattenKeys(v, key, out);
    else out.push(key);
  });
  return out;
}

// Harvest registered keys across both the core i18n module (whose
// built-in DICT holds core.* / feedback.*) and the per-locale
// strings.<locale>.js files (which hold home.*, settings.*, etc.).
//
// We can't just sum the per-script register() calls: i18n.js wraps
// register() inside an IIFE that re-assigns window.App.i18n after
// our interceptor runs. Same approach as scripts/smoke-prod.js:
// run assets/js/i18n.js first, then monkey-patch the resulting
// App.i18n.register so subsequent strings.<locale>.js calls feed
// our `registered` map. Additionally we read i18n.js's internal
// DICT literal out of the source so the built-in core.* keys are
// counted even though no script ever calls register({core: ...}).
function harvestRegistered(scripts) {
  const registered = { es: {}, en: {} };
  const vm = require('vm');
  const sandbox = {
    App: { i18n: { register: function (dict, loc) {
      if (!dict || typeof dict !== 'object') return;
      if (loc !== 'es' && loc !== 'en') return;
      Object.keys(dict).forEach(function (k) { registered[loc][k] = dict[k]; });
    } } },
    window: {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);

  for (const f of scripts) {
    const base = path.basename(f);
    if (base === 'i18n.js') {
      // Read i18n.js's built-in DICT out of the source so we count
      // the core.* keys that live there but are never explicitly
      // registered through App.i18n.register.
      const src = fs.readFileSync(f, 'utf8');
      const dictMatch = src.match(/var\s+DICT\s*=\s*\{[\s\S]*?\n\s*\};/);
      if (dictMatch) {
        try {
          vm.runInContext(dictMatch[0] + '\nthis.__SMOKE_DICT__ = DICT;', sandbox, { filename: f + '#dict', timeout: 2000 });
          const builtIn = sandbox.__SMOKE_DICT__;
          if (builtIn && typeof builtIn === 'object') {
            SUPPORTED.forEach(function (loc) {
              if (builtIn[loc] && typeof builtIn[loc] === 'object') {
                Object.keys(builtIn[loc]).forEach(function (k) { registered[loc][k] = builtIn[loc][k]; });
              }
            });
          }
        } catch (e) { /* leave registered as-is */ }
      }
      // Also seed window.App.i18n.register so the strings.<locale>.js
      // calls that follow land in our `registered` map.
      try {
        vm.runInContext(src, sandbox, { filename: f, timeout: 2000 });
        const realRegister = sandbox.App && sandbox.App.i18n && sandbox.App.i18n.register;
        if (typeof realRegister === 'function') {
          sandbox.App.i18n.register = function (dict, loc) {
            if (dict && typeof dict === 'object' && (loc === 'es' || loc === 'en')) {
              Object.keys(dict).forEach(function (k) { registered[loc][k] = dict[k]; });
            }
            return realRegister.call(this, dict, loc);
          };
        }
      } catch (e) { /* i18n.js may touch browser-only globals */ }
      continue;
    }
    // strings.<locale>.js (and any other per-locale register file).
    try {
      vm.runInContext(fs.readFileSync(f, 'utf8'), sandbox, { filename: f, timeout: 2000 });
    } catch (e) { /* browser globals not stubbed; expected */ }
  }
  return registered;
}

function buildDomain(htmlFile) {
  const dir = path.dirname(htmlFile);
  const scripts = extractScriptSrcs(htmlFile)
    .map((s) => path.join(dir, s))
    .filter((f) => f.slice(-3) === '.js' && fs.existsSync(f));
  const registered = harvestRegistered(scripts);
  const htmlSrc = fs.readFileSync(htmlFile, 'utf8');
  const used = [];
  ['data-i18n', 'data-i18n-aria', 'data-i18n-meta', 'data-i18n-title'].forEach(function (attr) {
    used.push.apply(used, collectAttrKeys(htmlSrc, attr));
  });
  scripts.forEach((f) => {
    used.push.apply(used, collectCallKeys(fs.readFileSync(f, 'utf8')));
  });
  return {
    es: flattenKeys(registered.es, '').sort(),
    en: flattenKeys(registered.en, '').sort(),
    used: Array.from(new Set(used))
  };
}

const strict = process.argv.indexOf('--strict') !== -1;

let totalMissing = 0;
HTML_PAGES.forEach(function (page) {
  const label = path.relative(ROOT, page);
  const domain = buildDomain(page);
  SUPPORTED.forEach(function (loc) {
    const set = domain[loc];
    const missing = [];
    domain.used.forEach(function (key) {
      if (set.indexOf(key) !== -1) return;
      // Allow family matches: a used key "home.tagline" is satisfied
      // by a registered family "home" with any children.
      const hasFamily = set.some(function (rk) { return rk.indexOf(key) === 0; });
      if (hasFamily) return;
      missing.push(key);
    });
    if (missing.length) {
      totalMissing += missing.length;
      console.log('✗ ' + label + ' [' + loc + '] ' + missing.length + ' used key(s) not registered:');
      missing.forEach(function (k) { console.log('    - ' + k); });
    } else {
      console.log('✓ ' + label + ' [' + loc + '] every used key is registered');
    }
  });
});

if (totalMissing) {
  console.log('\n' + totalMissing + ' key(s) missing across all pages — fix in strings.<locale>.js.');
  if (strict) process.exit(1);
} else {
  console.log('\nAll pages: every used i18n key is registered for every supported locale.');
}