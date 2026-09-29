# Documentation index — Memofun

> Navigation map for the documentation. For where to start by profile, and
> for project roles, see [`roles.md`](roles.md); for how to contribute, see
> [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
>
> **App**: [memofun.apptonomia.uk](https://memofun.apptonomia.uk) · **Repository**: [github.com/miralante/memofun](https://github.com/miralante/memofun) · **Other language**: [Español](../es/indice.md)

---

## 📂 Documentation structure

```
doc/
├── es/
│   ├── indice.md   ← Entry point, ES
│   ├── readme.md  ← Easy-read intro for end users
│   ├── roles.md   ← Project roles
│   ├── spec.md    ← Product definition
│   ├── tecnico.md ← Technical architecture
│   ├── guia-ia-crear-barajas.md        ← AI guide (entry point)
│   ├── guia-interna-crear-barajas.md   ← Internal AI guide
│   ├── guia-chat-ia-crear-barajas.md   ← Chat AI guide
│   ├── guia-crear-elementos.md         ← Creating elements guide
│   ├── guia-rapida.md                  ← Quick guide
│   ├── i18n.md     ← Internationalization
│   ├── contenidos.md ← Content catalog
│   └── equipo.md   ← Team
├── en/
│   ├── index.md   ← This file (entry point, EN)
│   ├── readme.md  ← Easy-read intro for end users
│   ├── roles.md   ← Project roles
│   ├── spec.md    ← Product definition
│   ├── technical.md ← Technical architecture
│   ├── ai-creating-decks-guide.md        ← AI guide (entry point)
│   ├── internal-creating-decks-guide.md  ← Internal AI guide
│   ├── chat-ai-creating-decks-guide.md   ← Chat AI guide
│   ├── creating-elements-guide.md        ← Creating elements guide
│   ├── quick-guide.md                   ← Quick guide
│   ├── i18n.md     ← Internationalization
│   ├── contents.md ← Content catalog
│   └── team.md    ← Team
└── curriculum/  ← Curriculum library (ES + EN)
```

---

## 📋 All documents

| Document | What it's for |
|---|---|
| 👤 [`README.md`](README.md) | **Start here** — easy-read intro for end users and families: what Memofun is, key features, how to start, what ships out of the box. |
| [`SPEC.md`](SPEC.md) | What Memofun is, who it's for, and the non-negotiable rules (including "no generative AI in the product"). |
| [`roles.md`](roles.md) | The project's three roles and where each one starts. |
| [`technical.md`](technical.md) | Architecture, shared JS modules, deck file format, accessibility rules. |
| [`ai-creating-decks-guide.md`](ai-creating-decks-guide.md) | Entry point: which guide to follow depending on whether your AI (Cowork, Cursor, ChatGPT…) has repo access or not. |
| [`internal-creating-decks-guide.md`](internal-creating-decks-guide.md) | Step-by-step guide to generating and publishing a new deck with an AI that has repo access (support role, no code involved). |
| [`chat-ai-creating-decks-guide.md`](chat-ai-creating-decks-guide.md) | Same, but with a standalone AI chat (ChatGPT, Claude.ai…) that has no access to the repository. |
| [`I18N.md`](I18N.md) | How the Spanish/English UI works and how to add strings or languages. |
| [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) | Cloudflare Workers deployment. |
| [`../../CLAUDE.md`](../../CLAUDE.md) | Rules for AI agents working in this repo. |
| [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) | How to contribute code or content. |
