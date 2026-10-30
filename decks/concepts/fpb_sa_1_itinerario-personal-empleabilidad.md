# fpb_sa_1_itinerario-personal-empleabilidad — conceptos ya cubiertos

> Registro de trabajo del agente de IA (ver CLAUDE.md → "Generating deck content" paso 7).
> No lo lee la app ni el service worker; no necesita subir VERSION en sw.js.

## Alcance

Esta asignatura cubre los **Temas 1-8** del temario oficial.
- Tema 1: `D:/img_memofun/ipp/tema1/`, 11 páginas → 4 barajas, 71 tarjetas
- Tema 2: `D:/img_memofun/ipp/tema2/`, 12 páginas → 3 barajas, 40 tarjetas
- Tema 3: `D:/img_memofun/ipp/tema3/`, 10 páginas → 4 barajas, 37 tarjetas
- Tema 4: `D:/img_memofun/ipp/tema4/`, 8 páginas → 4 barajas, 44 tarjetas
- Tema 5: `D:/img_memofun/ipp/tema5/`, 10 páginas → 6 barajas, 36 tarjetas
- Tema 6: `D:/img_memofun/ipp/tema6/`, 8 páginas → 4 barajas, 23 tarjetas
- Tema 7: `D:/img_memofun/ipp/tema7/`, 9 páginas → 8 barajas, 44 tarjetas
- Tema 8: `D:/img_memofun/ipp/tema8/`, 7 páginas → 8 barajas, 38 tarjetas

### Cobertura del material fuente para Tema 1

El temario oficial enumera 8 subsecciones. El material capturado solo
desarrolla las **tres primeras** (con subapartados 3.1, 3.2, 3.3). Las
subsecciones 4 (Daños derivados), 5 (Cómo prevenir), 6 (Emergencia),
7 (Derechos y deberes) y 8 (Gestión de la prevención) están listadas
en el mapa conceptual de la página 6 pero **no se desarrollan** en
las páginas siguientes. Por lo tanto las barajas solo cubren lo que
está en la fuente.

| Subsección oficial | Cubierta por la fuente | Baraja |
|---|---|---|
| 1. ¿Qué es la seguridad y salud? | ✅ (pag7) | `salud-y-riesgo-laboral.json` |
| 2. El trabajo y la salud | ✅ (pag7) | `salud-y-riesgo-laboral.json` |
| 3. Condiciones de trabajo (intro) | ✅ (pag7) | `salud-y-riesgo-laboral.json` |
| 3.1 Condiciones de seguridad | ✅ (pag8) | `riesgos-condiciones-seguridad.json` |
| 3.2 Condiciones medioambientales | ✅ (pag9-pag10) | `riesgos-ambientales.json` |
| 3.3 Carga de trabajo (física y mental) | ✅ (pag11) | `carga-de-trabajo-y-ergonomia.json` |
| 4-8 | ❌ no en la fuente | — |

## Tema 1 — Seguridad y salud en el trabajo

Las barajas de este tema viven en su propia carpeta dentro de la asignatura:

- `tema-1-seguridad-y-salud/salud-y-riesgo-laboral.json` (§1-§3) — 11 tarjetas
- `tema-1-seguridad-y-salud/condiciones-seguridad.json` (§3.1) — 5 tarjetas
- `tema-1-seguridad-y-salud/riesgos-ambientales.json` (§3.2) — 21 tarjetas
- `tema-1-seguridad-y-salud/carga-de-trabajo-y-ergonomia.json` (§3.3) — 8 tarjetas

Tema aprobado a partir de las fotos del módulo en `D:/img_memofun/ipp/tema1/`
(11 imágenes, organizadas como `pag5`–`pag13` y `ejercicios cuaderno 1/2`).

Cobertura: las cuatro barajas siguen las secciones numeradas de la fuente
(1, 2, 3, 3.1, 3.2, 3.3). Las secciones 4 a 8 del temario oficial quedan
sin baraja hasta que se amplíe el material fuente.

### Revisión de anclas (octubre 2026)

Las 45 tarjetas del tema 1 se repasaron contra la regla del ancla
(`doc/es/guia-crear-elementos.md` §2.3): el anverso tiene que traer una
palabra que devuelva el término de la respuesta, sin regalar el término.

- **19 tarjetas reescritas:** 5 regalaban la respuesta (R3) y 14 no tenían
  ancla plana. Las anclas nuevas son «evitar», «a salvo», «identificar» /
  «cubrirte», «sonido», «temblores», «el peso de todo eso», «postura
  incómoda» o «encorvado», entre otras.
- **Dos marcas corregidas** porque no describían la imagen: «Peligroso para
  el medio» (decía *un cielo gris con humo* en vez del rombo) y «Gas a
  presión» (decía *botella de gas*, que regalaba la respuesta).
- **Tabla de anclas** en `doc/revision-ipp/tema-01-seguridad-salud.md`.
- **Auditor:** `node scripts/audit-deck-anchors.js decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-1-seguridad-y-salud`
  → 45/45 con ancla, 0 R1/R2/R3. Para que el detector entendiera este
  tema se le añadió su vocabulario a `scripts/audit-deck-anchors.js` y se
  corrigió el conteo de frases de pista (el punto que deja el `<mark>`
  inicial se contaba como frase).

### Conceptos y dónde se han gastado ya

#### Salud y trabajo (§1-§3) — solo en `salud-y-riesgo-laboral.json`

- Prevención de riesgos laborales: trabajar no es solo hacer tareas, es hacerlas sin dañar la salud
- Trabajo y salud: relación directa entre el trabajo y el estado de salud
- Bienestar físico / mental / social: las tres partes de la salud (OMS), una tarjeta cada una
- No estar enfermo: la idea de que la salud es solo eso es incompleta
- Físico, mental y social: si falla una de las tres, la salud no está completa
- El lugar de trabajo / Las herramientas / La forma de trabajar: los tres factores que afectan a la salud
- Ruido: mucho ruido → perder audición
- Postura al levantar: levantar mal algo pesado → duele la espalda
- Productos tóxicos: pueden enfermar
- Riesgo laboral: definición (posibilidad de un daño causado por o relacionado con el trabajo)
- Condiciones de trabajo: definición (característica del trabajo que puede generar un riesgo)
- Cuatro categorías: seguridad / ambientales / ergonómicos / psicosociales
- Factores psicosociales: la cuarta familia, cómo se siente y se relaciona la persona
- Conocer los riesgos: cierre del bloque

#### §3.1 Condiciones de seguridad — nociones nuevas solo en `riesgos-condiciones-seguridad.json`

- Condiciones de seguridad: las condiciones materiales del lugar de trabajo
- Lugares de trabajo: áreas del centro donde se permanece
- Máquinas y herramientas: máquina, aparato, instrumento o instalación
- Riesgo eléctrico: cable en mal estado → calambre (el ejemplo más concreto del apartado)
- Riesgo de incendio: fuegos no controlados

#### §3.2 Condiciones ambientales — solo en `riesgos-ambientales.json`

- Agentes físicos: formas de energía nocivas (ruido, iluminación, radiaciones, vibraciones, temperatura)
- Ruido / Iluminación / Radiaciones / Vibraciones / Temperatura: una tarjeta por agente
- Agentes químicos: sustancias con propiedades fisicoquímicas, químicas o toxicológicas
- Físicoquímicas / Químicas / Toxicológicas: una tarjeta por familia de propiedades
- Gas a presión / Explosivo / Comburente / Inflamable / Corrosivo / Peligro para la salud /
  Toxicidad / Peligro grave / Peligroso para el medio: los nueve pictogramas, una tarjeta cada uno
  - Ojo: el pictograma de "peligro grave" es la silueta con la estrella en el pecho; el de
    "toxicidad" es la calavera. No intercambiarlos.
  - "Peligroso para el medio" va el primero, como en la rejilla del módulo.
  - "Comburente" es lo que hace que arda mejor, no el fuego en sí: la pista lo dice así a propósito.
- Agentes biológicos: virus, gérmenes, bacterias
- Exposición: el contacto con ese agente mientras trabajas es lo que hace el daño

#### §3.3 Riesgos ergonómicos — solo en `carga-de-trabajo-y-ergonomia.json`

- Riesgos ergonómicos: los aspectos físicos y mentales de la jornada
- Carga de trabajo: introduce las dos caras sin nombrar ninguna (física / mental)
- Carga física / Manipulación manual / Esfuerzo físico / Movimientos repetitivos
- Carga mental / Cabeza y escritorio: el esfuerzo mental en la oficina
  - "Movimientos repetitivos" está illustrado con una cadena de montaje porque es lo que
    resalta el diagrama del módulo.

### Repeticiones deliberadas (mismo concepto, ángulo distinto)

Estas respuestas salen en más de una baraja a propósito: la repetición consolida, pero
el ángulo tiene que ser nuevo. No volver a gastar estos pares sin uno realmente distinto:

- Ruido → 3 barajas: en `salud-y-riesgo-laboral` (ejemplo de trabajo), en
  `riesgos-condiciones-seguridad` (la fuente del sonido) y en `riesgos-ambientales`
  (forma de energía)
- Postura al levantar → 2 barajas: en `salud-y-riesgo-laboral` (duele la espalda) y
  en `riesgos-condiciones-seguridad` (agacharse con las rodillas)
- Bienestar mental → 2 barajas: definición (`salud-y-riesgo-laboral`) y la cabeza como lugar
  en el que descansar (`riesgos-condiciones-seguridad`)
- Conocer los riesgos → 2 barajas: conclusión del bloque (`salud-y-riesgo-laboral`) y el cartel
  que avisa antes de empezar (`carga-de-trabajo-y-ergonomia`)
- Prevención de riesgos laborales / Riesgo laboral / Condiciones de trabajo / Productos
  tóxicos / Bienestar físico / Bienestar social / Físico, mental y social / Las herramientas
  → 2 barajas cada una: primera vez en `salud-y-riesgo-laboral`, segunda en
  `riesgos-condiciones-seguridad` con el ángulo ya indicado arriba
- Iluminación / Temperatura / Agentes químicos / Agentes biológicos → 2 barajas cada una:
  como agentes (`riesgos-ambientales`) y como protección en el puesto
  (`carga-de-trabajo-y-ergonomia`)

### Lo que se eliminó

- ~~`tema-1-seguridad-y-salud/prevencion-emergencia-y-derechos.json`~~ — la quinta
  baraja (mapa conceptual, 18 tarjetas) cubría las secciones 6-8 del temario oficial
  (emergencia, primeros auxilios, derechos, gestión de la prevención) usando
  contenido de los Temas 2 y 3 del módulo. No es fiel al material fuente del Tema 1,
  así que se elimina.

## Tema 7 — La búsqueda de empleo

Las barajas de este tema viven en su propia carpeta dentro de la asignatura:

- `tema-7-la-busqueda-de-empleo/que-significa-buscar-empleo.json` (§1) — 3 tarjetas
- `tema-7-la-busqueda-de-empleo/que-necesito-antes-de-empezar.json` (§2) — 5 tarjetas
- `tema-7-la-busqueda-de-empleo/donde-buscar-empleo.json` (§3) — 5 tarjetas
- `tema-7-la-busqueda-de-empleo/consejos-para-buscar-empleo.json` (pag68) — 5 tarjetas
- `tema-7-la-busqueda-de-empleo/tipos-de-empleo.json` (§4) — 5 tarjetas
- `tema-7-la-busqueda-de-empleo/curriculum-vitae.json` (§5) — 7 tarjetas
- `tema-7-la-busqueda-de-empleo/carta-de-presentacion.json` (§6) — 5 tarjetas
- `tema-7-la-busqueda-de-empleo/prepararse-para-entrevista.json` (§7) — 9 tarjetas

**44 tarjetas** en total, más una **autoevaluación de 12 preguntas**
(`autoevaluacion.json`, tipos `seleccion`, `completar`, `vf`, `unir` y
`clasificar`) construida con los ejercicios 4-7 y las actividades del cuaderno.

Tema aprobado a partir de las fotos del módulo en `D:/img_memofun/ipp/tema7/`
(9 imágenes, organizadas como `pag63`–`pag71`).

> **Nota de numeración:** el **mapa conceptual** del módulo (pag64) lista
> solo 6 nodos y omite la subsección §4 ("Tipos de empleo que puedes
> buscar"), pero la **tabla de tipos** sí está desarrollada en la pag66.
> El **índice oficial** (7 subsecciones, 1-7) es el canónico y las 7
> barajas siguen esa numeración.

### Conceptos y dónde se han gastado ya

#### §1 — solo en `que-significa-buscar-empleo.json`

- Buscar empleo: proceso de encontrar un trabajo adaptado a tus intereses, habilidades y necesidades.
- No es solo enviar currículums: conocerse a uno mismo, saber qué quieres hacer y preparados bien.
- Constancia y organización: «buscar trabajo es un trabajo en sí mismo».

#### §2 — solo en `que-necesito-antes-de-empezar.json`

- Actitud positiva y activa: requisito anímico antes de empezar.
- Información sobre dónde buscar ofertas: requisito informativo.
- Idea clara del tipo de trabajo que buscas: requisito de foco.
- Currículum vitae (CV): requisito documental principal.
- Carta de presentación: documento de apoyo que se pide a veces.

#### §3 — solo en `donde-buscar-empleo.json`

- Portales de empleo en internet: Infojobs, Indeed, LinkedIn, SEPE y webs de empresas.
- Oficinas de empleo: te inscriben como demandante y te informan de cursos y ofertas.
- Redes de contacto: boca en boca entre familiares, amigos y conocidos.
- Entrega directa: ir a empresas con el CV a preguntar si hay vacantes.
- Recursos útiles: SEPE, TodoFP, Garantía Juvenil y Empléate.

#### pag68 — solo en `consejos-para-buscar-empleo.json`

- Sé constante: busca cada día.
- Sé organizado: lleva un registro de las ofertas.
- Sé activo: pregunta, llama y entrega tu currículum.
- Sé positivo: no te desanimes si no te llaman.
- Sigue formándote: mejora tus habilidades mientras buscas.

#### §4 — solo en `tipos-de-empleo.json`

- Primer empleo: no requiere experiencia previa.
- Empleo temporal: por tiempo limitado.
- Prácticas o becas: para aprender trabajando.
- Empleo parcial: menos horas al día o a la semana.
- Empleo a jornada completa: unas 8 horas diarias.

#### §5 — solo en `curriculum-vitae.json`

- Currículum vitae (CV): descripción concisa y organizada de la trayectoria.
- Datos personales: nombre, teléfono y correo.
- Formación académica: estudios realizados.
- Experiencia laboral: trabajos previos (si los hay).
- Habilidades: lo que sabes hacer bien.
- Idiomas y conocimientos informáticos: lo que hablas y lo que sabes de informática.
- Reglas de estilo: claro, breve (una página) y sin faltas de ortografía.

#### §7 — solo en `prepararse-para-entrevista.json`

- Entrevista de trabajo: conversación formal con la empresa para conocerte.
- Investigar sobre la empresa: tarea clave antes de la entrevista.
- Repasar tu currículum: no llegar con desajustes delante de quien te entrevista.
- Preguntas comunes de entrevista: "¿Por qué quieres trabajar aquí?", "¿Cómo trabajas en equipo?".
- Piensa en tus puntos fuertes: el cuarto paso de la preparación.
- Ser puntual: clave práctica durante la entrevista.
- Vestir de forma adecuada: cuidado de imagen.
- Hablar con claridad y respeto: la otra mitad de la actitud positiva.
- Actitud positiva: mostrar interés y ganas durante la conversación.

#### §6 — solo en `carta-de-presentacion.json`

- Carta de presentación: texto breve que acompaña al CV.
- Presentarte: primer propósito de la carta.
- Por qué te interesa el puesto: segundo propósito.
- Destacar tus puntos fuertes: tercer propósito; la carta debe ser personalizada.
- Diferencia entre CV y carta: el CV resume en una página; la carta explica el interés por el puesto.

### Revisión de fidelidad al temario (octubre de 2026)

Contraste con `doc/revision-ipp/tema-07-la-busqueda-de-empleo.md` y con las fotos
del cuaderno del centro (`D:/img_memofun/ipp/tema7/`, págs. 63-71):

- Las **ocho barajas** del tema son `que-significa-buscar-empleo` (3),
  `que-necesito-antes-de-empezar` (5), `donde-buscar-empleo` (5),
  `consejos-para-buscar-empleo` (5), `tipos-de-empleo` (5),
  `curriculum-vitae` (7), `carta-de-presentacion` (5) y
  `prepararse-para-entrevista` (9): **44 tarjetas**.
- **Baraja nueva: `consejos-para-buscar-empleo`.** Los cinco «Consejos para
  buscar empleo» de la pag68 no tenían ninguna tarjeta; es un bloque del
  libro, no una invención.
- **Tarjetas retiradas:** las de marca (InfoJobs, LinkedIn, SEPE, TodoFP,
  Garantía Juvenil, Empléate como respuesta). Las marcas se nombran ahora en la
  pista de «portales de empleo en internet» y en la tarjeta «recursos
  útiles», que es como las da el libro.
- **Tarjeta conservada:** «oficinas de empleo» (es el §3.2 del cuaderno) y se
  le **añade «recursos útiles»** (pag68), que no tenía ninguna tarjeta.
- **Tarjeta nueva en `prepararse-para-entrevista`:** «Piensa en tus puntos
  fuertes», el cuarto paso de la lista «antes de la entrevista» de la pag67.
- Todos los enunciados se reescribieron como **pista + analogía**, y la
  respuesta es el **nombre**: antes, casi todas las tarjetas filtraban la
  respuesta en la propia pregunta.
- Auditoría de imágenes: las **34 imágenes** del tema se revisaron una a una
  (vistas, no leídas del `alt`); **32 se sustituyeron** por fotos que
  ilustran de verdad la pista y **los 43 `alt` se redactaron** describiendo lo
  que se ve. 5 imágenes huérfanas quedan en `audit-out/huerfanos-tema7/`.
- Autoevaluación nueva de **12 preguntas** (5 tipos), con los ejercicios 4-7
  del cuaderno.

## Tema 8 — Toma de decisiones e itinerario personal

Las barajas de este tema viven en su propia carpeta dentro de la asignatura:

- `tema-8-toma-de-decisiones-itinerario-personal/que-es-tomar-decisiones.json` (§1) — 2 tarjetas
- `tema-8-toma-de-decisiones-itinerario-personal/que-es-itinerario-personal.json` (§2) — 3 tarjetas
- `tema-8-toma-de-decisiones-itinerario-personal/importancia-buenas-decisiones.json` (§3) — 5 tarjetas
- `tema-8-toma-de-decisiones-itinerario-personal/etapas-toma-decisiones.json` (§4) — 7 tarjetas
- `tema-8-toma-de-decisiones-itinerario-personal/factores-que-influyen.json` (§5) — 6 tarjetas
- `tema-8-toma-de-decisiones-itinerario-personal/construccion-itinerario.json` (§6) — 4 tarjetas
- `tema-8-toma-de-decisiones-itinerario-personal/tecnicas-mejores-decisiones.json` (§7) — 5 tarjetas
- `tema-8-toma-de-decisiones-itinerario-personal/consejos-para-construir-itinerario.json` (pag78) — 6 tarjetas

**38 tarjetas** en total, más una **autoevaluación de 12 preguntas**
(`autoevaluacion.json`, tipos `seleccion`, `completar`, `vf`, `unir` y
`clasificar`) construida con las actividades 1-3 del cuaderno y con los
conceptos de los apartados §1-§8.

Tema aprobado a partir de las fotos del módulo en `D:/img_memofun/ipp/tema8/`
(7 imágenes, organizadas como `pag73`–`pag79`).

> **Nota:** El MD previo (`tema-08-…md`) lista la fuente como
> `D:/img_memofun/ipp/tem8/` (typo sin la "a"), pero la carpeta real
> del material fuente es `D:/img_memofun/ipp/tema8/`, y es la que
> han usado las barajas.

### Conceptos y dónde se han gastado ya

#### §1 — solo en `que-es-tomar-decisiones.json`

- Tomar decisiones: elegir entre varias opciones posibles.
- Se aprende y mejora con la práctica: la habilidad se entrena usándola (tarjeta propia).

#### §2 — solo en `que-es-itinerario-personal.json`

- Itinerario personal: camino académico y profesional de cada persona.
- No hay un solo camino correcto: cada persona tiene el suyo y no hay que compararse con nadie.
- Metas personales y profesionales: lo que cada persona quiere ir logrando con el tiempo.

#### §3 — solo en `importancia-buenas-decisiones.json`

- Bienestar personal, oportunidades de trabajo, desarrollo como persona, satisfacción con la vida: las cuatro consecuencias más importantes.
- Elegir con conciencia y responsabilidad: decidir bien no consiste en acertar siempre.

#### §4 — solo en `etapas-toma-decisiones.json`

- 7 etapas del proceso de toma de decisiones: identificar, autoconocimiento, buscar información, evaluar opciones, decidir, actuar, revisar y ajustar.
- La 7ª etapa cierra el ciclo: una buena decisión se revisa y se ajusta.

#### §5 — solo en `factores-que-influyen.json`

- Los **6 factores** con el ejemplo que da la pag77: intereses (me gusta ayudar a los demás), habilidades (se me da bien organizar), valores (quiero un trabajo estable), familia y entorno (mis padres me apoyan en estudiar FP), información (conozco las salidas de cada opción) y emociones (tengo miedo de equivocarme).

#### §6 — solo en `construccion-itinerario.json`

- Formación académica: la cadena FP Básica → Grado Medio → Grado Superior → Universidad.
- Experiencias laborales: prácticas, trabajos temporales, voluntariado.
- Formación complementaria: idiomas, informática, habilidades sociales.
- Cambios de rumbo: si algo no te gusta, se puede cambiar.

#### §7 — solo en `tecnicas-mejores-decisiones.json`

- Las **5 técnicas** del §7: visualizar el futuro, hablar con personas de confianza, hacer una lista de pros y contras, escuchar tus emociones (sin decidir solo por ellas) y no tener miedo a equivocarse.
- Ojo: «flexibilidad» y «pedir ayuda» **no** son técnicas del §7: son consejos de la pag78 y viven en la baraja `consejos-para-construir-itinerario`.

#### pag78 — solo en `consejos-para-construir-itinerario.json`

- Los **5 consejos** para construir tu itinerario: sé flexible, ten metas claras pero abiertas, sigue aprendiendo, pide ayuda cuando la necesites y cree en ti (tú eres el protagonista de tu camino).
- La frase clave «Puedo cambiar de dirección si lo necesito».

## Tema 6 — Itinerarios académicos y profesionales

Las barajas de este tema viven en su propia carpeta dentro de la asignatura:

- `tema-6-itinerarios-academicos-profesionales/que-es-itinerario-academico.json` (§1) — 4 tarjetas
- `tema-6-itinerarios-academicos-profesionales/opciones-academicas.json` (§2) — 6 tarjetas
- `tema-6-itinerarios-academicos-profesionales/entorno-sociolaboral.json` (§3) — 7 tarjetas
- `tema-6-itinerarios-academicos-profesionales/herramientas-decision.json` (§4) — 6 tarjetas

Tema aprobado a partir de las fotos del módulo en `D:/img_memofun/ipp/tema6/`
(8 imágenes, organizadas como `pag55`–`pag62`).

> **Nota:** El directorio `tema6/` se creía antes que contenía imágenes
> duplicadas de `tema5/`, pero en realidad tiene 8 imágenes únicas
> (`pag55`–`pag62`) que cubren las 4 subsecciones del temario oficial.

### Revisión de anclas (octubre 2026)

Las 23 tarjetas del tema 6 se repasaron contra la regla del ancla
(`doc/es/guia-crear-elementos.md` §2.3).

- **23 tarjetas reescritas:** 21 no tenían ancla (R4) y 12 regalaban la
  respuesta dentro de la marca (R3); 2 de ellas además arrancaban por
  «Es…», que se lee como pregunta cerrada.
- **Anclas nuevas** como «los recursos a tu alcance», «un asesoramiento
  gratuito», «exámenes oficiales», «tu propia ruta, hecha a tu medida», «los
  informes de los estudios», «elegir con datos», «varias salidas», «un nivel
  intermedio», «el nivel más alto», «estudios generales», «estudios
  superiores» o «formación más corta y específica».
- **Dato corregido:** la tarjeta de «Pruebas de acceso» aplicaba «a mayores
  de 25 años» a los ciclos y al Bachillerato; en la fuente (pag60) la edad
  solo se aplica al acceso a la universidad.
- **Tabla de anclas** en `doc/revision-ipp/tema-06-itinerarios-academicos-profesionales.md`.
- **Auditor:** `node scripts/audit-deck-anchors.js decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-6-itinerarios-academicos-profesionales`
  → 23/23 con ancla, 0 R1/R2/R3, y sin avisos de legibilidad.
- **Pendiente:** las 23 imágenes del tema 6 son miniaturas de PDF (portadas
  que además nombran la respuesta). `scripts/check.js` avisa de las cuatro
  barajas; hay que sustituirlas por fotos que ilustren la pista.

### Conceptos y dónde se han gastado ya

#### §1 — solo en `que-es-itinerario-academico.json`

- Itinerario académico y profesional: la ruta que cada persona elige para su formación y su vida laboral.
- Itinerario de vida: la ruta personal de formación y trabajo que se va recorriendo con el tiempo.
- Proyecto de futuro: se construye poco a poco con decisiones y esfuerzo.
- Decisión propia: base de un buen itinerario.

#### §2 — solo en `opciones-academicas.json`

- Opciones académicas: alternativas para seguir formándote o trabajar.
- 5 opciones tras grado básico: grado medio, grado superior, Bachillerato, Universidad, certificado de profesionalidad.
- Certificado de profesionalidad: formación más corta y específica que acredita una cualificación.

#### §3 — solo en `entorno-sociolaboral.json`

- Entorno sociolaboral: condiciones del mercado, empresas, sectores y puestos.
- Empresas del sector: negocios y organizaciones de un sector económico.
- Oferta de empleo: puestos de trabajo disponibles en un momento.
- Demanda profesional: profesiones con más salidas.
- Sectores emergentes: áreas económicas con más oportunidades.
- Cualificaciones profesionales: capacidades profesionales reconocidas oficialmente.
- Competencias clave: habilidades transversales pedidas en cualquier puesto.

#### §4 — solo en `herramientas-decision.json`

- Herramientas para decidir el itinerario: recursos del sistema educativo.
- Orientación académica y profesional: servicio público gratuito.
- Pruebas de acceso: exámenes oficiales para ciclos formativos, Bachillerato o Universidad.
- Itinerario personalizado: hecho a medida, no copiado.
- Información académica: la que ofrecen los centros y los portales oficiales.
- Decisión informada: pensar bien las cosas antes de elegir.

## Tema 5 — Habilidades personales

Las barajas de este tema viven en su propia carpeta dentro de la asignatura:

- `tema-5-habilidades-personales/importancia-competencias-personales.json` (§1) — 3 tarjetas
- `tema-5-habilidades-personales/como-mejorar-habilidades.json` (§2) — 4 tarjetas
- `tema-5-habilidades-personales/gestion-emocional-y-asertividad.json` (§3) — 13 tarjetas
- `tema-5-habilidades-personales/comunicacion.json` (§4) — 5 tarjetas
- `tema-5-habilidades-personales/escucha-activa.json` (§5) — 4 tarjetas
- `tema-5-habilidades-personales/habilidades-en-entrevista.json` (§6) — 7 tarjetas

Tema aprobado a partir de las fotos del módulo en `D:/img_memofun/ipp/tema5/`
(10 imágenes, organizadas como `pag45`–`pag54`).

> **Nota de numeración:** el módulo del colegio areteia numeró internamente las
> subsecciones de forma irregular (1, 2, 4, 5, 6, 7) en lugar del 1, 2, 3, 4, 5, 6
> del índice oficial. Las barajas siguen la numeración canónica del índice.

### Revisión de anclas (octubre 2026)

Las 36 tarjetas del tema 5 se repasaron contra la regla del ancla
(`doc/es/guia-crear-elementos.md` §2.3).

- **30 tarjetas reescritas:** 11 tenían la respuesta dentro de la marca y el
  resto no tenía ancla o arrancaba por «Es…» / «Son…», que se lee como
  pregunta cerrada.
- **Anclas nuevas** como «capacidades que aprendes y desarrollas», «repetir
  cada día», «seguir aprendiendo toda la vida», «el que habla y el que
  escucha», «ponerte en el lugar del otro», «miras a quien te habla» o «las
  cosas que se te dan bien».
- **Tarjeta repetida que también estaba rota:** en
  `importancia-competencias-personales.json` dos tarjetas compartían
  respuesta («Competencias personales y sociales»). Ahora son «Competencias
  personales», «Competencias sociales» y «Las habilidades blandas», según las
  definiciones de pag47. El mazo sigue con 3 tarjetas y el manifiesto no
  cambia.
- **Tabla de anclas** en `doc/revision-ipp/tema-05-habilidades-personales.md`.
- **Auditor:** `node scripts/audit-deck-anchors.js decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-5-habilidades-personales`
  → 36/36 con ancla, 0 R1/R2/R3, y sin avisos de legibilidad.

### Conceptos y dónde se han gastado ya

#### §1 — solo en `importancia-competencias-personales.json`

- Competencias personales y sociales: las habilidades blandas que permiten trabajo en equipo, comunicación y convivencia.
- Habilidades blandas: conocimientos no técnicos que las empresas valoran.

#### §2 — solo en `como-mejorar-habilidades.json`

- Mejora de habilidades: práctica, esfuerzo, formación continua.
- 3 claves: práctica diaria, esfuerzo y constancia, formación continua.

#### §3 — solo en `gestion-emocional-y-asertividad.json`

- Gestión emocional: reconocer, entender y regular emociones.
- Inteligencia emocional: sinónimo del anterior.
- 3 pasos de la gestión emocional: reconocer, regular, expresar.
- 5 componentes de la inteligencia emocional: motivación, habilidades sociales, autoconciencia, autorregulación, empatía.
- Asertividad: habilidad para expresar lo que piensas, sientes o necesitas.
- 3 estilos de conducta: pasiva (Ratón), agresiva (León), asertiva (Persona).
- Decir no respetuosamente: la esencia de la asertividad.

#### §4 — solo en `comunicacion.json`

- Comunicación: transmisión e intercambio de mensajes entre emisor y receptor.
- Emisor y receptor: los dos extremos del proceso.
- Mensaje: lo que envía el emisor.
- Convivencia: vivir juntos gracias a la comunicación.
- Comunicación eficaz: lo importante es lo que finalmente entiende el receptor.

#### §5 — solo en `escucha-activa.json`

- Escucha activa: prestar atención a todos los detalles.
- 3 consejos: no hacer otra cosa, esperar turno, concentrarse en el mensaje.

#### §6 — solo en `habilidades-en-entrevista.json`

- Entrevista de trabajo: proceso necesario para acceder a un puesto.
- 3 habilidades: piensa en 3 que te representen.
- Técnica STAR: Situación, Tarea, Acción, Resultado.
- 3 frases tipo: organizada, adaptarse a cambios, trabajo en equipo.

## Tema 4 — Autoconocimiento y habilidades personales

Las barajas de este tema viven en su propia carpeta dentro de la asignatura:

- `tema-4-autoconocimiento-habilidades-personales/que-es-el-autoconocimiento.json` (§1) — 5 tarjetas
- `tema-4-autoconocimiento-habilidades-personales/que-debo-conocer-de-mi.json` (§2) — 16 tarjetas
- `tema-4-autoconocimiento-habilidades-personales/habilidades-personales.json` (§3) — 10 tarjetas
- `tema-4-autoconocimiento-habilidades-personales/analisis-personal-importancia.json` (§4) — 13 tarjetas

Tema aprobado a partir de las fotos del módulo en `D:/img_memofun/ipp/tema4/`
(8 imágenes, organizadas como `pag37`–`pag44`).

Cobertura: las cuatro barajas siguen las subsecciones del temario oficial
(1, 2, 3, 4) sin solaparse. La primera cubre la definición de autoconocimiento;
la segunda, las cosas que debo conocer de mí mismo; la tercera, los tipos de
habilidades; la cuarta, el análisis DAFO y los consejos.

### Revisión de anclas (octubre 2026)

Las 44 tarjetas del tema 4 se repasaron contra la regla del ancla
(`doc/es/guia-crear-elementos.md` §2.3). Aquí el problema era distinto al
de los otros temas: casi todas las barajas son de definiciones, así que el
`<mark>` **era** la respuesta.

- **43 tarjetas reescritas:** 10 tenían la respuesta dentro de la marca (y la
  de la matriz DAFO enumeraba las cuatro partes, con sus iniciales
  deletreando el acrónimo) y el resto no tenía ancla o arrancaba por «Es…» /
  «Son…», que se lee como pregunta cerrada.
- **Pista en texto plano, analogía en la marca**: la marca queda con el «Es
  como…» que ilustra la imagen y la definición pasa a texto plano.
- **Anclas nuevas** como «sabes quién eres», «en qué tienes soltura», «en
  qué debes mejorar», «llegar siempre a la hora», «el campo y los árboles»,
  «la pantalla y el ratón», «prestar oído a lo que te dice el otro»,
  «clavar con un martillo» o «cuatro cuadrantes».
- **Tabla de anclas** en `doc/revision-ipp/tema-04-autoconocimiento-habilidades-personales.md`.
- **Auditor:** `node scripts/audit-deck-anchors.js decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-4-autoconocimiento-habilidades-personales`
  → 44/44 con ancla, 0 R1/R2/R3, y sin avisos de legibilidad.

### Conceptos y dónde se han gastado ya

#### §1 — solo en `que-es-el-autoconocimiento.json`

- Autoconocimiento: la capacidad de entender cómo eres tú mismo.
- Reflexión: pensar en cómo te sientes y por qué.
- Gustos y preferencias: lo que te gusta y lo que no.
- Lo que se te da bien.
- Áreas de mejora.

#### §2 — solo en `que-debo-conocer-de-mi.json`

- Cualidades personales: características positivas (responsable, puntual, amable).
- 3 ejemplos de cualidades: responsabilidad, puntualidad, amabilidad.
- Áreas de mejora: lo que puedes desarrollar.
- 3 ejemplos de áreas: nervios, organización, concentración.
- Intereses: lo que te motiva o divierte (naturaleza, informática).
- Valores: principios que guían tu comportamiento.
- 4 valores del módulo: respeto, honestidad, esfuerzo, solidaridad.

#### §3 — solo en `habilidades-personales.json`

- Habilidades personales: capacidades para desenvolverte.
- Habilidades técnicas o duras: las que se aprenden (usar herramientas, cocinar, manejar ordenador, escribir).
- Habilidades blandas o sociales: las de relación (escuchar, trabajo en equipo, resolver conflictos).

#### §4 — solo en `analisis-personal-importancia.json`

- Importancia del autoconocimiento: la base de todo.
- 4 beneficios: elegir puesto, mejorar rendimiento, sentirse seguro, mejor comunicación.
- Matriz DAFO: herramienta con 4 cuadrantes.
- 4 elementos DAFO: Fortalezas, Oportunidades, Debilidades, Amenazas.
- 4 consejos para mejorar: escucharte, pedir opinión, reflexionar, probar cosas nuevas.

## Tema 3 — Técnicas básicas de primeros auxilios

Las barajas de este tema viven en su propia carpeta dentro de la asignatura:

- `tema-3-tecnicas-basicas-primeros-auxilios/concepto-de-primeros-auxilios.json` (§1) — 10 tarjetas
- `tema-3-tecnicas-basicas-primeros-auxilios/lo-mas-importante-pas.json` (§2) — 8 tarjetas
- `tema-3-tecnicas-basicas-primeros-auxilios/desmayos-y-hemorragias.json` (§3) — 5 tarjetas
- `tema-3-tecnicas-basicas-primeros-auxilios/emergencias-quemaduras-fracturas-convulsiones.json` (§3) — 10 tarjetas
- `tema-3-tecnicas-basicas-primeros-auxilios/el-botiquin-basico.json` (§4) — 9 tarjetas

Tema aprobado a partir de las fotos del módulo en `D:/img_memofun/ipp/tema3/`
(10 imágenes, organizadas como `pag27`–`pag36`).

Cobertura: las cinco barajas siguen las subsecciones del temario oficial
(1, 2, 3, 4) sin solaparse. La primera cubre el concepto general; la
segunda, la regla PAS; la tercera, los protocolos por tipo de
emergencia; la cuarta, el contenido del botiquín.

### Revisión de anclas (octubre 2026)

Las 42 tarjetas del tema 3 se repasaron contra la regla del ancla
(`doc/es/guia-crear-elementos.md` §2.3).

- **40 tarjetas reescritas:** 15 regalaban la respuesta (R3) —«112» se
  escribía entero en el anverso— y el resto no tenía ancla o traía frases
  de 13 a 20 palabras.
- **Anclas nuevas** como «el número único de emergencias» (112), «tumbarla
  para que respire bien», «un paño que no tenga suciedad», «cubrirlo con
  una hoja nueva», «subir la zona afectada», «la caja», «el botiquín»,
  «bombear el pecho», «tocar el latido», «las dos hojas que se cierran» o
  «telas sin gérmenes».
- **Nueve tarjetas** del botiquín tenían dos `<mark>`; la regla del
  proyecto es una por tarjeta.
- **Tabla de anclas** en `doc/revision-ipp/tema-03-tecnicas-basicas-primeros-auxilios.md`.
- **Auditor:** `node scripts/audit-deck-anchors.js decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-3-tecnicas-basicas-primeros-auxilios`
  → 42/42 con ancla, 0 R1/R2/R3.
- **Pendiente:** las imágenes del tema siguen siendo miniaturas de PDF
  (`check.js` lo avisa); hay que sustituirlas por fotos que ilustren la
  pista (§2.6).

### Conceptos y dónde se han gastado ya

#### §1 — solo en `concepto-de-primeros-auxilios.json`

- Primeros auxilios: definición, los cuidados antes de la ayuda médica.
- Ambulancia: el vehículo que lleva al herido al hospital.
- Valoración primaria: comprobar conciencia, respiración y pulso.
- Posición lateral de seguridad: postura para quien está inconsciente pero respira.
- 112: número único y gratuito de emergencias en España.
- Maniobra de Heimlich: para desobstruir la vía aérea por atragantamiento.
- Mantener la calma: actitud imprescindible.
- Herida: rotura de la piel que se debe limpiar y tapar.

#### §2 — solo en `lo-mas-importante-pas.json`

- P — Proteger: que tú y el accidentado estéis fuera de peligro.
- A — Avisar: llamar a los servicios sanitarios.
- S — Socorrer: actuar reconociendo primero los signos vitales.
- Signos vitales: conciencia, respiración y pulso, en ese orden.
- Masaje cardíaco (RCP): compresiones si no respira.
- Orden PAS: Proteger → Avisar → Socorrer.
- Servicios sanitarios: médicos, enfermeros, ambulancias.

#### §3 — solo en `que-hacer-en-emergencias.json`

- Desmayo: pérdida temporal de conciencia.
- Posición lateral de seguridad (PLS): postura de costado para quien no responde pero respira.
- Hemorragia: salida de sangre, se presiona con tela limpia.
- Gasa: tela limpia para tapar heridas.
- Atragantamiento: cuerpo extraño en la vía aérea.
- Heimlich: abrazo por detrás con puño sobre el ombligo, hacia dentro y arriba.
- Quemadura: lesión por calor, se enfría con agua fría 10 min.
- Fractura: hueso roto, no se mueve, se inmoviliza.
- Inmovilización: tabla o cartón junto al hueso.
- Convulsión: sacudidas del cuerpo, no sujetar.
- Quitar objetos peligrosos: apartar lo que pueda golpear a quien convulsiona.
- No sujetar: lo que NO se hace en una convulsión.

#### §4 — solo en `el-botiquin-basico.json`

- Botiquín: el armario o maletín con material médico.
- Gasas estériles: telas limpias para tapar heridas.
- Venda: tira para sujetar la gasa.
- Tijeras: para cortar gasa o venda a medida.
- Guantes desechables: para protegerte las manos.
- Suero fisiológico: agua con sal para limpiar heridas.
- Termómetro: para medir la temperatura.
- Tiritas: apósitos adhesivos pequeños.
- Antiséptico: líquido para evitar infecciones.

## Tema 2 — Técnicas de prevención y protección

Revisado en 2026-10 contra las 12 páginas del módulo (`pag15`–`pag26`) de
`D:/img_memofun/ipp/tema2/`. Las barajas viven en su propia carpeta dentro de
la asignatura y siguen las subsecciones numeradas del libro:

- `tema-2-tecnicas-prevencion-proteccion/prevencion-y-proteccion-definicion.json` (§1) — 7 tarjetas
- `tema-2-tecnicas-prevencion-proteccion/tecnicas-basicas-prevencion.json` (§2.0 + §2.1) — 13 tarjetas
- `tema-2-tecnicas-prevencion-proteccion/tipos-de-riesgo.json` (§2.2) — 5 tarjetas
- `tema-2-tecnicas-prevencion-proteccion/senalizacion-seguridad.json` (§2.3) — 5 tarjetas
- `tema-2-tecnicas-prevencion-proteccion/responsables-prevencion.json` (§2.4 + §2.5) — 5 tarjetas
- `tema-2-tecnicas-prevencion-proteccion/proteccion-colectiva.json` (§3a) — 6 tarjetas
- `tema-2-tecnicas-prevencion-proteccion/equipos-proteccion-individual.json` (§3b) — 9 tarjetas
- `tema-2-tecnicas-prevencion-proteccion/autoevaluacion.json` — 12 preguntas (5 tipos)

**Total tema 2:** 7 barajas, 50 tarjetas + 1 autoevaluación. La entrada
`selfTest` está en `fpb-sa-1-ipe-t2-definicion` (una sola por tema).

### Revisión de anclas (octubre 2026)

Las 50 tarjetas del tema 2 se repasaron contra la regla del ancla
(`doc/es/guia-crear-elementos.md` §2.3): el anverso tiene que traer una
palabra que devuelva el término de la respuesta, sin regalar el término.

- **43 tarjetas reescritas:** 12 regalaban la respuesta (R3) —«Equipos de
  Protección Individual» se escribía entero en el anverso— y el resto no
  tenía ancla o traía frases de más de 12 palabras.
- **Anclas nuevas** como «cada uno con lo suyo» (EPI), «a salvo», «localizar»
  (identificar), «juzga su gravedad» (evaluar), «tapar el peligro»
  (control), «antes» / «después» (prevención / protección), «la cabeza»,
  «las manos», «los pulmones», «los pies», «el ruido» (EPI), «toda la zona
  a la vez» (colectiva), «el botiquín» (salvamento), «el segundo principio»,
  «la máquina que lo hace» (origen) o «la familia de peligros» (los cinco
  tipos de riesgo).
- **Tabla de anclas** en `doc/revision-ipp/tema-02-tecnicas-prevencion-proteccion.md`.
- **Auditor:** `node scripts/audit-deck-anchors.js decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-2-tecnicas-prevencion-proteccion`
  → 50/50 con ancla, 0 R1/R2/R3. El vocabulario de este tema se añadió al
  mapa de sinónimos de `scripts/audit-deck-anchors.js`.

### Conceptos y dónde se han gastado ya

#### §1 — solo en `prevencion-y-proteccion-definicion.json`

- Integrar la prevención: la empresa la incorpora desde el proceso productivo y la organización.
- Identificar los riesgos: reconocer qué puede salir mal antes de empezar.
- Evaluar los riesgos: saber qué tan graves son los peligros identificados.
- Adoptar medidas de control: decidir qué hacer tras evaluar.
- Técnicas de prevención: actuar antes de que ocurra el problema.
- Técnicas de protección: reducir el daño de los riesgos no eliminados.
- Diferencia prevención/protección: la primera sobre la persona, la segunda sobre el riesgo o el medio.

#### §2.0 y §2.1 — solo en `tecnicas-basicas-prevencion.json`

- Prevención de riesgos: definición, actuar antes.
- 4 técnicas básicas: organización del trabajo, formación e información, señalización, mantenimiento de equipos.
- 8 principios básicos de la prevención (Ley de Protección de Riesgos Laborales):
  1. Evitar los riesgos
  2. Evaluar los riesgos
  3. Combatir los riesgos desde el origen
  4. Adaptar el trabajo a la persona
  5. Tener en cuenta la evolución técnica
  6. Planificar la prevención
  7. Proteger colectivamente antes que individualmente
  8. Dar instrucciones claras a los trabajadores

#### §2.2 — solo en `tipos-de-riesgo.json`

- 5 tipos de riesgo: físico, químico, biológico, ergonómico y psicosocial, con su ejemplo de prevención.

#### §2.3 — solo en `senalizacion-seguridad.json`

- 4 tipos de señales: prohibición (rojo), advertencia (amarillo), obligación (azul) y salvamento (verde).
- La señalización avisa pero **no sustituye** a la prevención.

#### §2.4 y §2.5 — solo en `responsables-prevencion.json`

- Buenas prácticas para prevenir riesgos: zona limpia, usar EPI, seguir instrucciones, informar, formación.
- El empresario: garante de la seguridad en la empresa.
- El trabajador: responsable de cumplir las normas.
- Delegado de prevención: representante de los trabajadores.
- Servicio de prevención: equipo técnico que asesora.

#### §3a — solo en `proteccion-colectiva.json`

- Protección colectiva: llega a todas las personas de la zona (barandilla, red, ventilación, extintor, salida de emergencia).

#### §3b — solo en `equipos-proteccion-individual.json`

- EPI: Equipo de Protección Individual, **obligatorio** cuando el riesgo no se puede eliminar.
- 7 EPI del módulo: casco, gafas de seguridad, guantes, mascarilla o filtro,
  botas de seguridad, ropa reflectante, tapones y cascos para los oídos.
  - Ojo: el módulo dice textualmente "salvavidas" para el chaleco cuando la
    imagen muestra uno reflectante — es una errata del propio módulo. La
    baraja dice "ropa reflectante", que es lo que la imagen muestra.

### Notas para quien amplía la serie

- **No reutilizar una imagen que ya ilustra otra tarjeta**, ni aunque sea de
  otra baraja: en la revisión de 2026-10 había 7 pares de tarjetas con la
  misma foto (la señal de obligación ilustrada con unas botas, el riesgo
  ergonómico con unos soldadores…). Para detectarlo, comparar el hash de
  cada fichero, no solo el nombre.
- **El `alt` tiene que describir lo que se ve**, no lo que debería verse: una
  tarjeta que dice "señal circular azul" con una foto de botas es un fallo
  aunque la foto sirva para otra tarjeta.
- En este tema las imágenes vienen de Commons (CC0 / CC BY / CC BY-SA /
  dominio público), de Flickr (CC BY) y del propio repo. Para un SVG de
  Commons hay que pedir la miniatura rasterizada:
  `…/thumb/<a>/<ab>/<fichero>.svg/1000px-<fichero>.svg.png`.
- Openverse da 424 al pedir miniaturas de algunos ficheros de Wikimedia. El camino que sí
  funciona: `_c` (800px) en Flickr en vez de `_b`, y para Commons la API con **`pageids=`
  (no `curid=`)**: `commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=800&pageids=<id>`.
- Si se reactivan los temas 3-8, rehacer cada baraja desde su `tema<N>/` correspondiente
  con `describe_images`. **No** reutilizar el contenido de las barajas eliminadas
  (mezclaban temas).
- **Tema 6** es el caso especial: el directorio `D:/img_memofun/ipp/tema6/` contiene
  las **mismas imágenes** que `tema5/` (10/10 byte-identical). El temario oficial
  describe Tema 6 como "Itinerarios académicos y profesionales" con 4 subsecciones, pero
  el material capturado no cubre esas subsecciones. Hasta que se disponga de imágenes
  propias para Tema 6, queda fuera de la baraja.
