# Memofun 🧠

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** [memofun.apptonomia.uk](https://memofun.apptonomia.uk/)

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-success.svg)](#-caracter%C3%ADsticas)
[![Sitio estático](https://img.shields.io/badge/build-ninguno-informational.svg)](#-caracter%C3%ADsticas)
[![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentaci%C3%B3n-del-proyecto-biling%C3%BCe)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/ci.yml)

Una app de tarjetas de memoria (flashcards) para practicar con
**aprendizaje significativo**: cada tarjeta explica un concepto con
una analogía cotidiana, un ejemplo práctico o el "por qué importa",
nunca con una definición de diccionario. Pensada para que nuestras
personas tipo puedan repasar un tema de forma autónoma.

No hay build, no hay backend, no hay cuentas, no hay dependencias, y
**ninguna API de IA en ningún punto del código**: HTML, CSS y
JavaScript vanilla. El contenido de cada baraja lo escribe
directamente el agente de IA de programación que trabaja en este
proyecto (ver `CLAUDE.md`), no una llamada en directo desde la app.
Las barajas usan un formato JSON propio, no el `.apkg` de Anki.

- 🌐 **Aplicación**: [memofun.apptonomia.uk](https://memofun.apptonomia.uk/)
- 📦 **Repositorio**: [github.com/miralante/memofun](https://github.com/miralante/memofun)
- 💻 **Ejecutar en local**: abre `index.html` directamente en un
  navegador, o sirve la carpeta con cualquier servidor estático
  (`npx serve .` / `python -m http.server 8080`).

---

## 🚀 Pruébalo en vivo

Memofun está desplegada en **[memofun.apptonomia.uk](https://memofun.apptonomia.uk/)**
— ábrela en un navegador, instala la PWA en la pantalla de inicio
para usarla sin conexión, y elige una baraja para empezar. Sin
cuentas, sin llamadas a APIs de IA en tiempo de ejecución.

---

## ✨ Características

- **Rejilla de barajas** en la pantalla de inicio — elegir y repasar,
  sin más pasos.
- **Repaso con tarjetas**: toca para girar, navega con flechas,
  escucha la tarjeta bajo demanda (🔊), sin cronómetro y sin
  corrección "bien/mal". Terminar una baraja suma una ⭐, guardada
  solo en el dispositivo del usuario.
- **Accesibilidad**: botones grandes, alto contraste, tipografía
  Atkinson Hyperlegible, navegación por teclado,
  `prefers-reduced-motion`.
- **Español e inglés** en toda la interfaz.
- **Funciona sin conexión** una vez instalada (PWA).
- **Sin IA generativa en el producto**: no hay ninguna integración
  con ninguna API de IA en el código del sitio. El contenido lo
  escribe el agente de IA de programación directamente en el
  repositorio — ver [`doc/es/SPEC.md`](doc/es/SPEC.md) §2.1.
- 🪶 **Cero dependencias en tiempo de ejecución** — HTML/CSS/JS
  puros.
- 🔒 **Privacidad por defecto** — sin cuentas, sin cookies, sin
  analítica: el progreso solo se guarda en `localStorage` en el
  dispositivo del usuario.

---

## 👥 Roles del proyecto

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (persona tipo) | Repasa barajas que ya están preparadas | Abre `index.html` y usa `tools/study/`; no toca `settings/` ni pide barajas al agente | La aplicación (`index.html`) |
| ❤️ **Apoyo** (familia, docente) | Pide al agente que escriba una baraja, la revisa y la publica | Abre un issue o habla con el agente; revisa el resultado contra el checklist antes de publicar | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| 💻 **Construcción** (desarrollador/a) | Programa la aplicación | Mantiene el código, revisa PRs, despliega | [`tecnico.md`](doc/es/tecnico.md) |

Ver [`doc/es/roles.md`](doc/es/roles.md) para la descripción completa
de los roles y los patrones trio/par/único en el conjunto de la suite.

---

## 📚 Documentación del proyecto (bilingüe)

Toda la documentación del proyecto vive en la carpeta `doc/`:

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`doc/es/indice.md`](doc/es/indice.md) |
| 🇬🇧 English | [`doc/en/index.md`](doc/en/index.md) |

| Tema | Documento |
|---|---|
| Producto, audiencia, reglas de accesibilidad | [`doc/es/SPEC.md`](doc/es/SPEC.md) · [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| Roles (trio / par / único en la suite) | [`doc/es/roles.md`](doc/es/roles.md) · [`doc/en/roles.md`](doc/en/roles.md) |
| Cómo crear y publicar una baraja | [`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md) · [`doc/en/internal-creating-decks-guide.md`](doc/en/internal-creating-decks-guide.md) |
| Arquitectura y referencia técnica | [`doc/es/tecnico.md`](doc/es/tecnico.md) · [`doc/en/technical.md`](doc/en/technical.md) |
| Internacionalización (añadir un idioma) | [`doc/es/I18N.md`](doc/es/I18N.md) · [`doc/en/I18N.md`](doc/en/I18N.md) |
| Flujo operativo para agentes de IA | `CLAUDE.md` |

### 📄 Otros documentos del repo

| Documento | Para quién |
|---|---|
| [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) | Familias, terapeutas y desarrolladores que quieran contribuir |
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers para la suite (Memofun + Apptonomia + Calculia, Okeymoney, Sinonimia, Teclatlon) |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `config.md` | Punto de entrada del mantenedor para crear barajas (según el contrato del agente) |

---

## 🛠️ Preparar / Ampliar contenido

Para preparar una baraja nueva (rol de apoyo): no hace falta instalar
nada ni tener ninguna API key. Pídeselo al agente de IA de
programación (Claude Code u otro) que trabaja en este proyecto:

> "Genera una baraja de Memofun sobre 'Docker y Contenedores', nivel
> intermedio, 10 tarjetas."

El agente escribe las tarjetas siguiendo las reglas de "Generating
deck content" en `CLAUDE.md`, crea el `.json` en `decks/` y añade la
entrada a `decks/manifest.json`. **Revisa el contenido** antes de
darlo por publicado (lectura fácil, sin lenguaje clínico, tono
divertido y algún dato curioso — ver [`doc/es/SPEC.md`](doc/es/SPEC.md)
§2.5).

`config.md` (en la raíz) y [`doc/curriculum/`](doc/curriculum/) son
el punto de ingesta de contenidos: basta con un `tema` (el agente
elige los subtemas), o `tema` + una sección `# Índice` con una lista
de subtemas propia si ya tienes un temario y quieres que la baraja
lo siga punto por punto — ver la guía completa en
[`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md).

---

## ✅ Validar los cambios

```bash
node scripts/check.js
```

No hace falta `npm install` — el script solo usa la librería estándar
de Node. Comprueba sintaxis JS, paridad ES/EN, integridad de
`sw.js` / `manifest.json` / `decks/manifest.json`, y aplica la regla
de cero menciones en la UI (ver `CLAUDE.md`). Es el único paso de
"test" y corre en cada push y PR vía
[`.github/workflows/ci.yml`](.github/workflows/ci.yml).

Si tocas cualquier archivo cacheado por `sw.js`, sube el `VERSION`
en `sw.js` y ejecuta también:

```bash
node scripts/check-version-bump.js
```

---

## ☁️ Despliegue

Memofun es un sitio totalmente estático (HTML/CSS/JS, sin build), así
que se publica directamente en **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
mediante su integración nativa con GitHub. Las cabeceras de seguridad
HTTP viven en [`_headers`](_headers), el fallback offline en
[`offline.html`](offline.html), y la metadata del proyecto en
[`wrangler.toml`](wrangler.toml). Consulta [`CLOUDFLARE.md`](CLOUDFLARE.md)
con la guía completa (rebuild, rollback, dominio personalizado,
rotación de credenciales).

Las pull requests reciben automáticamente una URL de
previsualización en `*.<subdominio-cuenta>.workers.dev` — sin
necesidad de un workflow extra.

---

## 🔐 Seguridad

Memofun es un sitio estático completamente del lado del cliente: sin
backend, sin base de datos, sin telemetría, sin ninguna integración
con API de IA (el contenido se escribe en tiempo de autoría, no en
tiempo de ejecución). El modelo de amenaza es esencialmente "qué
podría hacer una página maliciosa offline contra el mismo origen",
algo que el navegador ya aísla. Ver [`SECURITY.es.md`](SECURITY.es.md)
(o [`SECURITY.md`](SECURITY.md)) para reportar una sospecha de forma
privada.

---

## 📄 Licencia

Memofun publica **dos** licencias, una por tipo de activo:

- El **código** (HTML/CSS/JS) es de quien contribuye, bajo **MIT**
  (ver [`LICENSE`](LICENSE)).
- El **contenido de las barajas** (preguntas, respuestas) está bajo
  **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)**,
  salvo que una baraja concreta indique lo contrario.

---

## 🧹 Mantenimiento

Este repo no tiene `node_modules` ni artefactos de build. La carpeta
`decks/concepts/` guarda un registro de taller (un fichero corto por
tema de baraja, p. ej. `literatura.md`) que ayuda al agente de IA a
no duplicar conceptos entre extensiones de barajas — ver `CLAUDE.md`
§"Generating deck content" §7 para cómo se usa. Nunca llega a la
app y no necesita `VERSION` bump cuando cambia.

Para limpiar la caché local de la PWA durante el desarrollo,
desregistra el service worker desde DevTools (`Application →
Service workers → Unregister`) y borra los datos del sitio.

---

## 🙏 Créditos

La regla "sin IA en el producto" de Memofun se hereda de
[`SPEC.md`](../apptonomia/doc/es/SPEC.md) de Apptonomia. El contenido
de las barajas lo escribe directamente el agente de IA de
programación que trabaja en este repositorio (Claude Code u otro) —
ver `CLAUDE.md` §"Generating deck content" para las reglas, y
[`doc/es/SPEC.md`](doc/es/SPEC.md) §2.5 para el tono y los
requisitos de lectura fácil.

La biblioteca `decks/curriculum/` se construye a partir del
currículo español de la Comunidad de Madrid y del English National
Curriculum (DfE) y las rutas vocacionales Entry Level / BTEC Level 2.

---

## 🇬🇧 Cómo ayudar — construyendo la versión en inglés

La interfaz, los documentos y las reglas son bilingües (español por
defecto, espejo en inglés). **El contenido de las barajas y la
biblioteca curricular detrás, sin embargo, son específicos por
idioma**: la carpeta `decks/` y [`doc/curriculum/`](doc/curriculum/)
están poblados para español (Comunidad de Madrid) pero el currículo
en inglés está **parcialmente construido y necesita manos**. Aún
**no hay ficheros JSON de barajas en inglés** — esta sección es la
invitación abierta a escribirlos. Si puedes ayudar con cualquiera de
las siguientes tareas, un issue o un PR son bienvenidos — consulta
[`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) para el flujo, y el
[README del currículo en inglés](doc/curriculum/en/README.md) para
las lagunas exactas.

Maneras concretas de ayudar:

- **Elige un temario en inglés y pide su baraja.** El punto de
  entrada más simple: abre cualquier fichero bajo
  [`doc/curriculum/en/`](doc/curriculum/en/) (p. ej.
  `key-stage-2/3/english-literature.md`) y pide al agente de IA de
  programación "genera la baraja para este temario". El agente lee
  el fichero, escribe `decks/<slug>.json` y añade la entrada a
  `decks/manifest.json`. Tú lo revisas contra el checklist de la
  [guía interna en inglés](doc/en/internal-creating-decks-guide.md)
  §4 antes de publicarlo.
- **Autoría o revisión de un fichero índice de currículo** bajo
  [`doc/curriculum/en/`](doc/curriculum/en/) — Key Stage 1–4 (Years
  1–11) y las rutas vocacionales Entry Level / BTEC Level 2.
  Formato y frontmatter están descritos en §2 de la misma guía —
  misma forma que los ficheros en español de
  [`doc/curriculum/es/`](doc/curriculum/es/).
- **Nota**: las barajas en inglés de esta carpeta son **solo
  literatura inglesa** — cuentos, poemas, obras, autores y
  movimientos. Fonética, ortografía y gramática quedan fuera de
  alcance a propósito (nuestra audiencia se encuentra con el inglés
  como segunda lengua, y la literatura viaja mejor que la
  ortografía). Encaja con el hilo `literatura` de la biblioteca en
  español.
- **Revisa un fichero de currículo en inglés** contra el English
  National Curriculum (DfE) vigente o la especificación GCSE de tu
  board (AQA, OCR, Edexcel) — incluso una pequeña corrección factual
  importa.
- **Traduce cadenas de UI** que hayan derivado entre
  [`strings.en.js`](strings.en.js) y [`strings.es.js`](strings.es.js)
  — `node scripts/check.js` ya impone paridad, pero la calidad de
  la traducción a menudo necesita una segunda pasada humana.
- **Abre un issue** describiendo una laguna (un año que falta, una
  materia GCSE que falta, una unidad vocacional que falta) — eso
  ayuda a otra persona a recogerlo.

No necesitas conocer todo el proyecto para ayudar: cada una de
estas tareas es una contribución autocontenida con una forma clara
y un checklist claro. Consulta [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md)
para el flujo exacto de PR y [`doc/es/SPEC.md`](doc/es/SPEC.md)
para las reglas innegociables que toda contribución debe respetar
(sin IA en el producto, lectura fácil, sin lenguaje clínico, etc.).

---

## 🌐 La suite Miralante — proyectos del grupo

Memofun es una de las **seis apps** de la suite **Miralante**, que
comparten autor, la misma filosofía de accesibilidad sin backend y la
misma historia de despliegue en Cloudflare. Apptonomia, además de ser
una app en sí misma, actúa como **portal de la suite** que la presenta
al mundo. Ninguno de los siete repos es el "principal" — son iguales;
este es el producto original del que nació el grupo.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(portal — landing only, no es app)* | Landing que presenta la suite Miralante (no es una app en tiempo de ejecución) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Calculia](https://calculia.apptonomia.uk/) | Cálculo y razonamiento lógico | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Memofun](https://memofun.apptonomia.uk/) | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Routime](https://routime.apptonomia.uk/) | Actividades para rutinas y vida cotidiana | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

La guía canónica de Cloudflare / despliegue para el grupo vive en
[`CLOUDFLARE.md` de Apptonomia](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
Este repo usa el modelo **Workers + static assets** — ver
[`CLOUDFLARE.md`](CLOUDFLARE.md) para la guía local.

## More about this project

- [About this project](https://memofun.apptonomia.uk/about/)
