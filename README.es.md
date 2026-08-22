# Memofun 🧠

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** `https://memofun.miralante.workers.dev` (una vez desplegado)

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-success.svg)](#-caracter%C3%ADsticas)
[![Sitio estático](https://img.shields.io/badge/build-ninguno-informational.svg)](#-arranque-r%C3%A1pido)
[![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentaci%C3%B3n)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/ci.yml)

Una app de tarjetas de memoria (flashcards) para practicar con
**aprendizaje significativo**: cada tarjeta explica un concepto con una
analogía cotidiana, un ejemplo práctico o el "por qué importa", nunca
con una definición de diccionario. Pensada para que nuestros/as
usuarios/as tipo puedan repasar un tema de forma autónoma.

No hay build, no hay backend, no hay cuentas, no hay dependencias, y
**ninguna API de IA en ningún punto del código**: HTML, CSS y
JavaScript vanilla. El contenido de cada baraja lo escribe
directamente el agente de IA de programación que trabaja en este
proyecto (ver `CLAUDE.md`), no una llamada en directo desde la app.
Las barajas usan un formato JSON propio, no el `.apkg` de Anki.

- 🌐 **Aplicación**: [memofun.apptonomia.uk](https://memofun.apptonomia.uk/)
- 📦 **Repositorio**: [github.com/miralante/memofun](https://github.com/miralante/memofun)
- 💻 **Ejecutar en local**: abre `index.html` en un navegador, o sirve
  la carpeta con cualquier servidor estático (`npx serve .`).

---

## 🚀 Pruébalo en vivo

Abre `memofun.apptonomia.uk` en un navegador, instala la PWA en la
pantalla de inicio para usarla sin conexión, y elige una baraja para
empezar.

```bash
# o servir en local
npx serve .
```

## ✨ Características

- **Rejilla de barajas** en la pantalla de inicio — elegir y repasar,
  sin más pasos.
- **Repaso con tarjetas**: toca para girar, navega con flechas, escucha
  la tarjeta bajo demanda (🔊), sin cronómetro y sin corrección
  "bien/mal". Terminar una baraja suma una ⭐, guardada solo en tu
  dispositivo.
- **Accesibilidad**: botones grandes, alto contraste, tipografía
  Atkinson Hyperlegible, navegación por teclado, `prefers-reduced-motion`.
- **Español e inglés** en toda la interfaz.
- **Funciona sin conexión** una vez instalada (PWA).
- **Sin IA generativa en el producto**: no hay ninguna integración con
  ninguna API de IA en el código del sitio. El contenido lo escribe el
  agente de IA de programación directamente en el repositorio —
  ver [`doc/es/SPEC.md`](doc/es/SPEC.md) §2.1.

## 🛠️ Preparar / Ampliar contenido

Para preparar una baraja nueva (rol de apoyo): no hace falta
instalar nada ni tener ninguna API key. Pídeselo al agente de IA de
programación (Claude Code u otro) que trabaja en este proyecto:

> "Genera una baraja de Memofun sobre 'Docker y Contenedores', nivel
> intermedio, 10 tarjetas."

El agente escribe las tarjetas siguiendo las reglas de "Generating
deck content" en `CLAUDE.md`, crea el `.json` en `decks/` y añade la
entrada a `decks/manifest.json`. **Revisa el contenido** antes de
darlo por publicado (lectura fácil, sin lenguaje clínico, tono
divertido y algún dato curioso — ver [`doc/es/SPEC.md`](doc/es/SPEC.md) §2.5).

`config.md` (en la raíz) y [`doc/curriculum/`](doc/curriculum/) son
el punto de ingesta de contenidos: basta con un `tema` (el agente
elige los subtemas), o `tema` + una sección `# Índice` con una lista
de subtemas propia si ya tienes un temario y quieres que la baraja lo
siga punto por punto — ver la guía completa en
[`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md).

## 👥 Roles del proyecto

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (usuario/a tipo) | Repasa barajas que ya están preparadas | Abre `index.html` y usa `tools/study/`; no toca `settings/` ni pide barajas al agente | [La aplicación](index.html) |
| ❤️ **Apoyo** (familia, docente) | Pide al agente que escriba una baraja, la revisa y la publica | Abre un issue o habla con el agente; revisa el resultado contra el checklist antes de publicar | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| 💻 **Construcción** (desarrollador/a) | Programa la aplicación | Mantiene el código, revisa PRs, despliega | [`tecnico.md`](doc/es/tecnico.md) |

Ver [`doc/es/roles.md`](doc/es/roles.md) para el detalle de cada rol.

## ✅ Validar los cambios

```
node scripts/check.js
```

Comprueba sintaxis JS, paridad ES/EN, integridad de `sw.js`/`manifest.json`/
`decks/manifest.json`, y aplica la regla de cero menciones en la UI (ver
`CLAUDE.md`). Si tocaste un archivo cacheado por `sw.js`, además:

```
node scripts/check-version-bump.js
```

## ☁️ Despliegue

Memofun es un sitio totalmente estático (HTML/CSS/JS, sin build), así
que se publica directamente en **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
mediante su integración nativa con GitHub — no hay workflow personalizado
de GitHub Actions. Las cabeceras de seguridad HTTP viven en
[`_headers`](_headers), el fallback offline en [`offline.html`](offline.html),
y la metadata del proyecto en [`wrangler.toml`](wrangler.toml). Consulta
[`CLOUDFLARE.md`](CLOUDFLARE.md) con la guía completa (rebuild, rollback,
dominio personalizado, rotación de credenciales).

Las pull requests reciben automáticamente una URL de previsualización —
sin necesidad de un workflow extra.

## 📚 Documentación del proyecto (bilingüe)

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`doc/es/indice.md`](doc/es/indice.md) |
| 🇬🇧 English | [`doc/en/index.md`](doc/en/index.md) |

| Si quieres… | Empieza por… |
|---|---|
| Entender qué es Memofun y para quién es | [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Saber quién participa y cómo | [`doc/es/roles.md`](doc/es/roles.md) |
| Crear y publicar una baraja nueva, paso a paso | [`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md) |
| Ver la arquitectura técnica | [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Añadir una baraja, un idioma o tocar código | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| Que un agente de IA toque el código | `CLAUDE.md` (en inglés) |

## 🙌 Contribuir

Las contribuciones son bienvenidas. Consulta [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md)
para el flujo (o [`CONTRIBUTING.md`](CONTRIBUTING.md) para la versión en
inglés). Todas las personas participantes deben seguir
[`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

## 🔐 Seguridad

Memofun es un sitio estático completamente del lado del cliente: sin
backend, sin base de datos, sin telemetría, sin ninguna integración
con API de IA (el contenido se escribe en tiempo de autoría, no en
tiempo de ejecución). El modelo de amenaza es esencialmente "qué
podría hacer una página maliciosa offline contra el mismo origen",
algo que el navegador ya aísla. Ver [`SECURITY.es.md`](SECURITY.es.md)
(o [`SECURITY.md`](SECURITY.md)) para reportar una sospecha de
forma privada.

## 📄 Licencia

- El **código** (HTML/CSS/JS) es de quien contribuye, bajo
  licencia MIT (ver `LICENSE`).
- El **contenido de las barajas** (preguntas, respuestas) está bajo
  Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0), salvo que
  una baraja concreta indique lo contrario.

## 🧹 Mantenimiento

Este repo no tiene `node_modules` ni artefactos de build. La carpeta
`decks/concepts/` guarda un registro de taller (un fichero corto por
tema de baraja, p. ej. `literatura.md`) que ayuda al agente de IA a
no duplicar conceptos entre extensiones de barajas — ver
[`CLAUDE.md`](CLAUDE.md) §"Generating deck content" §7 para cómo se
usa. Nunca llega a la app y no necesita `VERSION` bump cuando cambia.

Para limpiar la caché local de la PWA durante el desarrollo,
desregistra el service worker desde DevTools (`Application → Service
workers → Unregister`) y borra los datos del sitio.

## 🙏 Créditos

La regla "sin IA en el producto" de Memofun se hereda de
[`SPEC.md`](../apptonomia/doc/es/SPEC.md) de Apptonomia. El contenido
de las barajas lo escribe directamente el agente de IA de programación
que trabaja en este repositorio (Claude Code u otro) — ver
[`CLAUDE.md`](CLAUDE.md) §"Generating deck content" para las reglas,
y [`doc/es/SPEC.md`](doc/es/SPEC.md) §2.5 para el tono y los
requisitos de lectura fácil.

La biblioteca `decks/curriculum/` se construye a partir del currículo
español de la Comunidad de Madrid y del English National Curriculum
(DfE) y las rutas vocacionales Entry Level / BTEC Level 2.

## 🧩 Proyectos hermanos

Este proyecto forma parte de un pequeño grupo de proyectos hermanos que
comparten autor, la misma filosofía de accesibilidad y sin backend, y
la misma historia de despliegue en Cloudflare. **Apptonomia es el
proyecto principal**; los demás salieron de él o se construyeron a su
lado sobre el mismo stack.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(principal)* | Actividades para rutinas y vida cotidiana (diseñado para nuestros/as usuarios/as tipo) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Cálculo y razonamiento lógico | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Routime | Actividades para rutinas y vida cotidiana | [github.com/miralante/routime](https://github.com/miralante/routime) |
| Sinonimia | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

La guía canónica de Cloudflare / despliegue para el grupo vive en
[`CLOUDFLARE.md` de Apptonomia](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
Este repo usa el modelo **Workers + static assets** — ver
[`CLOUDFLARE.md`](CLOUDFLARE.md) para la guía local.
