# Memofun

**Flashcard study app built around meaningful learning: every card explains a concept through an everyday analogy, a concrete example, or "why it matters".**

---

## What is Memofun?

Memofun is a digital tool for reviewing what you already studied — between classes, on the bus, while you wait. Each card gives you an everyday analogy, a concrete example, or the real problem a concept solves, and then asks you to recall the concept itself.

The app is **deck-driven**: there is one study activity that knows how to play any deck that follows the schema. Decks are prepared by a support role (family, teacher) and grouped by **course** and **level**. See the full list of courses and decks in [`activities.md`](activities.md).

---

## Key features

### ✅ Designed for autonomy

- **No timer, no right/wrong grading**: tap to flip, navigate with arrows
- **Listen on demand**: a 🔊 button appears on every card so you can hear it read aloud
- **Easy Reading**: short sentences, everyday vocabulary, one idea per screen
- **Positive reinforcement**: completing a deck earns one ⭐, only ever added, never subtracted

### ✅ Accessible to everyone

- **Large buttons**: minimum 64×64 pixels
- **Large text**: clear readable font (Atkinson Hyperlegible)
- **High contrast**: light colours on a white background
- **Keyboard navigation** and full `prefers-reduced-motion` support

### ✅ No generative AI in the product

Memofun's public site makes **zero** calls to any AI service, and the codebase contains **zero API integrations of any kind**. Every card you see was written directly by the maintainer, never generated live at runtime.

### ✅ In two languages

- 🇪🇸 **Español** (default)
- 🇬🇧 **English** (can be changed from the menu)

---

## Getting started

### 1. Open the app

Visit **[memofun.apptonomia.uk](https://memofun.apptonomia.uk)** or open `index.html` from a local server. The full step-by-step with **four ways to open Memofun** (internet, ZIP, Python, Node.js) lives in [`quick-guide.md`](quick-guide.md).

### 2. Pick a deck

On the home screen you'll see your decks grouped by course. Pick one to start reviewing.

### 3. Read the clue, then recall the answer

The **front** of the card is the clue (the analogy, the example or "why it matters"). Tap the card to flip and reveal the **back** — the concept you were asked to recall.

### 4. Change language

Tap the language button (🇪🇸 or 🇬🇧) at the top of the screen.

---

## Example of use

Imagine you are reviewing English Literature. You open the **📚 Key Stage 3 / English Literature** deck. The first card shows:

> *A soap bubble: it shines for a moment, then it's gone.*
>
> What is this image usually called?

You think it over, tap the card to flip, and the **back** shows:

> **Disillusionment**

That is the whole loop: clue → recall → reveal.

---

## What ships with Memofun

The current decks cover the Spanish and British curricula. Use them as templates for new decks; the structure (folder per course, level subfolder, deck JSON file) is part of the format.

### 🇬🇧 English (en)

| Course | Levels | Description |
|---|---|---|
| **Key Stage 1** | 1–2 | English Literature, Geography, History, Science. |
| **Key Stage 2** | 3–6 | English Literature, Geography, History, Science. |
| **Key Stage 3** | 7–9 | English Literature, Geography, History, Science. |
| **Key Stage 4** | 10–11 | Combined Science plus the separate Biology, Chemistry and Physics tracks, English Literature, Geography, History. |
| **Entry-Level Business** | 1–2 | Business basics and customer service. |
| **BTEC Business L2** | 1–2 | Business administration, communication, finance, operations. |

### 🇪🇸 Spanish (es)

| Course | Levels | Description |
|---|---|---|
| **Primaria** | 1–6 | Lengua castellana, Ciencias naturales, Ciencias sociales. |
| **ESO** | 1–4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química. |
| **FP Básica — Servicios administrativos** | 1–2 | Lengua, ciencias, técnicas administrativas, ofimática, atención al cliente, tratamiento de datos. |
| **FP GM — Gestión administrativa** | 1–2 | Comunicación empresarial, empresa y administración, técnica contable, operaciones, sostenibilidad, digitalización. |
| **Mapa mundi** | — | Flags, capitals, cities, continents, physical geography, records. |

---

## For the support role

If you are preparing decks for a learner, the canonical step-by-step lives in [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md) (for AI coding agents in this repo) and in [`ai-creating-decks-guide.md`](ai-creating-decks-guide.md) (for external AI tools). If you don't use any AI tool, [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md) explains a copy-paste prompt you can use with any chat-based AI.

---

## More information

- [Quick guide](quick-guide.md) — Step by step (four ways to open Memofun)
- [Course and deck catalogue](activities.md) — Complete list of decks
- [Guide for families and teachers](team.md) — How Memofun fits in the study routine
- [Technical information](technical.md) — For developers

---

## Credits and licence

Memofun is an open source project, distributed under the MIT licence. Deck content is curated by the maintainers and contributors, never generated live at runtime.
