# Memofun 🧠

> 🌐 **Other languages:** [Español](README.es.md)
>
> 🚀 **Try it live:** [memofun.apptonomia.uk](https://memofun.apptonomia.uk/)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-success.svg)](#-features)
[![Static site](https://img.shields.io/badge/build-none-informational.svg)](#-features)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-project-documentation-bilingual)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/ci.yml)

A flashcard study app built around **meaningful learning**: every card
explains a concept through an everyday analogy, a concrete example, or
"why it matters" — never a dictionary definition. Built so our typical
user profile can review a topic autonomously.

No build, no backend, no accounts, no dependencies, and **no AI API
integration anywhere in the code**: vanilla HTML, CSS and JavaScript.
Each deck's content is written directly by the AI coding agent
working on this project (see `CLAUDE.md`), not called live by the
app. Decks use our own JSON format, not Anki's `.apkg`.

- 🌐 **App**: [memofun.apptonomia.uk](https://memofun.apptonomia.uk/)
- 📦 **Repository**: [github.com/miralante/memofun](https://github.com/miralante/memofun)
- 💻 **Run locally**: open `index.html` directly in a browser, or serve
  the folder with any static server (`npx serve .` /
  `python -m http.server 8080`).

---

## 🚀 Try it live

Memofun is deployed at **[memofun.apptonomia.uk](https://memofun.apptonomia.uk/)**
— open it in a browser, install the PWA to the home screen for offline
use, and pick a deck to start. No accounts, no AI API calls at
runtime.

---

## ✨ Features

- **Deck grid** on the home screen — pick and review, nothing else.
- **Flashcard review**: tap to flip, navigate with arrows, listen to
  a card on demand (🔊), no timer and no right/wrong grading.
  Finishing a deck earns one ⭐, saved only on the user's device.
- **Accessibility**: large buttons, high contrast, Atkinson
  Hyperlegible typeface, keyboard navigation, `prefers-reduced-motion`.
- **Spanish and English** throughout the interface.
- **Works offline** once installed (PWA).
- **No generative AI in the product**: there's no integration with
  any AI API in the site's code. Content is written by the AI
  coding agent directly in the repository — see
  [`doc/en/SPEC.md`](doc/en/SPEC.md) §2.1.
- 🪶 **Zero runtime dependencies** — pure HTML/CSS/JS.
- 🔒 **Privacy by default** — no accounts, no cookies, no telemetry:
  progress is saved only in `localStorage` on the user's device.

---

## 👥 Roles in the project

| Role | Who they are | How they participate | Where they look first |
|---|---|---|---|
| 👤 **End user** (typical user profile) | Reviews decks that have already been prepared | Opens `index.html` and uses `tools/study/`; doesn't touch `settings/` or ask the agent for decks | The app (`index.html`) |
| ❤️ **Support** (family, teacher) | Asks the agent to write a deck, reviews it, publishes it | Opens an issue or asks the agent in-chat; reviews the output against the checklist before publishing | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| 💻 **Build** (developer) | Codes the app | Maintains the code, reviews PRs, deploys | [`technical.md`](doc/en/technical.md) |

See [`doc/en/roles.md`](doc/en/roles.md) for the full role description
and the trio-vs-pair-vs-sole patterns across the apps of the suite.

---

## 📚 Project documentation (bilingual)

All project documentation lives in the `doc/` folder:

| Language | Entry point |
|---|---|
| 🇬🇧 English (this file) | [`doc/en/index.md`](doc/en/index.md) |
| 🇪🇸 Español | [`doc/es/indice.md`](doc/es/indice.md) |

| Topic | Document |
|---|---|
| Product, audience, accessibility rules | [`doc/en/SPEC.md`](doc/en/SPEC.md) · [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Roles (trio / pair / sole across the suite) | [`doc/en/roles.md`](doc/en/roles.md) · [`doc/es/roles.md`](doc/es/roles.md) |
| How to create and publish a deck | [`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md) · [`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md) |
| Architecture and technical reference | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Internationalization (add a language) | [`doc/en/I18N.md`](doc/en/I18N.md) · [`doc/es/I18N.md`](doc/es/I18N.md) |
| AI agent operational workflow | `CLAUDE.md` |

### 📄 Other repo documents

| Document | Audience |
|---|---|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Anyone who wants to contribute (family, therapists, devs) |
| `CLAUDE.md` | AI agents: operational workflow, coordination and approvals |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Canonical Cloudflare Workers deploy guide for the suite (Memofun + Apptonomia + Calculia, Okeymoney, Sinonimia, Teclatlon) |
| Project history | Lives in `git log`; no external roadmap is maintained |
| `config.md` | Maintainer entry point for deck authoring (per the agent contract) |

---

## 🛠️ Preparing / Expanding content

To add a new deck (support role), nothing to install, no API key of
any kind. Just ask the AI coding agent (Claude Code or similar)
working on this project:

> "Generate a Memofun deck for 'Docker and Containers', intermediate
> level, 10 cards."

The agent writes the cards following the rules in "Generating deck
content" in `CLAUDE.md`, creates the `.json` in `decks/`, and adds
the entry to `decks/manifest.json`. **Review the content** before
considering it published (easy read, no clinical language, a fun
tone and a curious fact — see [`doc/en/SPEC.md`](doc/en/SPEC.md) §2.5).

`config.md` (at the repo root) and [`doc/curriculum/`](doc/curriculum/)
are the project's content ingestion point: a bare `topic` lets the
agent pick its own subtopics, or `topic` + a `# Index` section with
your own bullet list of subtopics if you already have a syllabus and
want the deck to follow it point by point — see the full guide at
[`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md).

---

## ✅ Validating changes

```bash
node scripts/check.js
```

No `npm install` needed — the script only uses Node's standard library.
It checks JS syntax, ES/EN parity, `sw.js` / `manifest.json` /
`decks/manifest.json` integrity, and enforces the zero-mentions rule
in the UI (see `CLAUDE.md`). It is the only "test" step and runs on
every push and PR via [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

If you touched any file cached by `sw.js`, also bump `VERSION` in
`sw.js` and run:

```bash
node scripts/check-version-bump.js
```

---

## ☁️ Deploying

Memofun is a fully static site (HTML/CSS/JS, no build step), so it
ships directly to **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
through its built-in GitHub integration. The HTTP security headers
live in [`_headers`](_headers), the offline fallback in
[`offline.html`](offline.html), and the project metadata in
[`wrangler.toml`](wrangler.toml). See [`CLOUDFLARE.md`](CLOUDFLARE.md)
for the full runbook (rebuild, rollback, custom domain, credential
rotation).

Pull requests automatically get a preview URL on
`*.<account-subdomain>.workers.dev` — no extra workflow is needed.

---

## 🛡️ Security

Memofun is a fully client-side static site: no backend, no database,
no telemetry, no AI API integration of any kind (deck content is
written at authoring time, not at runtime). The threat model is
essentially "what a hostile offline page could do to the same
origin", which the browser already sandboxes. See
[`SECURITY.md`](SECURITY.md) (or [`SECURITY.es.md`](SECURITY.es.md))
for how to report a suspected issue privately.

---

## 📄 License

Memofun ships **two** licences, one per asset kind:

- The **code** (HTML/CSS/JS) belongs to its contributors, under the
  **MIT** license (see [`LICENSE`](LICENSE)).
- **Deck content** (questions, answers) is licensed under **Creative
  Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)**, unless a
  specific deck states otherwise.

---

## 🧹 Housekeeping

There is no `node_modules` and no build artifacts in this repo. The
`decks/concepts/` directory holds a workshop log (one short file per
deck topic, e.g. `literatura.md`) that helps the AI agent avoid
duplicating concepts across deck extensions — see `CLAUDE.md`
§"Generating deck content" §7 for how it's used. It is never shipped
to the user-facing app and needs no `VERSION` bump when it changes.

To clear the local PWA cache during development, unregister the
service worker from DevTools (`Application → Service workers →
Unregister`) and clear site data.

---

## 🙏 Credits

Memofun's `no AI in the product` rule is inherited from Apptonomia's
`SPEC.md`. Deck content is written directly by the AI coding agent
working on this repository (Claude Code or similar) — see
`CLAUDE.md` §"Generating deck content" for the rules, and
[`doc/en/SPEC.md`](doc/en/SPEC.md) §2.5 for the tone and easy-read
requirements.

The `decks/curriculum/` library is built from the Spanish curricula
of the Comunidad de Madrid and the English National Curriculum (DfE)
and the vocational Entry Level / BTEC Level 2 routes.

---

## 🇬🇧 How to help — building the English version

The interface, the docs, and the rules are all bilingual (Spanish
default, English mirror). **Deck content and the curriculum library
behind it, however, are language-specific**: the `decks/` folder and
[`doc/curriculum/`](doc/curriculum/) are populated for Spanish
(Comunidad de Madrid) but the English curriculum is **partially built
and needs hands**. There are **no English deck JSON files yet** —
this section is the open invitation to write them. If you can help
with any of the below, an issue or a PR is very welcome — see
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the flow, and the
[English curriculum README](doc/curriculum/en/README.md) for the
exact gaps.

Concrete ways to help:

- **Pick an English curriculum and ask for its deck.** The simplest
  entry point: open any file under
  [`doc/curriculum/en/`](doc/curriculum/en/) (e.g.
  `key-stage-2/3/english-literature.md`) and ask the AI coding agent
  "generate the deck for this curriculum". The agent reads the file,
  writes `decks/<slug>.json`, and adds the entry to
  `decks/manifest.json`. You review it against the checklist in the
  [English internal guide](doc/en/internal-creating-decks-guide.md)
  §4 before publishing.
- **Author or review a curriculum index file** under
  [`doc/curriculum/en/`](doc/curriculum/en/) — Key Stage 1–4 (Years
  1–11) and the Entry Level / BTEC Level 2 vocational routes.
  Format and frontmatter are described in §2 of the same guide —
  same shape as the Spanish files in
  [`doc/curriculum/es/`](doc/curriculum/es/).
- **Note**: English decks in this folder are **English Literature
  only** — stories, poems, plays, authors, and movements. Phonics,
  spelling and grammar decks are intentionally out of scope here
  (the audience meets English as a second language, so literature
  travels better than orthography does). This matches the Spanish
  library's `literatura` strand.
- **Review an existing English curriculum file** against the current
  English National Curriculum (DfE) or your exam board's current
  GCSE specification (AQA, OCR, Edexcel) — even a small factual
  correction matters.
- **Translate UI strings** that drift between
  [`strings.en.js`](strings.en.js) and [`strings.es.js`](strings.es.js)
  — `node scripts/check.js` already enforces parity, but human
  phrasing often needs a second pass.
- **Open an issue** describing a gap (a missing Year, a missing
  GCSE subject, a missing vocational unit) — that helps someone else
  pick it up.

You don't need to know the whole project to help: every one of these
is a self-contained contribution with a clear shape and a clear
checklist. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the exact
PR flow and [`doc/en/SPEC.md`](doc/en/SPEC.md) for the non-negotiable
rules every contribution has to keep (no AI in the product, Easy
Read, no clinical language, etc.).

---

## 🌐 The Miralante suite — projects in the suite

Memofun is one of **six apps** in the **Miralante** suite, sharing
the same author, the same accessibility-first / no-backend philosophy
and the same deploy story. Apptonomia, on top of being an app itself,
also acts as the **landing portal** that introduces the whole suite.
None of the seven repos is the "main" one — they are peers; this is
just the original product this group grew out of.

| Project | What it is | Repository |
|---|---|---|
| **Apptonomia** *(portal — landing only, no app)* | Landing page that introduces the Miralante suite (not a runtime app) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Calculia](https://calculia.apptonomia.uk/) | Math and logical reasoning | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Memofun](https://memofun.apptonomia.uk/) | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Routime](https://routime.apptonomia.uk/) | Activities for routines and daily-life skills | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Easy-read dictionary | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Touch-typing with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

The canonical Cloudflare / deploy guide for the group lives in
[Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
This repo uses the **Workers + static assets** model — see
[`CLOUDFLARE.md`](CLOUDFLARE.md) for the local runbook.

## More about this project

- [About this project](https://memofun.apptonomia.uk/about/)
