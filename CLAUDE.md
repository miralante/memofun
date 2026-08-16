# CLAUDE.md — AI agent workflow

## Service worker cache (read this before touching any cached file)

`sw.js` is cache-first for the app shell — every file listed in `FILES`
is served from the cache. **Any change to a cached file without
bumping `VERSION` is invisible to users with the PWA installed.** The
bug is silent: the developer sees the change on a hard refresh, but the
user sees the old version until the SW updates.

**Rule**: when you edit any file listed in `FILES` in `sw.js` (or add a
new file that should be cached), bump `VERSION` (e.g. `memofun-v1` →
`memofun-v2`). Bump liberally rather than conservatively.

## No generative AI in the shipped product — read before touching this rule

Memofun's public site makes **zero** calls to any AI service, and the
codebase contains **zero API integrations of any kind** — no API key,
no `fetch` to an external AI endpoint, anywhere in this repo. This is
not an oversight — it is a direct requirement inherited from
Apptonomia's `SPEC.md` (determinism, accessibility, predictability for
the end user; also "sin coste, sin cuenta"). Deck content is written
directly by the AI coding agent working in this repository — see
"Generating deck content" below — never fetched at runtime by
`index.html`/`app.js`/`tools/study/`/`settings/`, and never via a
script that calls an external AI API with a key. Do not add a
client-side (or build-time) call to Gemini or any other AI API to the
site, even behind a flag or a "for teachers" label — see
`doc/en/SPEC.md` §2.1 for the full reasoning and what was explicitly
rejected (an earlier version *did* call the Gemini REST API from a
script; it was removed on purpose). If a task seems to require
re-adding an API call, stop and raise it with the user rather than
implementing it.

## Generating deck content — this is now your job, not a script's

There is no `scripts/generate.js` anymore. When asked to create or
extend a deck, **you** (the AI coding agent) write the `{pregunta,
respuesta}` pairs directly, following the exact rules below — this
replaces what used to be a system prompt sent to an external API, and
that's the only thing that changed: the rules themselves are unchanged
and still binding.

1. Read the content config: either a `doc/curriculum/**/*.md` file or
   a one-off `config.md`-shaped file (frontmatter: `tema`, `nivel`,
   `cantidad`, `salida`, optional `idioma`; body: optional `# Índice`
   bullet list — see `doc/es/tecnico.md` §3 and §8 for the exact shape,
   `scripts/config-parser.js` for the parsing rules if you need them
   read programmatically).
2. If the topic has an underlying mechanic or rule the learner needs
   before they can answer anything about it (a procedure, a notation,
   a formula — e.g. how Roman numerals combine to form a value before
   drilling calculations with them), open the deck with a small run of
   **lesson cards** that teach that mechanic directly and build on each
   other, before moving into the regular quiz-style cards from step 3.
   Same `{pregunta, respuesta}` shape, no schema change — just placed
   first and more directly didactic (state the rule, then show it
   working) rather than quiz-style. Skip this step for topics that are
   just a set of facts with no mechanic to front-load.
3. Write `cantidad` cards in Spanish (or `idioma` if set), each
   `{"pregunta": "...", "respuesta": "..."}`:
   - Questions: clear, concrete, evaluable (no yes/no), warm and
     curious in tone — never exam-like.
   - Answers: never a dictionary definition. Built around ONE of: an
     everyday ANALOGY, a concrete PRACTICAL EXAMPLE, or the real
     PROBLEM the concept solves ("why it matters") — wrap that key
     phrase in `<mark></mark>`.
   - Control conceptual density, not just sentence length — Easy Read
     for this audience (`doc/en/SPEC.md` §1.2: always someone with an
     intellectual disability) means short sentences AND few new ideas
     at once. At most one new named/abstract concept per card (a
     movement, an author, a technical term). Anchor every abstract idea
     in a concrete everyday image before naming it (e.g. explain
     *desengaño* as "a soap bubble: it shines, then it's gone," not as
     a bare label). A "how do X and Y differ" card is only allowed
     after X and Y have each already had their own concrete card — and
     even then, ground the comparison in the same concrete images
     already used, not in new abstraction. Topics with many names in a
     row (literary movements, historical periods) need *more*, smaller
     cards and deliberate repetition, not compression.
   - Tone: fun and warm, like explaining something interesting to a
     friend — never sarcasm, irony, wordplay, or double meanings (they
     break literal comprehension and Easy Read).
   - When it fits naturally, add ONE surprising/curious fact (a
     "¿Sabías que...?") — never forced, never at the cost of clarity.
   - 2-5 sentences per answer, ≤12 words each, one idea per sentence,
     everyday vocabulary, active voice. Simple HTML only (`<b>`, `<i>`,
     `<br>`) — never markdown.
   - Adapt depth to `nivel` (principiante/intermedio/avanzado). Don't
     number cards or repeat the topic name verbatim in every question.
     Repeating a concept on purpose (see step 7 below) is fine; padding
     with a card that adds zero new nuance, example, or angle is not.
   - Never use "discapacidad", "paciente", or clinical language — the
     content is about the topic, not about who's studying it.
   - If there's a `# Índice`: spread the cards across **every** point
     — none skipped, none invented that aren't in the list. Without
     one, pick the subtopics yourself.
   - Full reasoning: `doc/en/SPEC.md` §2.5.
4. Write the deck directly: `decks/<salida>` (or `decks/<slug>.json`
   derived from `tema` if `salida` wasn't given — see
   `scripts/config-parser.js`'s `slugify()`), matching the schema in
   `doc/en/technical.md` §3: `{tema, nivel, idioma, tarjetas}`.
5. Add the entry to `decks/manifest.json` yourself: `{id, tema, nivel,
   cantidad, file, icono}` — `id` can just be the slug (readable,
   deterministic, no hashing needed). If the source was a
   `doc/curriculum/<idioma>/<etapa>/<curso>/<asignatura>.md` file, also
   set `curso` and `asignatura` (derived from the path, e.g.
   `primaria/3/lengua-castellana.md` → `curso: "3º de Primaria"`,
   `asignatura: "Lengua Castellana"` — `doc/en/technical.md` §4) so the home
   screen groups it under that course instead of listing it as a
   one-off topic. Leave both unset for ad-hoc "modo simple" decks.
6. Tell the user what you generated and where, and that you've applied
   the review checklist yourself (`doc/es/guia-interna-crear-barajas.md` §4) —
   but if the topic is unfamiliar, technical, or high-stakes, say so
   and suggest a human double-check before the deck ships.
7. **Repetition reinforces, it isn't redundancy.** When a deck extends
   an existing topic/course (e.g. adding `literatura_3` next to an
   existing `literatura`/`literatura_2` for the same course), reuse
   that course's key concepts on purpose instead of hunting for
   never-touched trivia. Some cards can repeat an earlier question
   near-verbatim (pure repetition, for consolidation); others should
   restate the same idea through a new example, angle, or context
   (varied repetition, for multiple encoding). Don't chase novelty at
   the cost of dropping a concept the syllabus expects the learner to
   meet more than once. Full reasoning: `doc/en/SPEC.md` §1.3.

   To know what's already been covered without re-reading every
   sibling deck's full JSON (this gets expensive as a series grows —
   `literatura` → `_2` → `_3` → `_4`…), keep a short log at
   `decks/concepts/<base-slug>.md`, where `base-slug` is the topic
   without its trailing `_2`/`_3`/… suffix (e.g. `eso_1_literatura`
   covers `literatura.json` through `literatura_4.json`). One line per
   concept: which deck(s) in the series already used it, and — for
   varied repeats — the angle/analogy/example already spent, so the
   next repeat is genuinely a new one, not another soap-bubble. Read
   that log first; only open a sibling deck's full JSON if the log
   doesn't say enough for a specific card. If the series has no log
   yet, build one now from the existing sibling decks (a one-time
   cost) before writing the new deck, so the *next* extension doesn't
   pay it again. After writing the new deck, update the log with what
   it added. This file is a workshop tool for you, not shipped
   content — it's never read by `index.html`/`app.js`/`sw.js` and
   needs no `VERSION` bump when it changes.
8. **Stick to the temario.** When a `doc/curriculum/**/*.md` file or
   the subject/course's real official curriculum exists, that is both
   the floor and the ceiling for what a deck (or a deck extending it)
   covers — don't drift into adjacent-but-unlisted topics just because
   they "read well." Full reasoning: `doc/en/SPEC.md` §1.3.

## Vanilla only — no dependencies, no Anki format

The whole project is plain HTML/CSS/JS (and plain Node.js for the
`scripts/` tooling — parsing and structural checks only, no AI calls).
No frameworks, no bundler, no npm/pip packages of any kind. Decks are
Memofun's own JSON format (`doc/en/technical.md` §3), not Anki's
`.apkg` — that was a deliberate simplification (see `doc/en/SPEC.md`
§2.9) to drop Python and any ZIP/SQLite-reading library from the
stack. Do not reintroduce a build step, a package manager, or the Anki
format without raising it with the user first.

## Language policy

- **UI**: multilingual. Default locales: **Spanish (`es`)** and
  **English (`en`)**; `es` is the default and fallback. Every UI string
  (buttons, navigation, feedback messages) must exist in both — see
  `doc/en/I18N.md` / `doc/es/I18N.md`.
- **Deck content is not part of this parity rule**: a deck ships in
  whichever language it was generated in and is labelled with that
  language in `decks/manifest.json`. Translating deck content is out
  of scope for the i18n system.
- **Technical code**: always English — identifiers, comments, commit
  messages. UI text lives in `strings.<locale>.js` files; dictionary
  keys are code and must be English.

## 1. Canonical sources

| Topic | Canonical source |
|---|---|
| Product, audience, non-negotiable principles | [`doc/en/SPEC.md`](doc/en/SPEC.md) · [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Roles (persona usuaria / apoyo / construcción) | [`doc/en/roles.md`](doc/en/roles.md) · [`doc/es/roles.md`](doc/es/roles.md) |
| Architecture, file-by-file, accessibility rules | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| External-AI entry point (which guide to use depending on whether the tool — Cowork, Cursor, ChatGPT… — has repo access or not) | [`doc/en/ai-creating-decks-guide.md`](doc/en/ai-creating-decks-guide.md) · [`doc/es/guia-ia-crear-barajas.md`](doc/es/guia-ia-crear-barajas.md) |
| Content ingestion (`config.md` → deck, written by the AI agent), step by step | [`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md) · [`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md) |
| Same, but via a generic AI chat with no repo access (support role copies a prompt, pastes the JSON back) | [`doc/en/chat-ai-creating-decks-guide.md`](doc/en/chat-ai-creating-decks-guide.md) · [`doc/es/guia-chat-ia-crear-barajas.md`](doc/es/guia-chat-ia-crear-barajas.md) |
| Internationalization | [`doc/en/I18N.md`](doc/en/I18N.md) · [`doc/es/I18N.md`](doc/es/I18N.md) |
| Cloudflare deploy | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| Roadmap and closed decisions | Git only: `git log` |

## 2. Mandatory workflow

Read the affected source files before editing. Keep i18n parity per
the I18N docs. Keep changes minimal and on-target; do not bundle
unrelated refactors.

### 2.1 Session start

Run before any modification:

```bash
git status --short
node scripts/check.js
```

### 2.2 Before finishing

1. Run `node scripts/check.js` — it enforces i18n parity, the
   no-clinical-language rule, `sw.js`/`manifest.json`/`decks/`
   integrity, and CSP quoting in one pass (92 checks).
2. Run `node scripts/check-version-bump.js` if you touched any file
   listed in `sw.js`'s `FILES`. This is the same check that runs as
   the `cache-bump` job in `.github/workflows/ci.yml` — run it locally
   before pushing so the CI gate doesn't fail later.
3. Run `node scripts/i18n-keys-smoke.js` if you touched any UI text
   or any page that uses `data-i18n*` / `App.i18n.t()`. Same check
   that runs as the `i18n-smoke` job in `.github/workflows/ci.yml`
   (which uses `continue-on-error: true`; pass `--strict` if you want
   it to gate the build).
4. Run `node scripts/scan-secrets.js` if your change touched anything
   that might look like an API key, a token, or a private key — same
   check as the `secrets-scan` job in CI, runnable locally before
   pushing to catch the issue without burning a CI run.
5. Report only verifications you actually ran.

## 5. Housekeeping scripts

These are not gates; they are quality-of-life helpers modelled on
sinonimia's `scripts/limpiar-cache.js`. Run them occasionally, not as
part of every change:

- `node scripts/smoke-prod.js` — hits the live `*.workers.dev` URL
  and asserts the i18n / header / `decks/manifest.json` contract
  holds. Same script the `.github/workflows/smoke-prod.yml` scheduled
  job runs every 6h. Needs `PROD_URL` (defaults to
  `https://memofun.miralante.workers.dev`).
- `node scripts/limpiar-graphify-cache.js` — dry-run; shows what
  would be removed from `graphify-out/`. Pass `--apply` to actually
  delete it (safe: the next graphify run rebuilds it from scratch).
- `node scripts/scan-secrets.js` — pattern-based grep that the CI
  `secrets-scan` job runs in push; useful to run locally before
  pushing if your diff added anything that looks like a token.

## 3. External and destructive operations

- A deploy is a network operation: request explicit approval first.
- Never publish, push, or open/close external resources without an
  explicit request.
- Editing a sibling repo (Apptonomia, Calculia, Okeymoney, Sinonimia,
  Teclatlon) — even a one-line README table entry — touches a project
  outside this one; confirm scope with the user before doing it again
  beyond what was already agreed.

## 4. Out of scope for this file

Product principles, accessibility rules, architecture, roadmaps, and
bug chronicles belong in the §1 sources, not here. Detailed change
history lives in Git.
