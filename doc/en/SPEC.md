# SPEC.md — Product definition

> **This document defines WHAT Memofun is, WHO it's for, and why.**
> For the HOW (architecture, files, accessibility rules), see
> [`technical.md`](technical.md).

---

## 1. Product

Memofun is a **flashcard study app** built around **meaningful
learning**: every card explains a concept through an everyday analogy,
a concrete example, or "why it matters" — never a dictionary
definition. It is meant to let a person with an intellectual
disability review a topic **autonomously**.

### 1.1 What it is and isn't

**It is:**
- A tool for autonomous review between sessions or classes.
- A complement to work with a teacher or family member, who prepares
  the content ahead of time.
- An installable PWA, usable with no technical knowledge.

**It is not:**
- A chatbot or a tool with built-in generative AI. See §2.1.
- A clinical assessment system.
- A personal-data record.

### 1.2 Target audience

- **End user** (with an intellectual disability): reviews decks that
  have already been prepared, autonomously.
- **Support** (family, teacher): asks the project's AI agent to
  prepare each deck (from a topic or from `doc/curriculum/`) and
  reviews the content before publishing it.
- **Build** (developer): maintains the code.

See [`roles.md`](roles.md) for the detail of each role.

### 1.3 Reinforcement: repetition and syllabus fidelity

Meaningful learning (§1) isn't just "explain it well once." It's
shored up by two deliberate mechanisms in how decks are designed:

- **Repetition, both pure and with variation**: a key concept in a
  topic (a definition, a date, an author) can — and should — reappear
  across more than one card and more than one deck for the same
  topic/course. Sometimes literally (nearly the same question, to
  consolidate memory); sometimes varied (the same idea with a
  different example or angle, to build several connections to the
  same idea). This is not a design flaw or "redundant filler" — it's
  reinforcement through repetition, a real learning technique. Review
  (`internal-creating-decks-guide.md` §4) doesn't discard a card just for
  resembling another — it discards a card that repeats without adding
  any new nuance, example, or context.
- **Syllabus fidelity**: when a reference syllabus exists (a
  `doc/curriculum/**/*.md` file, a `# Índice` in a `config.md`, or
  the subject/course's official curriculum), decks stick to those
  exact points instead of drifting into adjacent topics that "sound
  nice" but aren't actually part of what's taught in that course.
  Sticking to the real syllabus is itself a way to shore up meaningful
  learning: the content matches what the learner actually needs to
  review.

See "Generating deck content" in `CLAUDE.md` for how this applies when
writing or extending a deck.

---

## 2. Non-negotiable constraints

These constraints come from the product, not from technical limits.

### 2.1 No generative AI in the product

**Memofun ships no chatbot, no live content generation, and no
integration with any AI API — anywhere in the code.** Deck content is
written directly by the AI coding agent (Claude Code or similar) that
builds and maintains this repository, as part of the support/build
role (see `roles.md`) — never live, never from the studying person's
browser. Why:

- **Determinism and accessibility**: a person with an intellectual
  disability needs a predictable interface; generative AI invoked live
  isn't one (different answers each time, risk of unreviewed content).
- **No cost, no account, no API key — not even in the repo**: the
  project handles no API key anywhere. Asking the student for one (or
  needing one to deploy the site) contradicts "free, frictionless, no
  technical barriers".
- **Reviewed before publishing**: everything that lands in `decks/` is
  reviewed (by whoever asked for it, or by the agent that wrote it)
  before it's added to `decks/manifest.json` — see
  `internal-creating-decks-guide.md` §4.

This decision has evolved twice, always in the same direction — less
AI surface in the product, not more:

1. An early version had a form where the end user pasted their own
   Gemini API key into the browser. It was removed to align the
   project with the rest of the family (Apptonomia, Calculia,
   Okeymoney, Sinonimia, Teclatlon), which share the "no generative AI
   in the product" rule.
2. A later version had `scripts/generate.js`, an offline build tool
   that *did* call the Gemini REST API (with a developer's key, never
   the user's). That was removed too: content is now written directly
   by the AI agent working in this repository, with no call to any
   external API anywhere in the project — see "Generating deck
   content" in `CLAUDE.md`.

### 2.2 Reviewing never punishes

- Stars and progress are never subtracted.
- There is no "right/wrong" grading card by card — review is free,
  untimed, unlimited passes.
- Finishing a full pass through a deck adds 1 ⭐, never removes one.

### 2.3 No time pressure

No visible timers. The person sets the pace.

### 2.4 Always Easy Read

- Short sentences, one idea per sentence, everyday vocabulary.
- No clinical language in the UI or on the cards ("patient",
  "disability", etc. — see the matching rule in "Generating deck
  content" in `CLAUDE.md`).
- Easy Read isn't only sentence-level: it also means controlling how
  many new ideas arrive at once. At most one new named/abstract
  concept per card, each anchored in a concrete everyday image before
  it's named — never a bare comparison between two abstractions the
  reader hasn't each met concretely first. Content with many names in
  a row (literary movements, historical periods) needs more, smaller
  cards, not compression — see "Generating deck content" in
  `CLAUDE.md`.

### 2.5 Fun tone and curious facts

Learning should feel like a treat, not an obligation. Every card is
written like someone sharing something interesting with a friend, not
like a manual:

- **Warm tone, with a bit of wit**: charming comparisons, picturesque
  detail, gentle humor. Never sarcasm, irony, wordplay, or double
  meanings — those clash with Easy Read (§2.4): a literal reader needs
  the text to mean exactly what it says.
- **Curious facts**: whenever it fits naturally with the topic, the
  answer adds a surprising or picturesque "did you know?" to better
  anchor the meaningful learning and make it memorable. Never forced
  when the topic doesn't lend itself to one, and never at the cost of
  clarity.
- This applies when the content is written (a mandatory rule for the
  AI agent — see "Generating deck content" in `CLAUDE.md`) and during
  review before publishing: a flat, exam-like card gets rewritten, not
  published as-is.

### 2.6 Privacy by default

- No sign-up, no accounts, no tracking cookies, no analytics.
- **Local progress contract**: `localStorage` only holds `estrellas`
  (integer, only added to) and `completado` (which decks have been
  reviewed at least once). Failures, time taken, attempt counts, or
  anything identifying are never saved. Progress never leaves the
  device.

### 2.7 Universal accessibility

- Buttons ≥ 64×64 px, gap ≥ 16 px.
- WCAG AA minimum contrast, light theme by default.
- Large type (20 px base), Atkinson Hyperlegible / Nunito.
- Audio (🔊, Web Speech API) only on demand, never automatic.
- Full keyboard navigation, `prefers-reduced-motion` respected.
- At most 3 screens in the main flow: home → deck → card. Decks
  grouped by course/subject add one optional level (courses →
  subjects → deck → card) — see `technical.md` §4.1.

### 2.8 Autonomy

Works offline (installable PWA), no login, no cost.

### 2.9 Vanilla, no dependencies

The whole project — public site and `scripts/` tooling — is **vanilla
HTML, CSS, and JavaScript**. No frameworks, no build step, no
third-party packages (no npm, no pip in earlier versions). Decks
use **our own JSON format** (see `technical.md` §3), not Anki's
`.apkg` — that dependency was dropped specifically to avoid needing
Python, or a SQLite/ZIP-reading library in the browser. Fewer moving
parts, smaller attack surface, easier for anyone who knows HTML/CSS/JS
to maintain.

---

## 3. Flow separation

| Area | For whom | What it allows |
|---|---|---|
| `index.html` (home) | End user | Pick an already-prepared deck. Nothing else. |
| `tools/study/` | End user | Review the chosen deck, card by card. |
| `settings/` | Support | Text size, language, importing your own deck `.json` to review without publishing it, clearing local progress. |
| Project AI agent | Support / build | Write a new deck's content from a topic or from `doc/curriculum/`, following "Generating deck content" (`CLAUDE.md`), for review before publishing. |

---

## 4. Success criteria

A change to Memofun succeeds when:

1. The end user can keep using the app unaided for that feature.
2. It meets the accessibility rules in `technical.md`.
3. It introduces no new generative AI, accounts, cost, or pressure.
4. It works offline.
5. It adds no new personal-data collection.
6. It keeps ES/EN parity of the interface.
7. New card content follows meaningful learning (analogy / example /
   why it matters) and Easy Read.

---

## 5. What Memofun does NOT do

| NO | Why |
|----|---|
| No chatbot or generative AI in the product | Determinism, accessibility, no cost — see §2.1 |
| Doesn't ask the student for an API key | Same reason — generation is a support-side, offline tool |
| No user account or login | Privacy and simplicity |
| No cloud storage | Privacy and offline-first |
| No ranking or comparisons | No pressure |
| No push notifications | No pressure, no external dependency |
| No ads, no in-app purchases | Free by design |
| Never subtracts stars or progress as punishment | The product only adds (§2.2) |
