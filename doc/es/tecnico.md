# tecnico.md — Arquitectura

El alcance, la audiencia y las reglas de producto están en
[`SPEC.md`](SPEC.md). Este documento es la fuente canónica de las decisiones
técnicas y de implementación.

## 1. Visión general

Sitio 100% estático, **vanilla HTML/CSS/JS puro** (sin build, sin
framework, sin dependencias de terceros, sin backend, sin ninguna
integración con ninguna API de IA en el código), desplegado como
Cloudflare Worker de assets estáticos. Las piezas que no son del sitio
público son las utilidades de `scripts/` (Node.js, offline, sin
ningún paquete npm): validan y dan forma al contenido, pero no lo
generan — eso lo hace el agente de IA de programación directamente
(ver §8).

```
memofun/
├── index.html            rejilla de barajas (inicio, persona usuaria)
├── app.js  ·  strings.es.js  ·  strings.en.js
├── manifest.json  ·  sw.js  ·  offline.html  ·  404.html
├── assets/
│   ├── css/  tokens.css · base.css · componentes.css
│   ├── js/   utils.js · i18n.js · tts.js · storage.js · feedback.js · deck-loader.js
│   ├── fonts/ Atkinson Hyperlegible + Nunito (.woff2)
│   └── img/decks/<slug>/ imágenes opcionales por tarjeta (ver §3.1), empaquetadas, no enlazadas
├── tools/study/          pantalla de repaso (flip-card)
├── settings/             zona de apoyo (texto, idioma, importar, borrar progreso)
├── decks/                manifest.json + *.json de barajas publicadas y revisadas
│   └── concepts/         registros de "qué ya está cubierto" por serie (solo agente, ver §8)
├── legal/                protección de datos
├── scripts/              config-parser.js · check.js · check-version-bump.js ·
│                         buscar-imagen.js (Node, offline salvo este último, ver §3.1)
├── config.md             ejemplo de config de contenido (ver §8)
└── doc/
    ├── es/ · en/         esta documentación
    └── curriculum/es/    biblioteca de índices curriculares Primaria→FP GM (ver README propio)
                          curriculum/en/ es una carpeta paralela vacía,
                          reservada para la misma biblioteca en otro
                          idioma
```

## 2. Módulos compartidos (`assets/js/`)

Namespace único `window.App`, cargados en este orden en cada página:
`utils.js` → `i18n.js` → `tts.js` → `storage.js` → `feedback.js` →
`deck-loader.js` → `strings.<locale>.js` de la página → `app.js` de la
página.

- **`App.utils`**: `$`, `$$`, `reducedMotion()`, `uid()`, `escapeHtml()`, `downloadBlob()`, `registerServiceWorker(path)` — registra el SW y, solo si es una actualización real (no la primera instalación), recarga la página en cuanto la versión nueva toma el control, en vez de dejar la pestaña abierta desactualizada en silencio hasta que alguien piense en forzar una recarga.
- **`App.i18n`**: `t(key)`, `pick(key)` (frase aleatoria de un array, para feedback), `register(dict, locale)`, `setLocale(locale)`, `apply(root)` (aplica `data-i18n`/`data-i18n-aria`/`data-i18n-meta`).
- **`App.tts`**: `speak(texto, [onEnd])` — Web Speech API, solo bajo demanda.
- **`App.storage`**: `get/set/remove/clearAll(key)` sobre `localStorage`, prefijo `memofun:`; `completeDeck(id)` para el contrato de progreso (§2.6 de `SPEC.md`).
- **`App.feedback`**: `success(zone)`, `encourage(zone)`, `celebrate(mensaje, after)` — Web Audio, sin archivos de sonido.
- **`App.decks`**: `readFile(file)` / `readUrl(url)` → `Promise<{tema, nivel, idioma, tarjetas}>`. Lee el JSON directamente con `fetch`/`File.text()` — sin ZIP, sin SQLite/WASM, sin ninguna librería externa.

## 3. Formato de una baraja

Memofun usa su **propio formato**, no el `.apkg` de Anki: un archivo
JSON plano.

```json
{
  "tema": "Docker y Contenedores",
  "nivel": "intermedio",
  "idioma": "es",
  "tarjetas": [
    { "pregunta": "...", "respuesta": "..." }
  ]
}
```

`pregunta` lleva la pista — la analogía cotidiana, el ejemplo práctico
o el "por qué importa" — cerrada con una pregunta corta que pide
nombrar o identificar el concepto; `respuesta` es SOLO ese
concepto/término, corto (1-6 palabras), envuelto en `<mark></mark>`
(ver las reglas de contenido en §8 y en `CLAUDE.md`). La pantalla de
estudio muestra `respuesta` como título grande y `pregunta` como texto
pequeño debajo (imagen, si la hay, a la izquierda —
`tools/study/app.js`), así que la propia analogía/ejemplo de
`pregunta` también va envuelta en un `<mark></mark>` (no toda la
pista, no la pregunta final) para llevar el mismo color de resaltado.
HTML simple únicamente (`<mark>`, `<b>`, `<i>`, `<br>`). `App.decks`
normaliza cualquier archivo con esta forma; un archivo sin `tarjetas`
(array) se rechaza.

### 3.1 Imagen opcional por tarjeta (`imagen`)

Una tarjeta puede llevar una foto/ilustración opcional como apoyo
visual a la explicación:

```json
{
  "pregunta": "Es una historia que se cuenta desde hace muchísimos años, de abuelos a nietos. ¿Cómo se llama esta clase de historia?",
  "respuesta": "<mark>Cuento popular</mark>",
  "imagen": {
    "archivo": "assets/img/decks/primaria_1_literatura/cuento-popular.jpg",
    "alt": "Portada de un libro de cuentos: una niña sentada, leyendo",
    "titulo": "Fairy Tales",
    "autor": "Boston Public Library",
    "fuente": "https://www.flickr.com/photos/24029425@N06/10871801484",
    "licencia": "CC BY 2.0"
  }
}
```

- `archivo`: ruta relativa a la raíz del sitio, dentro del propio
  repositorio en `assets/img/decks/<slug-de-la-baraja>/<archivo>.jpg`
  — **nunca** un enlace directo a un servicio externo. Las imágenes se
  descargan una vez, en el momento de preparar el contenido, y se
  publican como cualquier otro recurso estático: el sitio sigue sin
  hacer ninguna llamada externa en tiempo de ejecución (`SPEC.md`
  §2.1) y la imagen sigue funcionando sin conexión en cuanto se cachea
  (el manejador `fetch` genérico de `sw.js` la cachea en la primera
  visita, igual que el JSON de la baraja — no hace falta añadirla a
  `FILES`).
- `alt`: descripción llana de lo que la imagen muestra de verdad, en
  el idioma de la baraja — texto de accesibilidad, no un resumen de la
  tarjeta.
- `titulo` / `autor` / `fuente` / `licencia`: atribución de la obra
  original (Título/Autor/Fuente/Licencia, el convenio "TASL" de
  Creative Commons), que se muestra como pie de foto pequeño bajo la
  imagen. `licencia` debe ser una licencia que permita uso comercial y
  modificación sin restricciones extra — CC0, Dominio público, CC BY o
  CC BY-SA. Nunca una licencia `-NC` (no comercial) o `-ND` (sin
  obra derivada): `scripts/check.js` rechaza ambas.
- Los cinco campos son obligatorios cuando `imagen` está presente; una
  tarjeta sin `imagen` se ve exactamente igual que antes (la imagen es
  opcional, por tarjeta, no por baraja).
- **Las imágenes son siempre miniaturas. El archivo publicado TIENE que
  ser una miniatura de la fuente, no la imagen a resolución completa.**
  El repo se publica como static assets de Cloudflare Workers con un
  presupuesto total de ~25 MB para todo el sitio; una sola imagen a
  resolución completa de Openverse (suele ocupar 1-10 MB) revienta
  ese presupuesto ella sola, y encima es mucho más grande de lo que
  necesita una tarjeta — la tarjeta la renderiza a unos 300-400 px
  de ancho en el móvil, así que cualquier cosa por encima de eso son
  bytes gastados sin ganancia visible. El archivo publicado en
  `assets/img/decks/<slug-de-la-baraja>/<archivo>.<ext>` TIENE que
  ser, por tanto, una miniatura (≤1024 px en el lado largo) y TIENE
  que quedar por debajo de 200 KB en disco tras la descarga —
  `scripts/check.js` falla en seco por encima de 200 KB, un límite
  duro (no una preferencia estética blanda): un archivo tan grande ya
  es en sí mismo la prueba de que no es una miniatura de verdad, y
  varios así juntos revientan el presupuesto del deploy de Cloudflare.
  Orden de adquisición: (a) la URL
  `thumb` de Openverse desde `buscar-imagen.js`, que ya entra en ese
  rango (JPEGs de decenas de KB); (b) si esa URL falla con un 400,
  genera la miniatura tú mismo en vez de caer al fallback `image` a
  resolución completa — el campo `fuente` de la candidata de
  Openverse casi siempre apunta a Wikimedia Commons, y Wikimedia
  sirve una miniatura oficial de cualquier archivo vía
  `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<nombre>&width=800`
  (o su equivalente por API `?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800`
  sobre la página con ese `curid`), que es la misma foto a tamaño
  controlado y la herramienta correcta para este caso concreto —
  mismo autor, misma licencia, sólo más pequeña; (c) sólo si ni (a)
  ni (b) funcionan, aborta y reporta la imagen que falta — nunca
  recurras a la URL `image` a resolución completa como opción por
  defecto. `scripts/check.js` enforce el presupuesto, así que esta
  regla no puede colarse en silencio.
- Cómo buscarla: `node scripts/buscar-imagen.js "<término>"` busca en
  Openverse (openverse.org, sin necesidad de clave) restringido a esas
  mismas licencias seguras y lista candidatas — título, fuente, y una
  URL `thumb` y otra `image` de tamaño completo — para que una persona
  (o el agente) las revise y elija; no descarga ni elige nada
  automáticamente. La imagen publicada TIENE que venir de la URL
  `thumb`: es la misma foto a una fracción del tamaño, ya dentro del
  presupuesto de 200 KB. Si el proxy de miniaturas de Openverse falla
  con un 400 en algún origen concreto, genera la miniatura desde la
  fuente en lugar de caer al fallback `image` a resolución completa —
  ver el bullet de presupuesto de tamaño de arriba para el fallback
  `Special:FilePath` de Wikimedia. Elige a partir del texto
  (título/fuente) que imprime el script y trátalo como ya curado —
  nunca abras un archivo candidato para verlo, ni siquiera la elección
  final, eso gasta tokens de visión por un chequeo que el texto ya
  resuelve. Una imagen desajustada que se cuele la detecta después
  una persona leyendo la baraja y se reporta según
  `CONTRIBUTING.es.md`. Ver `guia-interna-crear-barajas.md` §3.1.

## 4. `decks/manifest.json`

Array de objetos:

```json
{ "id": "docker", "tema": "Docker y Contenedores", "nivel": "intermedio",
  "cantidad": 10, "file": "docker_memofun.json", "icono": "🐳" }
```

`id` se usa como clave en `localStorage` (`progreso.completado[id]`) —
puede ser simplemente el slug del archivo (legible, determinista, sin
necesidad de generar un hash). Quien escribe la baraja (el agente de
IA) añade esta entrada a mano tras revisar el contenido.

**`curso` / `asignatura` (opcionales)** — cadenas de texto libre (en
el mismo idioma que el contenido de la baraja, sin exigencia de
paridad ES/EN, igual que `tema`), por ejemplo:

```json
{ "id": "primaria-3-matematicas", "tema": "Matemáticas - 3º de Primaria",
  "nivel": "principiante", "curso": "3º de Primaria", "asignatura": "Matemáticas",
  "cantidad": 12, "file": "primaria_3_matematicas.json", "icono": "🔢" }
```

Si están presentes, la pantalla de inicio (`app.js`) agrupa las
barajas en curso → asignatura en vez de una rejilla plana — ver §4.1.
Al generar una baraja desde un archivo
`doc/curriculum/<idioma>/<etapa>/<curso>/<asignatura>.md`, deriva ambos campos
de la ruta/frontmatter (p. ej. `primaria/3/lengua-castellana.md` →
`curso: "3º de Primaria"`, `asignatura: "Lengua Castellana"`); déjalos sin
definir en barajas sueltas de "modo simple" sin curso propio — caen en
una sección plana de "otros temas", igual que antes de que existiera
este campo.

### 4.1 Navegación de la pantalla de inicio (cursos/asignaturas)

Todo se controla con los parámetros `?curso=&asignatura=` en
`index.html` — sin router ni framework, solo enlaces `<a href>`
normales, así que atrás/adelante y los marcadores funcionan gratis:

- Sin parámetro `curso`: tarjetas de curso (una por cada `curso` único
  entre las barajas), más una rejilla plana de "otros temas" para las
  barajas sin `curso`. Si ninguna baraja tiene `curso`, esto se reduce
  exactamente a la rejilla plana original (no aparece ningún nivel de
  curso).
- Con `curso`: tarjetas de asignatura de ese curso, más un botón para
  "fijar como mi curso" (`localStorage` `memofun:prefs.cursoFijado`).
  Una asignatura con una sola baraja enlaza directamente a ella; con
  más de una, primero muestra una rejilla pequeña de barajas.
- Curso fijado: aparece una tarjeta de "acceso rápido" al principio
  del nivel de cursos, que enlaza directamente a las asignaturas de
  ese curso.

Esto añade un nivel al flujo descrito en la regla 10 de §5 **solo**
para las barajas que usan `curso`/`asignatura` — las barajas planas no
se ven afectadas.

### 4.2 Versión en inglés (en) — temario con invitación a participar

Cuando `App.i18n.locale() === 'en'`, la pantalla de inicio **no
lee `decks/manifest.json` en absoluto**. Hoy todas las barajas
publicadas son contenido en español (el contenido de las barajas
no entra en la paridad i18n, ver `CLAUDE.md`); mostrar la rejilla
de barajas en español a una visita en inglés sería un callejón
sin salida silencioso. En su lugar, `app.js` renderiza un temario
en inglés hardcodeado (`EN_CURRICULUM` en `app.js`) que refleja
`doc/curriculum/en/`:

- **Nivel superior** — una tarjeta por etapa (`Key Stage 1` … `Key
  Stage 4`, `Entry Level Business`, `BTEC Business L2`), cada una
  enlazando a sus asignaturas vía `?en=1&curso=<etapa>`.
- **Nivel de asignatura** — una *tarjeta de invitación* por
  asignatura (`English Literature`, `Science`, `History`,
  `Geography`, etc.). La tarjeta **no** es un enlace a baraja:
  muestra la asignatura, el mensaje "Aún no hay baraja — sé el
  primero en aportar", y un botón que abre
  [`guia-interna-crear-barajas.md`](./guia-interna-crear-barajas.md)
  en GitHub, para que la visita caiga de lleno en el flujo que
  convierte un temario en baraja.

Los datos viven en `app.js` (no en el manifest) a propósito —
añadir al `manifest.json` forzaría a que existiera un
`decks/<slug>.json` real (la regla 8 de `check.js` falla si no), y
estas asignaturas aún no tienen barajas. `EN_CURRICULUM` es un
artefacto de taller, no un catálogo de barajas rastreado:
mantenlo en sincronía con `doc/curriculum/en/` por higiene de
autoría, igual que se hace con los logs de conceptos en español
(`decks/concepts/<base-slug>.md`).

El parámetro `?en=1` es obligatorio para la navegación EN, así
una visita que edita a mano una URL de baraja en español no puede
acabar en el flujo EN por accidente, ni al revés. Volver al UI
locale `es` (`localStorage 'memofun:locale'`) devuelve al flujo
del manifest sin más estado que resetear.

Cuando se publique la primera baraja real en inglés, la regla para
promocionar una asignatura de "tarjeta de invitación" a "tarjeta
de baraja" es la misma que para cualquier baraja en español
(`§4`): añadir el fichero `decks/<slug>.json`, añadir la entrada
correspondiente en `decks/manifest.json` con `curso`/`asignatura`
coincidiendo con la etapa y la asignatura de `EN_CURRICULUM`, y la
pantalla EN la mostrará automáticamente (el render EN sigue
bifurcando por locale; cuando exista una entrada de manifest para
una asignatura el camino EN puede optar por cambiar la tarjeta de
invitación por el enlace a la baraja real — ver
`renderEnSubjectLevel` en `app.js`).

## 5. Reglas de accesibilidad

1. Lectura Fácil: frases cortas, una idea por frase.
2. Botones ≥ 64×64 px, separación ≥ 16 px (`--button-min` en `tokens.css`).
3. Alto contraste, tema claro por defecto (WCAG AA mínimo).
4. Audio solo bajo demanda (`App.tts.speak`), nunca automático.
5. Sin cronómetros, sin puntuación negativa.
6. Refuerzo positivo al terminar una baraja: `App.feedback.celebrate()`.
7. Respetar `prefers-reduced-motion` (regla global en `base.css`).
8. Navegación por teclado completa (flechas para pasar de tarjeta; el
   botón "Ver la respuesta" y los demás controles se activan con
   Enter/Espacio, como cualquier botón; Enter/Espacio también activa
   la zona de importar).
9. ARIA en botones de icono (`data-i18n-aria`) y zonas de feedback
   (`aria-live`/`role="status"`).
10. Máximo 3 pantallas en el flujo principal (inicio → baraja →
    tarjeta); las barajas agrupadas por `curso`/`asignatura` añaden un
    nivel opcional (cursos → asignaturas → baraja → tarjeta) — ver §4.1.
11. Progreso solo positivo: ver contrato de `App.storage.completeDeck`.
12. Foco visible siempre (`:focus-visible` en `base.css`, nunca se quita).
13. Sin IA generativa, sin librerías de terceros ni llamadas de red no
    solicitadas en el producto público — ver `SPEC.md` §2.1.

## 6. Internacionalización

Ver [`I18N.md`](I18N.md). Resumen: `es` es la fuente de la verdad,
`en` debe mantener paridad. `App.i18n.register()` desde cada
`strings.<locale>.js`.

## 7. Despliegue

Cloudflare Workers (static assets). Ver [`CLOUDFLARE.md`](../../CLOUDFLARE.md).

## 8. Cómo se genera el contenido de una baraja

**No hay ningún script que llame a una API de IA.** El contenido lo
escribe directamente el agente de IA de programación (Claude Code u
otro) que trabaja en este repositorio, como parte de su rol de
apoyo/construcción — ver el ruleset completo en "Generating deck
content" de `CLAUDE.md`. Esto sustituyó a una versión anterior que sí
llamaba a la API REST de Gemini desde `scripts/generate.js`: se quitó
por completo, no solo del sitio público sino de todo el código — cero
API keys, cero llamadas de red a servicios de IA, en ningún archivo
del proyecto.

El **punto de ingesta de contenidos** sigue siendo un archivo Markdown
con frontmatter (`tema`, `nivel`, `cantidad`, `salida`, `idioma`
opcional) + el cuerpo del documento — el mismo formato de antes, solo
que ahora lo lee el agente directamente en vez de un script:

- **Solo `tema`**: el agente elige libremente los subtemas más
  relevantes para cubrir ese tema al nivel indicado.
- **`tema` + `# Índice`**: una sección `# Índice` (o `## Índice`, con
  cualquier nivel de encabezado) en el cuerpo del Markdown, con una
  lista de viñetas (`- subtema`). El agente reparte `cantidad` tarjetas
  entre todos los puntos, sin dejar ninguno sin tarjeta ni inventar
  otros. Útil cuando la persona de apoyo ya tiene un temario o guion
  claro y quiere que la baraja lo siga fielmente. Ver el ejemplo en
  `config.md`, o la biblioteca ya preparada en `doc/curriculum/`.

`scripts/config-parser.js` conserva el **análisis** de este formato
(`parseMarkdown()`, `parseIndice()`, `slugify()`) como funciones puras
sin red ni claves — las usa `scripts/check.js` para validar que todos
los archivos de `doc/curriculum/` tienen un frontmatter correcto y,
si declaran un índice, que no está vacío. No genera contenido; solo
entiende su forma.

**Flujo completo** (ver también `guia-interna-crear-barajas.md`):

1. Se pide al agente que genere una baraja, señalando un archivo de
   `doc/curriculum/` o un `config.md` nuevo.
2. El agente escribe las tarjetas siguiendo las reglas de
   `CLAUDE.md` → "Generating deck content" (aprendizaje significativo,
   Lectura Fácil, tono divertido, datos curiosos, cobertura del
   índice si lo hay).
3. El agente escribe `decks/<salida>.json` directamente (formato de §3).
4. El agente añade la entrada correspondiente a `decks/manifest.json`,
   con `curso`/`asignatura` si la baraja viene de un archivo de
   `doc/curriculum/` (ver §4).
5. Si la baraja amplía una serie existente (`literatura` → `_2` →
   `_3`…), el agente lee `decks/concepts/<base-slug>.md` en vez del
   JSON completo de cada otra baraja de la suite para ver qué está
   cubierto y cómo, y actualiza ese registro con lo que añadió la
   baraja nueva — ver `CLAUDE.md` → "Generating deck content" paso
   7. Este registro no lo lee nunca el sitio; es una herramienta de
   trabajo del agente, así que editarlo nunca requiere subir el
   `VERSION` de `sw.js`.
6. Se revisa el contenido (la propia persona que lo pidió, o el
   agente aplicando el checklist) antes de darlo por publicado.

## 9. `scripts/check.js` y `scripts/check-version-bump.js`

Mismo patrón que el resto de la familia de proyectos: comprobaciones
estructurales sin dependencias, pensadas para ejecutarse antes de cada
cambio.

- **`node scripts/check.js`**: sintaxis JS de todo el sitio, paridad de
  claves ES/EN, que `sw.js` no liste archivos inexistentes, que los
  iconos de `manifest.json` existan, que ninguna página de cara al
  usuario mencione discapacidad o lenguaje clínico, que el CSP de
  `_headers` esté bien formado, que cada `data-i18n*`/`App.i18n.t()`
  resuelva a una clave registrada, y que `decks/manifest.json` apunte a
  archivos `.json` reales con `tarjetas` no vacío.
- **`node scripts/check-version-bump.js`**: falla si un archivo listado
  en `sw.js` cambió en el diff sin subir `VERSION` (regla de
  `CLAUDE.md`). Se salta la comprobación si no hay repositorio git o no
  hay un commit anterior con el que comparar.

## 10. Patrón de la suite — cómo se construye cada app de Miralante

> 🌐 **Other language:** [English](../en/technical.md#8-suite-pattern-how-every-app-of-miralante-is-built)

Esta sección es la **guía canónica y transversal** de cómo se
construye y mantiene cada app de la [suite Miralante](https://apptonomia.uk).
Es la fuente de verdad que prevalece sobre el `technical.md`
(tecnico.md) de cualquier repo cuando entran en conflicto,
porque el objetivo es mantener las siete apps hermanas
(Apptonomia, Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon,
Routime) consistentes: misma forma, mismas convenciones,
mismo deploy, mismo i18n, mismo comportamiento offline.

Un cambio en esta sección es un **cambio transversal a la
suite** y debe aplicarse a todos los repos. Un cambio en
otras secciones de este archivo es específico del proyecto y
se queda ahí.

> **Fuente de verdad de las reglas de producto** en este
> repo: [`SPEC.md`](SPEC.md).
> **Fuente de verdad del i18n**: [`I18N.md`](I18N.md).
> Esta sección **no** redefine esas; codifica el patrón que
> todas comparten.

### 10.0 El patrón en un párrafo

Cada app de la suite Miralante es una **PWA estática, sin
dependencias y offline-first**, construida a partir del mismo
esqueleto mínimo:

1. Un conjunto pequeño de **páginas HTML standalone** en la
   raíz del repo (una sola actividad) o bajo `tools/<slug>/`
   (hubs multi-actividad).
2. Cada página es una **URL real y navegable** — **no hay
   routing SPA**, ni cambio de vista en la misma página, ni
   `pushState`. Cada página se recarga al entrar; la
   navegación entre páginas es un clic normal en un `<a>`.
3. Las rutas ocultas (`about/`, `team/`, `legal/`, `config/`)
   comparten la misma forma: `index.html` + `styles.css` + par
   `strings.<locale>.js`, con **interlinking en el pie** para
   que cualquiera de ellas esté a un clic de cualquier otra.
4. Un **service worker** (`sw.js`, network-first) cachea el
   shell (lista `FILES`, `VERSION` bumped) para que la app
   funcione offline.
5. **Sin paso de build**, sin `package.json`, sin frameworks,
   sin bundlers, sin CDNs de JS. La raíz del repo es el
   output de deploy.

### 10.1 La forma de las páginas standalone

Este es el patrón que siguen todas las rutas ocultas y todas
las rutas públicas. La forma es idéntica en la suite; solo
cambian los contenidos.

#### 10.1.1 El esqueleto de cinco carpetas

Cada app expone las mismas cinco carpetas:

```
<app>/
  index.html              # Entrada pública (la actividad)
  app.js                  # Lógica
  data.js                 # Layouts sin locale + contenido por locale
  strings.es.js           # Textos UI en español (fuente de verdad)
  strings.en.js           # Textos UI en inglés
  styles.css              # Estilos específicos de la app
  assets/
    css/{tokens,base,components}.css
    fonts/                # Atkinson Hyperlegible + Nunito autohospedados
    img/                  # Icono de la app + imágenes decorativas
    js/{utils,i18n,tts,storage,feedback}.js
  about/                  # Ruta oculta: presentación
    index.html
    styles.css
    strings.es.js
    strings.en.js
  team/                   # Ruta oculta: quiénes la hacen
    index.html
    styles.css
    strings.es.js
    strings.en.js
  legal/                  # Página de protección de datos (enlazada desde el pie)
    index.html
    styles.css
    strings.es.js
    strings.en.js
  config/                 # Ajustes (solo en apps que lo necesitan)
    index.html
    app.js
    styles.css
    strings.es.js
    strings.en.js
  manifest.json
  sw.js
  _headers
  404.html
  robots.txt
  sitemap.xml
```

Las apps de una sola actividad (Teclatlon, Okeymoney) ponen el
`index.html` en la raíz del repo. Las apps multi-actividad
(Apptonomia, Calculia) ponen `tools/<slug>/index.html` por
actividad y un landing `site/index.html`; las cuatro carpetas
ocultas viven en la raíz del repo.

#### 10.1.2 La concha HTML de una página standalone

Cada página standalone abre con el mismo boilerplate. Abajo,
la **plantilla**; las desviaciones se indican donde apliquen.

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="pageTitle">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Memofun — Sobre este proyecto</title>
  <!-- Hidden route: not linked from the main menu and should not be
       indexed. Aimed at anyone who wants to know what Teclatlon is:
       families, professionals, journalists, funders, contributors. -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="…">
  <meta name="theme-color" content="#FAF7F2">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container {legal|about}">
    <header class="cabecera-{legal|about}">
      <div class="idioma-selector" role="group" aria-label="Elegir idioma">
        <button type="button" class="btn-idioma" id="btnIdiomaEs"
                data-locale="es" aria-pressed="false">🇪🇸 Español</button>
        <button type="button" class="btn-idioma" id="btnIdiomaEn"
                data-locale="en" aria-pressed="false">🇬🇧 English</button>
      </div>
      <img src="../assets/img/icono.svg" alt="" width="80" height="80"
           class="logo-{legal|about}">
      <h1>…</h1>
      <p class="lema" data-i18n="tagline">…</p>
      <p class="entradilla" data-i18n="lead">…</p>
      <nav class="indice">…opcional, solo en páginas largas…</nav>
    </header>

    <main class="pila">
      <section class="card">…</section>
    </main>

    <footer class="pie-{legal|about}">
      <a class="btn btn-secundario" href="../"
         data-i18n="footerActivities">Ir a la aplicación</a>
      <a class="btn btn-secundario" href="../legal/"
         data-i18n="footerDataProtection">Protección de datos</a>
      <a class="btn btn-secundario" href="../about/"
         data-i18n="footerAbout">Sobre este proyecto</a>
      <a class="btn btn-secundario" href="../team/"
         data-i18n="footerTeamGuide">Quiénes la hacen</a>
      <a class="btn btn-secundario" href="../config/"
         data-i18n="footerSettings">Ajustes</a>
    </footer>
  </div>

  <script src="../assets/js/utils.js"></script>
  <script src="../assets/js/i18n.js"></script>
  <script src="strings.es.js"></script>
  <script src="strings.en.js"></script>
  <script>
    (function () {
      'use strict';
      function paintLanguageSelector() {
        var active = App.i18n.locale();
        document.getElementById('btnIdiomaEs')
          .setAttribute('aria-pressed', String(active === 'es'));
        document.getElementById('btnIdiomaEn')
          .setAttribute('aria-pressed', String(active === 'en'));
      }
      document.getElementById('btnIdiomaEs')
        .addEventListener('click', function () { App.i18n.setLocale('es'); });
      document.getElementById('btnIdiomaEn')
        .addEventListener('click', function () { App.i18n.setLocale('en'); });
      paintLanguageSelector();
    })();
  </script>
  <script>
    /* Register the SW from this entry point so it is active for any
       later navigation, matching what the main index.html and the
       other standalone pages already do. */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js').catch(function () {});
    }
  </script>
</body>
</html>
```

**Notas:**

- `data-i18n-title="pageTitle"` en `<html>` permite que
  `assets/js/i18n.js` rellene `document.title` durante
  `init()`. El `<title>` hardcoded es el fallback que la
  pestaña del navegador mostraría antes de que i18n.js se
  ejecute (y el fallback de la cache del SW).
- La clase propia de la página en el wrapper
  `<div class="container …">` es bajo la que `styles.css` de
  la página scopea sus reglas (`legal-page`, `about-page`,
  `team-page`). Sin prefijos ancestro `.sp-*` (eran residuo
  de la fusión SPA, retirado en 2026-09; ver `git log`).
- El pie es **siempre** los mismos cinco enlaces (en el mismo
  orden) en `about/`, `team/` y `legal/`. `config/` tiene un
  pie reducido que solo vuelve a la SPA. La raíz de la app
  (`index.html`) **no** renderiza este pie (tiene su propio
  pie con el botón de reset y el enlace a protección de datos
  — ver §2 arriba).

#### 10.1.3 El par de strings

Cada carpeta standalone trae su propio par `strings.es.js` /
`strings.en.js`. Siguen el patrón **clave plana,
IIFE-register**; `scripts/check.js` extrae el diccionario vía
`vm.createContext` con un stub `App.i18n.register` y verifica
la paridad de claves entre locales.

```javascript
/* legal/strings.es.js — texto de la página (ES). */
(function () {
  'use strict';
  App.i18n.register({
    pageTitle: 'Protección de datos',
    pageDescription: 'Teclatlon: qué datos guarda, dónde y por qué. …',
    routeNotice: 'Esta página no se enlaza desde la aplicación. …',
    tagline: 'Sin registro. Sin cookies. Sin analítica.',
    lead: 'Teclatlon no pide tus datos personales. …',
    navResponsible: 'Quién trata tus datos',
    navData: 'Qué guardamos',
    /* …más claves… */
    footerActivities: 'Ir a la aplicación',
    footerAbout: 'Sobre este proyecto',
    footerTeamGuide: 'Quiénes la hacen',
    footerSettings: 'Ajustes'
  }, 'es');
})();
```

Las claves son planas (sin namespacing tipo
`legal.pageTitle`); la página **es** el namespace, porque el
archivo vive en su propia carpeta. Las claves comunes
(`core.back`, `core.listen`, `core.dataProtection`) ya vienen
en `assets/js/i18n.js` y no se redefinen aquí.

#### 10.1.4 La hoja de estilos standalone

Cada carpeta standalone trae su propio `styles.css`. Es **el
antiguo `assets/css/subpages.css` dividido por página**, con
los prefijos ancestro `.sp-legal` / `.sp-about` eliminados
(eran residuo de la fusión SPA). La clase wrapper de la
página (`<div class="legal-page">`, `<div class="about-page">`,
etc.) es la que usa el CSS para scope:

```css
.legal-page { max-width: 880px; }
.legal-page .cabecera-legal { … }
.legal-page .indice a { … }
.legal-page section { … }
```

**No** introduzcas nombres de clase por página que colisionen
con los componentes compartidos (`base.css` ya define
`.cabecera`, `.lema`, `.indice`, `.btn`, `.card`, `.pila`, …).
Cuando la página standalone necesite un aspecto distinto,
scopea la regla bajo la clase de la página — nunca bajo un
`.cabecera` o `.indice` genérico.

### 10.2 El núcleo compartido

Cada app de la suite trae los mismos seis ficheros bajo
`assets/js/`, en el mismo orden de carga, con la misma forma
exportada. Adelgazar está permitido; **añadir** funcionalidad
de vuelta está prohibido a menos que sirva a una necesidad
concreta (las notas de adelgazamiento en §2.1 arriba son la
justificación canónica).

| Módulo | Superficie | Requerido por |
|---|---|---|
| `utils.js` | `App.utils.shuffle / $ / $$ / reducedMotion / wakeLock` | cada página |
| `i18n.js` | `App.i18n.{locale, setLocale, lang, register, t, pick, apply, SUPPORTED, DEFAULT_LOCALE, LABEL, FLAG}` | cada página |
| `tts.js` | `App.tts.speak` | solo páginas que leen en voz alta (la mayoría) |
| `storage.js` | `App.storage.{get, set, remove}` | solo páginas que leen o escriben `localStorage` (`index.html`, `config/`) |
| `feedback.js` | `App.feedback.{success, encourage, celebrate}` | solo el `app.js` de la actividad |

El orden de carga es `utils.js → i18n.js → tts.js → storage.js →
feedback.js → strings.<locale>.js → data.js → app.js`. `i18n.js`
debe cargar **antes** que `tts.js` y `feedback.js`, que leen
el idioma activo.

Tanto `strings.es.js` como `strings.en.js` cargan siempre (no
están gateados por `locale`); `App.i18n.locale()` decide cuál
está activo. El locale se elige primero de
`localStorage['teclatlon:locale']`, luego de `navigator.language`
(fallback `'es'`).

### 10.3 El contrato de la PWA

El service worker es **network-first, cache-fallback**,
declarado en `sw.js` y commiteado junto a `manifest.json`. El
contrato:

```javascript
var VERSION = 'teclatlon-vN';
var FILES = [
  './index.html',
  './404.html',
  './manifest.json',
  './app.js',
  './data.js',
  './strings.es.js',
  './strings.en.js',
  './styles.css',
  /* una entrada por fichero del shell, incluyendo cada
     index.html / styles.css / par strings.<locale>.js de las
     páginas standalone */
  './legal/index.html',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  /* …about/, team/, config/ igual… */
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/fonts/…woff2',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/img/icono.svg'
];
```

Dos reglas gobiernan cambios en `FILES`:

1. **Fichero nuevo → añadirlo a `FILES`.** El handler
   `install` mete cada fichero individualmente (nunca
   `cache.addAll`, que aborta en el primer fallo y rompe la
   cache para todos).
2. **Cualquier cambio en un fichero cacheado → bumpear
   `VERSION`** (`'teclatlon-vN'` → `'teclatlon-vN+1'`). Sin el
   bump, un usuario offline queda atascado en la versión
   vieja para siempre, porque el handler `activate` solo
   purga caches con un nombre distinto.

`scripts/check-version-bump.js` aplica (2): hace
`git show HEAD:sw.js` para ver qué `VERSION` había en el
último commit, lo compara contra el `VERSION` actual, y
verifica que `FILES` y el diff contra HEAD coincidan. Si no
coinciden, el script falla y el job `cache-bump` de CI
también falla.

Cada página standalone también ejecuta
`navigator.serviceWorker.register('../sw.js')` desde su
script inline, así una visita directa a `/legal/`,
`/about/` o `/team/` prima el SW para la raíz de la SPA del
mismo modo que hace `index.html`.

### 10.4 Invariantes de i18n

Estas son no negociables en toda la suite. Un cambio de
locale está incompleto hasta que **todos** los ficheros de
esta lista estén actualizados:

1. `assets/js/i18n.js#SUPPORTED` y `#DEFAULT_LOCALE`.
2. `assets/js/i18n.js#BCP47` (para selección de voz en
   `speechSynthesis`).
3. El detector pre-paint en `index.html` (el `<script>`
   inline que elige el locale antes del primer paint — ver
   §2.5 arriba).
4. `strings.<locale>.js` y cada par `strings.<locale>.js`
   por carpeta (`legal/`, `about/`, `team/`, `config/`).
5. `data.js`: cada array dividido por locale
   (`DATA.lessons.<locale>`, `DATA.words.<locale>`,
   `DATA.templates.<locale>`, `DATA.numpadSteps.<locale>`).
6. `sw.js`: añadir los nuevos `strings.<locale>.js` a
   `FILES` y bumpear `VERSION`.
7. `scripts/check.js`: la verificación de paridad funciona
   en N locales sin cambios de código (los coge todos vía
   `fs.readdirSync`); confirmar que el script sigue pasando
   tras añadir el locale.

La receta paso a paso completa (con código de ejemplo) está
en [`I18N.md`](I18N.md).

### 10.5 Lo que está **prohibido** (en toda la suite)

Estos son antipatrones observados en algún momento y
retirados explícitamente; el historial de commits es la fuente
de verdad de cada retirada. La regla es: "si te ves tentado
de usar uno de estos, para y vuelve a leer esta sección".

- **Sin SPA / sin `pushState` / sin secciones `view-*`.**
  Cada página es su propia URL. No fusionar `legal/`,
  `about/`, `team/` dentro de `index.html` como secciones
  ocultas, ni siquiera con un redirect shim. Se intentó en
  2026-09 (`spa: merge`) y se revirtió en la misma release;
  ver `git log` para las lecciones aprendidas. La
  navegación entre páginas debe ser siempre un clic real en
  un `<a>`, y cada ruta oculta debe estar a un clic de
  cualquier otra vía el pie compartido.
- **Sin `App.goLegal` / `App.goAbout` / `view-legal` /
  `view-about` / `sp-legal` / `sp-about` / `sp-idioma` /
  `subpages.css`.** Todos pertenecen al modelo de fusión
  SPA retirado.
- **Sin `_redirects` SPA catch-all.** Cloudflare lo
  rechaza como loop; documentado en `CLOUDFLARE.md` y en
  la receta de deploy.
- **Sin flash de `data-app-blocked="mobile"`.** El script
  pre-paint es un único `<script>` inline en `<head>`; no
  lo dividas en un `.js` aparte (CSP `script-src 'self'`
  lo permitiría, pero la garantía de timing síncrono solo
  se cumple con scripts inline en la cabeza).
- **Sin `package.json`, sin `node_modules`.** El repo es
  el output de build. Un package manifest forzaría a
  Cloudflare a ejecutar `npm install` en cada build,
  sobrepasando el límite de 25 MiB de assets.
- **Sin CDNs de JS.** Todas las fuentes, iconos y JS
  vienen en `assets/`.
- **Sin imports de ES modules** (`<script type="module">`).
  La app debe funcionar desde `file://` para uso offline;
  los ES modules rompen eso.
- **Sin base de datos en tiempo real, sin login, sin
  cookies, sin analítica.** La persistencia es solo
  `localStorage`.
- **Sin teclado en pantalla táctil** en apps que apuntan
  al teclado físico del ordenador (Teclatlon, importes
  tipeados de Okeymoney, palabras tipeadas de Sinonimia).
  El teclado en pantalla es solo decorativo.

### 10.6 Checklist de validación

Ejecutar esto en cada PR que toque cualquiera de los
ficheros de superficie (`*.html`, `*.js`, `*.css`, `sw.js`,
`manifest.json`, `data.js`):

```bash
node scripts/check.js           # debe reportar OK (N checks, sin fallos)
node scripts/check-version-bump.js   # debe pasar
```

Después abrir las páginas afectadas en un navegador en
`http://localhost:<puerto>/<ruta>` y recorrer el smoke
manual:

- `index.html` arranca en la pantalla de nombre o en el menú
  según el estado guardado; el roundtrip de `localStorage`
  funciona; el botón "🗑️ Borrar mi progreso" resetea tanto
  los datos como la UI.
- `/legal/` carga con el h1, lema y pie localizados; el
  selector de idioma cambia `lang`, `document.title` y cada
  texto `data-i18n` sin parpadeo de valores antiguos.
- `/about/` y `/team/` igual; sus enlaces del pie navegan
  entre ellos y a `/legal/` y `/config/` sin recargas
  antes de que el SW se prime.
- `/config/` lista el estado guardado y sus dos botones de
  reset funcionan (confirmación en dos pasos).
- Refrescar una vez tras la primera carga y verificar que
  `navigator.serviceWorker.controller` no es null.

Si algo falla, el cambio no encaja con el patrón de la suite
y debe revisarse antes de aterrizarlo.

### 10.7 Diferencias entre repos (lo que esta sección **no** cubre)

Cada app es una variante de una sola actividad del patrón de
arriba. Las diferencias por app — qué se comparte con la
suite, qué se adelgaza, y qué es intencionalmente distinto —
se documentan en el `tecnico.md` § "Other apps of the suite:
real differences" (la "diferencia específica del proyecto")
de cada repo. Usa esa sección para decidir si una
desviación en un repo es intencional antes de copiarla a
otro.

Esta sección canónica vive en el `tecnico.md` /
`technical.md` de **todos los repos** de la suite, mantenida
en sincronía. Si la cambias en un repo, espejéala en los
demás en el mismo PR.

### 10.8 Ver también

- §2 arriba — Recetas y contratos específicos de Teclatlon
  que se construyen sobre este patrón.
- [`I18N.md`](I18N.md) — Cómo añadir un idioma manteniendo
  las invariantes de i18n intactas.
- [`CLOUDFLARE.md`](../../CLOUDFLARE.md) — Contratos de
  deploy y SW/headers a nivel de Cloudflare Workers.
- [`SPEC.md`](SPEC.md) §"Mandatory rule" — Las invariantes
  de accesibilidad y "ninguna mención clínica" que cada
  página debe respetar.

---


