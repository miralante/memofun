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
      config/, tools/study/.
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
      and is valid JSON with a non-empty `tarjetas` array; any card's
      optional `imagen` has all its subfields, the referenced file
      exists on disk, the license isn't NC/ND, and the on-disk image
      size is within budget (technical.md §3.1 — fail over 200 KB so a
      full-res or otherwise non-thumbnail image can't sit in the repo
      unnoticed, and can't exceed Cloudflare's 25 MiB per-file deploy
      limit on its own). An optional `topicGroup` must be a non-empty
     string owned by a single subject, and its deck's `tema` must not
     still repeat the "Tema N" prefix (technical.md §4 — the topic level
     exists so sections aren't flattened into one grid).
   9. doc/curriculum/ (recursively): every .md file parses as a valid
      content config (frontmatter with `tema`, via scripts/config-parser.js)
      and, if it has a `# Índice` section, that section is not empty.
  10. _redirects stays within Cloudflare's per-file limits
      (https://developers.cloudflare.com/pages/configuration/redirects/):
      a maximum of 2 000 static redirects and 100 dynamic
      (placeholder) redirects per file — 2 100 in total. If the file
      is absent (the common case for projects that have no redirects)
      the check is skipped: zero is valid.
  11. _headers stays within Cloudflare's per-file limit of 100
      header rules per file
      (https://developers.cloudflare.com/pages/configuration/headers/).
      A "rule" is one path-glob block (the glob line followed by
      indented header lines), so the wildcards of `/assets/*` plus
      its two Cache-Control lines count as one rule each, not three.
      If the file is absent the check is skipped.
  12. No shipped file exceeds Cloudflare Pages' 25 MB per-file
      limit. Recursively walks the repo, excluding `.git/`,
      `node_modules/`, `.claude/` (graphify skill + agent settings +
      git worktrees, all never uploaded), and `graphify-out*` (build
      artifacts). Warns at 20 MB (still legal but worth a nudge) and
      fails at 25 MB (Cloudflare will reject the deploy).
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
var warnings = [];
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

/* --- 1. node --check on the root app, assets/js/, config/, tools/study/, scripts/ --- */
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
if (fs.existsSync(path.join(ROOT, 'config'))) compareLocales(path.join(ROOT, 'config'), 'config/');
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
  { term: 'dificultades cognitivas', match: 'substring' },
  { term: 'cognitive difficult', match: 'substring' },
  { term: 'necesidades especiales', match: 'substring' },
  { term: 'special needs', match: 'substring' },
  { term: 'capacidades diferentes', match: 'substring' },
  { term: 'different abilities', match: 'substring' },
  { term: 'menor de edad', match: 'substring' },
  { term: 'menores de edad', match: 'substring' },
  { term: 'personas menores', match: 'substring' },
  { term: 'menor que', match: 'substring' },
  { term: 'menores que', match: 'substring' },
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
  .concat(listJs(path.join(ROOT, 'config')))
  .concat([path.join(ROOT, 'config', 'index.html')])
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
      failures.push(rel(file) + ': contains "' + term + '" — no page visible to the user may mention disability or clinical language (see doc/en/spec.md §2.4)');
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
    path.join(ROOT, 'config', 'index.html'),
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
  /* topicGroup -> "curso / asignatura" that owns it, so the same tema
     name reused under two subjects is caught (one topic belongs to one
     subject; the topic level filters on all three at once). */
  var topicOwners = {};
  entries.forEach(function (entry, i) {
    var label = 'decks/manifest.json[' + i + ']';
    ['id', 'tema', 'nivel', 'cantidad', 'file'].forEach(function (field) {
      if (entry[field] === undefined) failures.push(label + ': missing "' + field + '"');
    });
    /* `tema` and `cantidad` are what the home screen actually renders
       (app.js reads deck.tema / deck.cantidad). A present-but-empty value
       renders a blank <h3> and a bare "tarjetas" with no number, which is
       invisible to every other check — see the drift guard in §10. */
    if (entry.tema !== undefined && !String(entry.tema).trim()) {
      failures.push(label + ': "tema" is empty — the home screen would show a blank title');
    }
    if (entry.cantidad !== undefined && !Number.isFinite(Number(entry.cantidad))) {
      failures.push(label + ': "cantidad" is not a number — the home screen would show no card count');
    }
    /* `topicGroup` is optional (only subjects split into topics use it),
       but when present it has to be usable: a non-empty string owned by
       a single subject, and a `tema` that no longer repeats the "Tema N"
       prefix — that flattened title is exactly what the topic level
       (app.js renderSectionLevel) replaced, so leaving it in place means
       the same words are shown twice, on two levels. */
    if (entry.topicGroup !== undefined) {
      if (typeof entry.topicGroup !== 'string' || !entry.topicGroup.trim()) {
        failures.push(label + ': "topicGroup" must be a non-empty string when present');
      } else {
        var owner = (entry.curso || '') + ' / ' + (entry.asignatura || '');
        if (topicOwners[entry.topicGroup] === undefined) {
          topicOwners[entry.topicGroup] = owner;
        } else if (topicOwners[entry.topicGroup] !== owner) {
          failures.push(label + ': "topicGroup" "' + entry.topicGroup +
            '" is also used under "' + topicOwners[entry.topicGroup] +
            '" — a tema belongs to a single subject, and the topic level matches on all three');
        }
        if (/^\s*tema\s*\d+\s*[·•:–—-]/i.test(String(entry.tema))) {
          failures.push(label + ': "tema" still repeats the "Tema N" prefix while the deck declares ' +
            '"topicGroup" — keep only the section name in "tema"; the topic is its own level');
        }
      }
    }
    if (!entry.file) return;
    var deckPath = path.join(ROOT, 'decks', entry.file);
    if (!fs.existsSync(deckPath)) {
      failures.push(label + ': file "' + entry.file + '" does not exist in decks/');
      return;
    }
    try {
      var deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));
      /* Support both old (Spanish) and new (English) schema keys */
      var cards = deck.cards || deck.tarjetas;
      if (!Array.isArray(cards) || !cards.length) {
        failures.push('decks/' + entry.file + ': "cards" must be a non-empty array');
      } else {
        cards.forEach(function (card, ci) {
          /* question/pregunta → question */
          var pregunta = card.question || card.pregunta || '';
          var respuesta = card.answer || card.respuesta || '';
          if (typeof pregunta !== 'string' || !pregunta.trim()) {
            failures.push('decks/' + entry.file + ': cards[' + ci + '].question' +
              ' must be a non-empty string, got ' + (typeof pregunta));
          }
          if (typeof respuesta !== 'string' || !respuesta.trim()) {
            failures.push('decks/' + entry.file + ': cards[' + ci + '].answer' +
              ' must be a non-empty string, got ' + (typeof respuesta));
          }
          var img = card.image || card.imagen;
          if (img !== undefined) {
            var imgLabel = 'decks/' + entry.file + ': cards[' + ci + '].image';
            if (typeof img !== 'object' || img === null) {
              failures.push(imgLabel + ' must be an object');
            } else {
              ['file', 'alt', 'title', 'autor', 'source', 'licencia'].forEach(function (field) {
                var v = img[field];
                if (typeof v !== 'string' || !v.trim()) {
                  failures.push(imgLabel + '.' + field + ' must be a non-empty string, got ' + (typeof v));
                }
              });
              var imgSrc = img.file || img.archivo;
              if (typeof imgSrc === 'string' && imgSrc.trim()) {
                var imgPath = path.join(ROOT, imgSrc);
                if (!fs.existsSync(imgPath)) {
                  failures.push(imgLabel + '.file "' + imgSrc + '" does not exist on disk');
                } else {
                  var imgBytes = fs.statSync(imgPath).size;
                  // Hard 200 KB cap — every shipped image MUST be an actual
                  // thumbnail, not a full-res (or merely "under 500 KB")
                  // download (technical.md §3.1). This used to be a soft
                  // warning at 200 KB with a hard fail only at 500 KB, which
                  // let several non-thumbnail images (200-280 KB, some over
                  // 1024 px on the long edge) sit in the repo unnoticed since
                  // the warning never turned the build red. 200 KB is now
                  // the hard cap so that gap can't reopen silently.
                  if (imgBytes > 200 * 1024) {
                    failures.push(imgLabel + '.file "' + imgSrc + '" is ' +
                      Math.round(imgBytes / 1024) + ' KB — over the 200 KB hard cap (technical.md §3.1). ' +
                      'Re-encode it (e.g. `cjpeg -quality 75 -outfile foo.jpg foo.jpg` or ' +
                      'resize to ≤1024 px on the long edge) and re-save before committing.');
                  }
                }
              }
              if (typeof img.licencia === 'string' && /(^|[\s-])(NC|ND)([\s-]|$)/i.test(img.licencia)) {
                failures.push(imgLabel + '.licencia "' + img.licencia + '" is not safe to reuse — ' +
                  'NC (non-commercial) and ND (no derivatives) licenses are not allowed, see technical.md §3.1');
              }
            }
          }
        });
      }
    } catch (e) {
      failures.push('decks/' + entry.file + ': not valid JSON — ' + e.message);
    }
  });
})();

/* --- 9. doc/curriculum/ (recursive): valid config + non-empty índice --- */
(function checkContentIndices() {
  var dir = path.join(ROOT, 'doc', 'curriculum');
  if (!fs.existsSync(dir)) return;

  var configParser;
  try {
    configParser = require(path.join(ROOT, 'scripts', 'config-parser.js'));
  } catch (e) {
    failures.push('doc/curriculum/: could not load scripts/config-parser.js — ' + e.message);
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

/* --- 10. manifest <-> app.js key drift guard --- */
(function checkManifestUiKeyDrift() {
  /* The home screen is the only consumer of decks/manifest.json, and it reads
     the entries by field name (`deck.tema`, `deck.cantidad`, …). Nothing else
     ties those names to the data, so a refactor that renames one side — e.g.
     commit 2fb2cf1 switching app.js to `deck.topic`/`deck.amount` — leaves the
     manifest valid, passes every other check, and ships a home screen where
     all 339 decks render a blank title. This check parses the field reads out
     of app.js and asserts each one actually exists on the manifest entries. */
  checks += 1;
  var appPath = path.join(ROOT, 'app.js');
  if (!fs.existsSync(appPath)) return;

  var src;
  try {
    src = fs.readFileSync(appPath, 'utf8');
  } catch (e) {
    failures.push('app.js: could not be read — ' + e.message);
    return;
  }

  /* `deck.<field>` and `subjectDecks[0].<field>` — both are manifest entries. */
  var reads = new Set();
  var re = /\b(?:deck|subjectDecks\[0\])\.([A-Za-z_][A-Za-z0-9_]*)/g;
  var m;
  while ((m = re.exec(src)) !== null) reads.add(m[1]);

  /* Members reached through a deck-ish identifier that are NOT manifest
     fields. Keep this list explicit so adding one is a deliberate act. */
  var NOT_MANIFEST_FIELDS = new Set([
    'cards',            // the study screen's normalised deck, not a manifest entry
    'querySelector', 'style', 'classList', 'textContent', 'length',
  ]);

  var manifestPath = path.join(ROOT, 'decks', 'manifest.json');
  if (!fs.existsSync(manifestPath)) return;
  var entries;
  try {
    entries = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    return; // already reported by §8
  }
  if (!Array.isArray(entries) || !entries.length) return;

  /* Every key any entry declares, not just entries[0]: several fields are
     optional by design (curso/asignatura only on grouped decks, topicGroup
     only on the subjects split into topics), so a single sample entry is
     not representative — checking it would fail the moment a new
     optional field is introduced, and the fix would be to weaken the
     manifest instead. A renamed field still shows up here: no entry
     would carry the new name. */
  var declared = new Set();
  entries.forEach(function (entry) {
    Object.keys(entry || {}).forEach(function (key) { declared.add(key); });
  });

  /* Iterate the Set itself. Object.keys() on a Set returns [] (a Set keeps its
     values internally, not as own enumerable properties), which would make
     this whole guard a silent no-op that always passes. */
  reads.forEach(function (field) {
    if (NOT_MANIFEST_FIELDS.has(field)) return;
    if (!declared.has(field)) {
      failures.push('app.js reads `deck.' + field + '` but no decks/manifest.json entry declares such ' +
        'a key (entry keys: ' + Array.from(declared).join(', ') + '). The home screen would render blank — ' +
        'rename the read or migrate the manifest, but keep both in sync.');
    }
  });
})();

/* --- Result --- */
(function checkPublishedFileSizes() {
  /* Cloudflare's asset limit is per published file, not a total-site quota.
     Memofun already uses one JSON file per deck as its natural shard
     boundary. Keep the gate here so a future deck or image cannot silently
     grow past the host limit; split a deck into another manifest entry before
     that happens. */
  var WARN_BYTES = 20 * 1024 * 1024;
  var FAIL_BYTES = 25 * 1024 * 1024;
  var EXCLUDED_DIRS = new Set(['.git', '.claude', 'graphify-out', 'audit-out', 'node_modules']);

  function walk(dir) {
    var files = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
      if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) return;
      var full = path.join(dir, entry.name);
      if (entry.isDirectory()) files = files.concat(walk(full));
      else if (entry.isFile()) files.push(full);
    });
    return files;
  }

  walk(ROOT).forEach(function (file) {
    var bytes = fs.statSync(file).size;
    if (bytes > FAIL_BYTES) {
      failures.push(rel(file) + ': ' + (bytes / (1024 * 1024)).toFixed(2) +
        ' MiB — exceeds Cloudflare\'s 25 MiB per-file limit; split the data into additional manifest entries');
    } else if (bytes > WARN_BYTES) {
      warnings.push(rel(file) + ': ' + (bytes / (1024 * 1024)).toFixed(2) +
        ' MiB — approaching Cloudflare\'s 25 MiB per-file limit; split before the next growth batch');
    }
  });
})();

if (warnings.length) {
  console.log('WARNINGS (' + warnings.length + ') — non-blocking, see technical.md §3.1:');
  warnings.forEach(function (w) { console.log('  - ' + w); });
  console.log('');
}
if (failures.length) {
  console.log('FAILURES (' + failures.length + '):');
  failures.forEach(function (f) { console.log('  - ' + f); });
  process.exitCode = 1;
} else {
  console.log('OK (' + checks + ' checks)');
}
