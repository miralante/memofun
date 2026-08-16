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
│   └── fonts/ Atkinson Hyperlegible + Nunito (.woff2)
├── tools/study/          review screen (flip-card)
├── settings/             support area (text size, language, import, clear progress)
├── decks/                manifest.json + published, reviewed *.json decks
│   └── concepts/         per-series "what's already covered" logs (agent-only, see §8)
├── legal/                data protection
├── scripts/              config-parser.js · check.js · check-version-bump.js (Node, offline)
├── config.md             example content config (see §8)
└── doc/
    ├── es/ · en/         this documentation
    └── curriculum/es/    Primaria→FP GM curriculum-outline library (own README)
                          curriculum/en/ is an empty sibling, reserved for the
                          same library in another language
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
{ "id": "primaria-3-matematicas", "tema": "Matemáticas - 3º de Primaria",
  "nivel": "principiante", "curso": "3º de Primaria", "asignatura": "Matemáticas",
  "cantidad": 12, "file": "primaria_3_matematicas.json", "icono": "🔢" }
```

When present, the home screen (`app.js`) groups decks into a
course-then-subject drill-down instead of a flat grid — see §4.1. When
generating a deck from a `doc/curriculum/<idioma>/<etapa>/<curso>/<asignatura>.md`
file, derive both from the path/frontmatter (e.g. `primaria/3/lengua-castellana.md`
→ `curso: "3º de Primaria"`, `asignatura: "Lengua Castellana"`); leave both
unset for one-off "modo simple" decks with no course of their own —
they fall back to a flat "other topics" section, exactly like before
this field existed.

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
