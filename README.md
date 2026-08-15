# Memofun 🧠

> 🌐 **Other languages:** [Español](README.es.md)
>
> 🚀 **Try it live:** `https://memofun.miralante.workers.dev` (once deployed)

A flashcard study app built around **meaningful learning**: every card
explains a concept through an everyday analogy, a concrete example, or
"why it matters" — never a dictionary definition. Built so a student
with an intellectual disability can review a topic autonomously.

No build, no backend, no accounts, no dependencies, and **no AI API
integration anywhere in the code**: vanilla HTML, CSS and JavaScript.
Each deck's content is written directly by the AI coding agent working
on this project (see `CLAUDE.md`), not called live by the app. Decks
use our own JSON format, not Anki's `.apkg`.

## Try it

Open `index.html` in a browser, or serve the folder with any static
server:

```
npx serve .
```

## What it includes

- **Deck grid** on the home screen — pick and review, nothing else.
- **Flashcard review**: tap to flip, navigate with arrows, listen to a
  card on demand (🔊), no timer and no right/wrong grading. Finishing a
  deck earns one ⭐, saved only on your device.
- **Accessibility**: large buttons, high contrast, Atkinson
  Hyperlegible typeface, keyboard navigation, `prefers-reduced-motion`.
- **Spanish and English** throughout the interface.
- **Works offline** once installed (PWA).
- **No generative AI in the product**: there's no integration with any
  AI API in the site's code. Content is written by the AI coding agent
  directly in the repository — see [`doc/en/SPEC.md`](doc/en/SPEC.md) §2.1.

## Preparing a new deck (support role)

Nothing to install, no API key of any kind. Just ask the AI coding
agent (Claude Code or similar) working on this project:

> "Generate a Memofun deck for 'Docker and Containers', intermediate
> level, 10 cards."

The agent writes the cards following the rules in "Generating deck
content" in `CLAUDE.md`, creates the `.json` in `decks/`, and adds the
entry to `decks/manifest.json`. **Review the content** before
considering it published (easy read, no clinical language, a fun tone
and a curious fact — see [`doc/en/SPEC.md`](doc/en/SPEC.md) §2.5).

`config.md` (at the repo root) and [`doc/curriculum/`](doc/curriculum/)
are the project's content ingestion point: a bare `tema` (topic) lets
the agent pick its own subtopics, or `tema` + a `# Índice` section with
your own bullet list of subtopics if you already have a syllabus and
want the deck to follow it point by point — see the full guide at
[`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md).

## Validating changes

```
node scripts/check.js
```

Checks JS syntax, ES/EN parity, `sw.js`/`manifest.json`/
`decks/manifest.json` integrity, and that no page mentions disability
or clinical language. If you touched a file cached by `sw.js`, also run:

```
node scripts/check-version-bump.js
```

## Project documentation

| Language | Entry point |
|---|---|
| 🇬🇧 English (this file) | [`doc/en/index.md`](doc/en/index.md) |
| 🇪🇸 Español | [`doc/es/indice.md`](doc/es/indice.md) |

| If you want to… | Start with… |
|---|---|
| Understand what Memofun is and who it's for | [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| Know who's involved and how | [`doc/en/roles.md`](doc/en/roles.md) |
| Create and publish a new deck, step by step | [`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md) |
| See the technical architecture | [`doc/en/technical.md`](doc/en/technical.md) |
| Add a deck, a language, or touch code | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Have an AI agent touch the code | `CLAUDE.md` |

## License

- The **code** (HTML/CSS/JS) belongs to its contributors, under
  the MIT license (see `LICENSE`).
- **Deck content** (questions, answers) is licensed under Creative
  Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0), unless a specific
  deck states otherwise.

---

## 🧩 Sibling projects

This project is part of a small group of sibling projects that share
an author, the same accessibility-first / no-backend philosophy, and
the same Cloudflare deploy story. **Apptonomia is the main project**;
the others grew out of it or were built alongside it on the same stack.

| Project | What it is | Repository |
|---|---|---|
| **Apptonomia** *(main)* | Occupational therapy: 7 modules, activities | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Math and logical reasoning | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Sinonimia | Easy-read dictionary | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Typing practice with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

The canonical Cloudflare / deploy guide for the group lives in
[Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
This repo uses the **Workers + static assets** model — see
[`CLOUDFLARE.md`](CLOUDFLARE.md) for the local guide.
