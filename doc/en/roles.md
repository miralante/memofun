# Project roles

Memofun has **three distinct roles**, same as the rest of the sibling
family (Apptonomia, Calculia, Okeymoney, Sinonimia, Teclatlon):

| Role | Who | How they participate | Where they look first |
|---|---|---|---|
| 👤 **End user** (with an intellectual disability) | Reviews decks | Uses `index.html` and `tools/study/` autonomously. Doesn't touch `settings/` or ask the agent for decks. | The app |
| ❤️ **Support**: family, teacher | Prepares and reviews content | Asks the project's AI agent to write a deck from a topic, or a topic + a detailed outline if they already have their own syllabus; reviews the output and publishes it to `decks/`. Uses `settings/` to import their own decks or adjust text size/language. | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) |
| 💻 **Build**: developer | Codes the app | Maintains the code, reviews PRs, deploys. | [`technical.md`](technical.md) |

> 💡 The end user is always someone with an intellectual disability.
> Content, language and interface decisions are always made with their
> experience in mind. What's out of their scope is purely technical
> decisions — not exclusion, just the support/build domain.

## Where to start, by profile

| If you are… | Start with… |
|---|---|
| 👤 End user or direct family member | The app — nothing else to read |
| ❤️ Family/teacher preparing content | [`creating-decks-guide.md`](creating-decks-guide.md) — full step-by-step |
| 🤔 Just want to understand what it is | [`SPEC.md`](SPEC.md) |
| 💻 Developer | [`technical.md`](technical.md) |
