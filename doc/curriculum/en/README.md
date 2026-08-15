# Curriculum indices — other languages

This folder is intentionally empty.

[`../es/`](../es/) holds the full curriculum-index library for the
Spanish (Comunidad de Madrid) curriculum, from Primaria to FP Grado
Medio — see its own [README](../es/README.md).

The `es/` / `en/` split exists so the **same approach** can be reused
for a curriculum taught in another language: mirror `es/`'s structure
here (`<etapa>/<curso>/<asignatura>.md`, one `config.md`-shaped file
per subject and course, see `../../es/tecnico.md` §8 for the exact
shape) with content indices grounded in that region's own official
curriculum. Nothing in the app or the deck-generation workflow assumes
`es/` is the only populated folder — see `CLAUDE.md` → "Generating
deck content".
