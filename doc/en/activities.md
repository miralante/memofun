# Activity catalogue

Memofun is a **flashcard study app**, not a fixed grid of activities.
The unit of content is the **deck**: a set of cards around a topic
(English literature, biology, maths, history…). Decks are organised
by **course** and **level**, and live under
[`tools/study/`](../../tools/study/). The end user reviews whichever
deck the support role has already prepared and published.

> Canonical product description (audience, "no generative AI in the
> product" rule, the support role's workflow) lives in
> [`SPEC.md`](SPEC.md). The deck file format and the rendering
> pipeline are in [`technical.md`](technical.md).

---

## 1. What is a "deck"?

A deck is a JSON file containing an ordered list of **cards**. Each
card presents a concept's everyday analogy, concrete example or
"why it matters" as a clue (the **front**), then asks the learner to
recall the concept itself (the **back**). The card format is defined
in [`technical.md`](technical.md) §6 and the Socratic hint ladder in
[`creating-activities-guide.md`](creating-activities-guide.md) §3.

A deck does not need to ship **with** an activity: Memofun has a
single render activity (`tools/study/`) that knows how to play any
deck that follows the schema. The catalogue below lists **courses**
and the decks they currently contain.

---

## 2. Courses and decks shipped with the project

The current `tools/study/` content covers the Spanish and British
curricula that the project supports out of the box. Use it as a
template for new decks; the structure (folder per course, level
subfolder, deck JSON file) is part of the format.

### 2.1 English (en)

| Course | Levels | Description |
|---|---|---|
| **Key Stage 1** | 1–2 | English Literature, Geography, History, Science. |
| **Key Stage 2** | 3–6 | English Literature, Geography, History, Science. |
| **Key Stage 3** | 7–9 | English Literature, Geography, History, Science. |
| **Key Stage 4** | 10–11 | Combined Science plus the separate Biology, Chemistry and Physics tracks, English Literature, Geography, History. |
| **Entry-Level Business** | 1–2 | Business basics and customer service. |
| **BTEC Business L2** | 1–2 | Business administration, communication, finance, operations. |

### 2.2 Spanish (es)

| Course | Levels | Description |
|---|---|---|
| **Primaria** | 1–6 | Lengua castellana, Ciencias naturales, Ciencias sociales. |
| **ESO** | 1–4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química. |
| **FP Básica — Servicios administrativos** | 1–2 | Lengua, ciencias, técnicas administrativas, ofimática, atención al cliente, tratamiento de datos. |
| **FP GM — Gestión administrativa** | 1–2 | Comunicación empresarial, empresa y administración, técnica contable, operaciones, sostenibilidad, digitalización. |
| **Mapa mundi** | — | Banderas, capitales, ciudades, continentes, geografía física, récords. |

---

## 3. How to add a new deck

This is the support-role flow (no code involved). The full step-by-step
guide lives in [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md)
(if your AI assistant has repo access) or
[`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md)
(if it doesn't). The short version:

1. **Pick the course and level** where the deck belongs, or create a
   new folder following the existing pattern.
2. **Write the deck JSON** following the schema in
   [`technical.md`](technical.md) §6.
3. **Review every card** before publishing: each one must have a
   clear clue (front), a one-sentence answer (back), and pass the
   "easy-read" rules in [`I18N.md`](I18N.md) §3.
4. **Publish** by running the project's standard check
   (`node scripts/check.js`) and opening a PR.

The decision between "this deck belongs in an existing course" vs.
"this deck starts a new course" is made by the support role; the
guide above includes a checklist to keep the choice consistent.
