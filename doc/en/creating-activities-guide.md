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
techniques that all Apptonomia-sibling projects share live in the
**Routime** repository under
[`creating-activities-guide.md`](https://github.com/thenkdframe/routime/blob/main/doc/en/creating-activities-guide.md).

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

### 2.3 Repetition with variation

A key concept can — and should — reappear across more than one
card and more than one deck for the same topic/course. Sometimes
literally (nearly the same question, to consolidate memory);
sometimes varied (the same idea with a different example or angle).
Review doesn't discard a card just for resembling another — it
discards a card that repeats without adding any new nuance,
example, or context.

### 2.4 Course and level conventions

Decks live in `tools/study/<locale>/<course>/<level>/<topic>.json`.
Adding a new course (a new syllabus) or a new level (a new school
year) follows the existing folder naming; see
[`activities.md`](activities.md) §2 for the courses currently shipped.

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
- [ ] Repetition, when present, adds a new nuance or example.
- [ ] Card count is realistic for a single session (target 8–15
      cards per deck for the first publication; longer decks can be
      split).
- [ ] Deck reviewed aloud with a learner (or someone playing the
      learner) before publishing.
- [ ] `node scripts/check.js` passes.
- [ ] Service worker cache `VERSION` bumped in `sw.js` if the new
      deck file should be available offline (default: yes).

## 5. See also

- Canonical pedagogical guide (Routime):
  [creating-activities-guide.md](https://github.com/thenkdframe/routime/blob/main/doc/en/creating-activities-guide.md).
- Internal AI-assisted deck creation:
  [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md).
- Chat AI-assisted deck creation:
  [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md).
- Technical recipe: [`technical.md`](technical.md) §6.
- Product non-negotiables: [`SPEC.md`](SPEC.md).
- Deck catalogue: [`activities.md`](activities.md).
