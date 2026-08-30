# Quick guide

> 🌐 **Other language:** [Español](../es/guia-rapida.md)

This guide explains step by step how to use Memofun: from opening it
to reviewing a deck, switching language or installing it on your
phone. It also includes **four ways to open the app**, ordered from
easiest to hardest.

> 📦 The detailed step-by-step version (with the full PWA install
> walkthrough, troubleshooting section and per-button screenshots)
> lives in the canonical cross-suite guide:
> [`routime/doc/en/quick-guide.md`](https://github.com/thenkdframe/routime/blob/main/doc/en/quick-guide.md).
> The **opening flow, PWA install, language switcher and
> troubleshooting are identical** across the Apptonomia-sibling
> projects. This document only lists what's specific to Memofun.

---

## 1. How to open Memofun

There are **four ways**, ordered from easiest to hardest. The full
walkthrough is in the canonical guide linked above. The short
version:

| # | Method | What you need | Offline? | PWA installable? |
|---|---|---|---|---|
| **A** | From the internet ([memofun.apptonomia.uk](https://memofun.apptonomia.uk)) | A browser | ❌ | ✅ |
| **B** | Downloading the ZIP from GitHub | A browser | ❌ | ❌ |
| **C** | Local server with Python | Python 3 | ❌ | ✅ |
| **D** | Local server with Node.js | Node.js | ✅ | ✅ |

> 💡 If you just want to **try the app**, use method **A** or **B**.
> For the **full experience** (PWA, offline mode, "Add to home
> screen"), use **C** or **D**.

---

## 2. The main screen

The main screen shows a list of **decks** organised by **course and
level**, not a grid of mini-games. Tap a course to expand its
levels; tap a level to expand its decks; tap a deck to open it.

The end user sees **only the decks the support role has published** —
drafts are hidden. See [`activities.md`](activities.md) for the
catalogue and the format of a deck.

## 3. Inside a deck

A deck shows one card at a time. The **front** is a clue (analogy,
example, or "why it matters"); tap **Show answer** to reveal the
**back**. Common buttons:

- **Show answer** — flips the card.
- **Hint** — reveals the first line of the back, not the full answer.
- **I knew it** — marks the card as learned (it appears less often).
- **Review again** — marks the card for the next session.

## 4. Audio

When the card has an audio file attached, a 🔊 button appears. Tap
it to play the word or sentence. Memofun respects
`prefers-reduced-motion` and the audio preference in settings.

## 5. Response messages

Memofun has **no failure state**. There is no "wrong" answer; every
review marks the card as "review again" or "knew it" without
affecting progress or stars.

## 6. Stars and progress

Each card you mark as "knew it" contributes to the deck's star
count. **Stars never decrease** — there is no punishment mechanic.

## 7. Changing language

Open the language menu from the header (globe icon 🌐). Available:
**Spanish (default)** and **English**. See [`I18N.md`](I18N.md) for
how to add a new locale.

## 8. Personal settings

Open `/settings`. From there you can:

- View **My progress** (cards known vs cards to review per deck).
- Reset progress (with a confirmation prompt, since it's
  destructive).
- Manage the audio and reduced-motion preferences.

## 9. Install the app on mobile

The full steps (Android / iOS / desktop) are in the canonical guide.
Short version: open Memofun in the browser, choose "Add to home
screen" / "Install", confirm.

## 10. Troubleshooting

See **§11 Troubleshooting** in the canonical guide — those items
apply identically to Memofun.

## 11. More help

- Product: [`SPEC.md`](SPEC.md).
- Architecture: [`technical.md`](technical.md).
- Deck catalogue: [`activities.md`](activities.md).
- For families and teachers: [`team.md`](team.md).
- AI-assisted deck creation: entry point at
  [`ai-creating-decks-guide.md`](ai-creating-decks-guide.md).

## 12. Quick summary

1. Open Memofun (4 methods; easiest is **A**).
2. Pick a course → level → deck from the home list.
3. Read the front (clue), tap **Show answer**, then **I knew it** or
   **Review again**.
4. Earn stars per card; no failure, no punishment.
5. Switch language with 🌐; install as PWA for offline use.
