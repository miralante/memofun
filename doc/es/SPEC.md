# SPEC.md — Definición del producto

> **Este documento define QUÉ es Memofun, PARA QUIÉN es y por qué.**
> Para el CÓMO (arquitectura, archivos, reglas de accesibilidad),
> consulta [`tecnico.md`](tecnico.md).

---

## 1. Producto

Memofun es una **app de estudio con tarjetas de memoria** (flashcards)
centrada en **aprendizaje significativo**: cada tarjeta presenta como
pista la analogía cotidiana, el ejemplo práctico o el "por qué
importa" de un concepto, y pide recordar el concepto en sí — nunca una
definición de diccionario recitada como respuesta. La prioridad nunca
es "explicar mucho": es conseguir que la persona (a) entienda una idea
concreta, (b) la reconozca en otro contexto, (c) la recuerde con poca
ayuda. Está pensada para que una persona con discapacidad intelectual
pueda repasar un tema de forma **autónoma**.

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
  prepare cada baraja (a partir de un tema o de `doc/curriculum/`) y
  revisa el contenido antes de publicarlo.
- **Construcción** (desarrollador/a): mantiene el código.

Ver [`roles.md`](roles.md) para el detalle de cada rol.

### 1.3 Refuerzo: repetición y fidelidad al temario

El aprendizaje significativo (§1) no es solo "explicarlo bien una
vez". Se apuntala con dos mecanismos deliberados en el diseño de las
barajas:

- **Repetición, pura y con variaciones**: un concepto clave de un
  tema (una definición, una fecha, un autor) puede — y debe —
  reaparecer en más de una tarjeta y en más de una baraja del mismo
  tema o curso. A veces de forma literal (la misma pregunta casi
  igual, para consolidar memoria); a veces variada (la misma idea con
  otro ejemplo o desde otro ángulo, para tejer varias conexiones a la
  misma idea). No es un fallo de diseño ni contenido "redundante que
  sobra": es refuerzo por repetición, una técnica de aprendizaje real.
  La revisión (`guia-interna-crear-barajas.md` §4) no descarta una tarjeta
  solo por parecerse a otra — descarta una que repite sin aportar
  ningún matiz, ejemplo o contexto nuevo.
- **Fidelidad al temario**: cuando existe un temario de referencia (un
  `doc/curriculum/**/*.md`, un `# Índice` en un `config.md`, o el
  currículo oficial de la asignatura y el curso), las barajas se ciñen
  a esos puntos exactos en vez de derivar hacia temas adyacentes que
  "quedan bien" pero no forman parte de lo que se estudia en ese
  curso. Ajustarse al temario real es, en sí mismo, una forma de
  apuntalar el aprendizaje significativo: el contenido coincide con lo
  que la persona usuaria necesita repasar de verdad.

Ver "Generating deck content" en `CLAUDE.md` para cómo se aplica esto
al escribir o ampliar una baraja.

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
  `guia-interna-crear-barajas.md` §4.

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
  - Métrica concreta: **2–4 frases de pista en `pregunta`**, **≤ 12
    palabras por frase**, más una pregunta final corta. La cifra
    `<= 12` viene del estándar UNE 153101:2018 EX para lectura fácil y
    se aplica a todas las tarjetas — ver `CLAUDE.md` §"Generating deck
    content" para el detalle de cada nivel (`principiante` /
    `intermedio` / `avanzado`). `respuesta` es el propio concepto o
    término, corto (1-6 palabras), no una frase.
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
- La pantalla de estudio muestra `respuesta` como título grande y
  `pregunta` como texto pequeño debajo, con la imagen opcional a la
  izquierda — ver "Generating deck content" en `CLAUDE.md`. La propia
  analogía/ejemplo dentro de `pregunta` va envuelta en
  `<mark></mark>` (el mismo color de resaltado que la píldora de
  `respuesta`), para que la pista también lleve una pista de color, no
  solo texto plano.

### 2.5 Tono divertido y datos curiosos

Aprender algo debe dar gusto, no obligación. Cada tarjeta se escribe
como quien le cuenta algo interesante a un amigo, no como un manual:

- **Tono cálido y con gracia**: comparaciones simpáticas, detalles
  pintorescos, un punto de humor amable. Nunca sarcasmo, ironía, ni
  juegos de palabras o dobles sentidos — chocan con la Lectura Fácil
  (§2.4): quien lee de forma literal necesita que lo escrito signifique
  exactamente lo que dice.
- **Datos curiosos**: cuando encaja de forma natural con el tema, la
  pista en `pregunta` teje un "¿Sabías que...?" sorprendente o
  pintoresco, para anclar mejor el aprendizaje significativo y hacerlo
  memorable. Nunca se fuerza uno si el tema no da pie a ello, nunca a
  costa de la claridad, y nunca en `respuesta`.
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
- Alto contraste (WCAG AA mínimo, AAA cuando sea posible), tema claro
  por defecto — ver `tecnico.md` §X para los criterios AAA que este
  proyecto honra y por qué la conformidad AAA completa no es viable
  para una aplicación web.
- Tipografía grande (base 20 px), Atkinson Hyperlegible / Nunito.
- Audio (🔊, Web Speech API) solo bajo demanda, nunca automático.
- Navegación completa por teclado, `prefers-reduced-motion` respetado.
- Máximo 3 pantallas en el flujo principal: inicio → baraja → tarjeta.
  Las barajas agrupadas por curso/asignatura añaden un nivel opcional
  (cursos → asignaturas → baraja → tarjeta) — ver `tecnico.md` §4.1.

### 2.8 Autonomía

Funciona offline (PWA instalable), sin login, sin coste.

### 2.9 Sencillez para la persona que estudia

La persona no necesita conocimientos técnicos, una cuenta, una clave ni
instalar herramientas para estudiar. La aplicación debe resultar previsible,
gratuita y fácil de retomar. La arquitectura que hace posible este alcance se
define en [`tecnico.md`](tecnico.md), no en esta especificación de producto.

### 2.10 Eufemismo público: "persona tipo"

Cuando se presenta Memofun de cara al **público general** (prensa,
charlas, READMEs públicos que cualquiera pueda leer, el portal
`apptonomia.uk`, notas en redes sociales, marketing), el término
"discapacidad intelectual" **no debe usarse** para describir la
audiencia de la app, ni siquiera cuando el texto que lo rodea sería
público. El eufemismo aceptado en esas superficies para referirse a la
audiencia es **"persona tipo"** (plural "personas tipo"),
entendido como marcador genérico de perfil, no como etiqueta para
ninguna persona real.

Dónde se aplica y dónde no:

- **Se aplica** a cualquier texto que cualquier persona ajena al
  proyecto pueda leer sin autenticarse: `README.es.md`, `README.md`,
  el portal en `apptonomia.uk`, charlas públicas, copy en redes, notas
  de prensa, material de marketing. En estas superficies se habla de
  la audiencia como "la persona tipo" o "las personas tipo"
  de la app.
- **No se aplica** a la documentación interna de este repositorio
  (`CLAUDE.md`, `doc/es/SPEC.md`, `doc/en/SPEC.md`, `tecnico.md`,
  `roles.md`, `CONTRIBUTING.es.md`, `CONTRIBUTING.md`) — esos
  archivos los lee quien mantiene o contribuye al proyecto, y
  "discapacidad intelectual" sigue siendo allí el término canónico,
  porque el proyecto necesita explicar sin ambigüedad su objetivo real
  a quien lo mantiene.
- **No se aplica** al contenido de las barajas que nombra un concepto
  clínico por su nombre real (p. ej. una tarjeta que explica un
  trámite administrativo relacionado con discapacidad): eso es
  contenido, no etiquetado de la audiencia.
- **No se aplica** a la UI de la propia app: la regla de §2.4 sigue
  prohibiendo **cualquier** mención, incluida "persona tipo", en
  `index.html`, `app.js`, `tools/study/`, `settings/`,
  `strings.<locale>.js` y cualquier otra superficie visible. El
  eufemismo es para el exterior, no para lo que lee quien visita la
  app.

Razón: presentar el objetivo real del proyecto en documentación interna
es útil y necesario; presentarlo en superficies de marketing o landing
no es necesario ni respetuoso con la audiencia — "persona tipo"
permite describir en público para qué sirve la app (qué perfil tiene
quien la usa) sin nombrar públicamente un grupo clínico.

---

## 3. Comunicación persuasiva al servicio del aprendizaje

Memofun es una herramienta de repaso, no un producto de consumo. La
motivación para estudiar una baraja debe ser **intrínseca** — el
placer de entender un concepto, la confianza de poder explicarlo —,
nunca **extrínseca** ni basada en presión. Por eso los patrones de
mercado que dependen de escasez, comparación o miedo a perder
**no pueden** aparecer en ningún punto del sitio. Esta regla es
suite-wide y se comparte con Apptonomia, Calculia, Okeymoney,
Sinonimia, Teclatlon y Routime; la lista concreta es la misma en los
siete proyectos para que ningún patrón que se rechace aquí pueda
entrar por la puerta de otro.

### 3.7 La lista cerrada de patrones prohibidos

Los siguientes patrones forman parte de la "presión" que Memofun
destierra y **no pueden** aparecer en ningún punto del sitio ni en
ninguna tarjeta del contenido:

- **Escasez**: "¡Solo te queda 1!", "Última oportunidad", "Date
  prisa", cuentas atrás, barajas o tarjetas que desaparecen.
- **Falsa urgencia**: cronómetros, carreras, "termina pronto",
  castigar la lentitud. Conecta directamente con §2.3 "Sin presión
  temporal".
- **Prueba social convertida en presión**: rankings, posiciones,
  "otros ya han estudiado esto" como presión social, comparativas
  entre personas usuarias, contadores globales del estilo "1.234
  personas han visto esta tarjeta".
- **Coste irrecuperable / FOMO**: "perderás tu progreso si paras",
  "no pierdas tu racha", mensajes forzados de retención,
  notificaciones de tipo "te echamos de menos". Conecta con §2.2
  "El repaso nunca castiga".
- **Reciprocidad manipuladora / dark patterns**: registros forzados,
  casillas premarcadas, costes ocultos, alertas falsas,
  confirmaciones tramposas (por ejemplo, un botón de "no" que en
  realidad cierra la sesión o borra el progreso).
- **Aversión a la pérdida explotadora**: "tenías 5 ⭐, has perdido
  2". Las estrellas y el progreso **solo suman**, nunca restan como
  castigo (ver §2.2).

El tono por defecto en Memofun es el **calmo y predecible** descrito
en §2.3 — la persona estudia porque el repaso le resulta atractivo,
no porque la estemos empujando. Cuando un patrón de esta lista
aparece en una propuesta de producto o de UI, se rechaza por defecto;
cualquier excepción se discute en una PR con motivo explícito.

---

## 4. Separación de flujos

| Zona | Para quién | Qué permite |
|---|---|---|
| `index.html` (inicio) | Persona usuaria | Elegir una baraja ya preparada. Nada más. |
| `tools/study/` | Persona usuaria | Repasar la baraja elegida, tarjeta a tarjeta. |
| `settings/` | Apoyo | Tamaño de texto, idioma, importar un `.json` de baraja propio para repasarlo sin publicarlo, borrar progreso local. |
| Agente de IA del proyecto | Apoyo / construcción | Escribir el contenido de una baraja nueva a partir de un tema o de `doc/curriculum/`, siguiendo las reglas de "Generating deck content" (`CLAUDE.md`), para revisar antes de publicar. |

---

## 5. Criterios de éxito

Un cambio en Memofun es exitoso cuando:

1. La persona usuaria puede seguir estudiando sin ayuda para esa función.
2. Cumple las reglas de accesibilidad de `tecnico.md`.
3. No introduce IA generativa, cuentas, coste ni presión nuevos.
4. Funciona offline.
5. No añade recogida de datos personales.
6. Mantiene la paridad ES/EN de la interfaz.
7. El contenido de las tarjetas nuevas sigue el principio de aprendizaje
   significativo (pista con analogía / ejemplo / por qué importa,
   concepto recordado como respuesta corta) y Lectura Fácil.

---

## 6. Lo que Memofun NO hace

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
| No usa mensajes de escasez, falsa urgencia ni FOMO ("solo te queda 1", "date prisa", "no pierdas tu racha") | Presión; choca con §2.3 y la lista cerrada de §3.7 |
| No usa prueba social como presión (rankings, posiciones, "otros ya lo han estudiado") | Presión y desánimo; choca con §2.2 y §3.7 |
| No usa dark patterns (registros forzados, casillas premarcadas, costes ocultos, alertas falsas) | Confianza y accesibilidad; choca con la lista cerrada de §3.7 |
