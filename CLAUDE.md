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

This rule is about **AI** services specifically. `scripts/buscar-imagen.js`
(see "Optional per-card image" below) calls the Openverse *image-bank*
API, but only at content-authoring time, from a Node script no
end-user ever runs — same category as `App.decks` never touching a
non-AI network resource at runtime either. The image it finds gets
downloaded once and shipped as a plain static file; nothing in
`index.html`/`app.js`/`tools/study/`/`settings/` ever fetches it (or
anything else) from an external host.

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
   Same `{pregunta, respuesta}` shape and same clue-first direction as
   step 3 below, no schema change — just placed first and more directly
   didactic (state the rule, then show it working) rather than
   quiz-style. Skip this step for topics that are just a set of facts
   with no mechanic to front-load.
3. Write `cantidad` cards in Spanish (or `idioma` if set), each
   `{"pregunta": "...", "respuesta": "..."}`. **Card design principle —
   read this before writing a single card**: the priority is never "explain
   a lot." It's getting the person to (a) understand one concrete idea,
   (b) recognize it in another context, (c) recall it with little help.
   Every rule below serves that goal — when a card is explaining too
   much, cut it, don't compress it into denser prose.
   - **Format: clue first, concept as the answer.** `pregunta` carries
     the explanation — an everyday ANALOGY, a concrete PRACTICAL
     EXAMPLE, or the real PROBLEM the concept solves ("why it
     matters") — described without naming the concept itself, closed
     by one short, direct question that asks the learner to name or
     identify it ("¿Cómo se llama...?", "¿Quién...?", "¿Qué número
     es?"). `respuesta` is ONLY the concept/term/name/value being asked
     for — short (1-6 words), wrapped in `<mark></mark>`, never a full
     sentence, never a restatement of the clue, never a dictionary
     definition. This applies to every card, with no exceptions,
     including the lesson cards from step 2: state the rule or fact as
     the clue, let the specific term/value/result be the short recalled
     answer.
   - Control conceptual density, not just sentence length — Easy Read
     for this audience (`doc/en/SPEC.md` §1.2: always someone with an
     intellectual disability) means short sentences AND few new ideas
     at once. At most one new named/abstract concept per card (a
     movement, an author, a technical term) — that concept is exactly
     what `respuesta` names; the clue in `pregunta` must not smuggle in
     a second, unnamed concept. Anchor every abstract idea in a
     concrete everyday image before naming it (e.g. describe
     *desengaño* as "a soap bubble: it shines, then it's gone," and let
     the answer be the word itself). A "how do X and Y differ" card is
     only allowed after X and Y have each already had their own
     concrete card — and even then, ground the comparison in the same
     concrete images already used, not in new abstraction. Topics with
     many names in a row (literary movements, historical periods) need
     *more*, smaller cards and deliberate repetition, not compression.
   - Tone: fun and warm, like explaining something interesting to a
     friend — never sarcasm, irony, wordplay, or double meanings (they
     break literal comprehension and Easy Read).
   - When it fits naturally, weave ONE surprising/curious fact (a
     "¿Sabías que...?") into the clue in `pregunta` — never forced,
     never at the cost of clarity, and never in `respuesta`.
   - `pregunta`: 2-4 clue sentences ≤12 words each, one idea per
     sentence, everyday vocabulary, active voice, ending in a short
     closing question. `respuesta`: 1-6 words, no sentence structure
     needed. Simple HTML only (`<mark>`, `<b>`, `<i>`, `<br>`) — never
     markdown.
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
9. **Optional per-card image — always a thumbnail.** Only when asked —
   don't add images on your own initiative for every new deck. A card
   can carry one `imagen` field with a photo/illustration as visual
   support (schema: `doc/en/technical.md` §3.1). The shipped image is
   **always a thumbnail of the source**, not the full-resolution
   original — the card renders it at maybe 300-400 px wide on a phone
   so anything above that is bytes spent for no visible quality, and
   the repo ships as Cloudflare Workers static assets with a ~25 MB
   total budget that a single full-res image (1-10 MB) breaks on its
   own. To source one: `node scripts/buscar-imagen.js "<term>"`
   searches Openverse (free image bank, no signup) restricted to
   CC0/Public Domain/CC BY/CC BY-SA — never `-NC`/`-ND` — lists
   candidates with title/source/dimensions, and you pick the one that
   actually fits **from that text** (search is tag-based, not
   semantic, so retry with a more concrete or common term when results
   are empty or off-topic). **Never open the candidate image files to
   view them, not even the final pick** — the search result's
   title/source is the curated signal for fit; treating it as
   sufficient is the point, not a shortcut, since opening any image
   burns ~1000+ vision tokens for a check the title text already
   gives. If a shipped card ever turns out to have a mismatched
   image, that's caught by a human reader after the fact and reported
   per `CONTRIBUTING.md`, not by the agent re-verifying every image
   at authoring time. **Download the `thumb` URL the script prints,
   not the full-res `image` one** — same picture, a fraction of the
   size, plenty for a card, and cheaper to inspect if you ever do
   need to. If the Openverse thumbnail proxy 400s on that specific
   source host, **generate the thumbnail yourself instead of falling
   back to the full-res `image` URL** — the candidate's `fuente` field
   almost always points to Wikimedia Commons, and Wikimedia serves an
   official thumbnail of any file via
   `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<name>&width=800`
   (or the API equivalent `?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800`
   on the `curid` page), which is the right tool for this exact case
   — same author, same license, just smaller. Only if neither
   Openverse's thumb nor the Wikimedia thumbnail works, abort and
   report the missing image — never use the full-res `image` URL as
   a default. **Size budget: the saved file in
   `assets/img/decks/<deck-slug>/<file>.<ext>` must end up under 200 KB
   on disk** (≤1024 px on the long edge) — `scripts/check.js` **fails
   the build over 200 KB**, a hard gate, not a soft aesthetic
   preference. Save it under `assets/img/decks/<deck-slug>/<file>.<ext>`
   and fill in all of `imagen`'s subfields, including the TASL
   attribution (`titulo`/`autor`/`fuente`/`licencia`). When a request
   covers a whole deck, batch the JSON edits into as few read/write
   passes over the file as practical rather than one full round trip
   per card. Bump `sw.js` `VERSION` if you touched `tools/study/app.js` or
   `componentes.css` to add the rendering — the images themselves
   don't need a `FILES` entry (see the service-worker rule above;
   they're cached on first view like any deck JSON).

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

## UNE 153101 reference (suite-wide)

All seven sibling projects follow **UNE 153101:2018 EX** (Spanish
easy-read standard) and Inclusion Europe's European easy-read
guidelines as the normative basis for the cognitive accessibility
principles that guide content and UI: short sentences, one idea per
sentence, everyday vocabulary, no clinical or technical jargon in
what the end user reads. This is the standard each `SPEC.md` cites
when it states the "easy read always" rule (see `doc/en/SPEC.md` §3.3
or its mirror in `doc/es/SPEC.md` §3.3). Adding a new language or a
new piece of UI copy means following UNE 153101 — not paraphrasing
it.

## WCAG AAA baseline (suite-wide)

This project conforms to WCAG 2.1 at **AA minimum** and adopts the
**AAA criteria that apply to the suite's audience** whenever feasible.
Full conformance at AAA is not feasible for a whole web application
(the W3C itself states AAA is meant for specific contexts); the rule
below lists the AAA criteria that ARE applicable and that this project
honours.

Adopted AAA criteria:

- **1.4.6 Contrast (Enhanced)** — text contrast ≥ 7:1 (large text
  ≥ 4.5:1). WCAG AA (4.5:1) is the legal floor; AAA is the design
  target. Verified pairs in Okeymoney (`#F2F4F8` on `#161A21` = 14.6:1,
  `#B7BDC9` on `#161A21` = 8.4:1) already meet AAA; this project aims
  at the same ratio when its token palette is next touched.
- **3.1.5 Reading Level** — content for the general public does not
  require advanced reading ability. Already complied with through
  UNE 153101 (see the section above) and Inclusion Europe's easy-read
  guidelines.
- **1.4.1 Use of Color** — color is never the only means of conveying
  information. Every feedback state (success / hint / error / lock)
  also uses shape, icon, text or sound, so users with color-vision
  deficiencies are not excluded. (`App.feedback.success()` /
  `App.feedback.encourage()` / `App.feedback.lockUntilAck()` already
  encode this.)

The product-facing wording in `doc/en/SPEC.md` §3.5 / §5 / §6 (and the
Spanish mirror in `doc/es/SPEC.md`) references this baseline using the
literal phrase **"WCAG AA minimum, AAA whenever possible"**, mirroring
the suite-wide rule in the metaproject's `apptonomia/CLAUDE.md`.

## Public-facing wording: "usuario/a tipo" euphemism

This directive applies across the entire Miralante suite (Apptonomia,
Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon, Routime) and the
metaproject landing at `apptonomia.uk`. The suite's real objective is
occupational-therapy support for people with intellectual disability, but
**that framing is not used in public surfaces** — only in internal
documentation.

### Where each term is allowed

- **"Discapacidad intelectual" / "intellectual disability"** is the
  canonical term and **may only appear in internal documentation**
  (`CLAUDE.md`, `doc/<lang>/SPEC.md`, `technical.md` / `tecnico.md`,
  `roles.md`, `CONTRIBUTING.md`, `CONTRIBUTING.es.md`, tooling files
  in `scripts/`). It is explicitly **forbidden** in public-facing
  surfaces, READMEs that anyone can read without authentication, public
  talks, social media copy, press notes, and marketing material.
- **"Usuario/a tipo"** (plural "usuarios/as tipo") is the accepted
  euphemism for the audience in public-facing surfaces. It is used as
  a generic profile marker, not as a label for any real person.
  - It applies to `README.md` / `README.es.md`, public talks, social
    media copy, press notes, marketing material, and any
    contributor-facing document that also doubles as a public
    description of the project (e.g. `CONTRIBUTING.md`).
  - It does **not** apply to the UI of the app itself: the project's
    "Mandatory rule: zero mentions in the user-facing product" (see
    `doc/en/SPEC.md` §"Zero mentions in the user-facing product" /
    `doc/es/SPEC.md` §"Cero menciones en el producto visible") continues
    to forbid **any** mention, including "usuario/a tipo", in
    `index.html`, `app.js`, `tools/study/`, `settings/`, `strings.<locale>.js`
    and any other user-facing surface. The euphemism is for the outside
    world, not for what the visitor reads on the site.
  - It does **not** apply to project content that names a clinical
    concept by its real-world name (e.g. a card that explains a
    bureaucratic procedure related to disability): that is content,
    not labelling of an audience.

### Rationale

Presenting the project's real objective in maintainer docs is useful
and necessary for whoever maintains and contributes to the suite.
Presenting it in marketing or landing surfaces is neither necessary nor
respectful of the audience — "usuario/a tipo" lets public material
describe what the app is for (who the typical profile is) without
publicly naming a clinical group. This rule is mirrored in the
metaproject's `apptonomia/CLAUDE.md` and in every sibling's own
`CLAUDE.md` and `SPEC.md` so it survives a single project's docs going
out of sync.

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when `query`/`path`/`explain` do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
