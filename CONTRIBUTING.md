# Contributing to Memofun

> 🌐 **Other languages:** [Español](CONTRIBUTING.es.md)
>
> **Part of the [Miralante](https://apptonomia.uk) suite** —
> Memofun is one of seven sibling projects (Apptonomia, Calculia,
> Memofun, Okeymoney, Routime, Sinonimia, Teclatlon) that share the
> same workflow, the same accessibility rules and the same code of
> conduct. This repo ships **Memofun** itself.

Thanks for your interest in contributing. This guide covers the GitHub
workflow we follow across the suite, the project roles, and the small
set of recipes that keep every sibling consistent.

---

## 🔀 GitHub workflow

```text
1. 🔍 Search or create an issue (in Spanish or English)
2. 💬 Comment and agree on scope
3. 🌿 Create a branch (fork if you don't have push access)
4. ✏️  Make changes following the recipes below
5. 📤 Open a Pull Request (PR) referencing the issue
6. 👀 Wait for review (at least 1 from a maintainer)
7. ✅ Merge when approved
```

**Issue labels** (used to classify incoming work):

| Label | Meaning |
|---|---|
| `UX` | Usability or experience improvement |
| `content` | Texts, translations, accessibility copy |
| `bug` | Reproducible error in behaviour |
| `tech` | Technical implementation, refactor |
| `docs` | Documentation changes |
| `good first issue` | Suitable for a first contribution |

### Branch conventions

- `feat/<slug>` — new features
- `fix/<slug>` — bug fixes
- `docs/<slug>` — documentation-only changes
- `content/<slug>` — content-only changes (decks, cards)
- `i18n/<code>` — translation to a language (e.g. `i18n/ca`, `i18n/gl`)

### Commits

- Message in **English** (repo convention), summary in imperative.
- One thing per commit — large commits can be asked to be split.
- If you close an issue, include `Closes #123` at the end.

---

## 👥 Project roles

| # | Role | Reads what first |
|---|---|---|
| 1 | 👤 **End user** | The app — never this file. |
| 2 | 🤝 **Support** (family / teacher) | `doc/en/roles.md`. |
| 3 | 💻 **Contributor** (content or code) | This file, plus `doc/en/SPEC.md`, `doc/en/technical.md`, and `CLAUDE.md`. |

> Technical decisions live with the contributor role, **not because the
> end user is ignored, but because that is each role's domain.**
> Product, content, language and UI design decisions **are tested and
> validated with end users whenever possible**, and their feedback is
> the primary source for improvement.

---

## 📝 What you can contribute

| I want to… | How |
|---|---|
| Add a new deck | Follow [`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md). |
| Fix or improve an existing deck | Edit the `.json` directly, or ask the agent to regenerate it. |
| Touch code (HTML/CSS/JS) | Follow the GitHub flow above. Read [`doc/en/technical.md`](doc/en/technical.md) first. |
| Translate the UI into a new language | Follow the [`doc/en/i18n.md`](doc/en/i18n.md) guide. |
| Report a card whose `imagen` doesn't match | Open an issue naming the deck, the card, and the problem. |

---

## 🌐 Recipes

### Copy fix

1. Edit the source-of-truth `strings.es.js` (`es` by default).
2. Mirror the change in every other locale file (`en` minimum).
3. Run `node scripts/check.js` to verify key parity.
4. Open a PR with a one-line description.

### New language

See `doc/en/i18n.md` for the full step-by-step. Adding a language
requires **no changes** to the bootstrap or app code.

### Accessibility fix

Read `doc/en/SPEC.md` §3 first — non-negotiable product constraints
live there (buttons ≥ 64×64 px, WCAG AA contrast with AAA as the
design target, easy-read copy, no-pressure feedback). Anything that
breaks them will be rejected.

### Adding or tightening a security header

Headers live in `_headers`. The CSP is intentionally tight
(`script-src 'self'`, no inline scripts; JSON-LD is data and does not
require `unsafe-inline`). Tightening is welcome; loosening almost
never is — open an issue first.

---

## ✅ Checklist before opening a PR

- [ ] `node scripts/check.js` passes locally.
- [ ] `node scripts/check-version-bump.js` passes if `sw.js` was
      touched, and `VERSION` was bumped for any cached file change.
- [ ] If you added UI strings, every supported locale is in sync.
- [ ] You tested in a real desktop browser (and on mobile if the app
      is a PWA).
- [ ] You did not add any new runtime dependency — vanilla HTML / CSS /
      JS only.
- [ ] You did not loosen the CSP in `_headers` without an issue.

---

## 🚫 What this repo does NOT accept

- **Loosening the CSP** (`script-src 'self'` stays strict).
- **New runtime dependencies** — vanilla HTML / CSS / JS only.
- **Analytics / telemetry / third-party calls of any kind.**
- **Personal data** of any kind.
- **Calls to an AI service from `index.html`, `app.js`,
  `tools/study/`, `settings/`, or any script under `scripts/`** —
  deck content is written directly by the agent in this repo, never
  fetched at runtime. See `doc/en/SPEC.md` §2.1.
- **A SPA, a router, or a build step.**

---

## 📞 Communication

- **Issues** → main channel for proposals, bugs, questions.
- **Pull Request reviews** → for review of specific changes.

---

## 📜 Code of conduct

This project follows [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
Participating means accepting it.

---

## 🙏 Thanks

Thanks for devoting time to a tool that helps people learn at their
own pace.
