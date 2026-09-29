# Third-party licenses

The main code in this repository is licensed under the
[MIT License](LICENSE) of the Miralante Memofun project. This file
documents the licenses of the **third-party images** shipped per
deck card.

---

## Card images

Every card carries a single `imagen` field sourced from a
**permissively-licensed image bank**. The shipped image is
**always a thumbnail of the source**, never the full-resolution
original (the project ships as Cloudflare Workers static assets
with a ~25 MB total budget; a single full-resolution image would
break that budget).

Sourcing follows the agent workflow documented in `CLAUDE.md` §B.8
step 9. The two upstream sources in use are:

### Openverse

- Portal: <https://openverse.org>
- API docs: <https://api.openverse.org/v1/>
- License: each result carries its own license (CC0 / CC BY /
  CC BY-SA, **never** `-NC` / `-ND` variants, which are rejected
  at selection time).

The script `scripts/buscar-imagen.js` lists candidates with their
title, author, source URL and license so the agent can pick from
the curated metadata rather than opening the image itself.

### Wikimedia Commons

- Portal: <https://commons.wikimedia.org>
- Thumbnail endpoint used:
  `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<name>&width=800`
- License: each file carries its own license (typically CC BY /
  CC BY-SA / public domain; the same `-NC` / `-ND` rejection rule
  applies).

---

## Required credit per card

Every `imagen` field in `decks/<slug>.json` includes a **TASL**
attribution block:

- `titulo` — title of the source artwork
- `autor` — author / rights holder
- `fuente` — canonical URL of the source page
- `licencia` — the exact license identifier (e.g.
  `CC BY-SA 4.0`, `Public Domain`)

The flashcard UI surfaces this credit per card so the chain of
attribution stays intact from the user to the original author.
Reusing a card or its image means keeping that TASL block intact;
removing or altering it is a license violation, not just a style
choice.

---

## What this repo does NOT use

- **No `(-NC)` / `(-ND)` images.** Any candidate returned by
  Openverse with a non-commercial or no-derivatives clause is
  rejected at selection time, even if no other candidate exists.
- **No closed databases** (Getty, Shutterstock, Adobe Stock,
  similar). The bank is restricted to free / open-license sources.
- **No scraped images without author + license.** Every image in
  `decks/` must carry both; otherwise `scripts/check.js` fails
  the build.

---

If a card image turns out to be the wrong picture for its text
despite the agent's title-only selection, that is a bug report
under `CONTRIBUTING.md` (the "I want to…" row about reporting a
mismatched `imagen`). The fix is to swap the image; the credit
chain is preserved.
