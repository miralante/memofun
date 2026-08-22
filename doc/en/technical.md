# technical.md — Architecture

## 1. Overview

A fully static site, **plain vanilla HTML/CSS/JS** (no build, no
framework, no third-party dependency, no backend, no integration with
any AI API anywhere in the code), deployed as a Cloudflare Worker
(static assets). The pieces that aren't part of the public site are
the `scripts/` utilities (Node.js, offline, zero npm packages): they
validate and shape content, but don't generate it — that's done by the
AI coding agent directly (see §8).

```
memofun/
├── index.html            deck grid (home, end-user screen)
├── app.js  ·  strings.es.js  ·  strings.en.js
├── manifest.json  ·  sw.js  ·  offline.html  ·  404.html
├── assets/
│   ├── css/  tokens.css · base.css · componentes.css
│   ├── js/   utils.js · i18n.js · tts.js · storage.js · feedback.js · deck-loader.js
│   ├── fonts/ Atkinson Hyperlegible + Nunito (.woff2)
│   └── img/decks/<slug>/ optional per-card images (see §3.1), bundled not hotlinked
├── tools/study/          review screen (flip-card)
├── settings/             support area (text size, language, import, clear progress)
├── decks/                manifest.json + published, reviewed *.json decks
│   └── concepts/         per-series "what's already covered" logs (agent-only, see §8)
├── legal/                data protection
├── scripts/              config-parser.js · check.js · check-version-bump.js ·
│                         buscar-imagen.js (Node, offline except the latter, see §3.1)
├── config.md             example content config (see §8)
└── doc/
    ├── es/ · en/         this documentation
    └── curriculum/
        ├── es/           Comunidad de Madrid: Primaria → FP GM (own README)
        └── en/           England: Key Stage 1 → Key Stage 4, with vocational
                          (own README; partially populated, see call for help)
```

## 2. Shared modules (`assets/js/`)

Single `window.App` namespace, loaded in this order on every page:
`utils.js` → `i18n.js` → `tts.js` → `storage.js` → `feedback.js` →
`deck-loader.js` → the page's `strings.<locale>.js` → the page's `app.js`.

- **`App.utils`**: `$`, `$$`, `reducedMotion()`, `uid()`, `escapeHtml()`, `downloadBlob()`, `registerServiceWorker(path)` — registers the SW and, only on an actual update (not the first-ever install), reloads the page once the new version takes control, instead of leaving the open tab silently stale until someone thinks to hard-refresh.
- **`App.i18n`**: `t(key)`, `pick(key)` (random phrase from an array, for feedback), `register(dict, locale)`, `setLocale(locale)`, `apply(root)` (applies `data-i18n`/`data-i18n-aria`/`data-i18n-meta`).
- **`App.tts`**: `speak(text, [onEnd])` — Web Speech API, on demand only.
- **`App.storage`**: `get/set/remove/clearAll(key)` over `localStorage`, `memofun:` prefix; `completeDeck(id)` implements the progress contract (SPEC.md §2.6).
- **`App.feedback`**: `success(zone)`, `encourage(zone)`, `celebrate(message, after)` — Web Audio, no sound files.
- **`App.decks`**: `readFile(file)` / `readUrl(url)` → `Promise<{tema, nivel, idioma, tarjetas}>`. Reads the JSON directly with `fetch`/`File.text()` — no ZIP, no SQLite/WASM, no external library at all.

## 3. Deck file format

Memofun uses **its own format**, not Anki's `.apkg`: a plain JSON file.

```json
{
  "tema": "Docker y Contenedores",
  "nivel": "intermedio",
  "idioma": "es",
  "tarjetas": [
    { "pregunta": "...", "respuesta": "..." }
  ]
}
```

`respuesta` is simple HTML (`<mark>`, `<b>`, `<i>`, `<br>`) — the key
meaningful-learning phrase is wrapped in `<mark></mark>` (see the
content rules in §8 and in `CLAUDE.md`). `App.decks` normalizes any
file with this shape; a file with no `tarjetas` array is rejected.

### 3.1 Optional per-card image (`imagen`)

A card can carry one optional photo/illustration as visual support for
the explanation:

```json
{
  "pregunta": "¿Qué es un cuento popular?",
  "respuesta": "...",
  "imagen": {
    "archivo": "assets/img/decks/primaria_1_literatura/cuento-popular.jpg",
    "alt": "Portada de un libro de cuentos: una niña sentada, leyendo",
    "titulo": "Fairy Tales",
    "autor": "Boston Public Library",
    "fuente": "https://www.flickr.com/photos/24029425@N06/10871801484",
    "licencia": "CC BY 2.0"
  }
}
```

- `archivo`: site-root-relative path to the image file, bundled inside
  the repo at `assets/img/decks/<deck-slug>/<file>.jpg` — **never** a
  hotlink to an external host. Images are downloaded once at
  content-authoring time and shipped like any other static asset, so
  the site keeps making zero runtime calls to any external service
  (`SPEC.md` §2.1) and the image still works offline once cached (the
  generic `fetch` handler in `sw.js` caches it on first view, same as
  a deck's own JSON — no `FILES` entry needed per image).
- `alt`: plain description of what the image actually shows, in the
  deck's language — accessibility text, not a restatement of the card.
- `titulo` / `autor` / `fuente` / `licencia`: attribution for the
  source work (Title/Author/Source/License — the CC "TASL" convention),
  shown as a small caption under the image. `licencia` must be a
  license that allows commercial reuse and modification with no extra
  restriction — CC0, Public Domain, CC BY, or CC BY-SA. Never a
  `-NC` (non-commercial) or `-ND` (no derivatives) license: `scripts/check.js`
  rejects both.
- All five fields are required when `imagen` is present; a card with
  no `imagen` renders exactly as before (image is optional, per card,
  not per deck).
- **Images are always thumbnails. The shipped file MUST be a thumbnail
  of the source, not the full-resolution original.** The repo ships as
  Cloudflare Workers static assets with a hard total budget of ~25 MB
  for the entire site; a single full-res Openverse `image` (often
  1-10 MB) blows that budget on its own, and on top of that the image
  is much larger than a card illustration needs — the card renders
  it at maybe 300-400 px wide on a phone, so anything above that is
  bytes spent for no visible quality. The shipped file in
  `assets/img/decks/<deck-slug>/<file>.<ext>` MUST therefore be a
  thumbnail (≤1024 px on the long edge) and MUST stay under 200 KB
  on disk after the download (`scripts/check.js` reports any image
  over that as a warning, and any over 500 KB as a hard failure — the
  failure threshold is the size that single-handedly breaks the
  Cloudflare deploy budget, not a soft aesthetic preference).
  Acquisition order is: (a) the Openverse `thumb` URL from
  `buscar-imagen.js`, which is already in this range (tens-of-KB
  JPEGs); (b) if that 400s, generate the thumbnail yourself instead
  of falling back to the full-res `image` URL — the Openverse
  candidate's `fuente` field almost always points to Wikimedia
  Commons, and Wikimedia serves an official thumbnail of any file
  via `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<name>&width=800`
  (or its API equivalent `?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800`
  on the `curid` page), which is the same picture at a controlled
  size and the right tool for this exact case — same author, same
  license, just smaller; (c) only if neither (a) nor (b) works,
  abort and report the missing image — never fall back to the
  full-res `image` URL as a default. `scripts/check.js` enforces the
  budget so this rule can't silently slip.
- Sourcing: `node scripts/buscar-imagen.js "<term>"` searches Openverse
  (openverse.org, no key needed) restricted to those same safe
  licenses and lists candidates — title, source, and both a `thumb`
  and a full-res `image` URL — for a human/agent to review and pick;
  it does not download or pick automatically. The shipped image MUST
  come from the `thumb` URL: same picture, a fraction of the size,
  already in the 200 KB budget. If the Openverse thumbnail proxy 400s
  on a specific source host, generate the thumbnail from the source
  instead of falling back to the full-res `image` URL — see the
  size-budget bullet above for the Wikimedia `Special:FilePath`
  fallback. Pick from the title/source text the script prints and
  treat it as curated — never open a candidate file to view it,
  including the final pick, that spends vision tokens for a check
  the text already gives. A mismatched image that slips through gets
  caught by a human reader later and reported per `CONTRIBUTING.md`.
  See `internal-creating-decks-guide.md` §3.1.

## 4. `decks/manifest.json`

Array of objects:

```json
{ "id": "docker", "tema": "Docker y Contenedores", "nivel": "intermedio",
  "cantidad": 10, "file": "docker_memofun.json", "icono": "🐳" }
```

`id` is used as the `localStorage` key (`progreso.completado[id]`) —
it can just be the file's slug (readable, deterministic, no hashing
needed). Whoever writes the deck (the AI agent) adds this entry by
hand after reviewing the content.

**Optional `curso` / `asignatura`** — free-text strings (same language
as the deck's own content, no ES/EN parity required, same rule as
`tema`), e.g.:

```json
{ "id": "ks2-3-english", "tema": "English - Key Stage 2, Year 3",
  "nivel": "principiante", "curso": "Year 3 (KS2)", "asignatura": "English",
  "cantidad": 12, "file": "ks2_3_english.json", "icono": "📚" }
```

When present, the home screen (`app.js`) groups decks into a
course-then-subject drill-down instead of a flat grid — see §4.1. When
generating a deck from a `doc/curriculum/<idioma>/<etapa>/<curso>/<asignatura>.md`
file, derive both from the path/frontmatter (e.g.
`key-stage-2/3/english-literature.md` → `curso: "Year 3 (KS2)"`,
`asignatura: "English Literature"`); leave both unset for one-off
"modo simple" decks with no course of their own — they fall back to
a flat "other topics" section, exactly like before this field
existed.

### 4.1 Home screen navigation (courses/subjects)

Driven entirely by `?curso=&asignatura=` query params on `index.html`
— no router, no framework, plain `<a href>` navigation so back/forward
and bookmarking work for free:

- No `curso` param: course cards (one per unique `curso` across
  decks), plus a flat "other topics" grid for decks without a
  `curso`. If every deck lacks `curso`, this degrades to exactly the
  original flat grid (no course level shown at all).
- `curso` set: subject cards for that course, plus a "pin as my
  course" toggle (`localStorage` `memofun:prefs.cursoFijado`). A
  subject with exactly one deck links straight to it; more than one
  shows a small deck grid first.
- Pinned course: a "quick access" card appears at the top of the
  course level, linking straight into that course's subjects.

This adds one level to the flow described in §5 rule 10 *only* for
decks that opt into `curso`/`asignatura` — flat decks are unaffected.

### 4.2 English locale (en) — invite-only curriculum

When `App.i18n.locale() === 'en'` the home screen **does not read
`decks/manifest.json` at all**. Every shipped deck today is Spanish
content (deck content is not covered by the i18n parity rule, see
`CLAUDE.md`); serving the Spanish deck grid to an English visitor
would be a silent dead end. Instead, `app.js` renders a
hardcoded English curriculum (`EN_CURRICULUM` in `app.js`) that
mirrors `doc/curriculum/en/`:

- **Top level** — one card per stage (`Key Stage 1` … `Key Stage 4`,
  `Entry Level Business`, `BTEC Business L2`), each linking to its
  subjects via `?en=1&curso=<stage>`.
- **Subject level** — one *invite card* per subject (`English
  Literature`, `Science`, `History`, `Geography`, etc.). The card is
  not a deck link: it shows the subject, the message "No deck yet —
  be the first to contribute", and a button that opens
  [`internal-creating-decks-guide.md`](./internal-creating-decks-guide.md)
  on GitHub so the visitor lands on the exact workflow that turns a
  temario into a deck.

The data lives in `app.js` (not the manifest) on purpose — adding
to `manifest.json` would force a real `decks/<slug>.json` to exist
(`check.js` rule 8 fails otherwise), and these subjects have no
decks yet. `EN_CURRICULUM` is a workshop artefact, not a tracked
deck catalogue: keep it in sync with `doc/curriculum/en/` as a
matter of authorship hygiene, the same way the Spanish concept logs
are kept in sync (`decks/concepts/<base-slug>.md`).

The `?en=1` query param is mandatory for EN-side navigation, so a
visitor who hand-edits a Spanish deck URL can never accidentally
land on the EN flow and vice versa. Reverting the UI locale to
`es` (`localStorage 'memofun:locale'`) returns to the manifest
flow with no other state to reset.

When the first real English deck ships, the rule for promoting a
subject from "invite card" to "deck card" is the same as for any
Spanish deck (`§4`): add the `decks/<slug>.json` file, add a
matching `decks/manifest.json` entry with `curso`/`asignatura`
matching the EN_CURRICULUM stage and subject, and the EN home will
automatically surface it (the EN render still branches on locale;
when a manifest entry exists for a given subject the EN path can
opt to swap the invite card for the real deck link — see
`renderEnSubjectLevel` in `app.js`).

## 5. Accessibility rules

1. Easy Read: short sentences, one idea per sentence.
2. Buttons ≥ 64×64 px, gap ≥ 16 px (`--button-min` in `tokens.css`).
3. High contrast, light theme by default (WCAG AA minimum).
4. Audio only on demand (`App.tts.speak`), never automatic.
5. No timers, no negative scoring.
6. Positive reinforcement on finishing a deck: `App.feedback.celebrate()`.
7. Respect `prefers-reduced-motion` (global rule in `base.css`).
8. Full keyboard navigation (arrows to move between cards; the "Show
   answer" button and other controls activate with Enter/Space, like
   any button; Enter/Space also activates the import dropzone).
9. ARIA on icon buttons (`data-i18n-aria`) and feedback zones
   (`aria-live`/`role="status"`).
10. At most 3 screens in the main flow (home → deck → card); decks
    grouped by `curso`/`asignatura` add one optional level (courses →
    subjects → deck → card) — see §4.1.
11. Progress only ever adds up: see `App.storage.completeDeck` contract.
12. Focus always visible (`:focus-visible` in `base.css`, never removed).
13. No generative AI, no third-party libraries, and no unsolicited
    network calls in the public product — see `SPEC.md` §2.1.

## 6. Internationalization

See [`I18N.md`](I18N.md). Summary: `es` is the source of truth, `en`
must keep parity. `App.i18n.register()` from each `strings.<locale>.js`.

## 7. Deployment

Cloudflare Workers (static assets). See [`CLOUDFLARE.md`](../../CLOUDFLARE.md).

## 8. How a deck's content gets generated

**No script calls any AI API.** Content is written directly by the AI
coding agent (Claude Code or similar) working in this repository, as
part of its support/build role — see the full ruleset in "Generating
deck content" in `CLAUDE.md`. This replaced an earlier version that
did call the Gemini REST API from `scripts/generate.js`: that was
removed entirely, not just from the public site but from the whole
codebase — zero API keys, zero network calls to AI services, anywhere
in the project.

The **content ingestion point** is still a Markdown file with
frontmatter (`tema`, `nivel`, `cantidad`, `salida`, optional `idioma`)
plus the document body — the same format as before, just read by the
agent directly instead of by a script:

- **`tema` alone**: the agent freely picks the subtopics most relevant
  to that topic at the given level.
- **`tema` + a `# Índice`**: an `# Índice` (or `## Índice`, any heading
  level) section in the Markdown body, with a bullet list
  (`- subtopic`). The agent spreads `cantidad` cards across every
  listed point — none skipped, none invented. Useful when the support
  person already has a syllabus or outline and wants the deck to
  follow it closely. See the example in `config.md`, or the
  ready-made library in `doc/curriculum/`.

`scripts/config-parser.js` keeps the **parsing** of this format
(`parseMarkdown()`, `parseIndice()`, `slugify()`) as pure functions,
no network, no keys — used by `scripts/check.js` to validate that
every file under `doc/curriculum/` has correct frontmatter and, if it
declares an outline, that it isn't empty. It doesn't generate content;
it only understands its shape.

**Full workflow** (see also `internal-creating-decks-guide.md`):

1. Ask the agent to generate a deck, pointing at a `doc/curriculum/`
   file or a new `config.md`.
2. The agent writes the cards following `CLAUDE.md` → "Generating deck
   content" (meaningful learning, Easy Read, fun tone, curious facts,
   outline coverage if there is one).
3. The agent writes `decks/<salida>.json` directly (§3's format).
4. The agent adds the matching entry to `decks/manifest.json`, with
   `curso`/`asignatura` if the deck came from a `doc/curriculum/`
   file (see §4).
5. If the deck extends an existing series (`literatura` → `_2` →
   `_3`…), the agent reads `decks/concepts/<base-slug>.md` instead of
   every sibling deck's full JSON to see what's already covered and
   how, then updates that log with what the new deck added — see
   `CLAUDE.md` → "Generating deck content" step 7. This log is never
   read by the site itself; it's a workshop file for the agent, so
   editing it never needs a `sw.js` `VERSION` bump.
6. The content gets reviewed (by whoever asked for it, or by the agent
   applying the checklist) before it's considered published.

## 9. `scripts/check.js` and `scripts/check-version-bump.js`

Same pattern as the rest of the sibling family: dependency-free
structural checks meant to run before every change.

- **`node scripts/check.js`**: JS syntax across the whole site, ES/EN
  key parity, that `sw.js` doesn't list a non-existent file, that
  `manifest.json` icons exist, that no user-facing page mentions
  disability or clinical language, that `_headers`' CSP is well-formed,
  that every `data-i18n*`/`App.i18n.t()` resolves to a registered key,
  and that `decks/manifest.json` points to real `.json` files with a
  non-empty `tarjetas` array.
- **`node scripts/check-version-bump.js`**: fails if a file listed in
  `sw.js` changed in the diff without `VERSION` being bumped
  (`CLAUDE.md` rule). Skips the check if there's no git repository or
  no previous commit to diff against.
