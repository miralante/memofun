# Adding a deck with an external AI (Cowork, Cursor, ChatGPT…)

> Entry point for the **support** role (family, teacher) who wants to
> generate a deck with help from an AI that is **not** part of the
> Memofun product itself — anywhere from an AI-assisted collaborative
> dev environment ("cowork"-style: Cursor, Windsurf, GitHub Copilot
> Workspace, Claude Code…) to a plain text chat like ChatGPT or
> Claude.ai in the browser. This document doesn't repeat the content
> rules — it sends you straight to the guide that fits what you have.

---

## The only question that matters: can your tool read and write to this repository?

The brand or specific name of the tool doesn't matter. The only thing
that changes the flow is whether that AI can **actually access
Memofun's code** (clone it, browse it, read and write files), or
whether it's just an isolated text conversation with no connection to
this repository.

### ✅ Yes, it can access the repository

This includes AI-integrated development environments — often called
**"cowork"** tools or AI-assisted coding tools: Cursor, Windsurf,
GitHub Copilot Workspace, Claude Code, or even a ChatGPT/Claude.ai
session with a GitHub connector enabled that lets it read this
repository.

→ Follow **[`internal-creating-decks-guide.md`](internal-creating-decks-guide.md)**. The
flow is exactly the same regardless of the specific tool: give it
access to the repository and ask it to:

1. Read `CLAUDE.md` → "Generating deck content" (the full content
   ruleset) and `technical.md` §3-4 (the exact deck and
   `manifest.json` format).
2. Generate the deck from a topic, or from a
   [`doc/curriculum/es/`](../curriculum/es/) file if one already
   exists for your course/subject.
3. Write `decks/<slug>.json` and add the entry to
   `decks/manifest.json`.
4. Run `node scripts/check.js` (and `check-version-bump.js` if it
   touched any file cached by `sw.js`).
5. If the tool can also open a Pull Request, even better — still walk
   through the checklist in
   [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md) §4 before
   approving it.

> 💡 If your tool doesn't read `CLAUDE.md` on its own (some only index
> code for autocomplete, without "reasoning" like an agent), paste it
> in yourself at the start of the conversation, along with
> `doc/en/technical.md` §3-4. The rest of the flow is the same from
> there.

### ❌ No, it can't access the repository

It's a standalone text chat — ChatGPT, Claude.ai, Gemini, Copilot
Chat… open in the browser, with no connection to this repository. It
can only generate text in a conversation; it can't read or write any
file in the project.

→ Follow **[`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md)**. It has a
ready-to-copy prompt with all the content rules, plus the steps to
bring the result into the repository yourself (or hand it to someone
with access) by hand.

---

## Why this doesn't break the "no generative AI in the product" rule

Memofun never calls any AI from `index.html`, `app.js`,
`tools/study/`, `settings/`, or any script under `scripts/` — see
[`SPEC.md`](SPEC.md) §2.1. Everything described here happens
**before** anything gets published: a person, using a tool external
to the product, prepares content that then gets reviewed and saved as
plain text in `decks/`. It doesn't matter whether that tool is an
agent inside an IDE or a chat in a browser tab — in neither case does
it ever connect to the app that the person studying actually uses.

## Cross-references

- [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md) — full flow
  with an AI that has access to the repository.
- [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md) — full flow with an AI
  chat that has no access to the repository, prompt included.
- `CLAUDE.md` → "Generating deck content" — the full content ruleset
  both guides draw from.
- [`technical.md`](technical.md) §3-4 — deck and `manifest.json`
  format.
- [`SPEC.md`](SPEC.md) §2.1 — why there's no generative AI in the
  product, and why this flow doesn't contradict that.

🌐 Versión en español: [`../es/guia-ia-crear-barajas.md`](../es/guia-ia-crear-barajas.md)
