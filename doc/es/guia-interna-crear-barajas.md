# Guía para crear barajas (ingesta de contenido)

> **Documentación interna del proyecto**: describe el flujo de trabajo
> para generar contenido *dentro del propio repositorio* de Memofun,
> no una función de la aplicación en sí — la persona usuaria final
> nunca ve ni usa esto. Es para el rol de **apoyo** (familia, docente)
> que ya tiene **el repositorio de Memofun abierto con un agente de IA
> de programación con acceso a él** (Claude Code u otro): cómo pedir
> una baraja nueva, paso a paso. **No hace falta instalar nada, ni
> tener una API key de nada**: el contenido lo escribe directamente ese
> agente. Si quieres el resumen de arquitectura en vez del paso a
> paso, ve a [`tecnico.md`](tecnico.md) §8.

> 💡 **¿Buscas un temario ya hecho?** [`doc/curriculum/es/`](../curriculum/es/)
> tiene índices listos de Primaria (1º-6º), ESO (1º-4º) y el Grado Medio
> de Gestión Administrativa. Puedes pedir directamente "genera la
> baraja de `doc/curriculum/es/primaria/3/lengua-castellana.md`" sin escribir
> nada más. Ver [`doc/curriculum/es/README.md`](../curriculum/es/README.md).

> 🤖 **¿No tienes un agente de IA con acceso a este repositorio?** Si
> solo cuentas con un chat de IA suelto (ChatGPT, Claude.ai, Gemini…),
> usa en su lugar [`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md) — mismas
> reglas, con un paso extra para traer el resultado al repositorio. Si
> no sabes cuál es tu caso, empieza por
> [`guia-ia-crear-barajas.md`](guia-ia-crear-barajas.md).

---

## 1. Qué necesitas

Nada que instalar ni ninguna cuenta que crear. Solo abrir este
proyecto en un IDE con un agente de IA de programación (por ejemplo,
Claude Code) y pedirle la baraja. El agente lee y escribe archivos
directamente en el repositorio.

## 2. El punto de ingesta: un tema, o un tema con índice

Puedes pedir una baraja de dos formas:

**Modo simple** — solo el tema:

> "Genera una baraja de Memofun sobre el aparato circulatorio, nivel
> intermedio, 15 tarjetas."

El agente elige por su cuenta los subtemas más relevantes para cubrir
ese tema al nivel indicado.

**Modo con índice** — si ya tienes un temario y quieres que la baraja
lo siga punto por punto, descríbelo (o pega la lista) y pide que la
baraja cubra exactamente esos puntos:

> "Genera una baraja de Memofun para 'Docker y Contenedores', nivel
> intermedio, 10 tarjetas, cubriendo estos puntos: qué es una imagen y
> qué es un contenedor; Dockerfile; volúmenes; redes en Docker;
> despliegue en un servidor Linux."

También puedes escribir primero un archivo `config.md` con ese
formato (frontmatter + `# Índice`, ver el ejemplo en la raíz del
proyecto o en `doc/curriculum/`) y pedir "genera la baraja a partir
de este archivo" — es exactamente el mismo formato que antes, solo que
ahora lo lee el agente en vez de un script.

### Campos del `config.md` (si lo usas)

| Campo | Obligatorio | Qué es | Por defecto |
|---|---|---|---|
| `tema` | Sí | El tema de la baraja, en pocas palabras. | — |
| `nivel` | No | `principiante`, `intermedio` o `avanzado`. | `intermedio` |
| `cantidad` | No | Cuántas tarjetas generar. | `10` |
| `salida` | No | Nombre del archivo `.json` de salida. | se genera del `tema` |
| `idioma` | No | Idioma del contenido de la baraja (no de la interfaz). | `es` |
| `# Índice` | No | Lista de viñetas con los subtemas a cubrir. | el agente los elige |

## 3. Lo que hace el agente

Cuando le pides una baraja, el agente:

1. Escribe las `cantidad` tarjetas siguiendo las reglas de
   `CLAUDE.md` → "Generating deck content" — aprendizaje significativo
   como tarjeta de pista primero (`pregunta` lleva una analogía, un
   ejemplo práctico o el "por qué importa" y cierra con una pregunta
   corta; `respuesta` es solo el concepto/término corto que se pide),
   Lectura Fácil, tono divertido y cercano, algún dato curioso cuando
   encaja, y cobertura completa del índice si le diste uno. Si el tema
   tiene una
   mecánica o regla de base (un procedimiento, una notación, una
   fórmula — p. ej. cómo se combinan los números romanos antes de
   calcular con ellos), la baraja empieza con unas tarjetas de lección
   que explican esa mecánica primero.
2. Escribe el archivo `decks/<salida>.json` directamente. Si la baraja
   amplía una serie existente (p. ej. añadir `literatura_3` junto a
   `literatura`/`literatura_2`), primero lee el registro corto de
   `decks/concepts/<base-slug>.md` — en vez del JSON completo de cada
   baraja hermana — para ver qué está cubierto y cómo, así las
   repeticiones siguen siendo con propósito sin releer la serie
   entera cada vez. Después actualiza ese registro con lo que añadió
   la baraja nueva.
3. Añade la entrada correspondiente a `decks/manifest.json` — si
   pediste la baraja a partir de un archivo de `doc/curriculum/`,
   incluye también `curso` y `asignatura`, así la pantalla de inicio
   la agrupa dentro de ese curso en vez de mostrarla suelta (ver
   `tecnico.md` §4.1). Puedes fijar un curso como acceso rápido desde
   la pantalla de asignaturas: se guarda en tu `localStorage`, solo en
   tu dispositivo.
4. Te dice qué generó y dónde, y si conviene una revisión humana
   adicional (por ejemplo, en temas muy técnicos o sensibles).

### 3.1 Opcional: añadir una imagen de apoyo visual a una tarjeta

Cualquier tarjeta puede llevar una foto/ilustración como apoyo visual
a la explicación (ver `tecnico.md` §3.1 para la lista completa de
campos). Pídelo de forma explícita — el agente no añade imágenes por
su cuenta — al generar la baraja o después, para una tarjeta o para
toda la baraja:

> "Añade una imagen de apoyo a las tarjetas de `primaria_1_literatura.json`."

Para cada tarjeta, el agente:

1. Busca con `node scripts/buscar-imagen.js "<término>"` — esto
   consulta Openverse (openverse.org), un banco de imágenes gratuito
   que agrega fotos con licencia abierta, sin necesidad de registro,
   restringido a licencias que permiten reutilizar y modificar sin
   restricciones extra (CC0, Dominio público, CC BY, CC BY-SA — nunca
   `-NC`/`-ND`). Igual que la búsqueda de ARASAAC en sinonimia, es una
   **herramienta de preparación de contenido que se ejecuta al
   escribir la baraja**, no una llamada en tiempo de ejecución desde
   el sitio publicado — la imagen descargada acaba siendo un archivo
   estático más, como cualquier otro recurso (`CLAUDE.md` → "No
   generative AI in the shipped product").
2. Elige la candidata que de verdad encaja con la tarjeta **solo a
   partir del texto (título/fuente) que imprime el script** (no solo
   la que coincide literalmente con el término buscado — la búsqueda
   de Openverse es por etiquetas, no semántica, así que probar un
   término más concreto o más común cuando la primera búsqueda no da
   nada o da resultados fuera de tema funciona igual que con
   `buscar-pictograma.js` en sinonimia). **Nunca abre un archivo de
   imagen para verlo — tampoco la candidata final.** El título/fuente
   del resultado de búsqueda se trata como la señal ya curada para
   decidir el encaje; es una decisión deliberada, no un atajo, porque
   abrir cualquier imagen gasta ~1000 tokens de visión o más por un
   chequeo que el título ya resuelve. La tarjeta puntual que acabe con
   una imagen de verdad desajustada la detecta después una persona
   leyendo la baraja, que lo reporta según `CONTRIBUTING.es.md` — no el
   agente reverificando cada imagen al escribir el contenido.
3. Descarga la URL `thumb` (no la `image` de resolución completa) en
   `assets/img/decks/<slug-de-la-baraja>/<archivo>.jpg` — es la misma
   foto a una fracción del tamaño, de sobra para ilustrar una tarjeta.
   Si el proxy de miniaturas de Openverse falla con un 400 en ese
   origen concreto, **genera la miniatura tú mismo en vez de caer al
   fallback `image` a resolución completa** — el campo `fuente` de
   la candidata casi siempre apunta a Wikimedia Commons, y Wikimedia
   sirve una miniatura oficial de cualquier archivo vía
   `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/<nombre>&width=800`
   (o su equivalente por API `?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800`
   sobre la página con ese `curid`), que es la herramienta correcta
   para este caso concreto — mismo autor, misma licencia, sólo más
   pequeña. Sólo si ni la miniatura de Openverse ni la de Wikimedia
   funcionan, aborta y reporta la imagen que falta — nunca recurras a
   la URL `image` a resolución completa como opción por defecto.
   **Presupuesto de tamaño: el archivo guardado tiene que quedar por
   debajo de 200 KB en disco** (≤1024 px en el lado largo — ver
   `tecnico.md` §3.1). El check en `scripts/check.js` falla el build
   por encima de 200 KB.
4. Añade el campo `imagen` a esa tarjeta con todos sus subcampos
   (`archivo`, `alt`, `titulo`, `autor`, `fuente`, `licencia`) — `alt`
   describe lo que la imagen muestra de verdad, en el idioma de la
   baraja.

Si te piden añadir imágenes a toda una baraja en vez de a una sola
tarjeta, agrupa las ediciones del campo `imagen` en el menor número de
pasadas posible sobre el JSON de la baraja, en vez de releer y volver a
editar el archivo completo por cada tarjeta — la búsqueda y descarga sí
va tarjeta a tarjeta (cada una necesita su propia imagen), pero el
archivo en sí no hace falta releerlo cada vez.

## 4. Revisar antes de dar por publicada la baraja

Aunque el agente aplica las reglas al escribir, sigue mereciendo la
pena echar un vistazo antes de considerarla publicada — es la misma
idea que revisar cualquier contenido antes de un examen. Comprueba:

- [ ] **Lectura fácil**: frases cortas, una idea por frase.
- [ ] **Formato pista-primero**: `pregunta` es la pista (analogía,
      ejemplo o "por qué importa"), sin nombrar el concepto;
      `respuesta` es solo ese concepto/término, corto (1-6 palabras) —
      nunca una frase, nunca una definición de diccionario reformulada.
- [ ] **Densidad conceptual**: como mucho un concepto nuevo por
      tarjeta, anclado en algo concreto — no varios nombres o ideas
      abstractas seguidos sin ejemplo (temas como movimientos
      literarios o épocas históricas son los que más fallan aquí).
- [ ] **Sin lenguaje clínico**: nada de "discapacidad", "paciente", etc.
- [ ] **Tono divertido y cercano**: como quien cuenta algo interesante a
      un amigo — nunca sarcasmo, ironía ni dobles sentidos
      (`SPEC.md` §2.5).
- [ ] **Dato curioso** cuando el tema se presta a ello.
- [ ] **Repetición con propósito**: repetir un concepto clave (igual o
      con variación, incluso entre barajas del mismo tema/curso) está
      bien y apuntala el aprendizaje — lo que se descarta es una
      tarjeta que repite sin aportar ningún matiz, ejemplo o contexto
      nuevo (`SPEC.md` §1.3).
- [ ] **Fiel al temario**: si hay un temario de referencia
      (`doc/curriculum/`, un `# Índice`, el currículo oficial), la
      baraja se ciñe a esos puntos y no deriva a temas adyacentes que
      no se estudian en ese curso (`SPEC.md` §1.3).
- [ ] Si pediste un índice: **todos los puntos están cubiertos**.
- [ ] Si alguna tarjeta tiene `imagen`: la licencia es CC0/Dominio
      público/CC BY/CC BY-SA (nunca `-NC`/`-ND` — `scripts/check.js` lo
      detecta, pero conviene un vistazo humano también) y el texto
      `alt` describe la propia imagen. Si de verdad muestra lo que
      trata la tarjeta *no* se reverifica aquí — el título/fuente de la
      búsqueda ya fue la señal curada al escribir el contenido, y
      reabrir cada archivo para comprobarlo otra vez gastaría
      justo los tokens de visión que este flujo busca evitar. Si tú (o
      cualquiera leyendo la baraja publicada) encuentra una tarjeta
      cuya imagen de verdad no encaja, repórtalo según
      `CONTRIBUTING.es.md` en vez de arreglarlo de paso sin más — así
      la tasa de desajustes queda visible.

Si algo no cumple, pide al agente que reescriba esa tarjeta o edita el
`.json` directamente (es texto plano).

## 5. Comprobar que todo encaja

```
node scripts/check.js
```

Valida, entre otras cosas, que `decks/manifest.json` apunta a archivos
reales con tarjetas, y que ningún archivo de `doc/curriculum/` está
mal formado. No revisa la calidad del contenido — eso sigue siendo
cosa de una persona (o del agente aplicando el checklist del punto 4).

## 6. Publicar la baraja

Si el agente ya añadió la entrada a `decks/manifest.json`, no queda
nada más que hacer: abre `index.html` y la baraja ya aparece en la
rejilla de inicio.

---

## 7. Referencias cruzadas

- `CLAUDE.md` → "Generating deck content" — el ruleset completo que
  sigue el agente al escribir las tarjetas.
- [`tecnico.md`](tecnico.md) §3 — formato JSON de una baraja.
- [`tecnico.md`](tecnico.md) §3.1 — el campo opcional `imagen` por tarjeta.
- [`tecnico.md`](tecnico.md) §8 — cómo funciona la ingesta de contenido por dentro.
- [`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md) — la misma tarea, pero con un chat de IA genérico sin acceso al repositorio.
- [`SPEC.md`](SPEC.md) §1.3 — por qué repetir con propósito y ceñirse al temario apuntalan el aprendizaje significativo.
- [`SPEC.md`](SPEC.md) §2.1 — por qué no hay ninguna IA generativa en el producto.
- [`SPEC.md`](SPEC.md) §2.5 — el porqué del tono divertido y los datos curiosos.
- [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) — cómo abrir un PR con la baraja nueva.

🌐 English version: [`../en/internal-creating-decks-guide.md`](../en/internal-creating-decks-guide.md)
