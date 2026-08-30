# Detailed contents — Memofun

> 🌐 **Other language:** [Español](../es/CONTENIDOS.md)

This document is a **detailed didactic index** of Memofun. It
expands on [`activities.md`](activities.md) and
[`creating-activities-guide.md`](creating-activities-guide.md) by
giving, for every deck and pedagogical concept shipped with the
app:

- Its **course** (the syllabus it belongs to).
- Its **level** (the school year or unit).
- Its **deck file** (`decks/<course>_<level>_<topic>.json`).
- Its **didactic objective** (the concept it works on).
- Its **key vocabulary / theme** (the topic of the cards).
- Its **reference** (canonical document and section).

Memofun ships **one** render activity (`tools/study/`) that
plays **any** deck that follows the schema. The "content" of the
app is therefore the **set of decks**, not the set of activities.

Use this document as the **workbook for Memofun**: when a new
deck is proposed, when content is reviewed, or when coverage of a
syllabus needs to be balanced, this is the document to read first.

> **Source of truth for product rules**: [`SPEC.md`](SPEC.md).
> **Source of truth for pedagogy**:
> [`creating-activities-guide.md`](creating-activities-guide.md).
> This document does **not** redefine rules; it indexes the content
> that those rules produce.

---

## 0. How this document is organized

1. Card anatomy (what a single card looks like).
2. Courses and decks shipped with the project (the catalogue).
3. Pedagogical concepts (how Memofun builds meaningful learning).
4. Deck authoring rules (what a "good" deck looks like).
5. Restrictions and forbidden content.

---

## 1. Card anatomy

A deck is a JSON file with an ordered list of cards. Each card
follows this **didactic shape**:

| Field | Role | Didactic intent |
|---|---|---|
| `front` | The clue (analogy, example, or "why it matters"). | Anchors the concept in something the learner already knows. **Never a definition to recite.** |
| `back` | The single-sentence answer. | One sentence, easy-read vocabulary, no jargon. |
| `topic` | The deck's topic (subject area). | Used by the topic filter. |
| `course` | The course / syllabus it belongs to. | Used by the course grid. |
| `level` | The level within the course (school year). | Used by the level grid. |
| `audio` | Optional recorded pronunciation or example-sentence read-aloud. | Optional aid; not required. |
| `pictogram` | Optional pictogram reference. | Optional aid; not required. |

The card front is **always a clue** (see
[`creating-activities-guide.md`](creating-activities-guide.md)
§2.2). This is the project's most distinctive didactic rule.

---

## 2. Courses and decks shipped with the project

> The current catalogue is summarised by **count of decks per
> course**. The exact filenames follow the convention
> `decks/<course_prefix>_<level>_<topic>[_<index>].json` (where the
> optional `_<index>` is used when a topic is split across multiple
> decks to keep each session short).

### 2.1 English (en)

| Course | Levels | Topic groups | Deck count (approx.) |
|---|---|---|---|
| **Key Stage 1** | 1–2 | English Literature, Geography, History, Science | ~16 |
| **Key Stage 2** | 3–6 | English Literature, Geography, History, Science | ~32 |
| **Key Stage 3** | 7–9 | English Literature, Geography, History, Science | ~24 |
| **Key Stage 4** | 10–11 | English Literature, Geography, History, Combined Science + the separate Biology, Chemistry and Physics tracks | ~32 |
| **Entry-Level Business** | 1–2 | Business basics, Customer service | ~16 |
| **BTEC Business L2** | 1–2 | Business administration, Communication, Finance, Operations | ~32 |

#### 2.1.1 Key Stage 1 (ages 5–7)

| Level | Topics |
|---|---|
| 1 | English Literature, Geography, History, Science |
| 2 | English Literature, Geography, History, Science |

#### 2.1.2 Key Stage 2 (ages 7–11)

| Level | Topics |
|---|---|
| 3 | English Literature, Geography, History, Science |
| 4 | English Literature, Geography, History, Science |
| 5 | English Literature, Geography, History, Science |
| 6 | English Literature, Geography, History, Science |

#### 2.1.3 Key Stage 3 (ages 11–14)

| Level | Topics |
|---|---|
| 7 | English Literature, Geography, History, Science |
| 8 | English Literature, Geography, History, Science |
| 9 | English Literature, Geography, History, Science |

#### 2.1.4 Key Stage 4 (ages 14–16)

| Level | Topics |
|---|---|
| 10 | English Literature, Geography, History, Combined Science |
| 11 | English Literature, Geography, History + separate Biology, Chemistry, Physics |

#### 2.1.5 Entry-Level Business

| Level | Topics |
|---|---|
| 1 | Business basics, Customer service |
| 2 | Business basics, Customer service |

#### 2.1.6 BTEC Business L2

| Level | Topics |
|---|---|
| 1 | Business administration, Communication, Finance, Operations |
| 2 | Business administration, Communication, Finance, Operations |

### 2.2 Spanish (es)

| Course | Levels | Topic groups | Deck count (approx.) |
|---|---|---|---|
| **Primaria** | 1–6 | Lengua castellana, Ciencias naturales, Ciencias sociales | ~139 |
| **ESO** | 1–4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química | ~93 |
| **FP Básica — Servicios administrativos** | 1–2 | Lengua, ciencias, técnicas administrativas, ofimática, atención al cliente, tratamiento de datos | ~22 |
| **FP GM — Gestión administrativa** | 1–2 | Comunicación empresarial, empresa y administración, técnica contable, operaciones, sostenibilidad, digitalización | ~26 |
| **Mapa mundi** | — | Banderas, capitales, ciudades, continentes, geografía física, récords | ~12 |

#### 2.2.1 Primaria (1–6)

| Level | Topics |
|---|---|
| 1 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 2 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 3 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 4 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 5 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 6 | Lengua castellana, Ciencias naturales, Ciencias sociales |

#### 2.2.2 ESO (1–4)

| Level | Topics |
|---|---|
| 1 | Lengua castellana, Geografía e historia, Biología y geología |
| 2 | Lengua castellana, Geografía e historia, Física y química |
| 3 | Lengua castellana, Geografía e historia, Biología y geología, Física y química |
| 4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química |

#### 2.2.3 FP Básica — Servicios administrativos (1–2)

| Level | Topics |
|---|---|
| 1 | Lengua, ciencias, ciencias sociales, itinerario personal y de empleabilidad, técnicas administrativas básicas, atención al cliente, tratamiento informático de datos |
| 2 | Lengua, ciencias, ciencias sociales, aplicaciones básicas de ofimática, archivo y comunicación, preparación de pedidos y venta de productos |

#### 2.2.4 FP GM — Gestión administrativa (1–2)

| Level | Topics |
|---|---|
| 1 | Comunicación empresarial y atención al cliente, empresa y administración, itinerario personal y de empleabilidad (I), operaciones administrativas de compraventa, técnica contable, tratamiento informático de la información |
| 2 | Digitalización aplicada a los sectores productivos, empresa en el aula, itinerario personal y de empleabilidad (II), operaciones administrativas de RRHH, operaciones auxiliares de gestión de tesorería, sostenibilidad del sistema productivo, tratamiento de la documentación contable |

#### 2.2.5 Mapa mundi (sin niveles)

| Topic |
|---|
| Banderas |
| Capitales |
| Ciudades importantes |
| Continentes |
| Geografía física |
| Récords |

### 2.3 Aggregate

The shipped catalogue currently contains roughly **293 decks**
across all courses and locales. Each deck targets **8–15 cards**
for a single session. The full per-file inventory is in
`/decks/` and can be inspected with the standard project scripts.

---

## 3. Pedagogical concepts (how Memofun builds meaningful learning)

Memofun's pedagogy is built on **four** principles, applied
everywhere. They are not optional:

### 3.1 The front is a clue, never a definition

The front of a card is an **analogy, an example, or a
"why-it-matters"** that anchors the concept in something the
learner already knows. The card asks the learner to **recall** the
concept, not to **recite** it. This is the project's most
distinctive rule (see
[`creating-activities-guide.md`](creating-activities-guide.md) §2.2
and [`SPEC.md`](SPEC.md) §1).

Examples:

| ❌ Recite | ✅ Recall |
|---|---|
| "What is the definition of photosynthesis?" | "What do plants do with sunlight, water and CO₂ to make their own food?" |
| "Who wrote Don Quixote?" | "Which Spanish writer lost his mind by reading too many chivalry books?" |
| "What is a prime number?" | "Which number has exactly two friends: 1 and itself?" |

### 3.2 Repetition with variation

A key concept can — and should — reappear across more than one
card and more than one deck for the same topic/course.
Sometimes literally (nearly the same question, to consolidate
memory); sometimes varied (the same idea with a different example
or angle). Repetition is **reinforcement**, not a flaw
(see [`SPEC.md`](SPEC.md) §1.3).

### 3.3 Easy-read cards

Every card follows UNE 153101 — short sentences, one idea per
sentence, everyday vocabulary, no clinical jargon in what the
learner reads (see [`SPEC.md`](SPEC.md) §3 and the suite rule in
the root [`CLAUDE.md`](CLAUDE.md) §"UNE 153101 reference").

### 3.4 The Socratic hint ladder

When a card has a hint, the hint is a **partial reveal of the
back**, never a different question. This is the suite's
"hint-before-answer" rule (see
[`creating-activities-guide.md`](creating-activities-guide.md) §3
and the canonical Routime guide).

---

## 4. Deck authoring rules

A "good" Memofun deck obeys these rules (full rationale in
[`creating-activities-guide.md`](creating-activities-guide.md)
§2 and §3):

| Rule | Why |
|---|---|
| **Card count**: 8–15 cards per deck. | Short sessions beat long ones; a single sitting is 5–10 minutes. |
| **Front is a clue**, never a definition. | Recall beats recite. |
| **Back is one sentence**, easy-read. | One idea per sentence, plain words. |
| **No duplicate concept** in the same deck. | Two cards on the same idea in a row is filler, not reinforcement. |
| **Repetition across decks** is welcome when it adds a nuance. | Same idea, different angle, across decks = reinforcement. |
| **Topic label matches the course / level**. | Lets the topic filter show it in the right group. |
| **All UI strings** added to BOTH `strings.es.js` and `strings.en.js`. | i18n parity (enforced by `scripts/check.js`). |
| **Reviewed aloud** with a learner (or someone playing the learner) before publishing. | A card that confuses the reviewer confuses the learner. |

---

## 5. Restrictions and forbidden content

These rules apply to **every** deck and are **never** broken
(full rationale in [`SPEC.md`](SPEC.md) §2 and §3):

- **No generative AI in the product** — decks are reviewed and
  curated by the support role; the runtime never calls an LLM
  (see [`SPEC.md`](SPEC.md) §2.1).
- **No timers, no score, no punishment** — feedback is
  encouragement, not "wrong".
- **No clinical labels** about the learner (intellectual
  disability, occupational therapy, minors) inside the UI.
- **No hostile, sexual, political or violent content** in the
  card texts.
- **No tracking, no login, no analytics** — progress is in
  `localStorage` only.

---

## 6. See also

- Product: [`SPEC.md`](SPEC.md).
- Architecture: [`technical.md`](technical.md).
- Activity catalogue (short): [`activities.md`](activities.md).
- Pedagogical guide (long):
  [`creating-activities-guide.md`](creating-activities-guide.md).
- AI-assisted deck creation: entry point at
  [`ai-creating-decks-guide.md`](ai-creating-decks-guide.md).
- Languages: [`I18N.md`](I18N.md).
- For families and teachers: [`team.md`](team.md).
