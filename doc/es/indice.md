# Índice de documentación — Memofun

> Mapa de navegación de la documentación. Para saber por dónde empezar
> según tu perfil, o los roles del proyecto, ver [`roles.md`](roles.md);
> para cómo contribuir, ver [`../../CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md).
>
> **App**: [memofun.apptonomia.uk](https://memofun.apptonomia.uk) · **Repositorio**: [github.com/miralante/memofun](https://github.com/miralante/memofun) · **Otro idioma**: [English](../en/index.md)

---

## 📂 Estructura de la documentación

```
doc/
├── es/
│   ├── indice.md   ← Este archivo (punto de entrada, ES)
│   ├── readme.md   ← Introducción en lectura fácil para la audiencia
│   ├── roles.md    ← Roles del proyecto
│   ├── spec.md     ← Definición de producto
│   ├── tecnico.md  ← Arquitectura técnica
│   ├── guia-ia-crear-barajas.md        ← Guía IA (punto de entrada)
│   ├── guia-interna-crear-barajas.md  ← Guía IA interna
│   ├── guia-chat-ia-crear-barajas.md  ← Guía IA por chat
│   ├── guia-crear-elementos.md         ← Guía crear elementos
│   ├── guia-rapida.md                 ← Guía rápida
│   ├── i18n.md     ← Internacionalización
│   ├── contenidos.md ← Catálogo de contenidos
│   └── equipo.md   ← Equipo
├── en/
│   ├── index.md   ← Punto de entrada, EN
│   ├── readme.md  ← Introducción en lectura fácil
│   ├── roles.md   ← Roles del proyecto
│   ├── spec.md    ← Product definition
│   ├── technical.md ← Technical architecture
│   ├── ai-creating-decks-guide.md       ← AI guide (entry point)
│   ├── internal-creating-decks-guide.md ← Internal AI guide
│   ├── chat-ai-creating-decks-guide.md  ← Chat AI guide
│   ├── creating-elements-guide.md       ← Creating elements guide
│   ├── quick-guide.md                  ← Quick guide
│   ├── i18n.md     ← Internationalization
│   ├── contents.md ← Content catalog
│   └── team.md    ← Team
└── curriculum/  ← Biblioteca curricular (ES + EN)
```

---

## 📋 Todos los documentos

| Documento | Para qué sirve |
|---|---|
| 👤 [`README.md`](README.md) | **Empieza aquí** — introducción en lectura fácil para personas usuarias y familias: qué es Memofun, características, cómo empezar, qué viene incluido. |
| [`SPEC.md`](SPEC.md) | Qué es Memofun, para quién, y las reglas innegociables (incluida la de "sin IA generativa en el producto"). |
| [`roles.md`](roles.md) | Los tres roles del proyecto y por dónde empieza cada uno. |
| [`tecnico.md`](tecnico.md) | Arquitectura, módulos JS compartidos, formato de baraja, reglas de accesibilidad. |
| [`guia-ia-crear-barajas.md`](guia-ia-crear-barajas.md) | Punto de entrada: qué guía seguir según si tu IA (Cowork, Cursor, ChatGPT…) tiene o no acceso al repositorio. |
| [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md) | Paso a paso para generar y publicar una baraja nueva con una IA que tiene acceso al repositorio (rol de apoyo, sin tocar código). |
| [`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md) | Lo mismo, pero con un chat de IA suelto (ChatGPT, Claude.ai…) sin acceso al repositorio. |
| [`I18N.md`](I18N.md) | Cómo funciona el español/inglés de la interfaz y cómo añadir textos o idiomas. |
| [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) | Despliegue en Cloudflare Workers. |
| [`../../CLAUDE.md`](../../CLAUDE.md) | Reglas para agentes de IA que toquen este repositorio. |
| [`../../CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) | Cómo contribuir código o contenido. |
