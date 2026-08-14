# Guide to creating decks (content ingestion)

> This guide is for the **support** role (family, teacher): how to
> request a new deck, step by step. **Nothing to install, no API key
> of any kind**: the content is written directly by the AI coding
> agent (Claude Code or similar) working on this project. For the
> architecture summary instead of the walkthrough, see
> [`technical.md`](technical.md) §8.

> 💡 **Looking for a ready-made syllabus?** [`content-indices/`](../../content-indices/)
> has ready outlines for Primaria (grades 1-6), ESO (grades 1-4), and
> the Gestión Administrativa mid-level vocational track. You can just
> ask "generate the deck for `content-indices/primaria/3/lengua-castellana.md`"
> without writing anything else. See
> [`content-indices/README.md`](../../content-indices/README.md).

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
`content-indices/`) and ask "generate the deck from this file" — it's
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
2. Writes `decks/<salida>.json` directly.
3. Adds the matching entry to `decks/manifest.json` — if you asked for
   the deck from a `content-indices/` file, this also includes `curso`
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
- [ ] **No duplicate or redundant cards**.
- [ ] If you asked for an outline: **every point is covered**.

If something's off, ask the agent to rewrite that card, or edit the
`.json` directly (it's plain text).

## 5. Checking everything fits together

```
node scripts/check.js
```

Validates, among other things, that `decks/manifest.json` points to
real files with cards, and that no file under `content-indices/` is
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
- [`SPEC.md`](SPEC.md) §2.1 — why there's no generative AI in the product.
- [`SPEC.md`](SPEC.md) §2.5 — why the fun tone and curious facts.
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) — how to open a PR with the new deck.

🌐 Versión en español: [`../es/guia-crear-barajas.md`](../es/guia-crear-barajas.md)
