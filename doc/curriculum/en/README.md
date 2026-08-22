# Curriculum indices — England (Early Years to KS4, with vocational)

This folder is the project's **content ingestion library** for the AI
agent (see [`../../en/internal-creating-decks-guide.md`](../../en/internal-creating-decks-guide.md)):
one Markdown file per subject and Key Stage / year, ready to request
a deck directly:

> "Generate the deck for `doc/curriculum/en/key-stage-2/3/english-literature.md`."

It is the `en/` half of [`doc/curriculum/`](../). It mirrors the
structure of the Spanish (`Comunidad de Madrid`) library at
[`../es/`](../es/) — same per-year, per-subject layout — but grounded
in the **English National Curriculum** (Department for Education,
DfE), the **GCSE subject specifications** (AQA, OCR, Edexcel — pick
the one your school uses), and the **DfE vocational programmes** for
the Entry Level / Level 1 / Level 2 routes.

The sibling [`../es/`](../es/) folder has the Comunidad de Madrid
curriculum (LOMLOE, ESO, FP Básica/GM). Both folders use the same
`config.md` shape (frontmatter + `# Índice`) so the same agent flow
works for either.

No script and no API key needed — the agent reads the file and writes
the content itself (see "Generating deck content" in `CLAUDE.md`).

## Scope

Covers **Key Stage 1 (Year 1-2) through Key Stage 4 (GCSE,
Year 10-11)** in England, following the real post-primary progression
(Primary → Secondary → GCSE; a GCSE grade 4 or above already gives
access to A-Levels, T-Levels, BTEC Level 3, or an Apprenticeship),
plus two **alternative routes** for learners who don't go straight
through GCSE:

| Stage | Years | Subjects covered |
|---|---|---|
| `key-stage-1/` | 1 and 2 (ages 5-7) | English Literature, Science, History, Geography |
| `key-stage-2/` | 3 to 6 (ages 7-11) | English Literature, Science, History, Geography |
| `key-stage-3/` | 7 to 9 (ages 11-14) | English Literature, Science (single subject), History, Geography |
| `key-stage-4/` | 10 and 11 (ages 14-16) | English Literature, History, Geography, Biology, Chemistry, Physics, Combined Science |
| `entry-level-business/` | 1 and 2 (ages 14-16) | Entry Level Certificate / Level 1 units in Business and Administration — alternative vocational route for learners who don't sit GCSEs |
| `btec-business-l2/` | 1 and 2 (ages 16-18) | BTEC Level 2 Diploma in Business Administration units (Pearson Edexcel) — post-16 vocational route |

**Core / foundation subjects only** — PE, Art & Design, Music, RSHE,
Citizenship and similar are intentionally left out: a flashcard deck
is worth most in content-dense subjects (language, sciences, history,
geography) where review matters, less so in skills-first ones. Drop
us a PR if a different subject should join the library.

**English Literature only — no phonics, spelling or grammar decks.**
The English National Curriculum groups phonics, spelling, grammar,
punctuation and handwriting together with reading and literature into
a single "English" subject. Memofun's audience meets English as a
second or additional language, so the **literature** strand (the
stories, rhymes, poems, plays and authors that travel well across
cultures) makes a far better review deck than orthography does.
This matches the Spanish library's `literatura` strand: literature
without the language-orthography drill. If you want the language
strand, the sibling app **Calculia**'s English activities (planned)
or a future Memofun extension can cover it — for now, this folder
keeps English to literature and lets the other subjects stand alone.

**No Maths**: arithmetic and logical reasoning are already covered by
the sibling app **Calculia** (11 dedicated activities — numbers,
tables, Roman numerals, patterns, the clock, the money purse...) with
a hands-on practice format much better suited to the subject than a
Q/A card. Memofun sticks to factual and narrative content.

## Status — call for help

The folder is **partially populated** in two senses:

- **Curriculum outlines** (this folder) — every Key Stage and the
  vocational routes has at least one subject, and the structure
  mirrors the Spanish library. Several decks need a deeper review
  against the live specification (AQA / OCR / Edexcel, depending on
  the school) before publishing.
- **Deck files in `decks/`** — there are **no English deck JSON files
  yet**. That's deliberate: writing decks is the **support / build
  role**'s work, and this folder is the open invitation to do it.
  Any contributor can pick any temario here, ask the AI coding agent
  to generate the matching `decks/<slug>.json`, review it against
  the checklist in `internal-creating-decks-guide.md` §4, and ship
  it.

A non-exhaustive list of what is still missing or thin:

- **No English-literature decks yet** (KS1-4). Pick a temario and
  ask the agent to generate the matching deck — see
  [`internal-creating-decks-guide.md`](../../en/internal-creating-decks-guide.md).
- KS4 single-science decks (Biology / Chemistry / Physics) — file
  templates are in place; please review against your exam board's
  current specification (AQA / OCR / Edexcel) before publishing.
- KS4 Geography and History — pick the GCSE spec your school uses.
- Entry Level / BTEC Level 2 — vocational units vary by centre; the
  decks here are a starting point, not a complete coverage of every
  unit on every specification.

If you spot a factual error or a unit that's drifted from the live
specification, please open an issue or a PR — see
[`../../CONTRIBUTING.md`](../../CONTRIBUTING.md). If you're new to
the project, the simplest entry point is: pick a temario in this
folder, ask the AI coding agent for the deck, review it, ship it.
