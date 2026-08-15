# Guía: añadir una baraja con una IA de chat genérica (sin agente de código)

> Esta guía es para el rol de **apoyo** (familia, docente) que **no**
> tiene un agente de IA de programación con acceso al repositorio
> (como Claude Code) — solo un chat de IA cualquiera (ChatGPT,
> Claude.ai, Gemini, Copilot Chat…) en el navegador. Si sí tienes un
> agente con acceso al repo, usa en su lugar
> [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md): es más directo,
> porque el propio agente lee las reglas y escribe los archivos por ti.

---

## 1. Qué cambia respecto a la guía normal

En [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md) le pides a un
agente de IA que **ya tiene acceso al repositorio** que escriba la
baraja: lee las reglas de `CLAUDE.md`, escribe el `.json` y actualiza
`decks/manifest.json` él mismo.

Un chat de IA genérico no tiene ese acceso: no puede leer este
repositorio ni escribir archivos en él, solo generar texto en una
conversación. Por eso este flujo tiene un paso más — generar el
contenido en el chat y luego llevarlo tú (o pedírselo a alguien con
acceso) al repositorio.

Esto **no** cambia la regla de "sin IA generativa en el producto"
(`SPEC.md` §2.1): sigue siendo un paso de preparación de contenido que
hace una persona, fuera de la aplicación, antes de publicar nada —
igual de "offline" que cuando lo hace el agente de código.

## 2. Qué necesitas

- Acceso a cualquier chat de IA de texto, en el navegador.
- Una forma de guardar el resultado en el repositorio: o sabes crear
  archivos en GitHub desde la web, o le pides el paso final a alguien
  de construcción (o a un agente de código, si tienes acceso puntual
  a uno) — ver el paso 3.

## 3. Paso 1 — copia este prompt

Copia y pega este bloque completo al principio de la conversación con
tu IA de chat, y rellena los `[corchetes]` con tu tema:

```
Vas a escribir el contenido de una baraja de tarjetas de repaso para
Memofun, una app de estudio en Lectura Fácil pensada para que una
persona con discapacidad intelectual pueda repasar un tema de forma
autónoma. Sigue estas reglas exactamente:

TEMA: [tu tema, en pocas palabras]
NIVEL: [principiante / intermedio / avanzado]
CANTIDAD DE TARJETAS: [un número, p. ej. 15]
IDIOMA DEL CONTENIDO: [es / en]
ÍNDICE (opcional — si lo rellenas, cubre cada punto, ninguno más,
ninguno menos; si lo dejas vacío, elige tú los subtemas):
- [subtema 1]
- [subtema 2]

REGLAS DE CONTENIDO (obligatorias):
- Cada tarjeta es un objeto {"pregunta": "...", "respuesta": "..."}.
- La pregunta es clara, concreta, evaluable (nunca de sí/no), con un
  tono cálido y curioso — nunca de examen.
- La respuesta NUNCA es una definición de diccionario. Se construye
  alrededor de UNA de estas tres cosas: una ANALOGÍA cotidiana, un
  EJEMPLO PRÁCTICO concreto, o el PROBLEMA real que resuelve ese
  concepto ("por qué importa"). Envuelve esa frase clave entre
  <mark> y </mark>.
- Lectura Fácil: frases cortas (máximo 12 palabras cada una), una idea
  por frase, vocabulario cotidiano, voz activa. HTML simple permitido
  (<b>, <i>, <br>) — nunca markdown (nada de **, _, #, etc.).
- Como mucho UN concepto nuevo (un nombre propio, un término técnico,
  una idea abstracta) por tarjeta. Ancla siempre ese concepto en una
  imagen cotidiana concreta antes de nombrarlo. Si el tema tiene
  muchos nombres seguidos (movimientos, épocas, personajes), usa MÁS
  tarjetas, más pequeñas — no comprimas varios nombres en una tarjeta.
- Una tarjeta de "en qué se diferencian X e Y" solo si X e Y ya han
  tenido antes su propia tarjeta por separado.
- Tono divertido y cercano, como quien le cuenta algo interesante a
  un amigo — nunca sarcasmo, ironía, ni dobles sentidos.
- Cuando encaje de forma natural, añade UN dato curioso ("¿Sabías
  que...?") — nunca forzado.
- Cada respuesta tiene entre 2 y 5 frases.
- Nunca uses las palabras "discapacidad", "paciente" ni lenguaje
  clínico — el contenido trata del tema, no de quién lo estudia.
- No numeres las tarjetas ni repitas el nombre del tema en cada
  pregunta.
- Repetir un concepto clave con una variación (otro ejemplo, otro
  ángulo) está bien si ayuda a fijarlo — lo que no vale es una
  tarjeta que no aporta ningún matiz nuevo.

FORMATO DE SALIDA (obligatorio):
Devuelve ÚNICAMENTE este JSON, sin explicaciones antes ni después, sin
bloque de markdown alrededor:

{
  "tema": "...",
  "nivel": "...",
  "idioma": "...",
  "tarjetas": [
    { "pregunta": "...", "respuesta": "..." }
  ]
}

El array "tarjetas" debe tener EXACTAMENTE la cantidad de tarjetas
pedida arriba. Cuéntalas antes de responder.
```

## 4. Paso 2 — revisa lo que te devuelve

Antes de usarlo, comprueba a ojo:

- [ ] ¿Es JSON válido? (pégalo en cualquier validador de JSON online si
      tienes dudas, o guárdalo tal cual en un `.json` y ábrelo)
- [ ] ¿Tiene exactamente el número de tarjetas pedido? Las IA de chat
      a veces se quedan cortas o se pasan.
- [ ] ¿Cada respuesta tiene un `<mark>...</mark>`?
- [ ] ¿Hay algo en markdown (`**negrita**`, `# título`) colado en vez
      de HTML? Corrígelo o pide que lo regenere.
- [ ] Si diste un índice, ¿están todos los puntos cubiertos?

Si algo falla, pégaselo de vuelta a la misma IA: "corrige esto: [lo
que falta]" — suele ser más rápido que reescribirlo a mano.

## 5. Paso 3 — llévalo al repositorio

Tres caminos, según lo que tengas a mano:

**A) Tienes acceso de escritura a GitHub, pero no un agente de código**

1. En GitHub, ve a la carpeta `decks/` del repositorio y usa
   "Add file → Create new file".
2. Nombra el archivo como el `tema` en minúsculas y con guiones, p. ej.
   `docker-y-contenedores.json` (ver `slugify()` en
   `scripts/config-parser.js` si quieres el criterio exacto).
3. Pega el JSON que te dio la IA.
4. Añade a mano una entrada en `decks/manifest.json` (es una lista;
   añade tu entrada al final, respetando la coma anterior):
   ```json
   { "id": "docker-y-contenedores", "tema": "Docker y Contenedores",
     "nivel": "intermedio", "cantidad": 15,
     "file": "docker-y-contenedores.json", "icono": "🐳" }
   ```
   `cantidad` debe coincidir con el número real de tarjetas del
   archivo. Elige un emoji que represente el tema para `icono`.
5. Sigue el flujo normal de [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md):
   rama, commit, Pull Request. Alguien de construcción ejecutará
   `node scripts/check.js` al revisarlo — si puedes ejecutarlo tú antes
   (necesita Node.js), mejor: detecta errores de formato antes de abrir
   el PR.

**B) Tienes acceso puntual a un agente de código (Claude Code u otro)**

Pégale el JSON que generó el chat y pídele explícitamente:

> "He generado este contenido con [nombre de la IA] siguiendo las
> reglas de CLAUDE.md. Revísalo contra el checklist de
> `guia-interna-crear-barajas.md` §4, corrige lo que haga falta, guárdalo como
> `decks/<slug>.json`, añade la entrada en `decks/manifest.json` y
> ejecuta `node scripts/check.js`."

El agente hará la revisión, la integración y las comprobaciones por
ti — el mismo checklist que aplicaría si hubiera escrito la baraja él
mismo desde cero.

**C) No tienes acceso ni a GitHub ni a un agente de código**

Abre un issue en el repositorio (ver el paso 1 del flujo de
[`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md)) pegando el JSON que
generó la IA y explicando de qué tema se trata. Alguien de
construcción se encargará de revisarlo e integrarlo.

## 6. Revisión humana — más importante todavía aquí

Un chat de IA genérico no conoce este proyecto: no ha leído
`CLAUDE.md` a menos que se lo hayas pegado en el prompt, y no aplica
ningún checklist por su cuenta. Por eso, antes de dar la baraja por
publicada, repasa el checklist completo de
[`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md) §4 — Lectura Fácil,
densidad conceptual, sin lenguaje clínico, tono, dato curioso,
repetición con propósito, fidelidad al índice si diste uno.

## 7. Errores típicos de las IA de chat genéricas

- **Se inventan campos que no existen** en el esquema (`autor`,
  `fecha`, `dificultad`…) — bórralos; el esquema es exactamente
  `{tema, nivel, idioma, tarjetas}`.
- **Usan markdown en vez de HTML** dentro de `respuesta` — solo se
  permite `<b>`, `<i>`, `<br>`, `<mark>`.
- **Cuentan mal las tarjetas** — pediste 15 y te da 12, o 18. Cuéntalas
  tú antes de integrar.
- **Envuelven el JSON en una explicación** ("Aquí tienes tu baraja:
  \`\`\`json … \`\`\`") — quita todo lo que no sea el JSON en sí antes
  de guardarlo.
- **Repiten la misma estructura de frase en cada respuesta** ("Es
  como…") — pide variedad si lo notas muy monótono; no afecta a la
  validez técnica, pero sí a lo agradable que resulta repasar.

---

## 8. Referencias cruzadas

- [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md) — el flujo normal,
  con un agente de IA que tiene acceso al repositorio.
- `CLAUDE.md` → "Generating deck content" — el ruleset completo del
  que sale el prompt de este documento.
- [`tecnico.md`](tecnico.md) §3 — el formato JSON exacto de una
  baraja.
- [`SPEC.md`](SPEC.md) §2.1 — por qué esto no contradice la regla de
  "sin IA generativa en el producto".
- [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) — cómo abrir un PR
  o un issue con la baraja nueva.

🌐 English version: [`../en/chat-ai-creating-decks-guide.md`](../en/chat-ai-creating-decks-guide.md)
