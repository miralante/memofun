# Contributing to Memofun

> 🌐 **Other languages:** [Español](CONTRIBUTING.es.md)

Memofun has three roles (see [`doc/en/roles.md`](doc/en/roles.md)):
end user, support (family/teacher), and build (developer). This guide
is for the latter two — the end user doesn't need to read any of this,
just open the app.

## 👥 Ways to contribute

| I want to… | How |
|---|---|
| Add a new deck | Follow [`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md) (full step-by-step); summary: ask the AI agent to write the deck from a topic or a `config.md`, **review the content**, and add the entry to `decks/manifest.json` before opening a PR with the `.json` and the manifest. |
| Fix or improve an existing deck | Edit the `.json` directly (it's plain text), or ask the agent to regenerate it and replace the file in `decks/`. |
| Touch code (HTML/CSS/JS) | Follow the GitHub flow below. Read [`doc/en/technical.md`](doc/en/technical.md) first. The whole project is vanilla: no frameworks, no new dependencies. |
| Translate the UI into a new language | Follow the [`doc/en/I18N.md`](doc/en/I18N.md) guide. |

## ⚠️ Before touching content generation

Deck content is written directly by the AI agent in the repository
(see "Generating deck content" in `CLAUDE.md`) — there is no script
that calls an AI API, and there shouldn't be one. It is never wired
into the public site, under any circumstance — see `doc/en/SPEC.md`
§2.1. Any PR that adds a call to an AI service from `index.html`,
`app.js`, `tools/study/`, `settings/`, or any script under `scripts/`,
will be rejected.

## 🔀 GitHub workflow

```
1. 🔍 Find or open an issue (in Spanish or English)
2. 💬 Comment and agree on scope
3. 🌿 Create a branch (fork if you don't have push access)
4. ✏️  Make the changes following doc/en/technical.md
5. ✅ Run the validating scripts (see below)
6. 📤 Open a Pull Request referencing the issue
7. 👀 Wait for review (at least 1 maintainer)
8. ✅ Merge once approved
```

## ✅ Validating changes

Three scripts run automatically in CI on every push and PR (see
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) +
[`.github/workflows/smoke-prod.yml`](.github/workflows/smoke-prod.yml)),
but run them locally first to catch issues faster:

```
node scripts/check.js                  # 92 checks: structural, i18n parity, no-clinical-language, CSP quoting, deck manifest, sw.js ↔ disk
node scripts/check-version-bump.js     # fails if you changed a sw.js FILES entry without bumping VERSION
node scripts/i18n-keys-smoke.js        # informational: lists any data-i18n* / App.i18n.t() keys used but not registered in any locale
node scripts/i18n-keys-smoke.js --strict   # same, but exits 1 on missing keys (use this in CI or when adding a new locale)
node scripts/scan-secrets.js           # best-effort grep for accidentally committed API keys, tokens, private keys (same script as the CI secrets-scan job)
node scripts/smoke-prod.js             # post-deploy: hits the live URL and checks headers + i18n parity + decks/manifest.json (needs PROD_URL)
node scripts/limpiar-graphify-cache.js # dry-run: shows what would be removed from graphify-out/ (a regenerable agent artefact)
```

## ✅ Checklist before opening a PR

- [ ] `node scripts/check.js` passes with no errors.
- [ ] If you touched a file cached by `sw.js`, you bumped `VERSION`
      (`node scripts/check-version-bump.js` catches this automatically).
- [ ] `node scripts/i18n-keys-smoke.js --strict` reports no missing
      keys for the locales you touched.
- [ ] `node scripts/scan-secrets.js` reports "no secrets found" (run
      this locally before pushing if your change touched anything that
      might look like a token).
- [ ] If you added UI text, it's in `strings.es.js` **and**
      `strings.en.js`.
- [ ] If you added or changed a deck, you reviewed the content and
      updated `decks/manifest.json`.
- [ ] No user-facing text mentions "disability" or clinical jargon.
- [ ] New content has a warm, fun tone (never sarcasm or double
      meanings) and a curious fact where it fits — see
      `doc/en/SPEC.md` §2.5.
- [ ] Buttons ≥ 64×64 px, high contrast, no new timers.
