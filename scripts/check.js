#!/usr/bin/env node
/* ============================================================
   Memofun — scripts/check.js
   Structural check with no dependencies (plain Node only), same
   convention as the sibling projects (Apptonomia, Okeymoney, Sinonimia,
   Calculia, Teclatlon).
   Usage: node scripts/check.js
   Checks:
   1. That every .js file at the repo root, in assets/js/, settings/,
      tools/study/ and scripts/ parses (equivalent to `node --check`).
   2. es/en key parity between strings.es.js and strings.en.js — root,
      settings/, tools/study/.
   3. sw.js <-> disk parity: every FILES path exists.
   4. manifest.json icons exist on disk.
   5. Mandatory rule: zero mentions of disability, intellectual
      disability, occupational therapy, clinical language or minors in
      user-facing files (see doc/<locale>/SPEC.md §2.4 / CLAUDE.md).
   6. _headers: every quoted Content-Security-Policy source expression
      (e.g. 'self') has exactly one leading and one trailing quote.
   7. Usage vs. registration: every data-i18n / data-i18n-aria /
      data-i18n-meta / data-i18n-title attribute and every literal
      App.i18n.t('key') call reachable from a page must resolve to a
      key actually registered (in each locale) by that page's own
      <script src> bundle.
   8. decks/manifest.json: every listed deck's `file` exists in decks/
      and is valid JSON with a non-empty `tarjetas` array.
   9. content-indices/ (recursively): every .md file parses as a valid
      content config (frontmatter with `tema`, via scripts/config-parser.js)
      and, if it has a `# Índice` section, that section is not empty.
   Output: list of failures with the exact file. Exit code 1 if there
   are any, "OK (N checks)" otherwise.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var execFileSync = require('child_process').execFileSync;

/* Page scripts run inside a vm sandbox (see extractRegisterCalls below)
   often call an async top-level function (e.g. app.js's IIFE calling an
   `async function loadDecks()`) that touches `document`/`fetch`, which
   aren't stubbed. The throw happens after the sandboxed function has
   already returned a Promise, so it surfaces as an unhandled rejection
   *outside* the synchronous try/catch around vm.runInContext — and
   Node terminates the process on unhandled rejections by default. This
   check only cares about register() calls made before any such throw,
   so unhandled rejections from sandboxed evaluation are intentionally
   swallowed here rather than crashing the whole script. */
process.on('unhandledRejection', function () {});

var ROOT = path.join(__dirname, '..');
var failures = [];
var checks = 0;

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

function listJs(dir) {
  var out = [];
  if (!fs.existsSync(dir)) return out;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    var full = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  });
  return out;
}

/* --- 1. node --check on the root app, assets/js/, settings/, tools/study/, scripts/ --- */
var jsFiles = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(function (e) { return e.isFile() && e.name.endsWith('.js'); })
  .map(function (e) { return path.join(ROOT, e.name); })
  .concat(listJs(path.join(ROOT, 'assets', 'js')))
  .concat(listJs(path.join(ROOT, 'settings')))
  .concat(listJs(path.join(ROOT, 'tools', 'study')))
  .concat(listJs(path.join(ROOT, 'scripts')));

jsFiles.forEach(function (file) {
  checks += 1;
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    failures.push(rel(file) + ': does not parse (node --check) — ' +
      (e.stderr ? e.stderr.toString().trim().split('\n')[0] : e.message));
  }
});

/* --- 2. strings.<locale>.js key parity --- */
function extractDictFromStrings(file) {
  var captured = null;
  var sandbox = { App: { i18n: { register: function (dict, loc) {
    if (typeof loc === 'string') captured = dict;
  } } }, window: {} };
  sandbox.window = sandbox;
  try {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  } catch (e) {
    return null;
  }
  return captured;
}

function flattenKeys(obj, prefix) {
  var out = [];
  Object.keys(obj || {}).forEach(function (k) {
    var key = prefix ? prefix + '.' + k : k;
    var value = obj[k];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out = out.concat(flattenKeys(value, key));
    } else {
      out.push(key);
    }
  });
  return out;
}

function compareLocales(dir, label) {
  var entries = fs.readdirSync(dir)
    .filter(function (name) { return /^strings\.[a-zA-Z0-9-]+\.js$/.test(name); });
  if (entries.length < 2) return;
  checks += 1;
  var dicts = {};
  entries.forEach(function (name) {
    var d = extractDictFromStrings(path.join(dir, name));
    if (!d) {
      failures.push(label + ': could not extract dict from ' + name);
      return;
    }
    dicts[name] = flattenKeys(d, '').sort();
  });
  var names = Object.keys(dicts);
  if (!names.length) return;
  var reference = names[0];
  names.slice(1).forEach(function (name) {
    var a = dicts[reference], b = dicts[name];
    var onlyA = a.filter(function (k) { return b.indexOf(k) === -1; });
    var onlyB = b.filter(function (k) { return a.indexOf(k) === -1; });
    if (onlyA.length || onlyB.length) {
      var detail = [];
      if (onlyA.length) detail.push('only in ' + reference + ': ' + onlyA.join(', '));
      if (onlyB.length) detail.push('only in ' + name + ': ' + onlyB.join(', '));
      failures.push(label + ': ' + detail.join('; '));
    }
  });
}

compareLocales(ROOT, 'strings.<locale>.js');
if (fs.existsSync(path.join(ROOT, 'settings'))) compareLocales(path.join(ROOT, 'settings'), 'settings/');
if (fs.existsSync(path.join(ROOT, 'tools', 'study'))) compareLocales(path.join(ROOT, 'tools', 'study'), 'tools/study/');

/* --- 3. sw.js <-> disk parity --- */
checks += 1;
var swContent = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
var filesMatch = swContent.match(/var FILES = \[([\s\S]*?)\];/);
if (!filesMatch) {
  failures.push('sw.js: FILES array not found');
} else {
  var re = /'([^']+)'/g;
  var m;
  while ((m = re.exec(filesMatch[1])) !== null) {
    var full = path.join(ROOT, m[1].replace(/^\.\//, ''));
    if (!fs.existsSync(full)) {
      failures.push('sw.js: FILES lists ' + m[1] + ' but it does not exist on disk');
    }
  }
}

/* --- 4. manifest.json icons exist --- */
checks += 1;
var manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
(manifest.icons || []).forEach(function (icon) {
  var full = path.join(ROOT, icon.src.replace(/^\.\//, ''));
  if (!fs.existsSync(full)) {
    failures.push('manifest.json: icon ' + icon.src + ' does not exist on disk');
  }
});

/* --- 5. Mandatory rule: zero disability / clinical / minors mentions ---
   SPEC.md §2.4 and CLAUDE.md: the end user never sees clinical or
   disability-labeling language. Internal docs (SPEC.md, README.md,
   CONTRIBUTING.md, CLAUDE.md) are out of scope by design — they explain
   the project's real audience, which is the very reason this rule
   exists for the product surface. */
checks += 1;
var FORBIDDEN_TERMS = [
  { term: 'discapacidad', match: 'substring' },
  { term: 'disabilit', match: 'substring' },
  { term: 'intelectual', match: 'substring' },
  { term: 'intellectual', match: 'substring' },
  { term: 'terapia ocupacional', match: 'substring' },
  { term: 'occupational therap', match: 'substring' },
  { term: 'necesidades especiales', match: 'substring' },
  { term: 'special needs', match: 'substring' },
  { term: 'paciente', match: 'word' },
  { term: 'patient', match: 'word' },
  { term: 'minor', match: 'word' },
  { term: 'underage', match: 'word' },
  { term: 'children', match: 'word' }
];
var USER_FACING_FILES = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'app.js'),
  path.join(ROOT, 'strings.es.js'),
  path.join(ROOT, 'strings.en.js'),
  path.join(ROOT, 'offline.html'),
  path.join(ROOT, '404.html'),
  path.join(ROOT, 'legal', 'index.html')
]
  .concat(listJs(path.join(ROOT, 'settings')))
  .concat([path.join(ROOT, 'settings', 'index.html')])
  .concat(listJs(path.join(ROOT, 'tools', 'study')))
  .concat([path.join(ROOT, 'tools', 'study', 'index.html')])
  .filter(function (f) { return fs.existsSync(f); });

USER_FACING_FILES.forEach(function (file) {
  var content = fs.readFileSync(file, 'utf8').toLowerCase();
  FORBIDDEN_TERMS.forEach(function (entry) {
    var term = entry.term;
    var hit;
    if (entry.match === 'word') {
      hit = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(content);
    } else {
      hit = content.indexOf(term.toLowerCase()) !== -1;
    }
    if (hit) {
      failures.push(rel(file) + ': contains "' + term + '" — no page visible to the user may mention disability or clinical language (see doc/en/SPEC.md §2.4)');
    }
  });
});

/* --- 6. _headers: CSP source-expression quoting --- */
checks += 1;
var headersContent = fs.readFileSync(path.join(ROOT, '_headers'), 'utf8');
headersContent.split('\n').filter(function (line) {
  return /^\s*Content-Security-Policy:/i.test(line);
}).forEach(function (line) {
  var value = line.replace(/^\s*Content-Security-Policy:/i, '');
  value.split(';').forEach(function (directive) {
    directive.trim().split(/\s+/).filter(Boolean).forEach(function (token) {
      var quoteCount = (token.match(/'/g) || []).length;
      if (quoteCount === 0) return;
      var wellFormed = quoteCount === 2 && token[0] === "'" && token[token.length - 1] === "'";
      if (!wellFormed) {
        failures.push('_headers: malformed CSP source expression "' + token +
          '" — quotes should wrap the keyword exactly once (e.g. \'self\', not \'\'self\'\')');
      }
    });
  });
});

/* --- 7. Usage vs. registration --- */
(function checkUsageVsRegistration() {
  function extractCoreDict() {
    var file = path.join(ROOT, 'assets', 'js', 'i18n.js');
    var src = fs.readFileSync(file, 'utf8');
    var m = src.match(/var DICT = (\{[\s\S]*?\n {2}\});\s*\n\s*function detect\(\)/);
    if (!m) return { es: {}, en: {} };
    try {
      return vm.runInNewContext('(' + m[1] + ')');
    } catch (e) {
      return { es: {}, en: {} };
    }
  }

  function extractRegisterCalls(file) {
    var result = { es: {}, en: {} };
    var sandbox = {
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
    } catch (e) { /* file leans on browser globals we don't stub — ignore */ }
    return result;
  }

  function extractScriptSrcs(htmlFile) {
    var src = fs.readFileSync(htmlFile, 'utf8');
    var out = [];
    var re = /<script\s+[^>]*\bsrc=(["'])([^"']+)\1[^>]*>\s*<\/script>/g;
    var m;
    while ((m = re.exec(src)) !== null) {
      if (!/^https?:\/\//i.test(m[2])) out.push(m[2]);
    }
    return out;
  }

  function collectAttrKeys(text, attr) {
    var keys = [];
    var re = new RegExp(attr + '="([^"]+)"', 'g');
    var m;
    while ((m = re.exec(text)) !== null) keys.push(m[1]);
    return keys;
  }

  function collectCallKeys(text) {
    var keys = [];
    var re = /App\.i18n\.t\(\s*(['"])([^'"]+)\1/g;
    var m;
    while ((m = re.exec(text)) !== null) keys.push(m[2]);
    return keys;
  }

  var coreDict = extractCoreDict();

  function buildDomain(htmlFile) {
    var dir = path.dirname(htmlFile);
    var scripts = extractScriptSrcs(htmlFile)
      .map(function (s) { return path.join(dir, s); })
      .filter(function (f) {
        return f.slice(-3) === '.js' && path.basename(f) !== 'i18n.js' && fs.existsSync(f);
      });
    var registered = { es: {}, en: {} };
    ['es', 'en'].forEach(function (loc) {
      Object.keys(coreDict[loc] || {}).forEach(function (k) { registered[loc][k] = coreDict[loc][k]; });
    });
    scripts.forEach(function (f) {
      var reg = extractRegisterCalls(f);
      ['es', 'en'].forEach(function (loc) {
        Object.keys(reg[loc]).forEach(function (k) { registered[loc][k] = reg[loc][k]; });
      });
    });
    var htmlSrc = fs.readFileSync(htmlFile, 'utf8');
    var used = [];
    ['data-i18n', 'data-i18n-aria', 'data-i18n-meta', 'data-i18n-title'].forEach(function (attr) {
      used = used.concat(collectAttrKeys(htmlSrc, attr));
    });
    scripts.forEach(function (f) {
      used = used.concat(collectCallKeys(fs.readFileSync(f, 'utf8')));
    });
    return {
      es: flattenKeys(registered.es, '').sort(),
      en: flattenKeys(registered.en, '').sort(),
      used: Array.from(new Set(used))
    };
  }

  function checkDomain(htmlFile) {
    checks += 1;
    var domain = buildDomain(htmlFile);
    ['es', 'en'].forEach(function (loc) {
      var set = domain[loc];
      domain.used.forEach(function (key) {
        if (set.indexOf(key) !== -1) return;
        var hasFamily = set.some(function (rk) { return rk.indexOf(key) === 0; });
        if (hasFamily) return;
        failures.push(rel(htmlFile) + ': [' + loc + '] key "' + key +
          '" is used (data-i18n* or App.i18n.t) but not registered by any script this page loads');
      });
    });
  }

  [
    path.join(ROOT, 'index.html'),
    path.join(ROOT, 'settings', 'index.html'),
    path.join(ROOT, 'tools', 'study', 'index.html')
  ].filter(function (f) { return fs.existsSync(f); }).forEach(checkDomain);
})();

/* --- 8. decks/manifest.json <-> decks/*.json integrity --- */
checks += 1;
(function checkDeckManifest() {
  var manifestPath = path.join(ROOT, 'decks', 'manifest.json');
  var entries;
  try {
    entries = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    failures.push('decks/manifest.json: not valid JSON — ' + e.message);
    return;
  }
  if (!Array.isArray(entries)) {
    failures.push('decks/manifest.json: must be a JSON array');
    return;
  }
  entries.forEach(function (entry, i) {
    var label = 'decks/manifest.json[' + i + ']';
    ['id', 'tema', 'nivel', 'cantidad', 'file'].forEach(function (field) {
      if (entry[field] === undefined) failures.push(label + ': missing "' + field + '"');
    });
    if (!entry.file) return;
    var deckPath = path.join(ROOT, 'decks', entry.file);
    if (!fs.existsSync(deckPath)) {
      failures.push(label + ': file "' + entry.file + '" does not exist in decks/');
      return;
    }
    try {
      var deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));
      if (!Array.isArray(deck.tarjetas) || !deck.tarjetas.length) {
        failures.push('decks/' + entry.file + ': "tarjetas" must be a non-empty array');
      } else {
        deck.tarjetas.forEach(function (card, ci) {
          ['pregunta', 'respuesta'].forEach(function (field) {
            var v = card[field];
            if (typeof v !== 'string' || !v.trim()) {
              failures.push('decks/' + entry.file + ': tarjetas[' + ci + '].' + field +
                ' must be a non-empty string, got ' + (typeof v) +
                ' — non-string card fields render literally (e.g. "[object Object]") since' +
                ' tools/study/app.js inserts them into innerHTML unescaped to allow simple HTML');
            }
          });
        });
      }
    } catch (e) {
      failures.push('decks/' + entry.file + ': not valid JSON — ' + e.message);
    }
  });
})();

/* --- 9. content-indices/ (recursive): valid config + non-empty índice --- */
(function checkContentIndices() {
  var dir = path.join(ROOT, 'content-indices');
  if (!fs.existsSync(dir)) return;

  var configParser;
  try {
    configParser = require(path.join(ROOT, 'scripts', 'config-parser.js'));
  } catch (e) {
    failures.push('content-indices/: could not load scripts/config-parser.js — ' + e.message);
    return;
  }

  function walk(current) {
    var out = [];
    fs.readdirSync(current, { withFileTypes: true }).forEach(function (entry) {
      var full = path.join(current, entry.name);
      if (entry.isDirectory()) out = out.concat(walk(full));
      else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md') out.push(full);
    });
    return out;
  }

  walk(dir).forEach(function (file) {
    checks += 1;
    var raw = fs.readFileSync(file, 'utf8');
    var cfg;
    try {
      cfg = configParser.parseMarkdown(raw);
    } catch (e) {
      failures.push(rel(file) + ': ' + e.message);
      return;
    }
    if (/^#{1,6}[ \t]*(?:[íÍ]ndice|indice)/im.test(raw) && !cfg.indice.length) {
      failures.push(rel(file) + ': has a "# Índice" heading but no bullet points were parsed from it');
    }
  });
})();

/* --- Result --- */
if (failures.length) {
  console.log('FAILURES (' + failures.length + '):');
  failures.forEach(function (f) { console.log('  - ' + f); });
  process.exitCode = 1;
} else {
  console.log('OK (' + checks + ' checks)');
}
