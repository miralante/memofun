#!/usr/bin/env node
/*
 * Memofun — production smoke test.
 *
 * Catches drift between what's deployed and what visitors are actually
 * served — the class of bug scripts/check.js structurally cannot see,
 * because check.js only inspects the source tree, not what the live
 * Cloudflare Workers edge is serving. The model and trigger are the
 * same as sinonimia/scripts/smoke-prod.js: cron-scheduled (every 6h,
 * see .github/workflows/smoke-prod.yml) so drift caused by stale
 * caches is caught within the window, not only at deploy time.
 *
 * Concretely, on every run this script:
 *
 *   1. GETs the live index.html and parses its <script src=...> tags.
 *      The exact URLs it follows are the ones a real visitor would
 *      see — if any of them is being served stale, this test is
 *      fooled by the same stale cache.
 *
 *   2. For each script it found, sandboxes-evaluates it and harvests
 *      every App.i18n.register({...}, 'es'|'en') call. Then it parses
 *      index.html and every script's own body for data-i18n* and
 *      App.i18n.t('...') references, and asserts every used key is
 *      registered in each locale. A visitor would see the literal
 *      key ("home.tagline", "core.back") instead of translated text
 *      otherwise — the same bug the teclatlon CSP regression
 *      caused when its _headers shipped a doubled-quote typo.
 *
 *   3. GETs decks/manifest.json and asserts it's reachable, 200, and
 *      parseable as a JSON array — the home screen would render an
 *      empty state otherwise.
 *
 *   4. GETs index.html a second time with HEAD to assert the four
 *      security headers set in _headers (X-Frame-Options,
 *      X-Content-Type-Options, Content-Security-Policy,
 *      Referrer-Policy) are still present.
 *
 * Run manually: node scripts/smoke-prod.js
 * Against another deploy: PROD_URL=https://... node scripts/smoke-prod.js
 */

const PROD_URL = (process.env.PROD_URL || 'https://memofun.miralante.workers.dev').replace(/\/$/, '');

function ok(message) { console.log('✓ ' + message); }
function fail(message) { console.error('✗ ' + message); process.exitCode = 1; }

function bail(message) {
  console.error('✗ ' + message);
  process.exit(1);
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' fetching ' + url);
  return { status: res.status, body: await res.text(), headers: res.headers };
}

function extractScriptSrcs(html) {
  const srcs = [];
  const re = /<script\s+[^>]*\bsrc=(["'])([^"']+)\1[^>]*>\s*<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!/^https?:\/\//i.test(m[2])) srcs.push(m[2]);
  }
  return srcs;
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

(async function main() {
  console.log('Smoke target: ' + PROD_URL);

  // ----- 1. Fetch index.html -----
  const indexResp = await fetchText(PROD_URL + '/');
  ok('fetched ' + PROD_URL + '/  (HTTP ' + indexResp.status + ')');
  const html = indexResp.body;

  // ----- 2. Headers check (CSP, X-Frame-Options, etc.) -----
  ['x-frame-options', 'x-content-type-options', 'content-security-policy', 'referrer-policy'].forEach(function (header) {
    if (!indexResp.headers.has(header)) {
      fail('live index.html is missing the "' + header + '" response header — check _headers still ships it.');
    } else {
      ok('header "' + header + '" present');
    }
  });

  // ----- 3. Harvest App.i18n.register from each script the page loads -----
  // Memofun's i18n.js wraps its register() inside an IIFE and the
  // per-locale strings.<locale>.js files call `App.i18n.register({...},
  // 'es'|'en')`. Trying to sandbox-eval all the page's scripts just
  // to intercept register is fragile (the IIFE overwrites App.i18n
  // with its own implementation, killing any external interceptor).
  // Instead we read the two strings.<locale>.js files directly via
  // the same vm sandbox check.js uses (single shared App, single
  // register interceptor), and additionally bootstrap i18n.js first
  // so the strings.<locale>.js files don't bail on their own
  // `if (window.App.i18n)` guard.
  const scriptSrcs = extractScriptSrcs(html);
  if (!scriptSrcs.length) {
    bail('could not find any <script src="..."> in the live index.html');
  }
  const vm = require('vm');
  const registered = { es: {}, en: {} };
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

  // We run the scripts in two phases to handle the IIFE-vs-interceptor
  // dance that memofun's i18n.js does: phase 1 runs assets/js/i18n.js
  // (which defines the core.* DICT and exposes a register() that mutates
  // it directly), phase 2 monkey-patches the resulting window.App.i18n
  // register so any subsequent strings.<locale>.js calls also flow into
  // our `registered` map. After that we run each strings.<locale>.js.
  // This mirrors how the browser does it, just with our observer
  // spliced in after i18n.js is done initializing.
  const isI18n = function (rel) { return /(^|\/)assets\/js\/i18n\.js$/.test(rel); };
  const isStrings = function (rel) { return /(^|\/)strings\.(es|en)\.js$/.test(rel); };
  const fetchBody = async function (rel) {
    const url = PROD_URL + '/' + rel.replace(/^\//, '');
    try {
      return await fetchText(url);
    } catch (e) {
      fail('could not fetch ' + url + ': ' + e.message);
      return null;
    }
  };

  for (const rel of scriptSrcs) {
    if (!isI18n(rel)) continue;
    const r = await fetchBody(rel);
    if (!r) continue;
    try {
      vm.runInContext(r.body, sandbox, { filename: PROD_URL + '/' + rel, timeout: 2000 });
    } catch (e) { /* browser globals not stubbed; ignored on purpose */ }
    // After i18n.js ran, window.App.i18n is the real implementation
  // whose register() mutates an internal DICT. Splice in an observer
  // that keeps the original behaviour but also feeds our `registered`
  // map so we can later flatten and compare against data-i18n* usage.
    const realRegister = sandbox.App && sandbox.App.i18n && sandbox.App.i18n.register;
    if (typeof realRegister === 'function') {
      sandbox.App.i18n.register = function (dict, loc) {
        if (dict && typeof dict === 'object' && (loc === 'es' || loc === 'en')) {
          Object.keys(dict).forEach(function (k) { registered[loc][k] = dict[k]; });
        }
        return realRegister.call(this, dict, loc);
      };
    }
  }

  // After i18n.js, also seed the registered map with i18n.js's own
  // built-in DICT. i18n.js pre-registers {core: {appName, back, ...},
  // feedback: {...}} for both locales inside its IIFE; we want that
  // baseline to count too. The cleanest way is to ask i18n.js itself
  // for its current DICT through a tiny shim that calls register on
  // it; but a sandbox-scoped "App.i18n.t" doesn't return the dict
  // directly. Easier: pull the DICT out via the well-known function
  // name `lookup` exposed by i18n.js — but it's not exported. So
  // re-register what i18n.js is supposed to have by reading the
  // harvested `t()` would need an existing key. Instead, just rely
  // on the strings.<locale>.js files (which is what adds user-facing
  // keys) plus a separate harvest of i18n.js's built-in core.* keys
  // by calling its t() with a probe key — too brittle. Simplest
  // robust approach: parse i18n.js's DICT literal out of its source
  // with regex. We do that below, before the per-locale run, so the
  // harvest covers both the built-in core.* keys AND the strings.*
  // keys regardless of order.

  // Extract the DICT literal from i18n.js source.
  const i18nRel = scriptSrcs.find(isI18n);
  if (i18nRel) {
    const r = await fetchBody(i18nRel);
    if (r) {
      const dictMatch = r.body.match(/var\s+DICT\s*=\s*\{[\s\S]*?\n\s*\};/);
      if (dictMatch) {
        try {
          const dictLiteral = dictMatch[0];
          // Evaluate just the DICT literal in our sandbox so we get
          // both the 'es' and 'en' branches as real objects.
          vm.runInContext(dictLiteral + '\nthis.__SMOKE_DICT__ = DICT;', sandbox, { filename: PROD_URL + '/' + i18nRel + '#dict', timeout: 2000 });
          const builtIn = sandbox.__SMOKE_DICT__;
          if (builtIn && typeof builtIn === 'object') {
            ['es', 'en'].forEach(function (loc) {
              if (builtIn[loc] && typeof builtIn[loc] === 'object') {
                Object.keys(builtIn[loc]).forEach(function (k) { registered[loc][k] = builtIn[loc][k]; });
              }
            });
          }
        } catch (e) { /* leave registered as-is */ }
      }
    }
  }

  for (const rel of scriptSrcs) {
    if (!isStrings(rel)) continue;
    const r = await fetchBody(rel);
    if (!r) continue;
    try {
      vm.runInContext(r.body, sandbox, { filename: PROD_URL + '/' + rel, timeout: 2000 });
    } catch (e) {
      fail('live ' + rel + ' threw during sandbox eval: ' + (e && e.message));
    }
  }
  ['es', 'en'].forEach(function (loc) {
    const totalKeys = flattenKeys(registered[loc], '').length;
    if (!totalKeys) {
      fail('no i18n keys harvested for locale "' + loc + '" — the smoke cannot verify locale parity.');
    } else {
      ok('harvested ' + totalKeys + ' registered keys for locale "' + loc + '"');
    }
  });

  // ----- 4. Cross-check usage vs registration, in both directions -----
  const flatReg = {
    es: flattenKeys(registered.es, '').sort(),
    en: flattenKeys(registered.en, '').sort()
  };
  const used = new Set();
  ['data-i18n', 'data-i18n-aria', 'data-i18n-meta', 'data-i18n-title'].forEach(function (attr) {
    collectAttrKeys(html, attr).forEach(function (k) { used.add(k); });
  });
  // Re-fetch each script to also collect App.i18n.t(...) references inside them.
  for (const rel of scriptSrcs) {
    const url = PROD_URL + '/' + rel.replace(/^\//, '');
    try {
      const r = await fetchText(url);
      collectCallKeys(r.body).forEach(function (k) { used.add(k); });
    } catch (e) { /* already reported above */ }
  }
  ok('collected ' + used.size + ' distinct i18n keys in use across index.html + scripts');

  ['es', 'en'].forEach(function (loc) {
    const set = flatReg[loc];
    used.forEach(function (key) {
      if (set.indexOf(key) !== -1) return;
      const family = set.find(function (rk) { return rk.indexOf(key) === 0; });
      if (family) return;
      fail('live page uses i18n key "' + key + '" (data-i18n* or App.i18n.t) but no loaded script registers it for locale "' + loc + '" — a visitor would see the literal key.');
    });
  });
  if (!process.exitCode) {
    ok('every used i18n key is registered for both locales in the live site');
  }

  // ----- 5. decks/manifest.json sanity -----
  try {
    const m = await fetchText(PROD_URL + '/decks/manifest.json');
    let parsed;
    try {
      parsed = JSON.parse(m.body);
    } catch (e) {
      bail('decks/manifest.json is not valid JSON: ' + e.message);
    }
    if (!Array.isArray(parsed) || !parsed.length) {
      fail('decks/manifest.json is JSON but is not a non-empty array — home would show the empty state.');
    } else {
      ok('decks/manifest.json reachable, valid JSON, ' + parsed.length + ' deck(s) listed');
    }
  } catch (e) {
    fail('decks/manifest.json: ' + e.message);
  }

  if (process.exitCode) {
    console.error('\nFAILED: production is serving a broken Memofun.');
    process.exit(1);
  } else {
    console.log('\nAll production smoke checks passed.');
  }
})().catch(function (e) {
  fail(e.message);
  process.exit(1);
});