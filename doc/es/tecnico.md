# tecnico.md â€” Arquitectura

El alcance, la audiencia y las reglas de producto estÃ¡n en
[`SPEC.md`](SPEC.md). Este documento es la fuente canÃ³nica de las decisiones
tÃ©cnicas y de implementaciÃ³n.

## 1. VisiÃ³n general

Sitio 100% estÃ¡tico, **vanilla HTML/CSS/JS puro** (sin build, sin
framework, sin dependencias de terceros, sin backend, sin ninguna
integraciÃ³n con ninguna API de IA en el cÃ³digo), desplegado como
Cloudflare Worker de assets estÃ¡ticos. Las piezas que no son del sitio
pÃºblico son las utilidades de `scripts/` (Node.js, offline, sin
ningÃºn paquete npm): validan y dan forma al contenido, pero no lo
generan â€” eso lo hace el agente de IA de programaciÃ³n directamente
(ver §8).

```
memofun/
â”œâ”€â”€ index.html            rejilla de barajas (inicio, persona usuaria)
â”œâ”€â”€ app.js  ·  strings.es.js  ·  strings.en.js
â”œâ”€â”€ manifest.json  ·  sw.js  ·  offline.html  ·  404.html
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ css/  tokens.css · base.css · componentes.css
â”‚   â”œâ”€â”€ js/   utils.js · i18n.js · tts.js · storage.js · feedback.js · deck-loader.js
â”‚   â”œâ”€â”€ fonts/ Atkinson Hyperlegible + Nunito (.woff2)
â”‚   â””â”€â”€ img/decks/<slug>/ imÃ¡genes opcionales por tarjeta (ver §3.1), empaquetadas, no enlazadas
â”œâ”€â”€ tools/study/          pantalla de repaso (flip-card)
â”œâ”€â”€ settings/             zona de apoyo (texto, idioma, importar, borrar progreso)
â”œâ”€â”€ decks/                manifest.json + *.json de barajas publicadas y revisadas
â”‚   â””â”€â”€ concepts/         registros de "quÃ© ya estÃ¡ cubierto" por serie (solo agente, ver §8)
â”œâ”€â”€ legal/                protecciÃ³n de datos
â”œâ”€â”€ scripts/              config-parser.js · check.js · check-version-bump.js ·
â”‚                         buscar-imagen.js (Node, offline salvo este Ãºltimo, ver §3.1)
â”œâ”€â”€ config.md             ejemplo de config de contenido (ver §8)
â””â”€â”€ doc/
    â”œâ”€â”€ es/ · en/         esta documentaciÃ³n
    â””â”€â”€ curriculum/es/    biblioteca de Ã­ndices curriculares Primariaâ†’FP GM (ver README propio)
                          curriculum/en/ es una carpeta paralela vacÃ­a,
                          reservada para la misma biblioteca en otro
                          idioma
```

## 2. MÃ³dulos compartidos (`assets/js/`)

Namespace Ãºnico `window.App`, cargados en este orden en cada pÃ¡gina:
`utils.js` â†’ `i18n.js` â†’ `tts.js` â†’ `storage.js` â†’ `feedback.js` â†’
`deck-loader.js` â†’ `strings.<locale>.js` de la pÃ¡gina â†’ `app.js` de la
pÃ¡gina.

- **`App.utils`**: `$`, `$$`, `reducedMotion()`, `uid()`, `escapeHtml()`, `downloadBlob()`, `registerServiceWorker(path)` â€” registra el SW y, solo si es una actualizaciÃ³n real (no la primera instalaciÃ³n), recarga la pÃ¡gina en cuanto la versiÃ³n nueva toma el control, en vez de dejar la pestaÃ±a abierta desactualizada en silencio hasta que alguien piense en forzar una recarga.
- **`App.i18n`**: `t(key)`, `pick(key)` (frase aleatoria de un array, para feedback), `register(dict, locale)`, `setLocale(locale)`, `apply(root)` (aplica `data-i18n`/`data-i18n-aria`/`data-i18n-meta`).
- **`App.tts`**: `speak(texto, [onEnd])` â€” Web Speech API, solo bajo demanda.
- **`App.storage`**: `get/set/remove/clearAll(key)` sobre `localStorage`, prefijo `memofun:`; `completeDeck(id)` para el contrato de progreso (§2.6 de `SPEC.md`).
- **`App.feedback`**: `success(zone)`, `encourage(zone)`, `celebrate(mensaje, after)` â€” Web Audio, sin archivos de sonido.
- **`App.decks`**: `readFile(file)` / `readUrl(url)` â†’ `Promise<{tema, nivel, idioma, tarjetas}>`. Lee el JSON directamente con `fetch`/`File.text()` â€” sin ZIP, sin SQLite/WASM, sin ninguna librerÃ­a externa.

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

`pregunta` lleva la pista â€” la analogÃ­a cotidiana, el ejemplo prÃ¡ctico
o el "por quÃ© importa" â€” cerrada con una pregunta corta que pide
nombrar o identificar el concepto; `respuesta` es SOLO ese
concepto/tÃ©rmino, corto (1-6 palabras), envuelto en `<mark></mark>`
(ver las reglas de contenido en §8 y en `CLAUDE.md`). La pantalla de
estudio muestra `respuesta` como tÃ­tulo grande y `pregunta` como texto
pequeÃ±o debajo (imagen, si la hay, a la izquierda â€”
`tools/study/app.js`), asÃ­ que la propia analogÃ­a/ejemplo de
`pregunta` tambiÃ©n va envuelta en un `<mark></mark>` (no toda la
pista, no la pregunta final) para llevar el mismo color de resaltado.
HTML simple Ãºnicamente (`<mark>`, `<b>`, `<i>`, `<br>`). `App.decks`
normaliza cualquier archivo con esta forma; un archivo sin `tarjetas`
(array) se rechaza.

### 3.1 Imagen opcional por tarjeta (`imagen`)

Una tarjeta puede llevar una foto/ilustraciÃ³n opcional como apoyo
visual a la explicaciÃ³n:

```json
{
  "pregunta": "Es una historia que se cuenta desde hace muchÃ­simos aÃ±os, de abuelos a nietos. Â¿CÃ³mo se llama esta clase de historia?",
  "respuesta": "<mark>Cuento popular</mark>",
  "imagen": {
    "archivo": "assets/img/decks/primaria_1_literatura/cuento-popular.jpg",
    "alt": "Portada de un libro de cuentos: una niÃ±a sentada, leyendo",
    "titulo": "Fairy Tales",
    "autor": "Boston Public Library",
    "fuente": "https://www.flickr.com/photos/24029425@N06/10871801484",
    "licencia": "CC BY 2.0"
  }
}
```

- `archivo`: ruta relativa a la raÃ­z del sitio, dentro del propio
  repositorio en `assets/img/decks/<slug-de-la-baraja>/<archivo>.jpg`
  â€” **nunca** un enlace directo a un servicio externo. Las imÃ¡genes se
  descargan una vez, en el momento de preparar el contenido, y se
  publican como cualquier otro recurso estÃ¡tico: el sitio sigue sin
  hacer ninguna llamada externa en tiempo de ejecuciÃ³n (`SPEC.md`
  §2.1) y la imagen sigue funcionando sin conexiÃ³n en cuanto se cachea
  (el manejador `fetch` genÃ©rico de `sw.js` la cachea en la primera
  visita, igual que el JSON de la baraja â€” no hace falta aÃ±adirla a
  `FILES`).
- `alt`: descripciÃ³n llana de lo que la imagen muestra de verdad, en
  el idioma de la baraja â€” texto de accesibilidad, no un resumen de la
  tarjeta.
- `titulo` / `autor` / `fuente` / `licencia`: atribuciÃ³n de la obra
  original (TÃ­tulo/Autor/Fuente/Licencia, el convenio "TASL" de
  Creative Commons), que se muestra como pie de foto pequeÃ±o bajo la
  imagen. `licencia` debe ser una licencia que permita uso comercial y
  modificaciÃ³n sin restricciones extra â€” CC0, Dominio pÃºblico, CC BY o
  CC BY-SA. Nunca una licencia `-NC` (no comercial) o `-ND` (sin
  obra derivada): `scripts/check.js` rechaza ambas.
- Los cinco campos son obligatorios cuando `imagen` estÃ¡ presente; una
  tarjeta sin `imagen` se ve exactamente igual que antes (la imagen es
  opcional, por tarjeta, no por baraja).
- **Las imÃ¡genes son siempre miniaturas. El archivo publicado TIENE que
  ser una miniatura de la fuente, no la imagen a resoluciÃ³n completa.**
  El repo se publica como static assets de Cloudflare Workers con un
  presupuesto total de ~25 MB para todo el sitio; una sola imagen a
  resoluciÃ³n completa de Openverse (suele ocupar 1-10 MB) revienta
  ese presupuesto ella sola, y encima es mucho mÃ¡s grande de lo que
  necesita una tarjeta â€” la tarjeta la renderiza a unos 300-400 px
  de ancho en el mÃ³vil, asÃ­ que cualquier cosa por encima de eso son
  bytes gastados sin ganancia visible. El archivo publicado en
  `assets/img/decks/<slug-de-la-baraja>/<archivo>.<ext>` TIENE que
  ser, por tanto, una miniatura (â‰¤1024 px en el lado largo) y TIENE
  que quedar por debajo de 200 KB en disco tras la descarga â€”
  `scripts/check.js` falla en seco por encima de 200 KB, un lÃ­mite
  duro (no una preferencia estÃ©tica blanda): un archivo tan grande ya
  es en sÃ­ mismo la prueba de que no es una miniatura de verdad, y
  varios asÃ­ juntos revientan el presupuesto del deploy de Cloudflare.
  Orden de adquisiciÃ³n: (a) la URL
  `thumb` de Openverse desde `buscar-imagen.js`, que ya entra en ese
  rango (JPEGs de decenas de KB); (b) si esa URL falla con un 400,
  genera la miniatura tÃº mismo en vez de caer al fallback `image` a
  resoluciÃ³n completa â€” el campo `fuente` de la candidata de
  Openverse casi siempre apunta a Wikimedia Commons, y Wikimedia
  sirve una miniatura oficial de cualquier archivo vÃ­a
  `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<nombre>&width=800`
  (o su equivalente por API `?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800`
  sobre la pÃ¡gina con ese `curid`), que es la misma foto a tamaÃ±o
  controlado y la herramienta correcta para este caso concreto â€”
  mismo autor, misma licencia, sÃ³lo mÃ¡s pequeÃ±a; (c) sÃ³lo si ni (a)
  ni (b) funcionan, aborta y reporta la imagen que falta â€” nunca
  recurras a la URL `image` a resoluciÃ³n completa como opciÃ³n por
  defecto. `scripts/check.js` enforce el presupuesto, asÃ­ que esta
  regla no puede colarse en silencio.
- CÃ³mo buscarla: `node scripts/buscar-imagen.js "<tÃ©rmino>"` busca en
  Openverse (openverse.org, sin necesidad de clave) restringido a esas
  mismas licencias seguras y lista candidatas â€” tÃ­tulo, fuente, y una
  URL `thumb` y otra `image` de tamaÃ±o completo â€” para que una persona
  (o el agente) las revise y elija; no descarga ni elige nada
  automÃ¡ticamente. La imagen publicada TIENE que venir de la URL
  `thumb`: es la misma foto a una fracciÃ³n del tamaÃ±o, ya dentro del
  presupuesto de 200 KB. Si el proxy de miniaturas de Openverse falla
  con un 400 en algÃºn origen concreto, genera la miniatura desde la
  fuente en lugar de caer al fallback `image` a resoluciÃ³n completa â€”
  ver el bullet de presupuesto de tamaÃ±o de arriba para el fallback
  `Special:FilePath` de Wikimedia. Elige a partir del texto
  (tÃ­tulo/fuente) que imprime el script y trÃ¡talo como ya curado â€”
  nunca abras un archivo candidato para verlo, ni siquiera la elecciÃ³n
  final, eso gasta tokens de visiÃ³n por un chequeo que el texto ya
  resuelve. Una imagen desajustada que se cuele la detecta despuÃ©s
  una persona leyendo la baraja y se reporta segÃºn
  `CONTRIBUTING.es.md`. Ver `guia-interna-crear-barajas.md` §3.1.

## 4. `decks/manifest.json`

Array de objetos:

```json
{ "id": "docker", "tema": "Docker y Contenedores", "nivel": "intermedio",
  "cantidad": 10, "file": "docker_memofun.json", "icono": "ðŸ³" }
```

`id` se usa como clave en `localStorage` (`progreso.completado[id]`) â€”
puede ser simplemente el slug del archivo (legible, determinista, sin
necesidad de generar un hash). Quien escribe la baraja (el agente de
IA) aÃ±ade esta entrada a mano tras revisar el contenido.

**`curso` / `asignatura` (opcionales)** â€” cadenas de texto libre (en
el mismo idioma que el contenido de la baraja, sin exigencia de
paridad ES/EN, igual que `tema`), por ejemplo:

```json
{ "id": "primaria-3-matematicas", "tema": "MatemÃ¡ticas - 3Âº de Primaria",
  "nivel": "principiante", "curso": "3Âº de Primaria", "asignatura": "MatemÃ¡ticas",
  "cantidad": 12, "file": "primaria_3_matematicas.json", "icono": "ðŸ”¢" }
```

Si estÃ¡n presentes, la pantalla de inicio (`app.js`) agrupa las
barajas en curso â†’ asignatura en vez de una rejilla plana â€” ver §4.1.
Al generar una baraja desde un archivo
`doc/curriculum/<idioma>/<etapa>/<curso>/<asignatura>.md`, deriva ambos campos
de la ruta/frontmatter (p. ej. `primaria/3/lengua-castellana.md` â†’
`curso: "3Âº de Primaria"`, `asignatura: "Lengua Castellana"`); dÃ©jalos sin
definir en barajas sueltas de "modo simple" sin curso propio â€” caen en
una secciÃ³n plana de "otros temas", igual que antes de que existiera
este campo.

### 4.1 NavegaciÃ³n de la pantalla de inicio (cursos/asignaturas)

Todo se controla con los parÃ¡metros `?curso=&asignatura=` en
`index.html` â€” sin router ni framework, solo enlaces `<a href>`
normales, asÃ­ que atrÃ¡s/adelante y los marcadores funcionan gratis:

- Sin parÃ¡metro `curso`: tarjetas de curso (una por cada `curso` Ãºnico
  entre las barajas), mÃ¡s una rejilla plana de "otros temas" para las
  barajas sin `curso`. Si ninguna baraja tiene `curso`, esto se reduce
  exactamente a la rejilla plana original (no aparece ningÃºn nivel de
  curso).
- Con `curso`: tarjetas de asignatura de ese curso, mÃ¡s un botÃ³n para
  "fijar como mi curso" (`localStorage` `memofun:prefs.cursoFijado`).
  Una asignatura con una sola baraja enlaza directamente a ella; con
  mÃ¡s de una, primero muestra una rejilla pequeÃ±a de barajas.
- Curso fijado: aparece una tarjeta de "acceso rÃ¡pido" al principio
  del nivel de cursos, que enlaza directamente a las asignaturas de
  ese curso.

Esto aÃ±ade un nivel al flujo descrito en la regla 10 de §5 **solo**
para las barajas que usan `curso`/`asignatura` â€” las barajas planas no
se ven afectadas.

### 4.2 VersiÃ³n en inglÃ©s (en) â€” temario con invitaciÃ³n a participar

Cuando `App.i18n.locale() === 'en'`, la pantalla de inicio **no
lee `decks/manifest.json` en absoluto**. Hoy todas las barajas
publicadas son contenido en espaÃ±ol (el contenido de las barajas
no entra en la paridad i18n, ver `CLAUDE.md`); mostrar la rejilla
de barajas en espaÃ±ol a una visita en inglÃ©s serÃ­a un callejÃ³n
sin salida silencioso. En su lugar, `app.js` renderiza un temario
en inglÃ©s hardcodeado (`EN_CURRICULUM` en `app.js`) que refleja
`doc/curriculum/en/`:

- **Nivel superior** â€” una tarjeta por etapa (`Key Stage 1` â€¦ `Key
  Stage 4`, `Entry Level Business`, `BTEC Business L2`), cada una
  enlazando a sus asignaturas vÃ­a `?en=1&curso=<etapa>`.
- **Nivel de asignatura** â€” una *tarjeta de invitaciÃ³n* por
  asignatura (`English Literature`, `Science`, `History`,
  `Geography`, etc.). La tarjeta **no** es un enlace a baraja:
  muestra la asignatura, el mensaje "AÃºn no hay baraja â€” sÃ© el
  primero en aportar", y un botÃ³n que abre
  [`guia-interna-crear-barajas.md`](./guia-interna-crear-barajas.md)
  en GitHub, para que la visita caiga de lleno en el flujo que
  convierte un temario en baraja.

Los datos viven en `app.js` (no en el manifest) a propÃ³sito â€”
aÃ±adir al `manifest.json` forzarÃ­a a que existiera un
`decks/<slug>.json` real (la regla 8 de `check.js` falla si no), y
estas asignaturas aÃºn no tienen barajas. `EN_CURRICULUM` es un
artefacto de taller, no un catÃ¡logo de barajas rastreado:
mantenlo en sincronÃ­a con `doc/curriculum/en/` por higiene de
autorÃ­a, igual que se hace con los logs de conceptos en espaÃ±ol
(`decks/concepts/<base-slug>.md`).

El parÃ¡metro `?en=1` es obligatorio para la navegaciÃ³n EN, asÃ­
una visita que edita a mano una URL de baraja en espaÃ±ol no puede
acabar en el flujo EN por accidente, ni al revÃ©s. Volver al UI
locale `es` (`localStorage 'memofun:locale'`) devuelve al flujo
del manifest sin mÃ¡s estado que resetear.

Cuando se publique la primera baraja real en inglÃ©s, la regla para
promocionar una asignatura de "tarjeta de invitaciÃ³n" a "tarjeta
de baraja" es la misma que para cualquier baraja en espaÃ±ol
(`§4`): aÃ±adir el fichero `decks/<slug>.json`, aÃ±adir la entrada
correspondiente en `decks/manifest.json` con `curso`/`asignatura`
coincidiendo con la etapa y la asignatura de `EN_CURRICULUM`, y la
pantalla EN la mostrarÃ¡ automÃ¡ticamente (el render EN sigue
bifurcando por locale; cuando exista una entrada de manifest para
una asignatura el camino EN puede optar por cambiar la tarjeta de
invitaciÃ³n por el enlace a la baraja real â€” ver
`renderEnSubjectLevel` en `app.js`).

## 5. Reglas de accesibilidad

1. Lectura FÃ¡cil: frases cortas, una idea por frase.
2. Botones â‰¥ 64Ã—64 px, separaciÃ³n â‰¥ 16 px (`--button-min` en `tokens.css`).
3. Alto contraste, tema claro por defecto (WCAG AA mÃ­nimo).
4. Audio solo bajo demanda (`App.tts.speak`), nunca automÃ¡tico.
5. Sin cronÃ³metros, sin puntuaciÃ³n negativa.
6. Refuerzo positivo al terminar una baraja: `App.feedback.celebrate()`.
7. Respetar `prefers-reduced-motion` (regla global en `base.css`).
8. NavegaciÃ³n por teclado completa (flechas para pasar de tarjeta; el
   botÃ³n "Ver la respuesta" y los demÃ¡s controles se activan con
   Enter/Espacio, como cualquier botÃ³n; Enter/Espacio tambiÃ©n activa
   la zona de importar).
9. ARIA en botones de icono (`data-i18n-aria`) y zonas de feedback
   (`aria-live`/`role="status"`).
10. MÃ¡ximo 3 pantallas en el flujo principal (inicio â†’ baraja â†’
    tarjeta); las barajas agrupadas por `curso`/`asignatura` aÃ±aden un
    nivel opcional (cursos â†’ asignaturas â†’ baraja â†’ tarjeta) â€” ver §4.1.
11. Progreso solo positivo: ver contrato de `App.storage.completeDeck`.
12. Foco visible siempre (`:focus-visible` en `base.css`, nunca se quita).
13. Sin IA generativa, sin librerÃ­as de terceros ni llamadas de red no
    solicitadas en el producto pÃºblico â€” ver `SPEC.md` §2.1.

## 6. InternacionalizaciÃ³n

Ver [`I18N.md`](I18N.md). Resumen: `es` es la fuente de la verdad,
`en` debe mantener paridad. `App.i18n.register()` desde cada
`strings.<locale>.js`.

## 7. Despliegue

Cloudflare Workers (static assets). Ver [`CLOUDFLARE.md`](../../CLOUDFLARE.md).

### 7.1 Service worker (`sw.js`)

Memofun envía un service worker propio en la raíz del proyecto (`sw.js`).
El SW sigue la estrategia **cache-first** con un único `FILES` flat (no
per-tool `ARCHIVOS` — memofun es deck-driven, no multi-actividad): el `fetch`
genérico sirve desde la caché cuando el archivo está listado, y solo va a
la red cuando no lo está.

**Regla de bump de `VERSION`** (`sw.js` declara `var VERSION =
"memofun-vN";`): bumpear `VERSION` en cada commit que toque cualquier archivo
de `FILES` o que añada un archivo nuevo que deba quedar en caché. El handler
`install` del SW compara `VERSION` con el nombre de la caché activa y solo
re-fetch + activa cuando difieren; un bump que no aterriza es silencioso y
las personas usuarias finales siguen viendo los archivos antiguos hasta que
el SW se desinstala.

**Excepción de barajas.** El contenido de las barajas (`decks/*.json` y
`assets/img/decks/*`) NO está listado en `FILES` del SW: se sirve siempre
desde la red (cache de HTTP estándar del navegador). Esto es deliberado —
las barajas pueden cambiar sin tocar `VERSION`, y el cache de Cloudflare para
esos paths ya está configurado en `_headers`.

**Verificación local antes de pushear.** Correr `node scripts/check-version-bump.js`
después de editar `sw.js` o cualquier archivo listado en `FILES` — el mismo
check que corre el job `cache-bump` en CI. La regla sigue siendo la misma:
bumpear en cada commit que toque un archivo de `FILES` (o añada uno nuevo).

Ver [`CLOUDFLARE.md`](../../CLOUDFLARE.md) §"Cache contract" para el
contrato de despliegue completo. Esta sección del `tecnico.md` es la
fuente canónica para el SW contract de memofun.
## 8. CÃ³mo se genera el contenido de una baraja

**No hay ningÃºn script que llame a una API de IA.** El contenido lo
escribe directamente el agente de IA de programaciÃ³n (Claude Code u
otro) que trabaja en este repositorio, como parte de su rol de
apoyo/construcciÃ³n â€” ver el ruleset completo en "Generating deck
content" de `CLAUDE.md`. Esto sustituyÃ³ a una versiÃ³n anterior que sÃ­
llamaba a la API REST de Gemini desde `scripts/generate.js`: se quitÃ³
por completo, no solo del sitio pÃºblico sino de todo el cÃ³digo â€” cero
API keys, cero llamadas de red a servicios de IA, en ningÃºn archivo
del proyecto.

El **punto de ingesta de contenidos** sigue siendo un archivo Markdown
con frontmatter (`tema`, `nivel`, `cantidad`, `salida`, `idioma`
opcional) + el cuerpo del documento â€” el mismo formato de antes, solo
que ahora lo lee el agente directamente en vez de un script:

- **Solo `tema`**: el agente elige libremente los subtemas mÃ¡s
  relevantes para cubrir ese tema al nivel indicado.
- **`tema` + `# Ãndice`**: una secciÃ³n `# Ãndice` (o `## Ãndice`, con
  cualquier nivel de encabezado) en el cuerpo del Markdown, con una
  lista de viÃ±etas (`- subtema`). El agente reparte `cantidad` tarjetas
  entre todos los puntos, sin dejar ninguno sin tarjeta ni inventar
  otros. Ãštil cuando la persona de apoyo ya tiene un temario o guion
  claro y quiere que la baraja lo siga fielmente. Ver el ejemplo en
  `config.md`, o la biblioteca ya preparada en `doc/curriculum/`.

`scripts/config-parser.js` conserva el **anÃ¡lisis** de este formato
(`parseMarkdown()`, `parseIndice()`, `slugify()`) como funciones puras
sin red ni claves â€” las usa `scripts/check.js` para validar que todos
los archivos de `doc/curriculum/` tienen un frontmatter correcto y,
si declaran un Ã­ndice, que no estÃ¡ vacÃ­o. No genera contenido; solo
entiende su forma.

**Flujo completo** (ver tambiÃ©n `guia-interna-crear-barajas.md`):

1. Se pide al agente que genere una baraja, seÃ±alando un archivo de
   `doc/curriculum/` o un `config.md` nuevo.
2. El agente escribe las tarjetas siguiendo las reglas de
   `CLAUDE.md` â†’ "Generating deck content" (aprendizaje significativo,
   Lectura FÃ¡cil, tono divertido, datos curiosos, cobertura del
   Ã­ndice si lo hay).
3. El agente escribe `decks/<salida>.json` directamente (formato de §3).
4. El agente aÃ±ade la entrada correspondiente a `decks/manifest.json`,
   con `curso`/`asignatura` si la baraja viene de un archivo de
   `doc/curriculum/` (ver §4).
5. Si la baraja amplÃ­a una serie existente (`literatura` â†’ `_2` â†’
   `_3`â€¦), el agente lee `decks/concepts/<base-slug>.md` en vez del
   JSON completo de cada otra baraja de la suite para ver quÃ© estÃ¡
   cubierto y cÃ³mo, y actualiza ese registro con lo que aÃ±adiÃ³ la
   baraja nueva â€” ver `CLAUDE.md` â†’ "Generating deck content" paso
   7. Este registro no lo lee nunca el sitio; es una herramienta de
   trabajo del agente, asÃ­ que editarlo nunca requiere subir el
   `VERSION` de `sw.js`.
6. Se revisa el contenido (la propia persona que lo pidiÃ³, o el
   agente aplicando el checklist) antes de darlo por publicado.

## 9. `scripts/check.js` y `scripts/check-version-bump.js`

Mismo patrÃ³n que el resto de la familia de proyectos: comprobaciones
estructurales sin dependencias, pensadas para ejecutarse antes de cada
cambio.

- **`node scripts/check.js`**: sintaxis JS de todo el sitio, paridad de
  claves ES/EN, que `sw.js` no liste archivos inexistentes, que los
  iconos de `manifest.json` existan, que ninguna pÃ¡gina de cara al
  usuario mencione discapacidad o lenguaje clÃ­nico, que el CSP de
  `_headers` estÃ© bien formado, que cada `data-i18n*`/`App.i18n.t()`
  resuelva a una clave registrada, y que `decks/manifest.json` apunte a
  archivos `.json` reales con `tarjetas` no vacÃ­o.
- **`node scripts/check-version-bump.js`**: falla si un archivo listado
  en `sw.js` cambiÃ³ en el diff sin subir `VERSION` (regla de
  `CLAUDE.md`). Se salta la comprobaciÃ³n si no hay repositorio git o no
  hay un commit anterior con el que comparar.

## 10. PatrÃ³n de la suite â€” cÃ³mo se construye cada app de Miralante

> ðŸŒ **Other language:** [English](../en/technical.md#8-suite-pattern-how-every-app-of-miralante-is-built)

Esta secciÃ³n es la **guÃ­a canÃ³nica y transversal** de cÃ³mo se
construye y mantiene cada app de la [suite Miralante](https://apptonomia.uk).
Es la fuente de verdad que prevalece sobre el `technical.md`
(tecnico.md) de cualquier repo cuando entran en conflicto,
porque el objetivo es mantener las siete apps hermanas
(Apptonomia, Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon,
Routime) consistentes: misma forma, mismas convenciones,
mismo deploy, mismo i18n, mismo comportamiento offline.

Un cambio en esta secciÃ³n es un **cambio transversal a la
suite** y debe aplicarse a todos los repos. Un cambio en
otras secciones de este archivo es especÃ­fico del proyecto y
se queda ahÃ­.

> **Fuente de verdad de las reglas de producto** en este
> repo: [`SPEC.md`](SPEC.md).
> **Fuente de verdad del i18n**: [`I18N.md`](I18N.md).
> Esta secciÃ³n **no** redefine esas; codifica el patrÃ³n que
> todas comparten.

### 10.0 El patrÃ³n en un pÃ¡rrafo

Cada app de la suite Miralante es una **PWA estÃ¡tica, sin
dependencias y offline-first**, construida a partir del mismo
esqueleto mÃ­nimo:

1. Un conjunto pequeÃ±o de **pÃ¡ginas HTML standalone** en la
   raÃ­z del repo (una sola actividad) o bajo `tools/<slug>/`
   (hubs multi-actividad).
2. Cada pÃ¡gina es una **URL real y navegable** â€” **no hay
   routing SPA**, ni cambio de vista en la misma pÃ¡gina, ni
   `pushState`. Cada pÃ¡gina se recarga al entrar; la
   navegaciÃ³n entre pÃ¡ginas es un clic normal en un `<a>`.
3. Las rutas ocultas (`about/`, `team/`, `legal/`, `config/`)
   comparten la misma forma: `index.html` + `styles.css` + par
   `strings.<locale>.js`, con **interlinking en el pie** para
   que cualquiera de ellas estÃ© a un clic de cualquier otra.
4. Un **service worker** (`sw.js`, network-first) cachea el
   shell (lista `FILES`, `VERSION` bumped) para que la app
   funcione offline.
5. **Sin paso de build**, sin `package.json`, sin frameworks,
   sin bundlers, sin CDNs de JS. La raÃ­z del repo es el
   output de deploy.

### 10.1 La forma de las pÃ¡ginas standalone

Este es el patrÃ³n que siguen todas las rutas ocultas y todas
las rutas pÃºblicas. La forma es idÃ©ntica en la suite; solo
cambian los contenidos.

#### 10.1.1 El esqueleto de cinco carpetas

Cada app expone las mismas cinco carpetas:

```
<app>/
  index.html              # Entrada pÃºblica (la actividad)
  app.js                  # LÃ³gica
  data.js                 # Layouts sin locale + contenido por locale
  strings.es.js           # Textos UI en espaÃ±ol (fuente de verdad)
  strings.en.js           # Textos UI en inglÃ©s
  styles.css              # Estilos especÃ­ficos de la app
  assets/
    css/{tokens,base,components}.css
    fonts/                # Atkinson Hyperlegible + Nunito autohospedados
    img/                  # Icono de la app + imÃ¡genes decorativas
    js/{utils,i18n,tts,storage,feedback}.js
  about/                  # Ruta oculta: presentaciÃ³n
    index.html
    styles.css
    strings.es.js
    strings.en.js
  team/                   # Ruta oculta: quiÃ©nes la hacen
    index.html
    styles.css
    strings.es.js
    strings.en.js
  legal/                  # PÃ¡gina de protecciÃ³n de datos (enlazada desde el pie)
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
`index.html` en la raÃ­z del repo. Las apps multi-actividad
(Apptonomia, Calculia) ponen `tools/<slug>/index.html` por
actividad y un landing `site/index.html`; las cuatro carpetas
ocultas viven en la raÃ­z del repo.

#### 10.1.2 La concha HTML de una pÃ¡gina standalone

Cada pÃ¡gina standalone abre con el mismo boilerplate. Abajo,
la **plantilla**; las desviaciones se indican donde apliquen.

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="pageTitle">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Memofun â€” Sobre este proyecto</title>
  <!-- Hidden route: not linked from the main menu and should not be
       indexed. Aimed at anyone who wants to know what Teclatlon is:
       families, professionals, journalists, funders, contributors. -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="â€¦">
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
                data-locale="es" aria-pressed="false">ðŸ‡ªðŸ‡¸ EspaÃ±ol</button>
        <button type="button" class="btn-idioma" id="btnIdiomaEn"
                data-locale="en" aria-pressed="false">ðŸ‡¬ðŸ‡§ English</button>
      </div>
      <img src="../assets/img/icono.svg" alt="" width="80" height="80"
           class="logo-{legal|about}">
      <h1>â€¦</h1>
      <p class="lema" data-i18n="tagline">â€¦</p>
      <p class="entradilla" data-i18n="lead">â€¦</p>
      <nav class="indice">â€¦opcional, solo en pÃ¡ginas largasâ€¦</nav>
    </header>

    <main class="pila">
      <section class="card">â€¦</section>
    </main>

    <footer class="pie-{legal|about}">
      <a class="btn btn-secundario" href="../"
         data-i18n="footerActivities">Ir a la aplicaciÃ³n</a>
      <a class="btn btn-secundario" href="../legal/"
         data-i18n="footerDataProtection">ProtecciÃ³n de datos</a>
      <a class="btn btn-secundario" href="../about/"
         data-i18n="footerAbout">Sobre este proyecto</a>
      <a class="btn btn-secundario" href="../team/"
         data-i18n="footerTeamGuide">QuiÃ©nes la hacen</a>
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
  pestaÃ±a del navegador mostrarÃ­a antes de que i18n.js se
  ejecute (y el fallback de la cache del SW).
- La clase propia de la pÃ¡gina en el wrapper
  `<div class="container â€¦">` es bajo la que `styles.css` de
  la pÃ¡gina scopea sus reglas (`legal-page`, `about-page`,
  `team-page`). Sin prefijos ancestro `.sp-*` (eran residuo
  de la fusiÃ³n SPA, retirado en 2026-09; ver `git log`).
- El pie es **siempre** los mismos cinco enlaces (en el mismo
  orden) en `about/`, `team/` y `legal/`. `config/` tiene un
  pie reducido que solo vuelve a la SPA. La raÃ­z de la app
  (`index.html`) **no** renderiza este pie (tiene su propio
  pie con el botÃ³n de reset y el enlace a protecciÃ³n de datos
  â€” ver §2 arriba).

#### 10.1.3 El par de strings

Cada carpeta standalone trae su propio par `strings.es.js` /
`strings.en.js`. Siguen el patrÃ³n **clave plana,
IIFE-register**; `scripts/check.js` extrae el diccionario vÃ­a
`vm.createContext` con un stub `App.i18n.register` y verifica
la paridad de claves entre locales.

```javascript
/* legal/strings.es.js â€” texto de la pÃ¡gina (ES). */
(function () {
  'use strict';
  App.i18n.register({
    pageTitle: 'ProtecciÃ³n de datos',
    pageDescription: 'Teclatlon: quÃ© datos guarda, dÃ³nde y por quÃ©. â€¦',
    routeNotice: 'Esta pÃ¡gina no se enlaza desde la aplicaciÃ³n. â€¦',
    tagline: 'Sin registro. Sin cookies. Sin analÃ­tica.',
    lead: 'Teclatlon no pide tus datos personales. â€¦',
    navResponsible: 'QuiÃ©n trata tus datos',
    navData: 'QuÃ© guardamos',
    /* â€¦mÃ¡s clavesâ€¦ */
    footerActivities: 'Ir a la aplicaciÃ³n',
    footerAbout: 'Sobre este proyecto',
    footerTeamGuide: 'QuiÃ©nes la hacen',
    footerSettings: 'Ajustes'
  }, 'es');
})();
```

Las claves son planas (sin namespacing tipo
`legal.pageTitle`); la pÃ¡gina **es** el namespace, porque el
archivo vive en su propia carpeta. Las claves comunes
(`core.back`, `core.listen`, `core.dataProtection`) ya vienen
en `assets/js/i18n.js` y no se redefinen aquÃ­.

#### 10.1.4 La hoja de estilos standalone

Cada carpeta standalone trae su propio `styles.css`. Es **el
antiguo `assets/css/subpages.css` dividido por pÃ¡gina**, con
los prefijos ancestro `.sp-legal` / `.sp-about` eliminados
(eran residuo de la fusiÃ³n SPA). La clase wrapper de la
pÃ¡gina (`<div class="legal-page">`, `<div class="about-page">`,
etc.) es la que usa el CSS para scope:

```css
.legal-page { max-width: 880px; }
.legal-page .cabecera-legal { â€¦ }
.legal-page .indice a { â€¦ }
.legal-page section { â€¦ }
```

**No** introduzcas nombres de clase por pÃ¡gina que colisionen
con los componentes compartidos (`base.css` ya define
`.cabecera`, `.lema`, `.indice`, `.btn`, `.card`, `.pila`, â€¦).
Cuando la pÃ¡gina standalone necesite un aspecto distinto,
scopea la regla bajo la clase de la pÃ¡gina â€” nunca bajo un
`.cabecera` o `.indice` genÃ©rico.

### 10.2 El nÃºcleo compartido

Cada app de la suite trae los mismos seis ficheros bajo
`assets/js/`, en el mismo orden de carga, con la misma forma
exportada. Adelgazar estÃ¡ permitido; **aÃ±adir** funcionalidad
de vuelta estÃ¡ prohibido a menos que sirva a una necesidad
concreta (las notas de adelgazamiento en §2.1 arriba son la
justificaciÃ³n canÃ³nica).

| MÃ³dulo | Superficie | Requerido por |
|---|---|---|
| `utils.js` | `App.utils.shuffle / $ / $$ / reducedMotion / wakeLock` | cada pÃ¡gina |
| `i18n.js` | `App.i18n.{locale, setLocale, lang, register, t, pick, apply, SUPPORTED, DEFAULT_LOCALE, LABEL, FLAG}` | cada pÃ¡gina |
| `tts.js` | `App.tts.speak` | solo pÃ¡ginas que leen en voz alta (la mayorÃ­a) |
| `storage.js` | `App.storage.{get, set, remove}` | solo pÃ¡ginas que leen o escriben `localStorage` (`index.html`, `config/`) |
| `feedback.js` | `App.feedback.{success, encourage, celebrate}` | solo el `app.js` de la actividad |

El orden de carga es `utils.js â†’ i18n.js â†’ tts.js â†’ storage.js â†’
feedback.js â†’ strings.<locale>.js â†’ data.js â†’ app.js`. `i18n.js`
debe cargar **antes** que `tts.js` y `feedback.js`, que leen
el idioma activo.

Tanto `strings.es.js` como `strings.en.js` cargan siempre (no
estÃ¡n gateados por `locale`); `App.i18n.locale()` decide cuÃ¡l
estÃ¡ activo. El locale se elige primero de
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
     pÃ¡ginas standalone */
  './legal/index.html',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  /* â€¦about/, team/, config/ igualâ€¦ */
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/fonts/â€¦woff2',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/img/icono.svg'
];
```

Dos reglas gobiernan cambios en `FILES`:

1. **Fichero nuevo â†’ aÃ±adirlo a `FILES`.** El handler
   `install` mete cada fichero individualmente (nunca
   `cache.addAll`, que aborta en el primer fallo y rompe la
   cache para todos).
2. **Cualquier cambio en un fichero cacheado â†’ bumpear
   `VERSION`** (`'teclatlon-vN'` â†’ `'teclatlon-vN+1'`). Sin el
   bump, un usuario offline queda atascado en la versiÃ³n
   vieja para siempre, porque el handler `activate` solo
   purga caches con un nombre distinto.

`scripts/check-version-bump.js` aplica (2): hace
`git show HEAD:sw.js` para ver quÃ© `VERSION` habÃ­a en el
Ãºltimo commit, lo compara contra el `VERSION` actual, y
verifica que `FILES` y el diff contra HEAD coincidan. Si no
coinciden, el script falla y el job `cache-bump` de CI
tambiÃ©n falla.

Cada pÃ¡gina standalone tambiÃ©n ejecuta
`navigator.serviceWorker.register('../sw.js')` desde su
script inline, asÃ­ una visita directa a `/legal/`,
`/about/` o `/team/` prima el SW para la raÃ­z de la SPA del
mismo modo que hace `index.html`.

### 10.4 Invariantes de i18n

Estas son no negociables en toda la suite. Un cambio de
locale estÃ¡ incompleto hasta que **todos** los ficheros de
esta lista estÃ©n actualizados:

1. `assets/js/i18n.js#SUPPORTED` y `#DEFAULT_LOCALE`.
2. `assets/js/i18n.js#BCP47` (para selecciÃ³n de voz en
   `speechSynthesis`).
3. El detector pre-paint en `index.html` (el `<script>`
   inline que elige el locale antes del primer paint â€” ver
   §2.5 arriba).
4. `strings.<locale>.js` y cada par `strings.<locale>.js`
   por carpeta (`legal/`, `about/`, `team/`, `config/`).
5. `data.js`: cada array dividido por locale
   (`DATA.lessons.<locale>`, `DATA.words.<locale>`,
   `DATA.templates.<locale>`, `DATA.numpadSteps.<locale>`).
6. `sw.js`: aÃ±adir los nuevos `strings.<locale>.js` a
   `FILES` y bumpear `VERSION`.
7. `scripts/check.js`: la verificaciÃ³n de paridad funciona
   en N locales sin cambios de cÃ³digo (los coge todos vÃ­a
   `fs.readdirSync`); confirmar que el script sigue pasando
   tras aÃ±adir el locale.

La receta paso a paso completa (con cÃ³digo de ejemplo) estÃ¡
en [`I18N.md`](I18N.md).

### 10.5 Lo que estÃ¡ **prohibido** (en toda la suite)

Estos son antipatrones observados en algÃºn momento y
retirados explÃ­citamente; el historial de commits es la fuente
de verdad de cada retirada. La regla es: "si te ves tentado
de usar uno de estos, para y vuelve a leer esta secciÃ³n".

- **Sin SPA / sin `pushState` / sin secciones `view-*`.**
  Cada pÃ¡gina es su propia URL. No fusionar `legal/`,
  `about/`, `team/` dentro de `index.html` como secciones
  ocultas, ni siquiera con un redirect shim. Se intentÃ³ en
  2026-09 (`spa: merge`) y se revirtiÃ³ en la misma release;
  ver `git log` para las lecciones aprendidas. La
  navegaciÃ³n entre pÃ¡ginas debe ser siempre un clic real en
  un `<a>`, y cada ruta oculta debe estar a un clic de
  cualquier otra vÃ­a el pie compartido.
- **Sin `App.goLegal` / `App.goAbout` / `view-legal` /
  `view-about` / `sp-legal` / `sp-about` / `sp-idioma` /
  `subpages.css`.** Todos pertenecen al modelo de fusiÃ³n
  SPA retirado.
- **Sin `_redirects` SPA catch-all.** Cloudflare lo
  rechaza como loop; documentado en `CLOUDFLARE.md` y en
  la receta de deploy.
- **Sin flash de `data-app-blocked="mobile"`.** El script
  pre-paint es un Ãºnico `<script>` inline en `<head>`; no
  lo dividas en un `.js` aparte (CSP `script-src 'self'`
  lo permitirÃ­a, pero la garantÃ­a de timing sÃ­ncrono solo
  se cumple con scripts inline en la cabeza).
- **Sin `package.json`, sin `node_modules`.** El repo es
  el output de build. Un package manifest forzarÃ­a a
  Cloudflare a ejecutar `npm install` en cada build,
  sobrepasando el lÃ­mite de 25 MiB de assets.
- **Sin CDNs de JS.** Todas las fuentes, iconos y JS
  vienen en `assets/`.
- **Sin imports de ES modules** (`<script type="module">`).
  La app debe funcionar desde `file://` para uso offline;
  los ES modules rompen eso.
- **Sin base de datos en tiempo real, sin login, sin
  cookies, sin analÃ­tica.** La persistencia es solo
  `localStorage`.
- **Sin teclado en pantalla tÃ¡ctil** en apps que apuntan
  al teclado fÃ­sico del ordenador (Teclatlon, importes
  tipeados de Okeymoney, palabras tipeadas de Sinonimia).
  El teclado en pantalla es solo decorativo.

### 10.6 Checklist de validaciÃ³n

Ejecutar esto en cada PR que toque cualquiera de los
ficheros de superficie (`*.html`, `*.js`, `*.css`, `sw.js`,
`manifest.json`, `data.js`):

```bash
node scripts/check.js           # debe reportar OK (N checks, sin fallos)
node scripts/check-version-bump.js   # debe pasar
```

DespuÃ©s abrir las pÃ¡ginas afectadas en un navegador en
`http://localhost:<puerto>/<ruta>` y recorrer el smoke
manual:

- `index.html` arranca en la pantalla de nombre o en el menÃº
  segÃºn el estado guardado; el roundtrip de `localStorage`
  funciona; el botÃ³n "ðŸ—‘ï¸ Borrar mi progreso" resetea tanto
  los datos como la UI.
- `/legal/` carga con el h1, lema y pie localizados; el
  selector de idioma cambia `lang`, `document.title` y cada
  texto `data-i18n` sin parpadeo de valores antiguos.
- `/about/` y `/team/` igual; sus enlaces del pie navegan
  entre ellos y a `/legal/` y `/config/` sin recargas
  antes de que el SW se prime.
- `/config/` lista el estado guardado y sus dos botones de
  reset funcionan (confirmaciÃ³n en dos pasos).
- Refrescar una vez tras la primera carga y verificar que
  `navigator.serviceWorker.controller` no es null.

Si algo falla, el cambio no encaja con el patrÃ³n de la suite
y debe revisarse antes de aterrizarlo.

### 10.7 Diferencias entre repos (lo que esta secciÃ³n **no** cubre)

Cada app es una variante de una sola actividad del patrÃ³n de
arriba. Las diferencias por app â€” quÃ© se comparte con la
suite, quÃ© se adelgaza, y quÃ© es intencionalmente distinto â€”
se documentan en el `tecnico.md` § "Other apps of the suite:
real differences" (la "diferencia especÃ­fica del proyecto")
de cada repo. Usa esa secciÃ³n para decidir si una
desviaciÃ³n en un repo es intencional antes de copiarla a
otro.

Esta secciÃ³n canÃ³nica vive en el `tecnico.md` /
`technical.md` de **todos los repos** de la suite, mantenida
en sincronÃ­a. Si la cambias en un repo, espejÃ©ala en los
demÃ¡s en el mismo PR.

### 10.8 Ver tambiÃ©n

- §2 arriba â€” Recetas y contratos especÃ­ficos de Teclatlon
  que se construyen sobre este patrÃ³n.
- [`I18N.md`](I18N.md) â€” CÃ³mo aÃ±adir un idioma manteniendo
  las invariantes de i18n intactas.
- [`CLOUDFLARE.md`](../../CLOUDFLARE.md) â€” Contratos de
  deploy y SW/headers a nivel de Cloudflare Workers.
- [`SPEC.md`](SPEC.md) §"Mandatory rule" â€” Las invariantes
  de accesibilidad y "ninguna menciÃ³n clÃ­nica" que cada
  pÃ¡gina debe respetar.

---


