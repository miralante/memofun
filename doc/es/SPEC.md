# SPEC.md — Definición del producto

> **Este documento define QUÉ es Memofun, PARA QUIÉN es y por qué.**
> Para el CÓMO (arquitectura, archivos, reglas de accesibilidad),
> consulta [`tecnico.md`](tecnico.md).

---

## 1. Producto

Memofun es una **app de estudio con tarjetas de memoria** (flashcards)
centrada en **aprendizaje significativo**: cada tarjeta explica un
concepto con una analogía cotidiana, un ejemplo práctico o el "por qué
importa", nunca con una definición de diccionario. Está pensada para
que una persona con discapacidad intelectual pueda repasar un tema de
forma **autónoma**.

### 1.1 Qué es y qué no es

**Es:**
- Una herramienta de repaso autónomo entre sesiones o clases.
- Un complemento al trabajo con un profesor o familiar, que prepara el
  contenido de antemano.
- Una PWA instalable, usable sin conocimientos técnicos.

**No es:**
- Un chatbot ni una herramienta con IA generativa integrada. Ver §2.1.
- Un sistema de evaluación clínica.
- Un registro de datos personales.

### 1.2 Público objetivo

- **Persona usuaria** (con discapacidad intelectual): repasa las
  barajas ya preparadas, de forma autónoma.
- **Apoyo** (familia, docente): pide al agente de IA del proyecto que
  prepare cada baraja (a partir de un tema o de `content-indices/`) y
  revisa el contenido antes de publicarlo.
- **Construcción** (desarrollador/a): mantiene el código.

Ver [`roles.md`](roles.md) para el detalle de cada rol.

---

## 2. Restricciones innegociables

Estas restricciones vienen del producto, no son técnicas.

### 2.1 Sin IA generativa en el producto

**Memofun no incluye ningún chatbot, generación de contenido en
directo, ni integración con ninguna API de IA — en ningún punto del
código.** El contenido de las barajas lo escribe directamente el
agente de IA de programación (Claude Code u otro) que construye y
mantiene este repositorio, como parte del rol de apoyo/construcción
(ver `roles.md`), nunca en tiempo real ni desde el navegador de quien
estudia. Las razones:

- **Determinismo y accesibilidad**: una persona con discapacidad
  intelectual necesita una interfaz predecible; una IA generativa
  invocada en directo no lo es (respuestas distintas cada vez,
  posibilidad de contenido inadecuado sin revisión).
- **Sin coste, sin cuenta, sin API key — ni siquiera en el repositorio**:
  el proyecto no gestiona ninguna clave de API en ningún sitio. Pedir
  una a quien estudia (o depender de una para desplegar el sitio)
  contradice el principio de "gratis, sin fricción, sin barreras
  técnicas".
- **Revisión antes de publicar**: todo el contenido que llega a
  `decks/` se revisa (por quien lo pidió, o por el propio agente que
  lo escribió) antes de añadirlo a `decks/manifest.json` — ver
  `guia-crear-barajas.md` §4.

Esta decisión ha evolucionado dos veces, siempre en la misma
dirección — menos superficie de IA en el producto, no más:

1. Una versión inicial tenía un formulario donde el propio usuario
   pegaba su API key de Gemini en el navegador. Se quitó al alinear el
   proyecto con el resto de la familia (Apptonomia, Calculia,
   Okeymoney, Sinonimia, Teclatlon), que comparten la regla de "sin IA
   generativa en el producto".
2. Una versión posterior tenía `scripts/generate.js`, una herramienta
   de construcción offline que sí llamaba a la API REST de Gemini
   (con una clave del desarrollador, nunca del usuario). Se eliminó
   también: el contenido se escribe ahora directamente por el agente
   de IA que trabaja en este repositorio, sin ninguna llamada a una
   API externa en ningún archivo del proyecto — ver "Generating deck
   content" en `CLAUDE.md`.

### 2.2 El repaso nunca castiga

- No se restan estrellas ni progreso.
- No hay corrección "bien/mal" tarjeta a tarjeta — el repaso es libre,
  sin cronómetro, sin límite de vueltas.
- Terminar una pasada completa de una baraja suma 1 ⭐, nunca se resta.

### 2.3 Sin presión temporal

No hay cronómetros visibles. El ritmo lo marca la persona usuaria.

### 2.4 Lectura Fácil siempre

- Frases cortas, una idea por frase, vocabulario cotidiano.
- Sin lenguaje clínico en la interfaz ni en las tarjetas ("paciente",
  "discapacidad", etc. — ver la regla correspondiente en "Generating
  deck content" de `CLAUDE.md`).
- La Lectura Fácil no es solo a nivel de frase: también significa
  controlar cuántas ideas nuevas llegan a la vez. Como máximo un
  concepto nuevo (nombre propio o idea abstracta) por tarjeta, anclado
  en una imagen cotidiana concreta antes de nombrarlo — nunca una
  comparación entre dos ideas abstractas que el lector no ha conocido
  antes por separado, cada una de forma concreta. Un contenido con
  muchos nombres seguidos (movimientos literarios, épocas históricas)
  necesita más tarjetas, más pequeñas, no comprimir — ver "Generating
  deck content" en `CLAUDE.md`.

### 2.5 Tono divertido y datos curiosos

Aprender algo debe dar gusto, no obligación. Cada tarjeta se escribe
como quien le cuenta algo interesante a un amigo, no como un manual:

- **Tono cálido y con gracia**: comparaciones simpáticas, detalles
  pintorescos, un punto de humor amable. Nunca sarcasmo, ironía, ni
  juegos de palabras o dobles sentidos — chocan con la Lectura Fácil
  (§2.4): quien lee de forma literal necesita que lo escrito signifique
  exactamente lo que dice.
- **Datos curiosos**: cuando encaja de forma natural con el tema, la
  respuesta añade un "¿Sabías que...?" sorprendente o pintoresco, para
  anclar mejor el aprendizaje significativo y hacerlo memorable. Nunca
  se fuerza uno si el tema no da pie a ello, ni a costa de la claridad.
- Esto se aplica al escribir el contenido (regla obligatoria para el
  agente de IA, ver "Generating deck content" en `CLAUDE.md`) y a la
  revisión antes de publicar: una tarjeta con tono plano o de examen se
  reescribe, no se publica así.

### 2.6 Privacidad por defecto

- Sin registro, sin cuentas, sin cookies de rastreo, sin analítica.
- **Contrato de progreso local**: `localStorage` solo guarda
  `estrellas` (entero, solo suma) y `completado` (qué barajas se han
  terminado de repasar al menos una vez). Nunca se guardan fallos,
  tiempo empleado, número de intentos ni nada que identifique a la
  persona. El progreso no sale del dispositivo.

### 2.7 Accesibilidad universal

- Botones ≥ 64×64 px, separación ≥ 16 px.
- Contraste WCAG AA mínimo, tema claro por defecto.
- Tipografía grande (base 20 px), Atkinson Hyperlegible / Nunito.
- Audio (🔊, Web Speech API) solo bajo demanda, nunca automático.
- Navegación completa por teclado, `prefers-reduced-motion` respetado.
- Máximo 3 pantallas en el flujo principal: inicio → baraja → tarjeta.
  Las barajas agrupadas por curso/asignatura añaden un nivel opcional
  (cursos → asignaturas → baraja → tarjeta) — ver `tecnico.md` §4.1.

### 2.8 Autonomía

Funciona offline (PWA instalable), sin login, sin coste.

### 2.9 Vanilla, sin dependencias

Todo el proyecto — sitio público y herramientas de `scripts/` — es
**HTML, CSS y JavaScript vanilla**. Sin frameworks, sin build, sin
paquetes de terceros (ni npm, ni pip en versiones anteriores). Las
barajas usan un **formato JSON propio** (ver
`tecnico.md` §3), no el `.apkg` de Anki — se descartó esa dependencia
precisamente para no necesitar Python, ni una librería de lectura de
SQLite/ZIP en el navegador. Menos piezas móviles, menos superficie de
ataque, más fácil de mantener por cualquiera que sepa HTML/CSS/JS.

---

## 3. Separación de flujos

| Zona | Para quién | Qué permite |
|---|---|---|
| `index.html` (inicio) | Persona usuaria | Elegir una baraja ya preparada. Nada más. |
| `tools/study/` | Persona usuaria | Repasar la baraja elegida, tarjeta a tarjeta. |
| `settings/` | Apoyo | Tamaño de texto, idioma, importar un `.json` de baraja propio para repasarlo sin publicarlo, borrar progreso local. |
| Agente de IA del proyecto | Apoyo / construcción | Escribir el contenido de una baraja nueva a partir de un tema o de `content-indices/`, siguiendo las reglas de "Generating deck content" (`CLAUDE.md`), para revisar antes de publicar. |

---

## 4. Criterios de éxito

Un cambio en Memofun es exitoso cuando:

1. La persona usuaria puede seguir estudiando sin ayuda para esa función.
2. Cumple las reglas de accesibilidad de `tecnico.md`.
3. No introduce IA generativa, cuentas, coste ni presión nuevos.
4. Funciona offline.
5. No añade recogida de datos personales.
6. Mantiene la paridad ES/EN de la interfaz.
7. El contenido de las tarjetas nuevas sigue el principio de aprendizaje
   significativo (analogía / ejemplo / por qué importa) y Lectura Fácil.

---

## 5. Lo que Memofun NO hace

| NO | Por qué |
|----|---------|
| No tiene chatbot ni IA generativa en el producto | Determinismo, accesibilidad, sin coste — ver §2.1 |
| No pide una API key a quien estudia | Misma razón — la generación es una herramienta de apoyo, offline |
| No tiene cuenta de usuario ni login | Privacidad y simplicidad |
| No guarda datos en la nube | Privacidad y offline-first |
| No tiene ranking ni comparativas | Sin presión |
| No usa notificaciones push | No introduce presión ni dependencias externas |
| No muestra publicidad ni compras integradas | Gratis por diseño |
| No resta estrellas ni progreso como castigo | El producto solo suma (§2.2) |
