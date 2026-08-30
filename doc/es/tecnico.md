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
                          curriculum/en/ es una carpeta hermana vacía, reservada
                          para la misma biblioteca en otro idioma
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
(ver las reglas de contenido en §8 y en `CLAUDE.md`). HTML simple
únicamente (`<mark>`, `<b>`, `<i>`, `<br>`). `App.decks` normaliza
cualquier archivo con esta forma; un archivo sin `tarjetas` (array) se
rechaza.

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
   JSON completo de cada baraja hermana para ver qué está cubierto y
   cómo, y actualiza ese registro con lo que añadió la baraja nueva —
   ver `CLAUDE.md` → "Generating deck content" paso 7. Este registro
   no lo lee nunca el sitio; es una herramienta de trabajo del agente,
   así que editarlo nunca requiere subir el `VERSION` de `sw.js`.
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
