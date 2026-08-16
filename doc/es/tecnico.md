# tecnico.md — Arquitectura

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
│   └── fonts/ Atkinson Hyperlegible + Nunito (.woff2)
├── tools/study/          pantalla de repaso (flip-card)
├── settings/             zona de apoyo (texto, idioma, importar, borrar progreso)
├── decks/                manifest.json + *.json de barajas publicadas y revisadas
│   └── concepts/         registros de "qué ya está cubierto" por serie (solo agente, ver §8)
├── legal/                protección de datos
├── scripts/              config-parser.js · check.js · check-version-bump.js (Node, offline)
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

`respuesta` es HTML simple (`<mark>`, `<b>`, `<i>`, `<br>`) — la frase
clave de aprendizaje significativo va envuelta en `<mark></mark>` (ver
las reglas de contenido en §8 y en `CLAUDE.md`). `App.decks` normaliza
cualquier archivo con esta forma; un archivo sin `tarjetas` (array) se
rechaza.

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
