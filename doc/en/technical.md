# technical.md â€” Architecture

Product scope, audience and product rules live in [`SPEC.md`](SPEC.md). This
document is the canonical source for technical and implementation decisions.

## 1. Overview

A fully static site, **plain vanilla HTML/CSS/JS** (no build, no
framework, no third-party dependency, no backend, no integration with
any AI API anywhere in the code), deployed as a Cloudflare Worker
(static assets). The pieces that aren't part of the public site are
the `scripts/` utilities (Node.js, offline, zero npm packages): they
validate and shape content, but don't generate it â€” that's done by the
AI coding agent directly (see §8).

```
memofun/
â”œâ”€â”€ index.html            deck grid (home, end-user screen)
â”œâ”€â”€ app.js  ·  strings.es.js  ·  strings.en.js
â”œâ”€â”€ manifest.json  ·  sw.js  ·  offline.html  ·  404.html
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ css/  tokens.css · base.css · componentes.css
â”‚   â”œâ”€â”€ js/   utils.js · i18n.js · tts.js · storage.js · feedback.js · deck-loader.js
â”‚   â”œâ”€â”€ fonts/ Atkinson Hyperlegible + Nunito (.woff2)
â”‚   â””â”€â”€ img/decks/<slug>/ optional per-card images (see §3.1), bundled not hotlinked
â”œâ”€â”€ tools/study/          review screen (flip-card)
â”œâ”€â”€ settings/             support area (text size, language, import, clear progress)
â”œâ”€â”€ decks/                manifest.json + published, reviewed *.json decks
â”‚   â””â”€â”€ concepts/         per-series "what's already covered" logs (agent-only, see §8)
â”œâ”€â”€ legal/                data protection
â”œâ”€â”€ scripts/              config-parser.js · check.js · check-version-bump.js ·
â”‚                         buscar-imagen.js (Node, offline except the latter, see §3.1)
â”œâ”€â”€ config.md             example content config (see §8)
â””â”€â”€ doc/
    â”œâ”€â”€ es/ · en/         this documentation
    â””â”€â”€ curriculum/
        â”œâ”€â”€ es/           Comunidad de Madrid: Primaria â†’ FP GM (own README)
        â””â”€â”€ en/           England: Key Stage 1 â†’ Key Stage 4, with vocational
                          (own README; partially populated, see call for help)
```

## 2. Shared modules (`assets/js/`)

Single `window.App` namespace, loaded in this order on every page:
`utils.js` â†’ `i18n.js` â†’ `tts.js` â†’ `storage.js` â†’ `feedback.js` â†’
`deck-loader.js` â†’ the page's `strings.<locale>.js` â†’ the page's `app.js`.

- **`App.utils`**: `$`, `$$`, `reducedMotion()`, `uid()`, `escapeHtml()`, `downloadBlob()`, `registerServiceWorker(path)` â€” registers the SW and, only on an actual update (not the first-ever install), reloads the page once the new version takes control, instead of leaving the open tab silently stale until someone thinks to hard-refresh.
- **`App.i18n`**: `t(key)`, `pick(key)` (random phrase from an array, for feedback), `register(dict, locale)`, `setLocale(locale)`, `apply(root)` (applies `data-i18n`/`data-i18n-aria`/`data-i18n-meta`).
- **`App.tts`**: `speak(text, [onEnd])` â€” Web Speech API, on demand only.
- **`App.storage`**: `get/set/remove/clearAll(key)` over `localStorage`, `memofun:` prefix; `completeDeck(id)` implements the progress contract (SPEC.md §2.6).
- **`App.feedback`**: `success(zone)`, `encourage(zone)`, `celebrate(message, after)` â€” Web Audio, no sound files.
- **`App.decks`**: `readFile(file)` / `readUrl(url)` â†’ `Promise<{tema, nivel, idioma, tarjetas}>`. Reads the JSON directly with `fetch`/`File.text()` â€” no ZIP, no SQLite/WASM, no external library at all.

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

`pregunta` carries the clue â€” the everyday analogy, concrete example,
or "why it matters" â€” closed by a short question asking the learner to
name or identify the concept; `respuesta` is ONLY that concept/term
itself, short (1-6 words), wrapped in `<mark></mark>` (see the content
rules in §8 and in `CLAUDE.md`). The study screen renders `respuesta`
as a large title and `pregunta` as a small caption below it (image, if
any, to the left â€” `tools/study/app.js`), so `pregunta`'s own
analogy/example phrase is also wrapped in one `<mark></mark>` span
(not the whole clue, not the closing question) to carry the same
highlight color. Simple HTML only (`<mark>`, `<b>`, `<i>`, `<br>`).
`App.decks` normalizes any file with this shape; a file with no
`tarjetas` array is rejected.

### 3.1 Optional per-card image (`imagen`)

A card can carry one optional photo/illustration as visual support for
the explanation:

```json
{
  "pregunta": "Es una historia que se cuenta desde hace muchÃ­simos aÃ±os, de abuelos a nietos. Â¿CÃ³mo se llama esta clase de historia?",
  "respuesta": "<mark>Cuento popular</mark>",
  "imagen": {
    "archivo": "assets/img/decks/primaria_1_literatura/cuento-popular.jpg",
    "alt": "Portada de un libro de cuentos: una niÃ±a sentada, leyendo",
    "titulo": "Fairy Tales",
    "autor": "Boston Public Library",
    "fuente": "https://www.flickr.com/photos/24029425@N06/10871801484",
    "licencia": "CC BY 2.0"
  }
}
```

- `archivo`: site-root-relative path to the image file, bundled inside
  the repo at `assets/img/decks/<deck-slug>/<file>.jpg` â€” **never** a
  hotlink to an external host. Images are downloaded once at
  content-authoring time and shipped like any other static asset, so
  the site keeps making zero runtime calls to any external service
  (`SPEC.md` §2.1) and the image still works offline once cached (the
  generic `fetch` handler in `sw.js` caches it on first view, same as
  a deck's own JSON â€” no `FILES` entry needed per image).
- `alt`: plain description of what the image actually shows, in the
  deck's language â€” accessibility text, not a restatement of the card.
- `titulo` / `autor` / `fuente` / `licencia`: attribution for the
  source work (Title/Author/Source/License â€” the CC "TASL" convention),
  shown as a small caption under the image. `licencia` must be a
  license that allows commercial reuse and modification with no extra
  restriction â€” CC0, Public Domain, CC BY, or CC BY-SA. Never a
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
  is much larger than a card illustration needs â€” the card renders
  it at maybe 300-400 px wide on a phone, so anything above that is
  bytes spent for no visible quality. The shipped file in
  `assets/img/decks/<deck-slug>/<file>.<ext>` MUST therefore be a
  thumbnail (â‰¤1024 px on the long edge) and MUST stay under 200 KB
  on disk after the download â€” `scripts/check.js` fails the build over
  200 KB, a hard gate (not a soft aesthetic preference): a size that
  large is itself proof the file isn't an actual thumbnail, and enough
  of them would blow the Cloudflare deploy budget on their own.
  Acquisition order is: (a) the Openverse `thumb` URL from
  `buscar-imagen.js`, which is already in this range (tens-of-KB
  JPEGs); (b) if that 400s, generate the thumbnail yourself instead
  of falling back to the full-res `image` URL â€” the Openverse
  candidate's `fuente` field almost always points to Wikimedia
  Commons, and Wikimedia serves an official thumbnail of any file
  via `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<name>&width=800`
  (or its API equivalent `?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800`
  on the `curid` page), which is the same picture at a controlled
  size and the right tool for this exact case â€” same author, same
  license, just smaller; (c) only if neither (a) nor (b) works,
  abort and report the missing image â€” never fall back to the
  full-res `image` URL as a default. `scripts/check.js` enforces the
  budget so this rule can't silently slip.
- Sourcing: `node scripts/buscar-imagen.js "<term>"` searches Openverse
  (openverse.org, no key needed) restricted to those same safe
  licenses and lists candidates â€” title, source, and both a `thumb`
  and a full-res `image` URL â€” for a human/agent to review and pick;
  it does not download or pick automatically. The shipped image MUST
  come from the `thumb` URL: same picture, a fraction of the size,
  already in the 200 KB budget. If the Openverse thumbnail proxy 400s
  on a specific source host, generate the thumbnail from the source
  instead of falling back to the full-res `image` URL â€” see the
  size-budget bullet above for the Wikimedia `Special:FilePath`
  fallback. Pick from the title/source text the script prints and
  treat it as curated â€” never open a candidate file to view it,
  including the final pick, that spends vision tokens for a check
  the text already gives. A mismatched image that slips through gets
  caught by a human reader later and reported per `CONTRIBUTING.md`.
  See `internal-creating-decks-guide.md` §3.1.

## 4. `decks/manifest.json`

Array of objects:

```json
{ "id": "docker", "tema": "Docker y Contenedores", "nivel": "intermedio",
  "cantidad": 10, "file": "docker_memofun.json", "icono": "ðŸ³" }
```

`id` is used as the `localStorage` key (`progreso.completado[id]`) â€”
it can just be the file's slug (readable, deterministic, no hashing
needed). Whoever writes the deck (the AI agent) adds this entry by
hand after reviewing the content.

**Optional `curso` / `asignatura`** â€” free-text strings (same language
as the deck's own content, no ES/EN parity required, same rule as
`tema`), e.g.:

```json
{ "id": "ks2-3-english", "tema": "English - Key Stage 2, Year 3",
  "nivel": "principiante", "curso": "Year 3 (KS2)", "asignatura": "English",
  "cantidad": 12, "file": "ks2_3_english.json", "icono": "ðŸ“š" }
```

When present, the home screen (`app.js`) groups decks into a
course-then-subject drill-down instead of a flat grid â€” see §4.1. When
generating a deck from a `doc/curriculum/<idioma>/<etapa>/<curso>/<asignatura>.md`
file, derive both from the path/frontmatter (e.g.
`key-stage-2/3/english-literature.md` â†’ `curso: "Year 3 (KS2)"`,
`asignatura: "English Literature"`); leave both unset for one-off
"modo simple" decks with no course of their own â€” they fall back to
a flat "other topics" section, exactly like before this field
existed.

### 4.1 Home screen navigation (courses/subjects)

Driven entirely by `?curso=&asignatura=` query params on `index.html`
â€” no router, no framework, plain `<a href>` navigation so back/forward
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
decks that opt into `curso`/`asignatura` â€” flat decks are unaffected.

### 4.2 English locale (en) â€” invite-only curriculum

When `App.i18n.locale() === 'en'` the home screen **does not read
`decks/manifest.json` at all**. Every shipped deck today is Spanish
content (deck content is not covered by the i18n parity rule, see
`CLAUDE.md`); serving the Spanish deck grid to an English visitor
would be a silent dead end. Instead, `app.js` renders a
hardcoded English curriculum (`EN_CURRICULUM` in `app.js`) that
mirrors `doc/curriculum/en/`:

- **Top level** â€” one card per stage (`Key Stage 1` â€¦ `Key Stage 4`,
  `Entry Level Business`, `BTEC Business L2`), each linking to its
  subjects via `?en=1&curso=<stage>`.
- **Subject level** â€” one *invite card* per subject (`English
  Literature`, `Science`, `History`, `Geography`, etc.). The card is
  not a deck link: it shows the subject, the message "No deck yet â€”
  be the first to contribute", and a button that opens
  [`internal-creating-decks-guide.md`](./internal-creating-decks-guide.md)
  on GitHub so the visitor lands on the exact workflow that turns a
  temario into a deck.

The data lives in `app.js` (not the manifest) on purpose â€” adding
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
opt to swap the invite card for the real deck link â€” see
`renderEnSubjectLevel` in `app.js`).

## 5. Accessibility rules

1. Easy Read: short sentences, one idea per sentence.
2. Buttons â‰¥ 64Ã—64 px, gap â‰¥ 16 px (`--button-min` in `tokens.css`).
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
10. At most 3 screens in the main flow (home â†’ deck â†’ card); decks
    grouped by `curso`/`asignatura` add one optional level (courses â†’
    subjects â†’ deck â†’ card) â€” see §4.1.
11. Progress only ever adds up: see `App.storage.completeDeck` contract.
12. Focus always visible (`:focus-visible` in `base.css`, never removed).
13. No generative AI, no third-party libraries, and no unsolicited
    network calls in the public product â€” see `SPEC.md` §2.1.

## 6. Internationalization

See [`I18N.md`](I18N.md). Summary: `es` is the source of truth, `en`
must keep parity. `App.i18n.register()` from each `strings.<locale>.js`.

## 7. Deployment

Cloudflare Workers (static assets). See [`CLOUDFLARE.md`](../../CLOUDFLARE.md).

### 7.1 Service worker (`sw.js`)

Memofun ships its own service worker at the project root (`sw.js`). The SW
follows the **cache-first** strategy with a single flat `FILES` list (no
per-tool `ARCHIVOS` — memofun is deck-driven, not multi-activity): the generic
`fetch` handler serves from cache when the file is listed, and only goes to
the network when it is not.

**`VERSION` bump rule** (`sw.js` declares `var VERSION = "memofun-vN";`):
bump `VERSION` on every commit that touches any file in `FILES` or adds a
new file that should be cached. The SW `install` handler compares `VERSION`
against the active cache name and only re-fetches + activates when they
differ; a bump that doesn't land is silent and end users keep seeing the old
files until the SW unregisters.

**Decks are an exception.** Deck content (`decks/*.json` and
`assets/img/decks/*`) is NOT listed in the SW `FILES` — it is always served
from the network (standard HTTP cache). This is deliberate: decks can change
without bumping `VERSION`, and the Cloudflare cache for those paths is already
configured in `_headers`.

**Local verification before pushing.** Run `node scripts/check-version-bump.js`
after editing `sw.js` or any file listed in `FILES` — the same check that runs
as the `cache-bump` job in CI. The rule is the same: bump on every commit that
touches a file in `FILES` (or adds one).

See [`CLOUDFLARE.md`](../../CLOUDFLARE.md) §"Cache contract" for the full
deploy contract. This section of `tecnico.md` is the canonical reference for
the memofun SW contract.
## 8. How a deck's content gets generated

**No script calls any AI API.** Content is written directly by the AI
coding agent (Claude Code or similar) working in this repository, as
part of its support/build role â€” see the full ruleset in "Generating
deck content" in `CLAUDE.md`. This replaced an earlier version that
did call the Gemini REST API from `scripts/generate.js`: that was
removed entirely, not just from the public site but from the whole
codebase â€” zero API keys, zero network calls to AI services, anywhere
in the project.

The **content ingestion point** is still a Markdown file with
frontmatter (`tema`, `nivel`, `cantidad`, `salida`, optional `idioma`)
plus the document body â€” the same format as before, just read by the
agent directly instead of by a script:

- **`tema` alone**: the agent freely picks the subtopics most relevant
  to that topic at the given level.
- **`tema` + a `# Ãndice`**: an `# Ãndice` (or `## Ãndice`, any heading
  level) section in the Markdown body, with a bullet list
  (`- subtopic`). The agent spreads `cantidad` cards across every
  listed point â€” none skipped, none invented. Useful when the support
  person already has a syllabus or outline and wants the deck to
  follow it closely. See the example in `config.md`, or the
  ready-made library in `doc/curriculum/`.

`scripts/config-parser.js` keeps the **parsing** of this format
(`parseMarkdown()`, `parseIndice()`, `slugify()`) as pure functions,
no network, no keys â€” used by `scripts/check.js` to validate that
every file under `doc/curriculum/` has correct frontmatter and, if it
declares an outline, that it isn't empty. It doesn't generate content;
it only understands its shape.

**Full workflow** (see also `internal-creating-decks-guide.md`):

1. Ask the agent to generate a deck, pointing at a `doc/curriculum/`
   file or a new `config.md`.
2. The agent writes the cards following `CLAUDE.md` â†’ "Generating deck
   content" (meaningful learning, Easy Read, fun tone, curious facts,
   outline coverage if there is one).
3. The agent writes `decks/<salida>.json` directly (§3's format).
4. The agent adds the matching entry to `decks/manifest.json`, with
   `curso`/`asignatura` if the deck came from a `doc/curriculum/`
   file (see §4).
5. If the deck extends an existing series (`literatura` â†’ `_2` â†’
   `_3`â€¦), the agent reads `decks/concepts/<base-slug>.md` instead of
   every other deck of the suite's full JSON to see what's already
   covered and how, then updates that log with what the new deck
   added â€” see `CLAUDE.md` â†’ "Generating deck content" step 7. This
   log is never read by the site itself; it's a workshop file for the
   agent, so editing it never needs a `sw.js` `VERSION` bump.
6. The content gets reviewed (by whoever asked for it, or by the agent
   applying the checklist) before it's considered published.

## 9. `scripts/check.js` and `scripts/check-version-bump.js`

Same pattern as the rest of the apps of the suite: dependency-free
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

## 10. Suite pattern â€” how every app of Miralante is built

> ðŸŒ **Other language:** [Spanish](../es/tecnico.md#8-patrÃ³n-de-la-suite-cÃ³mo-se-construye-cada-app-de-miralante)

This section is the **canonical, cross-project guide** for how
every app of the [Miralante suite](https://apptonomia.uk) is
built and maintained. It is the source of truth that overrides
any single repo's `technical.md` / `tecnico.md` when they
disagree, because the goal is to keep the seven sibling apps
(Apptonomia, Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon,
Routime) consistent: same shape, same conventions, same
deploy, same i18n, same offline behaviour.

A change to this section is a **suite-wide change** and must be
applied to every repo. A change to a project's other sections
in this file is project-specific and stays there.

> **Source of truth for product rules** in this repo:
> [`SPEC.md`](SPEC.md).
> **Source of truth for i18n**: [`I18N.md`](I18N.md).
> This section does **not** redefine those; it codifies the
> pattern they all share.

### 10.0 The pattern in one paragraph

Every app of the Miralante suite is a **static, dependency-free,
offline-first PWA** built from the same minimal skeleton:

1. A small set of **standalone HTML pages** at the repo root
   (one activity) or under `tools/<slug>/` (multi-activity hubs).
2. Every page is a **real, navigable URL** â€” there is **no SPA
   routing**, no in-page view switching, no `pushState`. Each
   page reloads on entry; navigation between pages is a normal
   `<a>` click.
3. Hidden routes (`about/`, `team/`, `legal/`, `config/`) share
   the same shape: `index.html` + `styles.css` + `strings.<locale>.js`
   pair, with **interlinking in the footer** so any of them is
   one click away from any other.
4. A **service worker** (`sw.js`, network-first) caches the shell
   (`FILES` list, bumped `VERSION`) so the app works offline.
5. **No build step**, no `package.json`, no frameworks, no
   bundlers, no CDN JS. The repo root is the deploy output.

### 10.1 The standalone-page shape

This is the pattern every hidden route and every public route
follows. The shape is identical across the suite; only the
contents change.

#### 10.1.1 The five-folder skeleton

Every app exposes the same five folders:

```
<app>/
  index.html              # Public entry point (the activity)
  app.js                  # Logic
  data.js                 # Locale-neutral layouts + per-locale content
  strings.es.js           # Spanish UI text (source of truth)
  strings.en.js           # English UI text
  styles.css              # App-specific styles
  assets/
    css/{tokens,base,components}.css
    fonts/                # Self-hosted Atkinson Hyperlegible + Nunito
    img/                  # App icon + decorative imagery
    js/{utils,i18n,tts,storage,feedback}.js
  about/                  # Hidden route: presentation
    index.html
    styles.css
    strings.es.js
    strings.en.js
  team/                   # Hidden route: who builds it
    index.html
    styles.css
    strings.es.js
    strings.en.js
  legal/                  # Data-protection page (linked from the footer)
    index.html
    styles.css
    strings.es.js
    strings.en.js
  config/                 # Settings (only on apps that need it)
    index.html
    app.js
    styles.css
    strings.es.js
    strings.en.js
  manifest.json
  sw.js
  _headers
  404.html
  robots.txt
  sitemap.xml
```

Single-activity apps (Teclatlon, Okeymoney) put `index.html` at
the repo root. Multi-activity apps (Apptonomia, Calculia) put
`tools/<slug>/index.html` per activity and a `site/index.html`
landing page; the four hidden folders live at the repo root.

#### 10.1.2 The HTML shell of a standalone page

Every standalone page opens with the same boilerplate. Below,
the **template**; deviations are called out where they apply.

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="pageTitle">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Memofun â€” Sobre este proyecto</title>
  <!-- Hidden route: not linked from the main menu and should not be
       indexed. Aimed at anyone who wants to know what Teclatlon is:
       families, professionals, journalists, funders, contributors. -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="â€¦">
  <meta name="theme-color" content="#FAF7F2">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container {legal|about}">
    <header class="cabecera-{legal|about}">
      <div class="idioma-selector" role="group" aria-label="Elegir idioma">
        <button type="button" class="btn-idioma" id="btnIdiomaEs"
                data-locale="es" aria-pressed="false">ðŸ‡ªðŸ‡¸ EspaÃ±ol</button>
        <button type="button" class="btn-idioma" id="btnIdiomaEn"
                data-locale="en" aria-pressed="false">ðŸ‡¬ðŸ‡§ English</button>
      </div>
      <img src="../assets/img/icono.svg" alt="" width="80" height="80"
           class="logo-{legal|about}">
      <h1>â€¦</h1>
      <p class="lema" data-i18n="tagline">â€¦</p>
      <p class="entradilla" data-i18n="lead">â€¦</p>
      <nav class="indice">â€¦optional, only on long pagesâ€¦</nav>
    </header>

    <main class="pila">
      <section class="card">â€¦</section>
    </main>

    <footer class="pie-{legal|about}">
      <a class="btn btn-secundario" href="../"
         data-i18n="footerActivities">Ir a la aplicaciÃ³n</a>
      <a class="btn btn-secundario" href="../legal/"
         data-i18n="footerDataProtection">ProtecciÃ³n de datos</a>
      <a class="btn btn-secundario" href="../about/"
         data-i18n="footerAbout">Sobre este proyecto</a>
      <a class="btn btn-secundario" href="../team/"
         data-i18n="footerTeamGuide">QuiÃ©nes la hacen</a>
      <a class="btn btn-secundario" href="../config/"
         data-i18n="footerSettings">Ajustes</a>
    </footer>
  </div>

  <script src="../assets/js/utils.js"></script>
  <script src="../assets/js/i18n.js"></script>
  <script src="strings.es.js"></script>
  <script src="strings.en.js"></script>
  <script>
    (function () {
      'use strict';
      function paintLanguageSelector() {
        var active = App.i18n.locale();
        document.getElementById('btnIdiomaEs')
          .setAttribute('aria-pressed', String(active === 'es'));
        document.getElementById('btnIdiomaEn')
          .setAttribute('aria-pressed', String(active === 'en'));
      }
      document.getElementById('btnIdiomaEs')
        .addEventListener('click', function () { App.i18n.setLocale('es'); });
      document.getElementById('btnIdiomaEn')
        .addEventListener('click', function () { App.i18n.setLocale('en'); });
      paintLanguageSelector();
    })();
  </script>
  <script>
    /* Register the SW from this entry point so it is active for any
       later navigation, matching what the main index.html and the
       other standalone pages already do. */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js').catch(function () {});
    }
  </script>
</body>
</html>
```

**Notes:**

- `data-i18n-title="pageTitle"` on `<html>` lets `assets/js/i18n.js`
  fill `document.title` during `init()`. The hardcoded `<title>`
  is the fallback the browser tab would show before i18n.js
  executes (and the SW cache fallback).
- The page's own class on the `<div class="container â€¦">` wrapper
  is what the page-specific `styles.css` scopes its rules under
  (`legal-page`, `about-page`, `team-page`). No more `.sp-*`
  ancestor prefixes (those were a SPA-merge leftover, retired in
  2026-09; see `git log`).
- The footer is **always** the same five links (in the same
  order) on `about/`, `team/` and `legal/`. `config/` gets a
  stripped footer that only returns to the SPA. The app root
  (`index.html`) does **not** render this footer (it has its own
  footer with the reset button and the data-protection link â€”
  see §2 above).

#### 10.1.3 The strings pair

Each standalone folder ships its own `strings.es.js` /
`strings.en.js`. They follow the **flat-key, IIFE-register**
pattern; `scripts/check.js` extracts the dictionary via
`vm.createContext` with a stub `App.i18n.register` and enforces
key parity between locales.

```javascript
/* legal/strings.es.js â€” page text (ES). */
(function () {
  'use strict';
  App.i18n.register({
    pageTitle: 'ProtecciÃ³n de datos',
    pageDescription: 'Teclatlon: quÃ© datos guarda, dÃ³nde y por quÃ©. â€¦',
    routeNotice: 'Esta pÃ¡gina no se enlaza desde la aplicaciÃ³n. â€¦',
    tagline: 'Sin registro. Sin cookies. Sin analÃ­tica.',
    lead: 'Teclatlon no pide tus datos personales. â€¦',
    navResponsible: 'QuiÃ©n trata tus datos',
    navData: 'QuÃ© guardamos',
    /* â€¦more keysâ€¦ */
    footerActivities: 'Ir a la aplicaciÃ³n',
    footerAbout: 'Sobre este proyecto',
    footerTeamGuide: 'QuiÃ©nes la hacen',
    footerSettings: 'Ajustes'
  }, 'es');
})();
```

Keys are flat (no `legal.pageTitle` style namespacing); the page
**is** the namespace, because the file lives in its own folder.
Common keys (`core.back`, `core.listen`, `core.dataProtection`)
already ship in `assets/js/i18n.js` and are not redefined here.

#### 10.1.4 The standalone stylesheet

Each standalone folder ships its own `styles.css`. It is **the
old `assets/css/subpages.css` split per page**, with the
`.sp-legal` / `.sp-about` ancestor prefixes dropped (they were
a SPA-merge leftover). The page wrapper class
(`<div class="legal-page">`, `<div class="about-page">`, etc.)
is what the CSS scopes under:

```css
.legal-page { max-width: 880px; }
.legal-page .cabecera-legal { â€¦ }
.legal-page .indice a { â€¦ }
.legal-page section { â€¦ }
```

Do **not** introduce per-page classnames that collide with the
shared components (`base.css` already defines `.cabecera`,
`.lema`, `.indice`, `.btn`, `.card`, `.pila`, â€¦). When the
standalone page needs a different look, scope the rule under
the page class â€” never under a generic `.cabecera` or `.indice`.

### 10.2 The shared core

Every app of the suite ships the same six files under
`assets/js/`, in the same load order, with the same exported
shape. Trimming is allowed; **adding** functionality back is
forbidden unless it serves a concrete need (the trimming notes
in §2.1 above are the canonical rationale).

| Module | Surface | Required by |
|---|---|---|
| `utils.js` | `App.utils.shuffle / $ / $$ / reducedMotion / wakeLock` | every page |
| `i18n.js` | `App.i18n.{locale, setLocale, lang, register, t, pick, apply, SUPPORTED, DEFAULT_LOCALE, LABEL, FLAG}` | every page |
| `tts.js` | `App.tts.speak` | only pages that read aloud (most do) |
| `storage.js` | `App.storage.{get, set, remove}` | only pages that read or write `localStorage` (`index.html`, `config/`) |
| `feedback.js` | `App.feedback.{success, encourage, celebrate}` | only the activity's `app.js` |

The load order is `utils.js â†’ i18n.js â†’ tts.js â†’ storage.js â†’
feedback.js â†’ strings.<locale>.js â†’ data.js â†’ app.js`. `i18n.js`
must load **before** `tts.js` and `feedback.js`, which read the
active language.

Both `strings.es.js` and `strings.en.js` always load (they're
not gated by `locale`); `App.i18n.locale()` decides which one
is active. The locale picks itself from
`localStorage['teclatlon:locale']` first, then
`navigator.language` (`'es'` fallback).

### 10.3 The PWA contract

The service worker is **network-first, cache-fallback**, declared
in `sw.js` and committed next to `manifest.json`. The contract:

```javascript
var VERSION = 'teclatlon-vN';
var FILES = [
  './index.html',
  './404.html',
  './manifest.json',
  './app.js',
  './data.js',
  './strings.es.js',
  './strings.en.js',
  './styles.css',
  /* one entry per file in the app shell, including every
     standalone page's index.html, styles.css and
     strings.<locale>.js pair */
  './legal/index.html',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  /* â€¦about/, team/, config/ likewiseâ€¦ */
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/fonts/â€¦woff2',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/img/icono.svg'
];
```

Two rules govern changes to `FILES`:

1. **New file â†’ add it to `FILES`.** The `install` handler
   puts each file individually (never `cache.addAll`, which
   aborts on the first failure and bricks the cache for
   everyone).
2. **Any change to a cached file â†’ bump `VERSION`**
   (`'teclatlon-vN'` â†’ `'teclatlon-vN+1'`). Without the bump,
   an offline user is stuck on the old version forever,
   because the `activate` handler only purges caches with a
   different name.

`scripts/check-version-bump.js` enforces (2): it
`git show HEAD:sw.js` to see what `VERSION` was at the last
commit, compares against the current `VERSION`, and checks
that `FILES` and the diff against HEAD agree. If they don't,
the script fails and the `cache-bump` CI job fails too.

Every standalone page also runs
`navigator.serviceWorker.register('../sw.js')` from its inline
script, so a direct visit to `/legal/`, `/about/` or `/team/`
primes the SW for the SPA root the same way `index.html` does.

### 10.4 i18n invariants

These are non-negotiable across the suite. A locale change is
incomplete until **every** file in this list is updated:

1. `assets/js/i18n.js#SUPPORTED` and `#DEFAULT_LOCALE`.
2. `assets/js/i18n.js#BCP47` mapping (for `speechSynthesis`
   voice selection).
3. The pre-paint detector in `index.html` (the inline
   `<script>` that picks the locale before first paint â€” see
   §2.5 above).
4. `strings.<locale>.js` and every per-folder
   `strings.<locale>.js` pair (`legal/`, `about/`, `team/`,
   `config/`).
5. `data.js`: every locale-split array
   (`DATA.lessons.<locale>`, `DATA.words.<locale>`,
   `DATA.templates.<locale>`, `DATA.numpadSteps.<locale>`).
6. `sw.js`: add the new `strings.<locale>.js` files to
   `FILES` and bump `VERSION`.
7. `scripts/check.js`: the parity check works in N locales
   with no code change (it picks up every
   `strings.<locale>.js` pair via `fs.readdirSync`); confirm
   the script still passes after the locale is added.

The full step-by-step recipe (with example code) is in
[`I18N.md`](I18N.md).

### 10.5 What is **forbidden** (across the suite)

These are anti-patterns observed at some point and explicitly
retired; the commit history is the source of truth for each
retirement. The rule is "if you find yourself reaching for one
of these, stop and re-read this section".

- **No SPA / no `pushState` / no `view-*` sections.** Every
  page is its own URL. Do not merge `legal/`, `about/`,
  `team/` into `index.html` as hidden sections, even with a
  redirect shim. This was tried in 2026-09 (`spa: merge`) and
  reverted in the same release; see `git log` for the lessons
  learned. Navigation between pages must always be a real
  `<a>` click, and every hidden route must be one click away
  from any other via the shared footer.
- **No `App.goLegal` / `App.goAbout` / `view-legal` /
  `view-about` / `sp-legal` / `sp-about` / `sp-idioma` /
  `subpages.css`.** These all belong to the retired SPA-merge
  model.
- **No `_redirects` SPA catch-all.** Cloudflare rejects it
  as a loop; documented in `CLOUDFLARE.md` and in the deploy
  recipe.
- **No `data-app-blocked="mobile"` flash.** The pre-paint
  script is a single inline `<script>` in `<head>`; do not
  split it into a separate `.js` (CSP `script-src 'self'`
  would still allow it, but the synchronous timing guarantee
  only holds for inline scripts in the head).
- **No `package.json`, no `node_modules`.** The repo is the
  build output. A package manifest would force Cloudflare to
  run `npm install` on every build, overshooting the 25 MiB
  asset limit.
- **No JS CDNs.** All fonts, icons and JS ship in `assets/`.
- **No ES module imports** (`<script type="module">`). The
  app must work from `file://` for offline use; ES modules
  break that.
- **No real-time database, no login, no cookies, no
  analytics.** Persistence is `localStorage` only.
- **No tappable on-screen keyboard** in apps that target the
  physical computer keyboard (Teclatlon, Okeymoney's typed
  amounts, Sinonimia's typed words). The on-screen keyboard
  is decorative only.

### 10.6 Validation checklist

Run this on every PR that touches any of the surface files
(`*.html`, `*.js`, `*.css`, `sw.js`, `manifest.json`, `data.js`):

```bash
node scripts/check.js           # must report OK (N checks, no failures)
node scripts/check-version-bump.js   # must pass
```

Then open the affected pages in a browser at
`http://localhost:<port>/<route>` and walk through the manual
smoke:

- `index.html` boots into the name screen or the menu depending
  on saved state; `localStorage` roundtrip works; the "ðŸ—‘ï¸
  Borrar mi progreso" button resets both the data and the UI.
- `/legal/` loads with the localized h1, tagline and footer;
  the language switcher toggles `lang`, `document.title` and
  every `data-i18n` text without a stale flash.
- `/about/` and `/team/` likewise; their footer links navigate
  to each other and to `/legal/` and `/config/` without reloads
  before the SW primes.
- `/config/` lists the saved state and its two reset buttons
  work (two-step confirm).
- Refresh once after first load and verify
  `navigator.serviceWorker.controller` is non-null.

If any of the above fails, the change does not match the suite
pattern and must be revised before landing.

### 10.7 Cross-repo differences (what this section does **not** cover)

Every app is a single-activity variant of the pattern above.
The per-app differences â€” what is shared with the suite, what
is trimmed, and what is intentionally different â€” are
documented in each repo's `technical.md` § "Other apps of the
suite: real differences" (the project-specific delta). Use
that section to decide whether a deviation in one repo is
intentional before copying it to another.

This canonical section lives in **every repo's**
`technical.md` / `tecnico.md`, kept in sync. If you change it
in one repo, mirror it across the others in the same PR.

### 10.8 See also

- §2 above â€” Teclatlon-specific recipes and contracts that
  build on this pattern.
- [`I18N.md`](I18N.md) â€” how to add a new language while keeping
  the i18n invariants intact.
- [`CLOUDFLARE.md`](../../CLOUDFLARE.md) â€” deploy and SW/header
  contracts at the Cloudflare Workers level.
- [`SPEC.md`](SPEC.md) §"Mandatory rule" â€” the accessibility and
  no-clinical-mention invariants every page must respect.

---


