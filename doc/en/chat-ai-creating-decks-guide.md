# Guide: adding a deck with a generic AI chat tool (no coding agent)

> This guide is for the **support** role (family, teacher) who does
> **not** have an AI coding agent with access to the repository (like
> Claude Code) — only a generic text AI chat (ChatGPT, Claude.ai,
> Gemini, Copilot Chat…) in the browser. If you do have an agent with
> repo access, use [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md)
> instead: it's more direct, since the agent itself reads the rules
> and writes the files for you.

---

## 1. What's different from the normal guide

In [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md) you ask an AI
agent that **already has access to the repository** to write the
deck: it reads the rules in `CLAUDE.md`, writes the `.json`, and
updates `decks/manifest.json` itself.

A generic AI chat doesn't have that access: it can't read this
repository or write files into it, only generate text in a
conversation. So this flow has one extra step — generate the content
in the chat, then bring it (yourself, or ask someone with access to)
into the repository.

This does **not** change the "no generative AI in the product" rule
(`SPEC.md` §2.1): it's still a content-preparation step done by a
person, outside the app, before anything gets published — just as
"offline" as when the coding agent does it.

## 2. What you need

- Access to any text AI chat, in the browser.
- A way to save the result into the repository: either you know how
  to create files on GitHub from the web, or you ask someone from the
  build role (or a coding agent, if you have occasional access to
  one) to do the final step — see step 3.

## 3. Step 1 — copy this prompt

Copy and paste this whole block at the start of your conversation with
the AI chat, filling in the `[brackets]` with your topic:

```
You're going to write the content for a review flashcard deck for
Memofun, an Easy Read study app built so a person with an intellectual
disability can review a topic on their own. Follow these rules
exactly:

TOPIC: [your topic, in a few words]
LEVEL: [beginner / intermediate / advanced]
NUMBER OF CARDS: [a number, e.g. 15]
CONTENT LANGUAGE: [en / es]
OUTLINE (optional — if you fill this in, cover every point, none
skipped, none invented; leave empty to pick your own subtopics):
- [subtopic 1]
- [subtopic 2]

CONTENT RULES (mandatory):
- Each card is an object {"pregunta": "...", "respuesta": "..."}
  (keep these exact JSON key names, even if your content is in
  English).
- The question is clear, concrete, evaluable (never yes/no), with a
  warm and curious tone — never exam-like.
- The answer is NEVER a dictionary definition. Build it around ONE of:
  an everyday ANALOGY, a concrete PRACTICAL EXAMPLE, or the real
  PROBLEM the concept solves ("why it matters"). Wrap that key phrase
  in <mark> and </mark>.
- Easy Read: short sentences (max 12 words each), one idea per
  sentence, everyday vocabulary, active voice. Simple HTML allowed
  (<b>, <i>, <br>) — never markdown (no **, _, #, etc.).
- At most ONE new concept (a proper name, a technical term, an
  abstract idea) per card. Always anchor that concept in a concrete
  everyday image before naming it. If the topic has many names in a
  row (movements, eras, people), use MORE, smaller cards — don't
  compress several names into one card.
- A "how do X and Y differ" card only after X and Y have each already
  had their own separate card.
- Fun and warm tone, like explaining something interesting to a
  friend — never sarcasm, irony, or double meanings.
- When it fits naturally, add ONE curious fact ("Did you know...?") —
  never forced.
- Each answer has 2 to 5 sentences.
- Never use the words "disability", "patient", or clinical language —
  the content is about the topic, not about who's studying it.
- Don't number the cards or repeat the topic name verbatim in every
  question.
- Repeating a key concept with a variation (a different example, a
  different angle) is fine if it helps it stick — a card that adds no
  new nuance at all is not.

OUTPUT FORMAT (mandatory):
Return ONLY this JSON, no explanation before or after, no markdown
fence around it:

{
  "tema": "...",
  "nivel": "...",
  "idioma": "...",
  "tarjetas": [
    { "pregunta": "...", "respuesta": "..." }
  ]
}

The "tarjetas" array must have EXACTLY the number of cards requested
above. Count them before answering.
```

## 4. Step 2 — review what it gives you

Before using it, check by eye:

- [ ] Is it valid JSON? (paste it into any online JSON validator if
      unsure, or save it as-is into a `.json` file and open it)
- [ ] Does it have exactly the number of cards you asked for? Chat AIs
      sometimes fall short or overshoot.
- [ ] Does every answer have a `<mark>...</mark>`?
- [ ] Any markdown (`**bold**`, `# heading`) that slipped in instead
      of HTML? Fix it or ask for a regeneration.
- [ ] If you gave an outline, is every point covered?

If something's off, paste it back to the same AI: "fix this: [what's
missing]" — usually faster than rewriting it by hand.

## 5. Step 3 — bring it into the repository

Three paths, depending on what you have access to:

**A) You have GitHub write access, but no coding agent**

1. On GitHub, go to the `decks/` folder in the repository and use
   "Add file → Create new file".
2. Name the file after the `tema`, lowercase and hyphenated, e.g.
   `docker-and-containers.json` (see `slugify()` in
   `scripts/config-parser.js` for the exact rule if you want to match
   it precisely).
3. Paste the JSON the AI gave you.
4. Add an entry to `decks/manifest.json` by hand (it's a list — add
   your entry at the end, keeping the preceding comma):
   ```json
   { "id": "docker-and-containers", "tema": "Docker and Containers",
     "nivel": "intermedio", "cantidad": 15,
     "file": "docker-and-containers.json", "icono": "🐳" }
   ```
   `cantidad` must match the real number of cards in the file. Pick an
   emoji that represents the topic for `icono`.
5. Follow the normal [`CONTRIBUTING.md`](../../CONTRIBUTING.md) flow:
   branch, commit, Pull Request. Someone from the build role will run
   `node scripts/check.js` when reviewing it — if you can run it
   yourself first (needs Node.js), even better: it catches formatting
   errors before you open the PR.

**B) You have occasional access to a coding agent (Claude Code or
similar)**

Paste it the JSON the chat generated and ask it explicitly:

> "I generated this content with [AI name] following the rules in
> CLAUDE.md. Review it against the checklist in
> `internal-creating-decks-guide.md` §4, fix anything that's off, save it as
> `decks/<slug>.json`, add the entry to `decks/manifest.json`, and run
> `node scripts/check.js`."

The agent will do the review, the integration, and the checks for you
— the same checklist it would apply if it had written the deck itself
from scratch.

**C) You have access to neither GitHub nor a coding agent**

Open an issue in the repository (see step 1 of the
[`CONTRIBUTING.md`](../../CONTRIBUTING.md) flow) pasting the JSON the
AI generated and explaining what the topic is. Someone from the build
role will review and integrate it.

## 6. Human review — even more important here

A generic AI chat doesn't know this project: it hasn't read
`CLAUDE.md` unless you pasted it into the prompt, and it doesn't apply
any checklist on its own. So before considering the deck published,
go through the full checklist in
[`internal-creating-decks-guide.md`](internal-creating-decks-guide.md) §4 — Easy Read,
conceptual density, no clinical language, tone, a curious fact,
purposeful repetition, faithfulness to the outline if you gave one.

## 7. Common mistakes generic AI chats make

- **Inventing fields that don't exist** in the schema (`author`,
  `date`, `difficulty`…) — delete them; the schema is exactly
  `{tema, nivel, idioma, tarjetas}`.
- **Using markdown instead of HTML** inside `respuesta` — only `<b>`,
  `<i>`, `<br>`, `<mark>` are allowed.
- **Miscounting the cards** — you asked for 15 and got 12, or 18.
  Count them yourself before integrating.
- **Wrapping the JSON in an explanation** ("Here's your deck:
  \`\`\`json … \`\`\`") — strip everything that isn't the JSON itself
  before saving it.
- **Repeating the same sentence structure in every answer** ("It's
  like…") — ask for more variety if it feels too monotonous; it
  doesn't break technical validity, but it does affect how pleasant
  the deck is to review.

---

## 8. Cross-references

- [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md) — the normal
  flow, with an AI agent that has access to the repository.
- `CLAUDE.md` → "Generating deck content" — the full ruleset this
  document's prompt is drawn from.
- [`technical.md`](technical.md) §3 — the exact JSON format of a deck.
- [`SPEC.md`](SPEC.md) §2.1 — why this doesn't contradict the "no
  generative AI in the product" rule.
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) — how to open a PR or an
  issue with the new deck.

🌐 Versión en español: [`../es/guia-chat-ia-crear-barajas.md`](../es/guia-chat-ia-crear-barajas.md)
