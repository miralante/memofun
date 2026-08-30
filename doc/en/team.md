# Guide for professionals and families

This guide is intended for teachers, families and support staff who
want to use Memofun as a review tool with a learner.

---

## Who is Memofun for?

Memofun is primarily designed for:

- **People with intellectual disability** who want to review
  previously-taught topics at their own pace.
- **Families** looking for a low-pressure way to repeat school
  content at home.
- **Teachers and therapists** who want to prepare custom decks for a
  learner or a small group.

The application **does not replace** teaching or therapy, but can
serve as:

- A daily review ritual between sessions or classes.
- An autonomous practice tool, used by the learner alone.
- A way for the support role to see which cards the learner knows
  cold and which ones still need work.

---

## How to use Memofun with a learner

### Before the first session

Memofun ships with a default catalogue of decks (see
[`activities.md`](activities.md)). Before the first session, decide:

1. **Which course and level** matches what the learner is currently
   studying. If nothing fits, skip to "Preparing a custom deck"
   below.
2. **What card count** is realistic for a single sitting. A typical
   session is **5–10 cards**, not a whole deck. The app does not
   enforce a cap, but shorter sessions work better.
3. **What the review criteria are** (e.g. "today we look only at
   science cards").

### During the session

- Open the deck from the home grid.
- **Read the front aloud together** the first time, then let the
  learner tap to flip.
- Use the **hint button** if the learner is stuck; it surfaces the
  first line of the back without showing the full answer.
- Use **"Mark as known"** and **"Mark as review again"** to control
  which cards come back in the next session. The order of cards in a
  session is influenced by those marks (cards marked for review tend
  to come back sooner).

### After the session

- Memofun stores the per-card history **only in this browser's
  `localStorage`**. It never leaves the device.
- Resetting progress is a destructive action (a confirmation prompt
  appears) — use it only when starting a fresh topic.

---

## Preparing a custom deck

This is the **support role**'s task. The full workflow lives in
[`internal-creating-decks-guide.md`](internal-creating-decks-guide.md)
(when your AI assistant has repo access) or
[`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md)
(when it doesn't). The short version:

1. **Pick a small, well-defined topic** (one chapter, one unit). A
   deck with 12 focused cards beats a deck with 60 mixed ones.
2. **Write the front as a clue**, not as a definition to recite.
   The card should ask "when would you see this?" or "what is this
   an example of?", never "what is the definition of X?".
3. **Write the back as a single sentence** in everyday vocabulary,
   following the easy-read rules in [`I18N.md`](I18N.md) §3.
4. **Review the deck aloud** with the learner (or a colleague who is
   the learner) before publishing. A card that confuses the reviewer
   will confuse the learner.
5. **Open a PR** with the deck JSON file and run
   `node scripts/check.js`.

---

## Privacy

- No login, no account, no analytics, no server calls.
- Progress lives in `localStorage` and only in the browser where the
  app is open.
- Different browsers on the same device store independent progress;
  the learner uses the same browser to keep the streak.

---

## More resources

- Activity catalogue (decks by course and level):
  [`activities.md`](activities.md).
- Internal AI-assisted deck creation guide:
  [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md).
- Chat AI-assisted deck creation guide:
  [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md).
- AI guide entry point (which one to follow):
  [`ai-creating-decks-guide.md`](ai-creating-decks-guide.md).
- Cross-suite guide for families on the broader activity suite:
  [Routime's `team.md`](https://github.com/thenkdframe/routime/blob/main/doc/en/team.md).
