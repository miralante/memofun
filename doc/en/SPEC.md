# SPEC.md — Product definition

> **This document defines WHAT Memofun is, WHO it's for, and why.**
> For the HOW (architecture, files, accessibility rules), see
> [`technical.md`](technical.md).

---

## 1. Product

Memofun is a **flashcard study app** built around **meaningful
learning**: every card presents a concept's everyday analogy, concrete
example, or "why it matters" as a clue, then asks the learner to
recall the concept itself — never a dictionary definition recited back
as the answer. The priority is never "explain a lot" — it's getting
the person to (a) understand one concrete idea, (b) recognize it in
another context, (c) recall it with little help. It is meant to let a
person with an intellectual disability review a topic
**autonomously**.

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
  - Concrete metric: **2–4 clue sentences in `pregunta`**, **≤ 12 words
    per sentence**, plus a short closing question. The `<= 12` figure
    comes from the UNE 153101:2018 EX easy-read standard and applies to
    every card — see `CLAUDE.md` §"Generating deck content" for the
    per-level (`principiante` / `intermedio` / `avanzado`) detail.
    `respuesta` is the short concept/term itself (1-6 words), not a
    sentence.
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
  clue in `pregunta` weaves in a surprising or picturesque "did you
  know?" to better anchor the meaningful learning and make it
  memorable. Never forced when the topic doesn't lend itself to one,
  never at the cost of clarity, and never in `respuesta`.
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
- High contrast (WCAG AA minimum, AAA whenever possible), light
  theme by default — see `technical.md` §X for the AAA criteria this
  project honours and why full AAA conformance is not feasible for a
  web app.
- Large type (20 px base), Atkinson Hyperlegible / Nunito.
- Audio (🔊, Web Speech API) only on demand, never automatic.
- Full keyboard navigation, `prefers-reduced-motion` respected.
- At most 3 screens in the main flow: home → deck → card. Decks
  grouped by course/subject add one optional level (courses →
  subjects → deck → card) — see `technical.md` §4.1.

### 2.8 Autonomy

Works offline (installable PWA), no login, no cost.

### 2.9 Simplicity for the learner

The learner needs no technical knowledge, account, key or development tools
to study. The product must be predictable, free and easy to resume. The
architecture that enables this scope is defined in [`technical.md`](technical.md),
not in this product specification.

### 2.10 Public-facing wording: "usuario/a tipo" euphemism

When presenting Memofun to **the general public** (press, talks,
public READMEs that anyone can read, the metaproject landing at
`apptonomia.uk`, social media copy, marketing material), the term
**"intellectual disability" / "discapacidad intelectual"** must not be
used as a way to describe the audience of the app — even when the
surrounding text would otherwise be public. The accepted euphemism for
that audience in those surfaces is **"usuario/a tipo"** (plural
"usuarios/as tipo"), used as a generic profile marker, not as a label
for any real person.

Where the euphemism applies and where it doesn't:

- **Applies** to any text that anyone outside the project can read
  without authentication: `README.md`, `README.es.md`, the portal at
  `apptonomia.uk`, public talks, social media copy, press notes,
  marketing material. In these surfaces, refer to the audience as
  "el/la usuario/a tipo" or "usuarios/as tipo" of the app.
- **Does NOT apply** to this repo's internal documentation
  (`CLAUDE.md`, `doc/en/SPEC.md`, `doc/es/SPEC.md`, `technical.md`,
  `roles.md`, `CONTRIBUTING.md`, `CONTRIBUTING.es.md`) — those files
  are read by maintainers and contributors, and "intellectual
  disability" / "discapacidad intelectual" remains the canonical term
  there, because the project needs an explicit, unambiguous
  explanation of its real objective for whoever maintains it.
- **Does NOT apply** to deck content that names a clinical concept by
  its real-world name (e.g. a card that explains a bureaucratic
  procedure related to disability): that is content, not labelling of
  an audience.
- **Does NOT apply** to the UI of the app itself: §2.4 above
  continues to forbid **any** mention, including "usuario/a tipo", in
  `index.html`, `app.js`, `tools/study/`, `settings/`,
  `strings.<locale>.js`, and any other user-facing surface. The
  euphemism is for the outside world, not for what the visitor reads
  on the site.

Rationale: presenting the project's real objective in maintainer docs
is useful and necessary; presenting it in marketing or landing
surfaces is neither necessary nor respectful of the audience —
"usuario/a tipo" lets public material describe what the app is for
(who the typical profile is) without publicly naming a clinical group.

---

## 3. Persuasive communication in service of learning

Memofun is a review tool, not a consumer product. The motivation to
study a deck must be **intrinsic** — the pleasure of understanding a
concept, the confidence of being able to explain it — never
**extrinsic** or based on pressure. The market patterns that rely on
scarcity, comparison, or fear of losing must never appear anywhere
in the site. This rule is suite-wide and shared with Apptonomia,
Calculia, Okeymoney, Sinonimia, Teclatlon and Routime; the concrete
list is identical across the seven projects so that no pattern
rejected here can sneak in through another one.

### 3.7 The closed list of forbidden patterns

The following patterns are part of the "pressure" Memofun disowns
and **must not** appear anywhere in the site or in any card's
content:

- **Scarcity**: "Only 1 left!", "Last chance", "Hurry", countdown
  timers, decks or cards that disappear.
- **False urgency**: timers, races, "finish quickly", punishing
  slowness. Connects directly to §2.3 "No time pressure" above.
- **Social proof turned into pressure**: leaderboards, ranks,
  "others have already studied this" as social pressure,
  comparisons between end users, global counters like "1,234 people
  have seen this card".
- **Sunk-cost / FOMO**: "you'll lose your progress if you stop",
  "don't lose your streak", forced retention messages, "we miss
  you" notifications. Connects to §2.2 "Reviewing never punishes".
- **Manipulative reciprocity / dark patterns**: forced signups,
  pre-checked boxes, hidden costs, fake alerts, deceptive
  confirmations (a "no" button that actually logs the user out or
  wipes their progress).
- **Exploitative loss aversion**: "you had 5 ⭐, you lost 2". Stars
  and progress **only grow**, never shrink as punishment (see §2.2).

The default tone in Memofun is the **calm and predictable** one
described in §2.3 — the person studies because reviewing is
engaging, not because we are pushing them. When a pattern from this
list shows up in a product or UI proposal, it is rejected by
default; any exception is discussed in a PR with an explicit
rationale.

---

## 4. Flow separation

| Area | For whom | What it allows |
|---|---|---|
| `index.html` (home) | End user | Pick an already-prepared deck. Nothing else. |
| `tools/study/` | End user | Review the chosen deck, card by card. |
| `settings/` | Support | Text size, language, importing your own deck `.json` to review without publishing it, clearing local progress. |
| Project AI agent | Support / build | Write a new deck's content from a topic or from `doc/curriculum/`, following "Generating deck content" (`CLAUDE.md`), for review before publishing. |

---

## 5. Success criteria

A change to Memofun succeeds when:

1. The end user can keep using the app unaided for that feature.
2. It meets the accessibility rules in `technical.md`.
3. It introduces no new generative AI, accounts, cost, or pressure.
4. It works offline.
5. It adds no new personal-data collection.
6. It keeps ES/EN parity of the interface.
7. New card content follows meaningful learning (clue built from an
   analogy / example / why it matters, concept recalled as the short
   answer) and Easy Read.

---

## 6. What Memofun does NOT do

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
| No scarcity, false urgency or FOMO messaging ("only 1 left", "hurry", "don't lose your streak") | Pressure; clashes with §2.3 and the closed list in §3.7 |
| No social-proof pressure (leaderboards, ranks, "others already studied it") | Pressure and discouragement; clashes with §2.2 and §3.7 |
| No dark patterns (forced signups, pre-checked boxes, hidden costs, fake alerts) | Trust and accessibility; clashes with the closed list in §3.7 |
