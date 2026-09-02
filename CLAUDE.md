# CLAUDE.md — AI agent workflow

## About this project

Memofun is a **flashcard study app built around meaningful learning**: every card gives the learner a real-life clue (an everyday analogy, a concrete example, or "why it matters") and asks them to recall the concept itself — never a dictionary definition recited back as the answer. It is meant for autonomous review between sessions or classes, with decks prepared by a support person (family, teacher). It is one of the seven siblings of the Apptonomia suite.

## Other projects in the Apptonomia suite

This project is one of seven siblings. The rest of the suite:

- **Apptonomia** — the metaproject root and the public landing at https://apptonomia.uk/, linking out to each sibling app.
- **Calculia** — math and logical reasoning with short, visual activities.
- **Memofun** *(this project)* — study flashcards for autonomous review, one idea per card.
- **Okeymoney** — personal finance and everyday financial autonomy, with a personal-finance simulator.
- **Sinonimia** — easy-read dictionary of difficult words, with synonyms and ARASAAC pictograms.
- **Teclatlon** — touch typing on the physical computer keyboard, finger by finger.

This file provides guidance to Claude Code (claude.ai/code) when working
with code in this repository. It is intentionally short and stable;
anything that grows beyond a short rule belongs in the canonical sources
listed in §A.1.

The document is split in two blocks:

- **Block A — Workflow** (§A.1 … §A.4): rules that govern *how* an
  agent edits this repo (canonical sources, mandatory workflow,
  external/destructive operations, scope of the file).
- **Block B — Suite-wide policies** (§B.1 … §B.10): inherited rules
  from the Miralante metaproject that also apply here (service worker
  cache, language policy, UNE 153101 / WCAG, public-facing wording,
  graphify), plus Memofun-specific policies (no generative AI in the
  shipped product, deck-content authoring, vanilla-only tooling,
  housekeeping scripts).

If two sections disagree, the more specific one wins: per-project
rules in Block A override the suite-wide rules in Block B for the
project at hand, and a rule about a specific topic wins over a
general one on the same block.

---

## Block A — Workflow

### A.1 Canonical sources

The canonical source for each topic prevails on that topic. If two
documents conflict, do not turn `CLAUDE.md` into a copy of both:
cross-check the code and fix the outdated doc in its canonical
location.

| Topic | Canonical source |
|---|---|
| Product, audience, accessibility rules, non-negotiable principles | [`doc/en/SPEC.md`](doc/en/SPEC.md) ↔ [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Project roles (user, support, build) and who reads what first (Memofun: persona usuaria / apoyo / construcción) | [`doc/en/roles.md`](doc/en/roles.md) ↔ [`doc/es/roles.md`](doc/es/roles.md) |
| Architecture, structure, activity anatomy, APIs, contracts, tests, deploy (Memofun: file-by-file, accessibility rules) | [`doc/en/technical.md`](doc/en/technical.md) ↔ [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| External-AI entry point (which guide to use depending on whether the tool — Cowork, Cursor, ChatGPT… — has repo access or not) | [`doc/en/ai-creating-decks-guide.md`](doc/en/ai-creating-decks-guide.md) ↔ [`doc/es/guia-ia-crear-barajas.md`](doc/es/guia-ia-crear-barajas.md) |
| Content ingestion (`config.md` → deck, written by the AI agent), step by step | [`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md) ↔ [`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md) |
| Same, but via a generic AI chat with no repo access (support role copies a prompt, pastes the JSON back) | [`doc/en/chat-ai-creating-decks-guide.md`](doc/en/chat-ai-creating-decks-guide.md) ↔ [`doc/es/guia-chat-ia-crear-barajas.md`](doc/es/guia-chat-ia-crear-barajas.md) |
| Internationalization | [`doc/en/I18N.md`](doc/en/I18N.md) ↔ [`doc/es/I18N.md`](doc/es/I18N.md) |
| Cloudflare deploy | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) ↔ [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| Roadmap and closed decisions | Git only: `git log` |
| AI agent operational flow | `CLAUDE.md` (this file) |
| Activity catalog | [`doc/en/activities.md`](doc/en/activities.md) ↔ [`doc/es/actividades.md`](doc/es/actividades.md) |
| Activity creation guide | [`doc/en/creating-activities-guide.md`](doc/en/creating-activities-guide.md) ↔ [`doc/es/guia-crear-actividades.md`](doc/es/guia-crear-actividades.md) |
| Coverage and therapeutic guidance | [`doc/en/team.md`](doc/en/team.md) ↔ [`doc/es/equipo.md`](doc/es/equipo.md) |
| Contents / TOC | [`doc/en/CONTENTS.md`](doc/en/CONTENTS.md) ↔ [`doc/es/CONTENIDOS.md`](doc/es/CONTENIDOS.md) |
| Doc index | [`doc/en/index.md`](doc/en/index.md) ↔ [`doc/es/indice.md`](doc/es/indice.md) |
| Quick guide | [`doc/en/quick-guide.md`](doc/en/quick-guide.md) ↔ [`doc/es/guia-rapida.md`](doc/es/guia-rapida.md) |

### A.2 Mandatory workflow

This repo may receive changes from the user and from several parallel
sessions. Read the affected source files before editing; never
overwrite in-flight work — re-read the file and reconcile if it
changed since your last read. Update the canonical source for the
topic, not a copy in `CLAUDE.md`. Keep `i18n` parity per the I18N
docs. For activity changes, follow `technical.md` §9 **and read
[`creating-activities-guide.md`](doc/en/creating-activities-guide.md)
first** (didactic, gamification, persuasion and neuromarketing
techniques for our audience); if a guide rule conflicts with `technical.md`,
`technical.md` wins. Update the catalogs and guides it names. Keep
changes minimal and on-target; do not bundle unrelated refactors.

#### A.2.1 Session start

Run before any modification:

```bash
git status --short
git log --oneline -3
node scripts/check.js
```

Keep uncommitted changes that are not yours (A.3 covers destructive
ops). If `check.js` already fails, find out whether the failure
belongs to the in-flight work before adding new changes.

#### A.2.2 Before editing

1. Classify the task with the canonical-sources table in §A.1.
2. Read the relevant sections and the affected code files.
3. For UI, content, or activities, always check `SPEC.md` §3–§4 and
   `technical.md` §5.
4. Closed project plan lives in `git log`. The canonical doc to use
   depends on the topic, not on an external roadmap.

#### A.2.3 Before finishing

1. Always run `node scripts/check.js` — it enforces i18n parity, the
   no-clinical-language rule, `sw.js`/`manifest.json`/`decks/`
   integrity, and CSP quoting in one pass (92 checks).
2. If this project ships a service worker (see §B.1): bump `VERSION`
   in `sw.js` whenever a cached file changes, and add any new file to
   `FILES`. Run `node scripts/check-version-bump.js` to verify the
   bump is consistent (this is the same check that runs as the
   `cache-bump` job in `.github/workflows/ci.yml` — run it locally
   before pushing so the CI gate doesn't fail later).
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

### A.3 External and destructive operations

- A deploy (even to a temporary Cloudflare Pages preview) is a
  network operation: request explicit approval before running it.
  Commands are in `technical.md` §12.5.
- Never publish, push, or open/close external resources without an
  explicit request or authorization.
- Never delete or revert changes from the user or another session to
  simplify your task; integrate them or explain the conflict.

### A.4 Out of scope for this file

Product principles, accessibility rules, architecture, roadmaps, and
bug chronicles belong in the §A.1 sources, not here. Detailed change
history lives in Git; `CLAUDE.md` must stay brief, operational, and
stable.

---

## Block B — Suite-wide policies

### B.1 Service worker cache

This project ships a service worker. **Behavior**: `sw.js` is
**cache-first** — every file in `FILES` (per-tool `ARCHIVOS` in
Calculia) is served from the cache; the network is only consulted
when the request is not in the cache.

**The cache is silent and persistent**. The developer sees a
change on a hard refresh, but users with the PWA installed keep
seeing the old version until either the SW itself is refreshed or
the cache is purged. The only reliable way to refresh the
deployed app after a new deploy is to bump `VERSION` in `sw.js`,
because the SW's `install` handler compares its `VERSION` against
the active cache name and only re-fetches + activates when they
differ.

**Rule — bump `VERSION` on every commit that touches any cached
file** (i.e. anything in `FILES` / `ARCHIVOS`, or a new file that
should be cached):

- Edit `sw.js` and increment the `VERSION` literal (e.g.
  `memofun-vN` → `memofun-vN+1`).
- Add any new file to `FILES` / `ARCHIVOS` at the same time.
- Run `node scripts/check-version-bump.js` to verify the bump is
  consistent with the changes (this is the same check that runs
  as the `cache-bump` job in CI — run it locally before pushing
  so the CI gate doesn't fail later).

The cost of bumping is one integer; the cost of not bumping is
"the deployed app keeps serving the old version after a deploy".
Bump liberally rather than conservatively. Full contract:
[`CLOUDFLARE.md`](CLOUDFLARE.md) § "Cache contract". This rule is
also the source of §A.2.3 step 2.

### B.2 Language policy

- **UI**: multilingual. Default locales: **Spanish (`es`)** and
  **English (`en`)**; `es` is the default and fallback. Every UI
  string (buttons, navigation, feedback messages) must exist in
  both — see `doc/en/I18N.md` / `doc/es/I18N.md`.
- **Deck content is not part of this parity rule**: a deck ships in
  whichever language it was generated in and is labelled with that
  language in `decks/manifest.json`. Translating deck content is out
  of scope for the i18n system.
- **Technical code**: always English — identifiers, comments, commit
  messages. UI text lives in `strings.<locale>.js` files; dictionary
  keys are code and must be English.

### B.3 UNE 153101 reference

All seven sibling projects follow **UNE 153101:2018 EX** (Spanish
easy-read standard) and Inclusion Europe's European easy-read
guidelines as the normative basis for the cognitive accessibility
principles that guide content and UI: short sentences, one idea per
sentence, everyday vocabulary, no clinical or technical jargon in
what the end user reads. This is the standard each `SPEC.md` cites
when it states the "easy read always" rule (see `doc/en/SPEC.md`
§3.3 or its mirror in `doc/es/SPEC.md` §3.3). Adding a new language
or a new piece of UI copy means following UNE 153101 — not
paraphrasing it.

### B.4 WCAG AAA baseline

This project conforms to WCAG 2.1 at **AA minimum** and adopts the
**AAA criteria that apply to the suite's audience** whenever feasible.
Full conformance at AAA is not feasible for a whole web application
(the W3C itself states AAA is meant for specific contexts); the list
below enumerates the AAA criteria that ARE applicable and that this
project honours.

Adopted AAA criteria:

- **1.4.6 Contrast (Enhanced)** — text ≥ 7:1 (large text ≥ 4.5:1).
  WCAG AA is the floor; AAA is the design target. Okeymoney is the
  suite's verified reference for this criterion (`#F2F4F8` on
  `#161A21` = 14.6:1, `#B7BDC9` on `#161A21` = 8.4:1).
- **3.1.5 Reading Level** — already covered by UNE 153101 (§B.3).
- **1.4.1 Use of Color** — color is never the only channel.
  `App.feedback.success/encourage/lockUntilAck` already combine
  shape, icon, text and sound.

The literal phrase **"WCAG AA minimum, AAA whenever possible"** lives
in `doc/en/SPEC.md` §3.6 / §5 (mirror in `doc/es/SPEC.md`). This
section mirrors the metaproject's `apptonomia/CLAUDE.md`.

### B.5 Public-facing wording: "persona tipo" euphemism

Applies to the whole Miralante suite and the `apptonomia.uk`
landing. The suite's real objective lives in internal docs; public
surfaces use **"persona tipo"** instead.

#### B.5.1 Where each term is allowed

- **"Discapacidad intelectual"** / **"intellectual disability"** —
  internal docs only (`CLAUDE.md`, `doc/<lang>/SPEC.md`,
  `technical.md` / `tecnico.md`, `roles.md`, `CONTRIBUTING.md`,
  `CONTRIBUTING.es.md`, `scripts/`). Forbidden in any public-facing
  surface, README, talk, press note or marketing material.
- **"Persona tipo"** — public surfaces only (`README.md`,
  `README.es.md`, talks, social copy, press notes, marketing,
  contributor-facing docs that double as public description, e.g.
  `CONTRIBUTING.md`).
- It does **not** apply to the UI of the app itself: each project's
  zero-mention rule (`doc/en/SPEC.md` §3.4 / `doc/es/SPEC.md` §3.4)
  forbids **any** mention — including "persona tipo" — in
  `index.html`, `app.js`, `strings.<locale>.js`, `js/i18n.js`,
  `about/privacidad.html`, etc.


#### B.5.2 Rationale

Maintainer docs describe the project's real purpose so contributors
can serve it. Public surfaces describe the audience generically via
"persona tipo" without publicly naming a clinical group. This rule
is mirrored in `apptonomia/CLAUDE.md` and every sibling's
`CLAUDE.md` / `SPEC.md`.

### B.6 graphify

This project has a knowledge graph at `graphify-out/` with god nodes,
community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"`
  when `graphify-out/graph.json` exists. Use `graphify path "<A>"
  "<B>"` for relationships and `graphify explain "<concept>"` for
  focused concepts. These return a scoped subgraph, usually much
  smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad
  navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture
  review or when `query`/`path`/`explain` do not surface enough
  context.
- After modifying code, run `graphify update .` to keep the graph
  current (AST-only, no API cost).

### B.7 No generative AI in the shipped product

Memofun's public site makes **zero** calls to any AI service, and
the codebase contains **zero API integrations of any kind** — no API
key, no `fetch` to an external AI endpoint, anywhere in this repo.
This is not an oversight — it is a direct requirement inherited from
Apptonomia's `SPEC.md` (determinism, accessibility, predictability for
the end user; also "sin coste, sin cuenta"). Deck content is written
directly by the AI coding agent working in this repository — see §B.8
— never fetched at runtime by `index.html`/`app.js`/`tools/study/`/
`settings/`, and never via a script that calls an external AI API
with a key. Do not add a client-side (or build-time) call to Gemini
or any other AI API to the site, even behind a flag or a "for
teachers" label — see `doc/en/SPEC.md` §2.1 for the full reasoning
and what was explicitly rejected (an earlier version *did* call the
Gemini REST API from a script; it was removed on purpose). If a task
seems to require re-adding an API call, stop and raise it with the
user rather than implementing it.

This rule is about **AI** services specifically. `scripts/buscar-imagen.js`
(see §B.8 step 9) calls the Openverse *image-bank* API, but only at
content-authoring time, from a Node script no end-user ever runs —
same category as `App.decks` never touching a non-AI network
resource at runtime either. The image it finds gets downloaded once
and shipped as a plain static file; nothing in
`index.html`/`app.js`/`tools/study/`/`settings/` ever fetches it (or
anything else) from an external host.

### B.8 Generating deck content

There is no `scripts/generate.js` anymore. When asked to create or
extend a deck, **you** (the AI coding agent) write the `{pregunta,
respuesta}` pairs directly, following the exact rules below — this
replaces what used to be a system prompt sent to an external API,
and that's the only thing that changed: the rules themselves are
unchanged and still binding.

1. Read the content config: either a `doc/curriculum/**/*.md` file
   or a one-off `config.md`-shaped file (frontmatter: `tema`,
   `nivel`, `cantidad`, `salida`, optional `idioma`; body: optional
   `# Índice` bullet list — see `doc/es/tecnico.md` §3 and §8 for
   the exact shape, `scripts/config-parser.js` for the parsing
   rules if you need them read programmatically).
2. If the topic has an underlying mechanic or rule the learner
   needs before they can answer anything about it (a procedure, a
   notation, a formula — e.g. how Roman numerals combine to form a
   value before drilling calculations with them), open the deck
   with a small run of **lesson cards** that teach that mechanic
   directly and build on each other, before moving into the regular
   quiz-style cards from step 3. Same `{pregunta, respuesta}` shape
   and same clue-first direction as step 3 below, no schema change —
   just placed first and more directly didactic (state the rule,
   then show it working) rather than quiz-style. Skip this step for
   topics that are just a set of facts with no mechanic to
   front-load.
3. Write `cantidad` cards in Spanish (or `idioma` if set), each
   `{"pregunta": "...", "respuesta": "..."}`. **Card design
   principle — read this before writing a single card**: the
   priority is never "explain a lot." It's getting the person to (a)
   understand one concrete idea, (b) recognize it in another
   context, (c) recall it with little help. Every rule below serves
   that goal — when a card is explaining too much, cut it, don't
   compress it into denser prose.
   - **Format: clue first, concept as the answer.** `pregunta`
     carries the explanation — an everyday ANALOGY, a concrete
     PRACTICAL EXAMPLE, or the real PROBLEM the concept solves
     ("why it matters") — described without naming the concept
     itself, closed by one short, direct question that asks the
     learner to name or identify it ("¿Cómo se llama...?",
     "¿Quién...?", "¿Qué número es?"). `respuesta` is ONLY the
     concept/term/name/value being asked for — short (1-6 words),
     wrapped in `<mark></mark>`, never a full sentence, never a
     restatement of the clue, never a dictionary definition. This
     applies to every card, with no exceptions, including the
     lesson cards from step 2: state the rule or fact as the clue,
     let the specific term/value/result be the short recalled
     answer.
   - **Highlight the example inside `pregunta` too.** The study
     screen now renders `respuesta` as a big title and `pregunta`
     as a small caption below it (`tools/study/app.js`
     `paintAnswer()`, `assets/css/componentes.css`
     `.flashcard .respuesta`/`.cara`), so the clue benefits from
     the same color cue already used for the answer. Wrap the
     ANALOGY/EXAMPLE phrase itself — not the whole clue, not the
     closing question — in `<mark></mark>` so it reads in the same
     accent color as `respuesta`'s pill against the plain
     surrounding sentence. One `<mark>` span per card, only around
     the concrete image/example, never around the abstract term
     being taught (that would just duplicate `respuesta`).
   - Control conceptual density, not just sentence length — Easy
     Read for this audience (`doc/en/SPEC.md` §1.2: always someone
     with an intellectual disability) means short sentences AND few
     new ideas at once. At most one new named/abstract concept per
     card (a movement, an author, a technical term) — that concept
     is exactly what `respuesta` names; the clue in `pregunta` must
     not smuggle in a second, unnamed concept. Anchor every
     abstract idea in a concrete everyday image before naming it
     (e.g. describe *desengaño* as "a soap bubble: it shines,
     then it's gone," and let the answer be the word itself). A
     "how do X and Y differ" card is only allowed after X and Y
     have each already had their own concrete card — and even
     then, ground the comparison in the same concrete images
     already used, not in new abstraction. Topics with many names
     in a row (literary movements, historical periods) need *more*,
     smaller cards and deliberate repetition, not compression.
   - Tone: fun and warm, like explaining something interesting to
     a friend — never sarcasm, irony, wordplay, or double meanings
     (they break literal comprehension and Easy Read).
   - When it fits naturally, weave ONE surprising/curious fact (a
     "¿Sabías que...?") into the clue in `pregunta` — never forced,
     never at the cost of clarity, and never in `respuesta`.
   - `pregunta`: 2-4 clue sentences ≤12 words each, one idea per
     sentence, everyday vocabulary, active voice, ending in a short
     closing question. Those are ceilings, not targets — prefer 2
     sentences over 4 and short words over long ones whenever the
     clue still lands; the shorter card that still teaches the one
     idea always beats the longer one that explains more.
     `respuesta`: 1-6 words, no sentence structure needed. Simple
     HTML only (`<mark>`, `<b>`, `<i>`, `<br>`) — never markdown.
   - Adapt depth to `nivel` (principiante/intermedio/avanzado).
     Don't number cards or repeat the topic name verbatim in every
     question. Repeating a concept on purpose (see step 7 below) is
     fine; padding with a card that adds zero new nuance, example,
     or angle is not.
   - Never use "discapacidad", "paciente", or clinical language —
     the content is about the topic, not about who's studying it.
   - If there's a `# Índice`: spread the cards across **every**
     point — none skipped, none invented that aren't in the list.
     Without one, pick the subtopics yourself.
   - Full reasoning: `doc/en/SPEC.md` §2.5.
4. Write the deck directly: `decks/<salida>` (or
   `decks/<slug>.json` derived from `tema` if `salida` wasn't
   given — see `scripts/config-parser.js`'s `slugify()`), matching
   the schema in `doc/en/technical.md` §3: `{tema, nivel, idioma,
   tarjetas}`.
5. Add the entry to `decks/manifest.json` yourself: `{id, tema,
   nivel, cantidad, file, icono}` — `id` can just be the slug
   (readable, deterministic, no hashing needed). If the source was
   a `doc/curriculum/<idioma>/<etapa>/<curso>/<asignatura>.md`
   file, also set `curso` and `asignatura` (derived from the
   path, e.g. `primaria/3/lengua-castellana.md` →
   `curso: "3º de Primaria"`,
   `asignatura: "Lengua Castellana"` — `doc/en/technical.md` §4)
   so the home screen groups it under that course instead of
   listing it as a one-off topic. Leave both unset for ad-hoc
   "modo simple" decks.
6. Tell the user what you generated and where, and that you've
   applied the review checklist yourself
   (`doc/es/guia-interna-crear-barajas.md` §4) — but if the topic
   is unfamiliar, technical, or high-stakes, say so and suggest a
   human double-check before the deck ships.
7. **Repetition reinforces, it isn't redundancy.** When a deck
   extends an existing topic/course (e.g. adding `literatura_3`
   next to an existing `literatura`/`literatura_2` for the same
   course), reuse that course's key concepts on purpose instead of
   hunting for never-touched trivia. Some cards can repeat an
   earlier question near-verbatim (pure repetition, for
   consolidation); others should restate the same idea through a
   new example, angle, or context (varied repetition, for multiple
   encoding). Don't chase novelty at the cost of dropping a
   concept the syllabus expects the learner to meet more than
   once. Full reasoning: `doc/en/SPEC.md` §1.3.

   To know what's already been covered without re-reading every
   sibling deck's full JSON (this gets expensive as a series
   grows — `literatura` → `_2` → `_3` → `_4`…), keep a short log
   at `decks/concepts/<base-slug>.md`, where `base-slug` is the
   topic without its trailing `_2`/`_3`/… suffix (e.g.
   `eso_1_literatura` covers `literatura.json` through
   `literatura_4.json`). One line per concept: which deck(s) in
   the series already used it, and — for varied repeats — the
   angle/analogy/example already spent, so the next repeat is
   genuinely a new one, not another soap-bubble. Read that log
   first; only open a sibling deck's full JSON if the log doesn't
   say enough for a specific card. If the series has no log yet,
   build one now from the existing sibling decks (a one-time
   cost) before writing the new deck, so the *next* extension
   doesn't pay it again. After writing the new deck, update the
   log with what it added. This file is a workshop tool for you,
   not shipped content — it's never read by
   `index.html`/`app.js`/`sw.js` and needs no `VERSION` bump when
   it changes.
8. **Stick to the temario.** When a `doc/curriculum/**/*.md`
   file or the subject/course's real official curriculum exists,
   that is both the floor and the ceiling for what a deck (or a
   deck extending it) covers — don't drift into
   adjacent-but-unlisted topics just because they "read well."
   Full reasoning: `doc/en/SPEC.md` §1.3.
9. **Optional per-card image — always a thumbnail.** Only when
   asked — don't add images on your own initiative for every new
   deck. A card can carry one `imagen` field with a
   photo/illustration as visual support (schema:
   `doc/en/technical.md` §3.1). The shipped image is **always a
   thumbnail of the source**, not the full-resolution original —
   the card renders it at maybe 300-400 px wide on a phone so
   anything above that is bytes spent for no visible quality, and
   the repo ships as Cloudflare Workers static assets with a ~25
   MB total budget that a single full-res image (1-10 MB) breaks
   on its own. To source one:
   `node scripts/buscar-imagen.js "<term>"` searches Openverse
   (free image bank, no signup) restricted to
   CC0/Public Domain/CC BY/CC BY-SA — never `-NC`/`-ND` — lists
   candidates with title/source/dimensions, and you pick the one
   that actually fits **from that text** (search is tag-based, not
   semantic, so retry with a more concrete or common term when
   results are empty or off-topic). **Never open the candidate
   image files to view them, not even the final pick** — the
   search result's title/source is the curated signal for fit;
   treating it as sufficient is the point, not a shortcut, since
   opening any image burns ~1000+ vision tokens for a check the
   title text already gives. If a shipped card ever turns out to
   have a mismatched image, that's caught by a human reader after
   the fact and reported per `CONTRIBUTING.md`, not by the agent
   re-verifying every image at authoring time. **Download the
   `thumb` URL the script prints, not the full-res `image` one** —
   same picture, a fraction of the size, plenty for a card, and
   cheaper to inspect if you ever do need to. If the Openverse
   thumbnail proxy 400s on that specific source host, **generate
   the thumbnail yourself instead of falling back to the full-res
   `image` URL** — the candidate's `fuente` field almost always
   points to Wikimedia Commons, and Wikimedia serves an official
   thumbnail of any file via
   `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<name>&width=800`
   (or the API equivalent
   `?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800` on the
   `curid` page), which is the right tool for this exact case —
   same author, same license, just smaller. Only if neither
   Openverse's thumb nor the Wikimedia thumbnail works, abort and
   report the missing image — never use the full-res `image` URL
   as a default. **Size budget: the saved file in
   `assets/img/decks/<deck-slug>/<file>.<ext>` must end up under
   200 KB on disk** (≤1024 px on the long edge) —
   `scripts/check.js` **fails the build over 200 KB**, a hard
   gate, not a soft aesthetic preference. Save it under
   `assets/img/decks/<deck-slug>/<file>.<ext>` and fill in all of
   `imagen`'s subfields, including the TASL attribution
   (`titulo`/`autor`/`fuente`/`licencia`). When a request covers a
   whole deck, batch the JSON edits into as few read/write passes
   over the file as practical rather than one full round trip per
   card. Bump `sw.js` `VERSION` if you touched
   `tools/study/app.js` or `componentes.css` to add the rendering
   — the images themselves don't need a `FILES` entry (see the
   service-worker rule above; they're cached on first view like
   any deck JSON).

### B.9 Vanilla only — no dependencies, no Anki format

The whole project is plain HTML/CSS/JS (and plain Node.js for the
`scripts/` tooling — parsing and structural checks only, no AI
calls). No frameworks, no bundler, no npm/pip packages of any kind.
Decks are Memofun's own JSON format (`doc/en/technical.md` §3),
not Anki's `.apkg` — that was a deliberate simplification (see
`doc/en/SPEC.md` §2.9) to drop Python and any ZIP/SQLite-reading
library from the stack. Do not reintroduce a build step, a package
manager, or the Anki format without raising it with the user first.

### B.10 Housekeeping scripts

These are not gates; they are quality-of-life helpers modelled on
sinonimia's `scripts/limpiar-cache.js`. Run them occasionally, not
as part of every change:

- `node scripts/smoke-prod.js` — hits the live `*.workers.dev` URL
  and asserts the i18n / header / `decks/manifest.json` contract
  holds. Same script the `.github/workflows/smoke-prod.yml`
  scheduled job runs every 6h. Needs `PROD_URL` (defaults to
  `https://memofun.miralante.workers.dev`).
- `node scripts/limpiar-graphify-cache.js` — dry-run; shows what
  would be removed from `graphify-out/`. Pass `--apply` to actually
  delete it (safe: the next graphify run rebuilds it from scratch).
- `node scripts/scan-secrets.js` — pattern-based grep that the CI
  `secrets-scan` job runs in push; useful to run locally before
  pushing if your diff added anything that looks like a token.
