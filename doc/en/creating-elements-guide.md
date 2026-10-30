# Guide to creating activities / decks

> **How to design and build a new deck in Memofun.**
>
> Memofun's "activities" are **decks** — JSON files describing a
> sequence of cards. There is exactly **one render activity**
> (`tools/study/`) that knows how to play any well-formed deck; the
> pedagogical work happens when you write the deck itself.
>
> This document does **not** duplicate the canonical pedagogical
> guide shared by the suite; it points to it and only lists what's
> specific to Memofun. If a rule here clashes with the canonical
> guide or with `technical.md`, `technical.md` wins.

---

## 1. The canonical pedagogical guide

The full didactic, gamification, persuasion and neuromarketing
techniques that all the apps of the Miralante suite share live in the
**Routime** repository under
[`creating-elements-guide.md`](https://github.com/thenkdframe/routime/blob/main/doc/en/creating-elements-guide.md).

Read it before designing anything. It covers (non-exhaustive):

- The 13 mandatory accessibility rules (with the rationale for each).
- The Socratic-method hint ladder (clue → bigger clue → answer).
- The positive-feedback palette (sounds, animations, micro-copy).
- The neuromarketing patterns adapted to the audience.
- The level-design checklist (Easy → Medium → Hard progression).

## 2. What's specific to Memofun (decks, not activities)

### 2.1 One activity, many decks

Don't create a new folder under `tools/` for each topic. Create a
deck JSON file under `tools/study/<course>/<level>/<topic>.json` and
let the existing `tools/study/` activity render it. New "activity"
folders should only appear for genuinely new gameplay (a quiz mode,
a timed game, etc.) and must be discussed with the build role
before being added.

### 2.2 The "front is a clue" rule

The front of a card is **never** "What is the definition of X?". It
is always a clue that anchors the concept in something the learner
already knows: an everyday analogy, a concrete example, or a
"why-it-matters". The card asks the learner to **recall** the
concept, not to **recite** it.

This is part of the product's "meaningful learning" rule (see
[`SPEC.md`](SPEC.md) §1). A card that fails this rule is rejected
at review time, no matter how accurate the back is.

### 2.3 The anchor: the word that brings the term back

A clue only works if the learner can get **from the clue back to the
term**. So the front has to carry an **anchor**: a word that points at
the answer term through its root or a close synonym.

| Answer | Anchor on the front | How it works |
| --- | --- | --- |
| Organización funcional | "it is organised by **functions**" | same root |
| Organización mixta | "a **mixture** of the hierarchical and the functional one" | synonym |
| Planificación | "the company draws up a **plan**" | same root |
| Sector terciario | "**the third** of the three" | order |
| Microempresa | "**tiny size**" | prefix |

Rules for the anchor:

- **It is a clue, not the answer.** The anchor may be the root or a
  synonym of the term, but **never the term itself**: if the front
  already says "mixta", the card has nothing left to ask. The other
  way round, if the front says "job" for "empleo", the learner has to
  translate.
- **The anchor goes on the front, not only inside the `<mark>`
  analogy.** The analogy is a visual clue; the anchor is the word that
  brings the term back.
- **A verb anchors its noun.** "the company **organises** the work"
  anchors "Organización"; "the boss **directs** the team" anchors
  "Dirección". It is the very word the learner will use afterwards.
- **A two-part answer needs an anchor per part.** "Elementos
  materiales y humanos" anchors with "means" (materiales) and "people"
  (humanos); "Dirigir, controlar y supervisar", with "sets the
  course", "keeps an eye" and "reviews the results".
- **On a classification card, the anchor is the position or the
  criterion**: "the first of the three", "right in the middle", "its
  size is enormous".

How it is checked: `node scripts/audit-deck-anchors.js decks/<course>`
flags the cards with no anchor (rule R4) and the ones that give the
answer away (rule R3). The detector is only a starting point — its
synonym map covers the vocabulary of the course under review, and every
case has to be confirmed by hand.

### 2.4 Repetition with variation

A key concept can — and should — reappear across more than one
card and more than one deck for the same topic/course. Sometimes
literally (nearly the same question, to consolidate memory);
sometimes varied (the same idea with a different example or angle).
Review doesn't discard a card just for resembling another — it
discards a card that repeats without adding any new nuance,
example, or context.

### 2.5 Course and level conventions

Decks live in `tools/study/<locale>/<course>/<level>/<topic>.json`.
Adding a new course (a new syllabus) or a new level (a new school
year) follows the existing folder naming; see
[`activities.md`](activities.md) §2 for the courses currently shipped.

### 2.6 The card image shows the clue, not the concept

When a card carries an image, the image **illustrates the clue** —the
analogy or example marked on the front— not the concept the learner
has to recall. If the clue says "it is like a skyscraper", the photo
is a skyscraper; if it says "it is like a kiosk on the corner", the
photo is a kiosk on a corner. Showing the concept (an office block
for "medium-sized company") just repeats what the front already says
in words and helps nobody recall it.

Two traps that have already cost images:

- **A PDF's thumbnail is the cover of the document, not its content.**
  Searching Wikimedia for "planets" often returns scanned documents;
  their thumbnail is the cover (a title, a seal, some text) and it
  illustrates nothing. Discard by hand every candidate whose
  `source` ends in `.pdf`, `.tif` or `.djvu`.
- **The source description may not describe the image.** On Commons a
  file can come with a description page about something else (the
  page for a six-storey building with a photo of its doorway). The
  `alt` has to describe what the image really shows, and that is
  only verified by looking at the image.

So the image is always looked at before it is accepted: existing,
weighing little and staying under 200 KB does not mean it illustrates
the card. And because the thumbnail is small on screen (140 px),
composition matters: a subject legible at that size (a whole
skyscraper, a sign, a facade), not a scene nobody can read.

## 3. The technical recipe

The deck JSON schema, the validation rules and the publishing
checklist are described in [`technical.md`](technical.md) §6. The
support-role workflow with an AI assistant that has repo access is
in [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md);
with a chat-only AI, in
[`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md).

## 4. Compliance checklist before opening a PR

- [ ] Deck JSON file created under the right course / level folder.
- [ ] Every card front is a **clue**, not a definition to recite.
- [ ] Every card back is **one sentence** in easy-read vocabulary.
- [ ] Every card front carries an **anchor**: a word that brings the
      answer term back (root or synonym) without spelling the term out
      (§2.3).
- [ ] Repetition, when present, adds a new nuance or example.
- [ ] Card count is realistic for a single session (target 8–15
      cards per deck for the first publication; longer decks can be
      split).
- [ ] Every image shows **the clue** of its card (the marked
      analogy), has been **looked at** before being accepted, and its
      `alt` describes what is really in it.
- [ ] Deck reviewed aloud with a learner (or someone playing the
      learner) before publishing.
- [ ] `node scripts/check.js` passes.
- [ ] Service worker cache `VERSION` bumped in `sw.js` if the new
      deck file should be available offline (default: yes).

## 5. See also

- Canonical pedagogical guide (Routime):
  [creating-elements-guide.md](https://github.com/thenkdframe/routime/blob/main/doc/en/creating-elements-guide.md).
- Internal AI-assisted deck creation:
  [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md).
- Chat AI-assisted deck creation:
  [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md).
- Technical recipe: [`technical.md`](technical.md) §6.
- Product non-negotiables: [`SPEC.md`](SPEC.md).
- Deck catalogue: [`activities.md`](activities.md).
