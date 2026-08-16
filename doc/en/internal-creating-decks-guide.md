# Guide to creating decks (content ingestion)

> **Internal project documentation**: describes the workflow for
> generating content *inside the Memofun repository itself* — it's not
> a feature of the app, and the end user never sees or uses any of
> this. It's for the **support** role (family, teacher) who already
> has **the Memofun repository open with an AI coding agent that has
> access to it** (Claude Code or similar): how to request a new deck,
> step by step. **Nothing to install, no API key of any kind**: the
> content is written directly by that agent. For the architecture
> summary instead of the walkthrough, see [`technical.md`](technical.md)
> §8.

> 💡 **Looking for a ready-made syllabus?** [`doc/curriculum/es/`](../curriculum/es/)
> has ready outlines for Primaria (grades 1-6), ESO (grades 1-4), and
> the Gestión Administrativa mid-level vocational track. You can just
> ask "generate the deck for `doc/curriculum/es/primaria/3/lengua-castellana.md`"
> without writing anything else. See
> [`doc/curriculum/es/README.md`](../curriculum/es/README.md).

> 🤖 **No AI agent with access to this repository?** If all you have is
> a standalone AI chat (ChatGPT, Claude.ai, Gemini…), use
> [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md) instead — same rules,
> with one extra step to bring the result into the repository. Not
> sure which case is yours? Start with
> [`ai-creating-decks-guide.md`](ai-creating-decks-guide.md).

---

## 1. What you need

Nothing to install, no account to create. Just open this project in an
IDE with an AI coding agent (e.g. Claude Code) and ask for the deck.
The agent reads and writes files directly in the repository.

## 2. The ingestion point: a topic, or a topic with an outline

You can ask for a deck in two ways:

**Simple mode** — just the topic:

> "Generate a Memofun deck about the circulatory system, intermediate
> level, 15 cards."

The agent picks the most relevant subtopics on its own, to cover that
topic at the requested level.

**Outline mode** — if you already have a syllabus and want the deck to
follow it point by point, describe it (or paste the list) and ask the
deck to cover exactly those points:

> "Generate a Memofun deck for 'Docker and Containers', intermediate
> level, 10 cards, covering these points: what's an image vs. a
> container; Dockerfile; volumes; Docker networking; deploying to a
> Linux server."

You can also first write a `config.md` file in that format
(frontmatter + `# Índice` — see the example at the repo root or in
`doc/curriculum/`) and ask "generate the deck from this file" — it's
the exact same format as before, just read by the agent instead of a
script.

### `config.md` fields (if you use one)

| Field | Required | What it is | Default |
|---|---|---|---|
| `tema` | Yes | The deck's topic, in a few words. | — |
| `nivel` | No | `principiante`, `intermedio`, or `avanzado`. | `intermedio` |
| `cantidad` | No | How many cards to generate. | `10` |
| `salida` | No | Output `.json` filename. | derived from `tema` |
| `idioma` | No | The deck content's language (not the UI's). | `es` |
| `# Índice` | No | Bullet list of subtopics to cover. | the agent picks them |

## 3. What the agent does

When you ask for a deck, the agent:

1. Writes the `cantidad` cards following the rules in `CLAUDE.md` →
   "Generating deck content" — meaningful learning (an analogy, a
   practical example, or "why it matters"), Easy Read, a warm and fun
   tone, a curious fact where it fits, and full coverage of the
   outline if you gave it one. If the topic has an underlying
   mechanic or rule (a procedure, a notation, a formula — e.g. how
   Roman numerals combine before drilling calculations with them), the
   deck opens with a few lesson cards that teach that mechanic first.
2. Writes `decks/<salida>.json` directly. If this deck extends an
   existing series (e.g. adding `literatura_3` next to
   `literatura`/`literatura_2`), it reads the short log at
   `decks/concepts/<base-slug>.md` first — instead of every sibling
   deck's full JSON — to see what's already covered and how, so
   repeats stay purposeful without re-reading the whole series each
   time. It then updates that log with what the new deck added.
3. Adds the matching entry to `decks/manifest.json` — if you asked for
   the deck from a `doc/curriculum/` file, this also includes `curso`
   and `asignatura`, so the home screen groups it under that course
   instead of listing it loose (see `technical.md` §4.1). You can pin
   a course as a shortcut from the subjects screen: it's saved to your
   `localStorage`, on your device only.
4. Tells you what it generated and where, and flags if extra human
   review is worth doing (e.g. for very technical or sensitive topics).

## 4. Reviewing before considering the deck published

Even though the agent applies the rules while writing, it's still
worth a look before considering the deck published — same idea as
reviewing any content before a test. Check:

- [ ] **Easy read**: short sentences, one idea per sentence.
- [ ] **Conceptual density**: at most one new concept per card,
      anchored in something concrete — not several names or
      abstractions in a row with no example (topics like literary
      movements or historical periods are the usual offenders here).
- [ ] **No clinical language**: nothing like "disability", "patient", etc.
- [ ] **Warm, fun tone**: like someone sharing something interesting
      with a friend — never sarcasm, irony, or double meanings
      (`SPEC.md` §2.5).
- [ ] **A curious fact** where the topic lends itself to one.
- [ ] **Repetition with purpose**: repeating a key concept (verbatim
      or with variation, even across decks for the same topic/course)
      is fine and shores up learning — what gets discarded is a card
      that repeats without adding any new nuance, example, or context
      (`SPEC.md` §1.3).
- [ ] **Faithful to the syllabus**: when a reference syllabus exists
      (`doc/curriculum/`, a `# Índice`, the official curriculum), the
      deck sticks to those exact points instead of drifting into
      adjacent topics not actually taught in that course (`SPEC.md`
      §1.3).
- [ ] If you asked for an outline: **every point is covered**.

If something's off, ask the agent to rewrite that card, or edit the
`.json` directly (it's plain text).

## 5. Checking everything fits together

```
node scripts/check.js
```

Validates, among other things, that `decks/manifest.json` points to
real files with cards, and that no file under `doc/curriculum/` is
malformed. It doesn't review content quality — that's still a person's
job (or the agent's, applying the checklist in step 4).

## 6. Publishing the deck

If the agent already added the entry to `decks/manifest.json`, there's
nothing left to do: open `index.html` and the deck already shows up on
the home grid.

---

## 7. Cross-references

- `CLAUDE.md` → "Generating deck content" — the full ruleset the agent
  follows when writing cards.
- [`technical.md`](technical.md) §3 — a deck's JSON format.
- [`technical.md`](technical.md) §8 — how content ingestion works internally.
- [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md) — the same task, but with a generic AI chat that has no access to the repository.
- [`SPEC.md`](SPEC.md) §1.3 — why purposeful repetition and syllabus fidelity shore up meaningful learning.
- [`SPEC.md`](SPEC.md) §2.1 — why there's no generative AI in the product.
- [`SPEC.md`](SPEC.md) §2.5 — why the fun tone and curious facts.
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) — how to open a PR with the new deck.

🌐 Versión en español: [`../es/guia-interna-crear-barajas.md`](../es/guia-interna-crear-barajas.md)
