# fpb_sa_1_tecnicas-administrativas-basicas — conceptos ya cubiertos

> Registro de trabajo del agente de IA (ver CLAUDE.md → "Generating deck content" paso 7).
> No lo lee la app ni el service worker; no necesita subir VERSION en sw.js.

## Octubre 2026 — todas las tarjetas del tema 1 llevan ancla

Se repassó el **tema 1** (4 barajas, 38 tarjetas) con un criterio nuevo,
el del **ancla**: el anverso tiene que traer una palabra que devuelva el
término de la respuesta (raíz o sinónimo), porque sin ella la pista
explica el concepto pero no ayuda a *recuperarlo*. Antes de este
repaso, 8 de las 38 tarjetas ya lo tenían (la de «Organización
funcional», con «se organiza por funciones», era el ejemplo), y 30 no.

El ancla **nunca** es el término exacto: si el anverso dice «mixta», la
tarjeta ya no tiene nada que preguntar. Y el ancla va en el anverso,
no solo dentro de la analogía de `<mark>`.

Se reescribieron los 30 anversos. Los cambios de fondo:

- **Las cinco tareas administrativas** (planificación, organización,
  dirección, coordinación, control) llevan ahora el verbo: «hace un
  plan», «organiza el trabajo», «dirige al equipo», «coordinan su
  trabajo», «controla si logró sus metas». Es la misma palabra que la
  persona usaría después al hablar del tema.
- **Los cuatro tipos de organización** se anclan por su rasgo:
  «la autoridad está bien clara» (jerárquica), «una mezcla de la
  jerárquica y la funcional» (mixta), «se divide en tres zonas»
  (divisiones), «un diagrama que diga quién manda sobre quién»
  (organigrama).
- **Los sectores de actividad** se anclan por su posición: «el primero
  de los tres», «el segundo de los tres», «el tercero de los tres».
- **Los tamaños de empresa** por su cualidad: «su tamaño es enorme»
  (gran), «está en el medio» (mediana), «trabajan solo unos pocos»
  (pequeña), «tamaño diminuto» (microempresa). Se corrigió además la
  pregunta de cierre de la tarjeta de «Gran empresa», que decía «¿Cómo
  se llama una empresa tan grande?» y ya lo nombraba.
- **«Crear empleo y riqueza»** ya no se escribía entero en el anverso
  («La empresa crea empleos y riqueza»): ahora se ancla con «da
  trabajo a la gente» y «hace que el país crezca». Lo mismo con
  «Estructura formal» («está escrita en papel») y «Dirigir, controlar
  y supervisar» («pone el rumbo», «vigila», «revisa»).

Dos tarjetas se quedan a propósito con una palabra de la respuesta en el
anverso: «Bienes y servicios» (el ancla de «bienes» es «productos» y la
respuesta es una pareja) y «Clasificación por tamaño» (la tarjeta
cabecera de una clasificación; el ancla es «tamaño»).

Regla nueva en `doc/es/guia-crear-elementos.md` §2.3 (y en la versión
en inglés), con `scripts/audit-deck-anchors.js` para detectarla. El
resto del curso (temas 3 a 6) seguia sin ancla; el detector da 144 de
156 tarjetas sin ancla en esos cuatro temas, y hay que confirmarlos a
mano porque su mapa de sinónimos se ha ido ampliando tema a tema.

## Octubre 2026 — el tema 2 también lleva ancla

Se aplicó el mismo criterio del **ancla** (ver la nota del tema 1) a las
dos barajas del **tema 2** (`areas-funcionales`, 11 tarjetas, y
`departamentos-organigrama`, 13 tarjetas). Las 24 quedan con ancla; 22
anversos se reescribieron y 2 ya la tenían («Departamentos», con
«división», y «El departamento financiero», con «lleva el dinero»).

- **Las cinco áreas funcionales** se anclan con el verbo del temario:
  «Esta zona **fabrica**» (producción), «atiende al cliente y **cierra la
  venta**» (comercial), «**administra** el dinero de la empresa»
  (finanzas), «se ocupa de las **personas** que trabajan» (recursos
  humanos) y «Esta zona **dirige**: fija los objetivos» (dirección).
- **Los cinco departamentos** por su tarea, con el verbo delante:
  «Este departamento **compra**», «**fabrica** y prepara los
  productos», «se encarga de **vender**», «**se guarda** todo»,
  «**lleva las cuentas**», «**administra** el archivo y la
  correspondencia».
- **El organigrama** se ancla con «un **esquema**» (raíz *-grama*, igual
  que «diagrama» en el tema 1) y la jerarquía con «la de arriba **manda**
  sobre las de abajo».

Dos tarjetas cambiaron de fondo, no solo de forma:

- **La tarjeta de las cinco áreas** («Producción, Comercial, Finanzas,
  Recursos Humanos y Dirección») nombraba «Producción» y «Comercial» en el
  anverso: andaba dos de los cinco nombres de la respuesta. Ahora dice
  «en una fábrica pesa más la que **fabrica**» y «en una tienda, la que
  **vende**».
- **La tarjeta de «para qué sirve el organigrama»** escribía
  «organigrama» en el anverso y preguntaba «¿Qué documento conviene
  consultar?»: la respuesta estaba dada. Ahora dice «miras el
  **esquema** de la empresa».

También se ajustaron las preguntas de cierre de las cinco tarjetas de
área, que repetían la definición («¿Qué área funcional administra el
dinero de la empresa?»), por «¿Qué área funcional se ocupa de este
trabajo?».

Con el tema 2, la foto del detector queda: **tema 1 y tema 2 al 100 %
con ancla**; los temas 3 a 6, pendientes.

## Octubre 2026 — el tema 3 también lleva ancla

Tercera vuelta del mismo trabajo: las cuatro barajas del **tema 3**
(`comunicacion-escrita-externa` 5, `comunicacion-interna-documentos` 20,
`medios-comunicacion-interna` 10 y `tipos-informacion-comunicacion` 9).
Las 44 tarjetas quedan con ancla; se reescribieron 36 anversos y 8 ya la
tenían.

El problema de este tema era otro: **el anverso daba la definición y la
pregunta de cierre la repetía**, así que la tarjeta era un recitado. Y en
las tarjetas de listas (los elementos del memorando, de la circular y del
oficio, y las formas y dificultades de los tres tipos de información) el
anverso **enumeraba la respuesta entera**: «El memorando tiene cuatro
partes: la cabecera, el De y el A, el cuerpo y el pie» con la pregunta
«¿Qué cuatro partes tiene un memorando?».

La solución fue **parafrasear en vez de nombrar**: el anverso describe la
pieza con otras palabras y es el estudiante quien tiene que devolverle el
nombre técnico.

| Elemento | Cómo se parafrasea ahora en el anverso |
| --- | --- |
| Membrete | «el papel con el nombre de la entidad» |
| Número | «un código que la identifica» |
| Asunto | «el tema del que trata» |
| Fecha | «dónde y el día» |
| Firma | «el nombre de quien la pone» |
| Recibo | «el resguardo firmado» |
| Quejas e ideas | «lo que molesta y lo que se le ocurre» |
| Órdenes y tareas | «mandando un trabajo a cada uno» |

Las anclas del resto:

- **Los tipos de comunicación** se anclan con la dirección del mensaje:
  «sube o baja» (vertical), «baja» (descendente), «sube» (ascendente),
  «en la misma línea» (horizontal), «cruza los niveles» (diagonal), «las
  vías oficiales» (formal), «nadie lo anota de forma oficial» (informal),
  «con la voz» (oral) y «no usa palabras» (no verbal).
- **Los documentos** con su palabra clave: «nota» (memorando), «el que
  avisa de una revisión médica» (aviso), «el documento que recorre toda la
  empresa» (circular interna), «un documento **oficial** que no sale de la
  empresa» (oficio interno, raíz *ofici-*), «un documento que **informa**»
  (informe) y «el documento donde se anotan los **acuerdos**» (acta).
- **Los medios** con su formato: «un libro con el reglamento interno»
  (manual), «una revista que trae noticias» (newsletter), «viaja por
  internet, sin papel» (coro electrónico), «una red interna: solo entra
  quien es de la casa» (intranet), «una lista de preguntas» (encuestas),
  «un cartel grande en la oficina» (tablón) y «Facebook, Twitter o
  Instagram» (redes sociales).

También se corrigió una respuesta: la de las dificultades de la
comunicación descendente («inseguridad y transmisión lenta» →
«inseguridad, transmisión lenta») para no pasar de las 12 palabras.

Dos palabras de la respuesta se quedan en el anverso a propósito, porque
son objetos concretos que no se pueden parafrasear sin volverlos
oscuros: «nota» (memorando) y «sello» (oficio interno).

## Octubre 2026 — el tema 4 también lleva ancla

Cuarta vuelta: las cuatro barajas del **tema 4** (`correos-lineas` 9,
`modalidades-envio` 6, `envio-correspondencia-paqueteria` 6 y
`mensajeria-externa` 13). Las 34 tarjetas quedan con ancla y los 34
anversos se reescribieron: aquí el anverso era, casi siempre, una copia
literal del libro, con frases de 22 a 42 palabras.

Lo que se hizo:

- **Las seis líneas de Correos** se anclan por su cualidad: «una para lo
  de siempre» (básica), «otra para cuando corre prisa» (urgente), «los
  paquetes» (paquetería), «lo barato» (económica), «la distancia»
  (servicios telegráficos) y «el buzón» (gestión de buzón).
- **Los productos de cada línea**, parafraseados: «uno para escribir y
  otro para mandar una postal» (carta y tarjeta postal), «un tercero para
  avisar de un trámite oficial» (notificación administrativa), «un
  paquete de color y otro con dos plazos» (producto azul y paquete de 48
  o 72 horas), «propaganda, correo para el buzón, cartas personalizadas,
  libros y revistas» (línea económica) y «el cable y el teléfono»
  (servicios telegráficos).
- **Las modalidades de envío** con su seña: «quien recibe tiene que
  firmar» (certificado), «una etiqueta con una palabra que avisa de la
  prisa» (correo urgente), «el que recibe es quien abona el importe… en
  el mostrador» (reembolso), «esa nota vuelve después al remitente»
  (aviso de recibo) y «por internet» (correo digital).
- **El embalaje y la normalización**, con la misma técnica de
  parafraseo: «que no se rompa con lo que lleva dentro / que sea de
  confianza / que case con lo que lleva» (los tres requisitos) y «las
  máquinas pueden trabajar los envíos sin que nadie los toque»
  (mecanización y manipulación automática).
- **Los once servicios de mensajería** se anclan con su mecánica:
  «vas tú a dejarle el paquete» (depósito), «le llaman enseguida»
  (acuse de recibo), «en una sola jornada» (urgente), «van a casa del
  cliente» (entrega en mano), «por el aire o por tierra»
  (internacionales), «se lleva hoy y llega mañana» (24 horas), «un
  repartidor fijo de la empresa» (mensajero en exclusiva), «que vuelva
  al punto de partida» (envíos con retorno), «deja las cajas listas para
  salir» (manipulación), «las bolsas de correo de una oficina a otra»
  (servicio de valijas) y «concertas una cita» (hora fijada).

Tres respuestas se acortaron para no pasar de las 12 palabras por
frase: la de las empresas de mensajería, la de los apartados del
impreso del certificado y la tercera línea de la dirección postal.

## Octubre 2026 — el tema 5 también lleva ancla

Quinta vuelta: las cuatro barajas del **tema 5** (`material-oficina` 5,
`equipos-oficina` 13, `archivo-registro-oficina` 4 e
`inventario-control-existencias` 5). Las **27 tarjetas** quedan con ancla;
se reescribieron **16 anversos** y los otros 11 ya la tenían.

Lo que se hizo:

- **El material de oficina** se ancla por el contraste entre lo que se
  repone y lo que dura: «artículos que se consumen» (fungible), «artículos
  que no se gastan» (no fungible) y, en las dos tarjetas de definición
  literal del libro, una raíz por cada palabra de la respuesta: «se
  consumen al usarlos / se gastan / se estropean / se pierden / con los
  días».
- **Los equipos de oficina** se anclan por su función: «el software
  adecuado» (ordenadores), «ponen en papel» y «cartuchos de tinta o de
  tóner» (impresoras), «hacen una copia en papel» (fotocopiadoras),
  «digitalizan documentos» (escáneres), «para llamar y escribir
  mensajes» (teléfonos) y «una sola máquina… varias funciones a la vez»
  (aparato multifunción).
- **El mobiliario** se ancla con su parafrase: «cada puesto tiene la
  suya / de apoyo, para guardar cosas / donde se junta la gente» (las
  tres clases de mesas), «el asiento que más se debería usar» (sillas
  ergonómicas), «un mueble guarda los papeles» (armarios) y «se enteran
  de los pendientes / lo que se está haciendo / los turnos / lo urgente»
  (tablón de anuncios).
- **Las barajas sin sección propia** (agenda, archivo, registro, sello y
  firma, control de existencias, inventario y pedido) también quedan
  ancladas, con el mismo criterio que los temas anteriores.

El detector oficial (`scripts/audit-deck-anchors.js`) solo exige **una**
ancla por tarjeta, así que se añadió una comprobación más exigente:
**cada palabra de contenido de la respuesta** tiene su ancla en el
anverso, ninguna palabra de la respuesta se escribe en el anverso y cada
tarjeta conserva **un solo `<mark>`**, que envuelve la analogía. Con ese
criterio estricto, las 27 tarjetas quedan limpias. El mapa de sinónimos
del detector se amplió con el vocabulario del tema 5 (`gasta`, `deteriora`,
`desaparece`, `desgaste`, `uso`, `tiempo`, `aparato`, `maquinaria`,
`mobiliario`, `desperdicio`…).

En el camino aparecieron dos erratas que se corrigieron: la tarjeta de
material no fungible decía «**grapadera**» (es una **grapadora**) y la de
ordenadores había perdido los **sonidos** de la lista del libro (pág. 47).

Con el tema 5, la foto del detector queda: **temas 1 a 5 al 100 % con
ancla** (171 de 218 tarjetas del curso); queda pendiente el tema 6.

## Octubre 2026 — el tema 6 también lleva ancla

Sexta vuelta y **última del curso**: las seis barajas del **tema 6**
(`cobros-pagos-caja` 7, `documentos-comerciales` 9, `medios-pago` 12,
`pago-online` 5, `excel-conceptos-basicos` 7 y `excel-pantalla-inicial` 11).
Las **51 tarjetas** quedan con ancla y los **50 anversos** se reescribieron: el
tema 6 era el que peor estaba, con 47 tarjetas sin ancla y 18 frases de pista
de más de 12 palabras.

Lo que se hizo:

- **Cobros y pagos en caja**: cada operación con su ancla («cada entrada y
  salida de dinero es un movimiento» para *operaciones de caja*, «un papel que
  hay que guardar» para *guardarlos*, «un papel con tu sueldo» para la
  *nómina*).
- **Documentos comerciales**: la factura, el albarán, el pedido y la nota de
  pedido se anclan por su función («un papel oficial», «el transportista»,
  «un cliente escribe a un proveedor»); la tarjeta de la información de la
  factura lleva **un ancla por cada dato** («quién manda, quién compra, qué
  día», «un código», «el desglose de cada línea», «cuántos artículos», «cuánto
  vale cada uno», «la suma sin impuestos», «lo que se paga»).
- **Medios de pago**: los tres momentos del pago («se paga al recibir»,
  «el cliente paga luego», «deja una cantidad a cuenta») y cada instrumento
  («un trocito de plástico» para la tarjeta de débito, «un papel firmado que
  ordena a su banco pagar» para el cheque, «unas siglas que empiezan por el
  país» para el IBAN).
- **Comercio electrónico**: la tarjeta de las cuatro formas de pago las
  parafrasea una a una («el plástico que te presta el banco», «mandar el
  dinero de una cuenta a otra del banco», «al recibirlo en casa», «con un
  intermediario en medio») sin nombrarlas.
- **Excel**: las once partes de la pantalla y los conceptos básicos se anclan
  por su forma («al abrir Excel aparece una ventana», «la franja de arriba»,
  «las pestañas Inicio, Insertar y Diseño», «abajo a la izquierda aparecen las
  hojas del libro»).

La misma comprobación estricta del tema 5 (una ancla **por palabra de
contenido** de la respuesta, sin spoilers, un solo `<mark>` y frases de pista
de 12 palabras como máximo) deja las 51 tarjetas limpias. El mapa de sinónimos
del detector se amplió con el vocabulario del tema 6 (operaciones de caja,
factura, albarán, presupuesto, cheque, pagaré, letra de cambio, IBAN,
pasarela de pago, columnas, filas, barras de Excel…).

Al reescribir se ajustaron **siete analogías** que regalaban la respuesta
(«la barra de direcciones de un navegador» para la barra de fórmulas,
«cuánto se cobra» para la nómina) o que no cuadraban con su foto (la columna
de un edificio para la columna de Excel, que en la foto son las letras A, B,
C).

**Con el tema 6, el curso completo queda al 100 % con ancla: 218 de 218
tarjetas.** Los únicos avisos que quedan en el detector son R3 deliberados de
los temas 1 a 4 (objetos concretos que no se pueden parafrasear: «nota»,
«sello», «buzón», «postal»…), documentados en su día.

## Migración a Wikimedia Commons (octubre 2026)

Las barajas se migraron del modelo antiguo (imágenes en raíz del curso, autor
Flickr/CC-BY) al modelo nuevo (carpeta
`assets/img/decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-N-slug/<baraja>/<slug>.jpg`,
atribución completa de Wikimedia Commons).

Concretamente:
- **Tema 1** (5 barajas, 63 cards, 57/63 con imagen CC):
  - `departamentos` 17/17
  - `estructura-organizativa-tareas` 10/10 (las 4 de organización con el organigrama del temario; planificación con un diagrama propio; las otras 4 tareas con la ilustración del temario)
  - `tipos-empresa-empresario` 20/20
  - `funciones-empresa-estructura` 5/5
  - `comunicacion-escrita-externa` 6/6
- **Tema 2** (2 barajas, 24 cards, todas con imagen CC): `areas-funcionales` 11/11 +
  `departamentos-organigrama` 13/13 (auditoría de fidelidad al temario de octubre 2026:
  la baraja cubría solo «departamentos y organigrama» y dejaba fuera las cinco áreas
  funcionales; se añadió `areas-funcionales` y se reordenó la existente)
- **Tema 3** (4 barajas, 44 cards): auditoría de fidelidad al temario de octubre 2026, repetida en el 26 de octubre de 2026 contra `D:/img_memofun/tecnicas_administrativas/tema3` (págs. 24-33)
  - `comunicacion-interna-documentos` 20/20 (clasificación por flujo, naturaleza y medio de transmisión, y la documentación interna: aviso, memorando, circular interna, oficio interno, informe y acta)
  - `medios-comunicacion-interna` 10/10 (con la tabla de medios de la pág. 29 del libro)
  - `tipos-informacion-comunicacion` 9/9 (nueva, con las tres columnas de la tabla 2.2 de la pág. 28: función, formas utilizadas y dificultades de la ascendente, la descendente y la transversal)
  - `comunicacion-escrita-externa` 5/5 (las dos ramas del §1: externas e internas, el ejemplo de la carta comercial y los documentos de la comunicación escrita)
  - `agenda-archivo-sello-inventario` (17 cards) **disuelta**: era un repaso general de otro curso, no contenido del tema 3. Sus 12 tarjetas ya cubiertas en los temas 2, 5 y 6 se eliminaron; agenda, archivar, registro y sello pasaron al tema 5, y la nota de pedido al tema 6.

  **Octubre 2026 — fidelidad al temario del tema 3 (segunda auditoría).** El
  temario del libro (págs. 24-33) no describe la estructura de la carta
  comercial: el §1 solo la menciona como ejemplo de comunicación externa
  («p.e. carta comercial»). Las cuatro tarjetas que la desglosaban (membrete,
  fecha, partes y valor legal) eran contenido del RA3 de FPGM Gestión
  Administrativa, así que se sustituyeron por lo que el tema sí deja fuera:
  las columnas «formas utilizadas» y «dificultades» de la tabla 2.2 y el
  ejercicio 5 (los documentos de la comunicación escrita de una empresa).
  La clasificación por flujo (vertical, descendente, ascendente, horizontal,
  diagonal) y la tabla de funciones pasaron a su propia baraja.

  **Octubre 2026 — imágenes del tema 3 rehechas.** 16 de las 38 imágenes no
  ilustraban la pista: eran portadas de PDF escaneados (un gráfico del clima
  en checo para la comunicación horizontal, un manual de assembler para la
  vertical, un libro negro para la ascendente, la Gaceta Oficial para la
  formal), dos eran casi negras (la carta comercial, 17/255 de luminancia
  media) y varias traían el `alt` sin redactar. Se sustituyeron por fotos
  que muestran la pista (el telefonillo del edificio, la mano levantada en
  clase, la pizarra del profesor, el montón de papeles, el buzón rotulado
  SUGGESTION BOX) y todos los `alt` se redactaron sobre lo que se ve de
  verdad. Al comprobar las fotos reutilizadas del repo se vio que sus `alt`
  tampoco eran fiables («Una factura de suministro» era un cartel pintado a
  mano; «Una máquina de escribir con una carta» eran teclas), así que las 33
  imágenes del tema se miraron una a una.
- **Tema 4** (4 barajas, 34 cards): `correos-lineas` 9/9 (las seis líneas operativas de Correos y sus productos) + `modalidades-envio` 6/6 (certificado, correo urgente, reembolso, aviso de recibo, correo digital y las partes del certificado) + `envio-correspondencia-paqueteria` 6/6 (embalaje, normalización, formato, color, grafía, dirección y remitente) + `mensajeria-externa` 13/13 (los once servicios de mensajería externa más las dos modalidades de entrega del envío), todas con imagen Wikimedia CC-BY/-SA, CC0 o dominio público
- **Tema 5** (2 barajas, 9 cards): `inventario-control-existencias` 5/5 + `material-oficina` 4/4 con imagen Wikimedia (esta última reubicada desde t6 tras auditoría de fidelidad al MD)
- **Tema 6** (6 barajas, 51 cards): `medios-pago` 13/13 (medios e instrumentos de pago: contado, aplazado, anticipado, efectivo, recibo, cheque, transferencia, tarjeta de débito, IBAN, pagaré y letra de cambio) + `pago-online` 5/5 (comercio electrónico y sus cuatro formas de pago) + `excel-pantalla-inicial` 10/10 (las diez partes de la ventana de Excel) + `excel-conceptos-basicos` 7/7 (columnas, filas, datos, guardado y fórmulas) + `documentos-comerciales` 9/9 (factura, albarán, pedido, nota de pedido, presupuesto, impresos) + `cobros-pagos-caja` 7/7 (caja, cobro, pago, justificantes, nómina y registro), todas con imagen Wikimedia

Total migrado: **123/138 cards** con imagen de Wikimedia CC-BY/-SA o Public Domain;
13 con Flickr legacy (9 agenda t3) o text-only (4 com t3). Pendiente cleanup
cuando se rehagan las barajas afectadas.

**Octubre 2026 — ampliación de `tipos-empresa-empresario`:** +12 cards (una
por cada tipo de tamaño, sector de actividad, ámbito geográfico y propiedad
del capital), todas con imagen CC de Openverse/Flickr (no Wikimedia): la
baraja pasa de 8 a 20 cards y el curso de 138 a 150.

**Octubre 2026 — ejemplos de organigrama:** +4 cards en
`estructura-organizativa-tareas` (una por cada tipo de organización, cada una
detrás de su carta de explicación): ejemplo de organización jerárquica y
funcional (página 10 del temario en
`D:/img_memofun/tecnicas_administrativas/tema1/pag10.jpeg`) y ejemplo de
organización mixta y por divisiones (página 11, `pag11.jpeg`). La baraja pasa
de 12 a 16 cards y el curso de 150 a 154.

**Octubre 2026 — los ejemplos de organigrama llevaron el organigrama real
del temario (y luego se eliminaron).** Estas cards de ejemplo no tenían
imagen (la foto entera de la página no se lee a 140 px) y el ejemplo iba
solo descrito en la pista. Se les puso un **recorte del organigrama** de
las páginas 10 y 11 del temario, ajustado al gráfico y sin el pie de foto
(que regalaría la respuesta). Eran material del centro, así que su
atribución no es de Wikimedia: en el TASL figuraba el temario del curso
como fuente y «material propio del centro — uso educativo» como licencia.
La card de «Organigrama» conserva el organigrama de 1902 de la United
States Rubber Company (dominio público), al que solo se le ha redactado
el `alt`.

**Octubre 2026 — se elimina la tarjeta de «áreas funcionales».** Repetía
el contenido de la de «organización funcional» (las secciones de la
empresa: producción, comercial, finanzas). Se borra la card y con ella su
imagen (`areas-funcionales.jpg`, una portada de PDF, que sale del repo).
La baraja baja de 11 a 10 cards y el `amount` del manifest se ajusta a
10.

**Octubre 2026 — se eliminan los ejemplos de organización repetidos.**
Quedaban dos tarjetas con la misma respuesta en cada caso: la del
concepto (con su analogía) y la del organigrama del temario. Se borran
las cuatro de ejemplo —jerárquica (pág. 10), funcional (pág. 10), mixta
(pág. 11) y por divisiones (pág. 11)— por redundantes, y con ellas sus
recortes (`organigrama-jerarquico.jpg`, `organigrama-funcional.jpg`,
`organigrama-mixto.jpg` y `organigrama-divisiones.jpg`, que salen del
repo; quedan en `audit-out/` por si se quieren recuperar). La baraja
baja de 15 a 11 cards y el `amount` del manifest se ajusta a 11. Queda
una sola tarjeta por cada tipo de organización.

**Octubre 2026 — la tarjeta de «organización funcional» se reescribe.**
Decía «A los empleados, aunque no tengan encima al Director General»:
«tener encima» confundía y además delata una cadena de mando, que es
justo lo que la organización funcional no es. Ahora explica lo que la
distingue: la empresa se reparte por funciones y el mismo trabajador
recibe órdenes de varios jefes a la vez, en vez de depender solo de uno
(analogía: un jugador que entrena con tres entrenadores).

**Octubre 2026 — la tarjeta de «organización mixta» se reescribe.** Decía
«Tiene jefes abajo. Y asesores arriba, que solo informan» y preguntaba
«¿Cómo se llama este modelo mixto?» —la pregunta ya lo nombraba. Ahora
aclara lo que el temario dice: une la organización jerárquica y la
funcional (mando en cascada y trabajo repartido por funciones), con los
asesores que solo informan al lado del Director general.

**Octubre 2026 — las cuatro cards de organización llevan el organigrama del
temario.** «Jerárquica», «Funcional», «Mixta» y «Por divisiones» reciben
ahora el organigrama real del libro, recortado de las páginas 10 y 11 del
temario del centro (página 10: jerárquica y funcional; página 11: mixta y
división territorial). Son los recortes que ya estaban hechos en
`audit-out/` (`tmp-recortar-organigramas.ps1`), sin el pie de foto del
libro —«Ejemplo de organización jerárquica»— que revelaría la respuesta.
La jerárquica, la mixta y las divisiones sustituyen a la miniatura de
portada de PDF; la funcional, que se había quedado sin imagen, la
recupera. TASL: fuente «Material del centro: Técnicas Administrativas
Básicas (Colegio Areteia)», autor «Colegio Areteia (material del temario
del curso)» y licencia «Material propio del centro — uso educativo».

Quedan pendientes en esta baraja las 5 imágenes de las cards de tareas
administrativas (planificación, organización, dirección, coordinación y
control): siguen siendo miniaturas de portadas de PDF con `alt`
«(imagen)». (Ya no: ver las dos notas siguientes.)

**Octubre 2026 — «Planificación» lleva un diagrama paso a paso propio.**
La imagen era la miniatura de un PNG de Wikimedia («WikiDonne Roadmap
Grant Metrics») con `alt` «(imagen)». Se sustituye por un diagrama creado
para memofun: cuatro pasos numerados y unidos por flechas —1) ¿Qué
quiero conseguir? 2) ¿Cómo lo voy a conseguir? 3) ¿En qué orden? 4)
«¿Quién hace cada cosa?», sobre fondo crema, con la tipografía de la app
(Atkinson Hyperlegible y Nunito) y los colores de `tokens.css` (acento
teal #00695C y oro #B8860B). Los cuatro pasos son los del §3 del temario
(«se determinan los objetivos, se fijan las estrategias […] y se trazan
planes»), redactados en forma de pregunta para no regalar la palabra
«planificación». La pista de la card se reescribe para que la imagen
siga ilustrando la pista: «Es como un diagrama con cuatro pasos, uno
detrás de otro». TASL: fuente «Material propio de memofun», autor
«Memofun (material propio del proyecto)» y licencia «CC0 1.0».

**Octubre 2026 — las cuatro tareas administrativas que faltaban llevan la
ilustración del temario.** «Organización», «Dirección», «Coordinación» y
«Control» tenían la miniatura de una portada de PDF con `alt` «(imagen)».
Ahora usan el dibujo que trae el propio libro para cada tarea
administrativa (página 12 del temario): las personas que llevan las piezas
de puzle (organización), el jefe con casco y portapapeles dando
instrucciones (dirección), el relevo de la flecha azul (coordinación) y el
hombre con la lupa (control). La de «Planificación» queda aparte, con el
diagrama paso a paso propio. Con esto la baraja se queda con las 10 cards
con imagen y sin ningún `alt` sin redactar. TASL: fuente «Material del
centro: Técnicas Administrativas Básicas (Colegio Areteia), página 12»,
autor «Colegio Areteia (material del temario del curso)» y licencia
«Material propio del centro — uso educativo».

**Octubre 2026 — fusión de las dos cartas de «organización»:** la carta de la
tarea «Organización» y la carta de «La organización» (su importancia) se
funden en una sola carta: la pista explica el reparto del trabajo y añade
que, si algo falla, la empresa entera se retrasa. La baraja queda con 15
cards (el curso, con 153) y la imagen huérfana `importancia-organizacion.jpg`
se ha eliminado.

**Octubre 2026 — el título de `estructura-organizativa-tareas` pasa a
«Organización empresarial y tareas administrativas».** La baraja se titulaba
«Estructuras organizativas y tareas administrativas», pero su contenido es el
§2 del temario (LA ORGANIZACIÓN EMPRESARIAL: organización jerárquica,
funcional, mixta y por divisiones) más el §3 (las tareas administrativas:
planificación, organización, dirección, coordinación y control). La
«estructura organizativa» es el §1.5 (estructura formal e informal), que vive
en `funciones-empresa-estructura`. Se cambió solo el `topic` visible, en la
entrada del manifest y en el JSON de la baraja; ni el nombre del fichero, ni
la carpeta de imágenes, ni el `id` del manifest (que es la clave de
localStorage: cambiarlo borraría el progreso guardado de esa baraja).

**Octubre 2026 — imágenes de `tipos-empresa-empresario`: la imagen
muestra la PISTA, no el concepto.** 13 de las 20 cards tenían una
foto que no ilustraba la analogía marcada en el anverso: la portada
en PDF de "Planetas del sistema solar" (clasificacion-tamano), un
colegio de 1912 de dos plantas para "edificio de seis pisos", el
interior de una tienda en blanco y negro para "casa de dos pisos",
una reunión para "los pisos de un edificio", un camarero para "un
taxi", la bandera de España para "un tren", una autopista de luces para
"local, nacional e internacional" (solo enseñaba el nivel
internacional) y seis miniaturas de
portadas de PDF (documento presidencial chileno, proyecto urbanístico,
artículo de economía, taller de habilidades, taxonomías de clubes de
fútbol, Una ciudad flotante de Julio Verne). Se han sustituido por
fotos que muestran la pista (los planetas a escala, los rascacielos
de Cuatro Torres, un edificio de seis pisos, una terraza de casas de
dos plantas, un kiosco en una esquina, un taxi,
tren, un examen, un taller propio, un equipo de fútbol, el
volante de un barco), todas con licencia libre y el `alt` redactado
en español sobre lo que se ve de verdad.

Tres cards se quedan sin imagen, las tres de "clasificación": la de
"sector primario, secundario y terciario" (analogía "la cadena del pan":
campo, fábrica y panadería — no hay foto libre que muestre los tres sectores
a la vez), la
de "locales, nacionales e internacionales" (analogía "calle de barrio
frente a autopista" — la foto solo enseñaba el nivel internacional; ahora
la pista enumera los tres niveles con un ejemplo cada uno: barrio, país
y mundo) y la de "públicas y privadas" (analogía "parque del pueblo y
jardín de tu casa" — la foto solo enseñaba el lado público; ahora la
pista dice el criterio del temario, "según quién pone el dinero", con
un ejemplo por lado). La imagen es opcional por tarjeta (tecnico.md
§3.1) y una imagen que no ilustra la pista es peor que ninguna: las
cards de detalle llevan ya su foto exacta (calle de pueblo, tren,
barco, parque, pastelero). La regla queda escrita en la guía de
creación de elementos §2.6.

**Octubre 2026 — tarjeta «públicas y privadas» y «empresa pública».**
La card de clasificación se reescribió con el criterio del temario
("según quién pone el dinero") y un ejemplo por lado (RENFE/RTVE/Canal
de Isabel II frente a Mercadona o una pizzería), con la analogía del
parque del pueblo y el jardín de tu casa: la imagen, que solo
enseñaba el lado público, se retiró. La card de «Empresa pública»
dejó de decir "público" en el anverso (regalaba la respuesta) y su
foto cambió del ayuntamiento de South Melbourne al parque, que es lo
que marca su pista ("como el parque del pueblo: lo paga y lo cuida la
ciudad"). La card de «Empresario individual y sociedad» usa ya la
respuesta "Empresario individual y sociedad", en lugar de "social".

**Octubre 2026 — el Banco de España sale de los ejemplos de empresa
pública.** No es una empresa: es una «entidad de derecho público con
personalidad jurídica propia» (Ley 13/1994 de Autonomía del Banco de
España, art. 1), que, a diferencia de los bancos comerciales, «no está
constituida como una sociedad». Usarlo como ejemplo de «empresa pública»
era incorrecto. En las dos cards afectadas —la de clasificación
("públicas y privadas") y la de «Empresa pública»— se sustituye por el
Canal de Isabel II, que sí es una empresa pública y es el ejemplo que usa
la autoevaluación del temario del centro (ejercicio 9: Mercadona,
RENFE, Amazon, RTVE, Zara, Canal de Isabel II, Burger King y Loterías y
Apuestas del Estado).

**Octubre 2026 — «Sociedad» en lugar de «empresario social».** La card
de la sociedad responde directamente "Sociedad" (antes "Empresario
social (o sociedad)"), y su anverso explica el acuerdo: todos ponen
dinero y se reparten los gastos. En la card de «Empresario individual o
sociedad» se corrigió "comparten dinero", que sonaba a dinero en
común, por "los dos ponen dinero y comparten los gastos". Las dos
imágenes se renombraron en consecuencia (`individual-vs-sociedad.jpg` y
`sociedad.jpg`): en la baraja ya no queda el término "social".

**Octubre 2026 — la analogía de los tres sectores se rehace.** La card
"sector primario, secundario y terciario" usaba "Es como los pisos de un
edificio: campo, fábrica y oficinas": el campo no es un piso de un edificio
y "campo, fábrica y oficinas" es una lista, no una analogía. Ahora es la
cadena del pan —primero se cultiva el trigo en el campo, luego la fábrica lo
convierte en pan y al final la panadería te lo vende y te atiende—, que
ordena los tres sectores igual que los da el temario (cultivan, fabrican,
prestan servicios). La card se queda sin imagen: no hay foto libre que
muestre los tres sectores a la vez.

**Octubre 2026 — «Empresario individual y sociedad», con «y» y no con
«o».** La card que presenta las dos formas jurídicas respondía
"Empresario individual **o** sociedad", y la «o» se leía como si las dos
cosas fueran excluyentes. Ahora la respuesta enumera los dos tipos, como
hacen las demás cards de clasificación de la baraja ("Locales, nacionales e
internacionales", "Públicas y privadas"): **Empresario individual y
sociedad**. El temario del centro usa «empresario individual y colectiva o
sociedad» (ficha y autoevaluación), que se deja tal cual por ser la
transcripción del libro.

- Departamentos de una empresa (compras, RRHH...): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (repartir tareas de una casa)
- Departamento de compras: fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (encargado de la compra grande)
- Departamento de recursos humanos: fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (cuida a las personas de la empresa)
- Organigrama (qué es y para qué sirve consultarlo): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (árbol genealógico de cargos; mapa de a qué puerta llamar)
- Área funcional (qué es y cuáles son las cinco): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/areas-funcionales.json (secciones de un supermercado: productos, clientes y cuentas)
- Área de producción (de las materias primas a los productos terminados): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/areas-funcionales.json (fábrica de pan: el trigo se convierte en pan)
- Área comercial (distribuir y vender bienes y servicios): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/areas-funcionales.json (el del mostrador que enseña el producto y lo lleva)
- Área de finanzas (administrar el dinero de la empresa): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/areas-funcionales.json (quien lleva las cuentas de casa y decide en qué gastar)
- Área de recursos humanos (coordinar habilidades y competencias de los trabajadores): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/areas-funcionales.json (entrenador que cuida que el equipo juegue bien)
- Área de dirección (objetivos, planes de organización, gestión y control): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/areas-funcionales.json (capitán que decide hacia dónde va el barco)
- Departamentos (producción, ventas, almacén, financiero, contable y administración): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (cada actor con su papel en la representación)
- Jerarquía de un organigrama (qué caja depende de cuál): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (árbol: las ramas cuelgan del tronco)
- Dirección general (la casilla que está por encima de todos los departamentos): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (el jefe al que todos los departamentos responden)
- Factura (qué es y qué información incluye): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (recibo definitivo con validez legal)
- Albarán (documento que certifica la entrega): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (recibo de que la mercancía llegó)
- Pedido y diferencia pedido/albarán/factura: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (lista de la compra oficial; pedir, recibir, pagar)
- Archivar bien la correspondencia: fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/archivo-registro-oficina.json (repetición, nuevo ángulo: cada cosa en su cajón)
- El organigrama ayuda a saber a quién preguntar: fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (mapa que indica a qué puerta llamar)
- Importancia de la organización administrativa (fusionada en la carta de la tarea «Organización»): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (si algo se equivoca, la empresa entera se retrasa)
- Presupuesto (qué es y por qué pedir varios): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (pedir precio antes de comprar; comparar tiendas)
- Operaciones básicas de caja: cobros y pagos sencillos: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/cobros-pagos-caja.json (monedero de la empresa siempre en movimiento)
- Recibo y justificantes de pago: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (prueba en papel de que se pagó)
- Nómina (qué es y qué información incluye): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/cobros-pagos-caja.json (resumen de dónde sale y a dónde va el sueldo)
- Impresos y formularios oficiales: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (plantilla oficial para trámites)
- Control de existencias de material de oficina: fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (llevar la cuenta de la despensa)
- Generar un pedido cuando escasea el material: fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (reponer la despensa antes de que se vacíe)
- Relación entre presupuesto y control de existencias: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (comparar precios antes de reponer)
- Registro claro de cobros y pagos en caja: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/cobros-pagos-caja.json (comprobar que la caja está cuadrada)
- Las técnicas administrativas como base de cualquier oficina: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (cimientos de un edificio)
- Agenda de trabajo (gestión de citas y tareas de oficina): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/archivo-registro-oficina.json (cuaderno donde apuntas cada cita y tarea)
- Clasificar y archivar por orden alfabético o numérico (método concreto): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/archivo-registro-oficina.json (libros de biblioteca ordenados por apellido del autor)
- Registro de entrada y salida de documentos: fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/archivo-registro-oficina.json (libro de recepción que apunta quién entra y quién sale)
- Nota de pedido y contrato de compraventa básico: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (rellenar un papel pidiendo algo, que el vendedor confirma)
- El sello y la firma en un documento oficial: fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/archivo-registro-oficina.json (carta sin remitente / algo escrito a mano que te identifica + marca de la empresa)
- Inventario (recuento completo, distinto del control continuo de existencias): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (la tienda cierra una vez al año y cuenta todo lo que tiene)
- Departamentos (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (secciones de una orquesta: cuerda, viento, percusión)
- Organigrama (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/departamentos-organigrama.json (panel de un edificio que indica el piso de cada oficina)
- Factura (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (cuenta detallada de un restaurante que se guarda para Hacienda)
- Albarán (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (hoja que firma el repartidor al entregar un paquete)
- Pedido (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (decirle al camarero qué platos quieres antes de que los traiga)
- Presupuesto (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (varios albañiles dan su precio antes de reformar una cocina)
- Operaciones de caja (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/cobros-pagos-caja.json (dinero de una caseta de feria guardado en un cajón y contado al final del día)
- Nómina (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/cobros-pagos-caja.json (extracto bancario mensual que resume los movimientos de la cuenta)
- Impresos oficiales (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/documentos-comerciales.json (papel de Hacienda con casillas fijas que no puedes cambiar)
- Control de existencias (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (empleado del súper revisando estanterías para ver qué falta)
- Importancia de la organización administrativa (repetición, nuevo ángulo): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (biblioteca bien organizada donde cualquier libro se encuentra en segundos)
- Organigrama (plano de la empresa con niveles jerárquicos): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (plano de un edificio que indica el piso de cada oficina)
- Organización jerárquica (cadena de mando clara de arriba a abajo): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (ejército con rangos claros de general a soldado; imagen: organigrama del temario, página 10)
- Organización funcional (la empresa se reparte por funciones y el mismo empleado depende de varios jefes a la vez): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (jugador que entrena con tres entrenadores, cada uno en su posición; imagen: organigrama del temario, página 10)
- Organización mixta (une la jerárquica y la funcional: mando en cascada y trabajo repartido por funciones, con asesores que solo informan): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (militares con asesores civiles; imagen: organigrama del temario, página 11)
- Organización por divisiones (cada división funciona como empresa independiente): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (padre con tres hijos adultos, cada uno con su casa y presupuesto; imagen: organigrama del temario, página 11)
- Planificación administrativa (decidir objetivos y cómo llegar): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (diagrama con cuatro pasos, uno detrás de otro)
- Organización administrativa (repartir trabajo y recursos; si algo falla, todo se retrasa): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (cocina: alguien corta, alguien cocina, alguien sirve; imagen: las piezas de puzle del temario)
- Dirección administrativa (guiar al equipo, dar órdenes, motivar): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (director de orquesta que marca el ritmo; imagen: el jefe con portapapeles del temario)
- Coordinación administrativa (que los departamentos no se crucen): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (relay: pasarse el testigo en el momento justo; imagen: el relevo de la flecha azul del temario)
- Control administrativo (comprobar si se cumplieron los objetivos): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (comparar respuestas del examen con lo que sabías; imagen: la lupa del temario)
- Comunicación vertical (de arriba a abajo o de abajo a arriba): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (telefonillo de un edificio: de planta a planta)
- Comunicación horizontal (entre compañeros del mismo nivel): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (dos alumnos de la misma clase que se pasan una nota)
- Comunicación descendente (de dirección a empleados): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (bando municipal en todos los barrios a la vez)
- Comunicación ascendente (de empleados a dirección): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (echar una carta al buzón de Correos)
- Comunicación diagonal (entre distintos niveles jerárquicos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (mesa redonda con jefe, adjuntos y empleados)
- Comunicación formal (sigue cauces oficiales de la empresa): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (conducir por la derecha: el camino marcado)
- Comunicación informal (entre compañeros sin seguir cauces): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (conversación de bar sin paperwork)
- Memorando/nota interior (comunicación breve entre departamentos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (nota adhesiva pegada en la puerta del compañero)
- Circular interna en empresas públicas (misma info a muchos receptores): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (grupo de WhatsApp con un solo mensaje a todos)
- Aviso en empresas privadas (comunicación breve a todos los trabajadores): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (post-it gigante en la puerta de entrada)
- Oficio interno (documento formal de empresas públicas): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (carta oficial pero interna, sin salir al exterior)
- Comunicación escrita interna (documentos que circulan entre departamentos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (sistema circulatorio: sangre que sale del corazón y vuelve por las venas)
- Informe (documento ordenado con datos, hechos y conclusiones): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (resumen estructurado de lo tratado en una reunión)
- Acta (registro de acuerdos tomados en una reunión): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (minutas de clase para los que no vinieron)
- Material de oficina (artículos necesarios para el trabajo diario, de uso frecuente y reemplazable): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/material-oficina.json (la lista de cosas que siempre faltan en el cajón de la mesa)
- Material fungible (se gasta y hay que reponerlo): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/material-oficina.json (comida del frigorífico: se acaba y se compra otra vez)
- Material no fungible (duro mucho, no se consume): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/material-oficina.json (sartén: la compras una vez y la usas años)
- Por qué se repone el material fungible (se consume con el uso: se gasta, deteriora o desaparece con el tiempo): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/material-oficina.json (la comida: en cuanto se acaba hay que comprar más)
- Por qué el material no fungible dura años (no se consume con el uso, aunque se desgaste con los años): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/material-oficina.json (los electrodomésticos de casa: se usan durante años)
- Equipos de oficina (máquinas duraderas como ordenadores, impresoras): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (electrodomésticos de una cocina)
- Características de los equipos de oficina (bienes duraderos, mantenimiento a largo plazo, ahorran esfuerzo manual, inventario fijo): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (coche de empresa: dura años, hay que revisarlo y ahorra trabajo)
- Ordenadores (elaboran documentos, imágenes, gráficos, sonidos y gestionan bases de datos): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (el cerebro de la oficina: todo pasa por él)
- Impresoras (reproducen en papel los archivos de texto e imágenes; funcionan con cartuchos de tinta o tóner): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (lo que ves en pantalla convertido en algo que puedes tocar)
- Fotocopiadoras (reproducen documentos en papel a partir de otro formato físico): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (hacer una copia a mano, pero al instante)
- Escáneres (digitalizan un documento y lo convierten en un archivo que se puede tratar con el ordenador): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (pasar la foto de un libro al móvil, pero de un libro entero)
- Teléfonos (otra de las herramientas imprescindibles de la oficina para comunicarnos): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (el inseparable del puesto de trabajo)
- Aparato multifunción (imprime, escanea, fotocopia, envía correos): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (Swiss Army Knife: muchas funciones en una sola herramienta)
- Tipos de mesas del mobiliario (operativas, auxiliares y de reunión): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (la mesa de cada uno y una mesa grande para las reuniones)
- Sillas ergonómicas (diseñadas para evitar problemas de salud): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (el asiento de un coche que te sostiene la espalda)
- Armarios de la oficina (custodian los documentos que la empresa debe conservar o que los empleados consultan a menudo): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (el armario del cuarto donde guardas lo importante)
- Tablón de anuncios del mobiliario (repetición, nuevo ángulo: informa de tareas, días festivos, horarios y avisos urgentes): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (el tablón del patio del cole, pero en la oficina)
- Pago al contado (se paga en el momento de recibir): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (pagar en el supermercado antes de salir)
- Cheque (orden escrita al banco de pagar a otra persona): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (mandato firmado que dice 'páguese a esta persona')
- Partes del cheque (IBAN, beneficiario, importe, fecha, firma): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (formulario oficial con casillas que hay que rellenar)
- Transferencia bancaria (mover dinero de una cuenta a otra): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (orden de transferencia de una habitación a otra del mismo hotel)
- Tarjeta de débito (solo gasta lo que hay en la cuenta, resta inmediato): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (pagar con dinero efectivo pero sin llevar billetes)
- Formas de pago en comercio electrónico (tarjeta, transferencia, contra reembolso, pasarela): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/pago-online.json (distintas cajas en una tienda online)
- Barra de fórmulas de Excel (muestra qué hay escrito en la celda seleccionada): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (barra de direcciones del navegador: te dice dónde estás)
- Columna en Excel (selección vertical que va de arriba a abajo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-conceptos-basicos.json (columna de un edificio)
- Fila en Excel (selección horizontal que va de izquierda a derecha): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-conceptos-basicos.json (fila de butacas de cine)
- Tipos de datos en celdas Excel (textos, números o fórmulas): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-conceptos-basicos.json (celda de papel quadriculado donde escribir lo que quieras)
- Fórmulas básicas de Excel (+, -, ×, ÷): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-conceptos-basicos.json (calculadora donde tú decides qué celdas se usan)
- Cálculo del TOTAL con IVA (subtotal + IVA 21%): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-conceptos-basicos.json (factura de restaurante: pedido + servicio = cuenta final)
- Qué es una empresa (combinación de elementos materiales y humanos): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/la-empresa.json (sin utensilios ni cocinero no hay plato)
- Qué produce la empresa (bienes y servicios): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/la-empresa.json (panadería que hace pan y empresa de limpieza que lava)
- Para qué sirve la actividad de la empresa (satisfacer necesidades y obtener beneficios): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/la-empresa.json (hacemos pan que otros necesitan y así ganamos)
- Clasificación de empresas por tamaño (gran, mediana, pequeña, micro): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (planetas grandes a pequeños)
- Sector primario, secundario y terciario de actividad: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (la cadena del pan: el trigo del campo, la fábrica que lo convierte en pan y la panadería que te lo vende y te atiende)
- Empresas locales, nacionales e internacionales según ámbito geográfico: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (tres escalones: barrio, país, mundo)
- Empresas públicas y privadas según quién pone el dinero: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (parque del pueblo vs jardín de tu casa)
- Empresario individual y sociedad: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (solo vs equipo: exámenes en solitario vs en grupo; la respuesta es "Empresario individual y sociedad" —usa "sociedad", no "social"—; los dos ponen dinero y comparten los gastos)
- Funciones del empresario: dirigir, controlar y supervisar: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (capitán de barco que pone rumbo y supervisa)
- Gran empresa (más de 250 trabajadores): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (rascacielos: muchas plantas y mucha gente)
- Empresa mediana (entre 50 y 249 trabajadores): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (colegio con 80 personas: edificio de seis pisos)
- Pequeña empresa (menos de 50 trabajadores): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (casa de dos pisos: todo el mundo se conoce)
- Microempresa (menos de 10 trabajadores): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (kiosco en la esquina: casi solo el dueño)
- Sector primario (agricultura, ganadería, pesca, minería y bosques): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (recoger aceitunas o pescar un pez)
- Sector secundario (transforma materias primas en otros productos): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (fábrica: coge trigo y hace pan)
- Sector terciario (presta servicios): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (taxi: no fabrica nada pero te lleva)
- Empresa local (trabaja en una localidad, provincia o comunidad): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (fuente del pueblo: el agua sale aquí)
- Empresa nacional (trabaja en todo un país): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (tren que recorre España entero)
- Empresa internacional (trabaja en varios países): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (barco que cruza el mar y llega a otras playas)
- Empresa pública (el capital es del Estado): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (parque del pueblo: lo paga la ciudad; el anverso no dice "público", que era la respuesta; la foto es el parque)
- Empresa privada (el capital es de particulares): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (jardín de tu casa: lo paga su dueño)
- Empresario individual (una sola persona pone el dinero y dirige): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (el autónomo que abre su propio taller)
- Sociedad (varios empresarios se unen para llevar un negocio): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (equipo de fútbol: el gol es de todos; todos ponen dinero y se reparten los gastos)
- Crear empleo y riqueza como función de la empresa: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (árbol que da frutos para la comunidad)
- Asumir riesgos técnicos y económicos: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (cruzar la calle: riesgo pero necesario para avanzar)
- Organizar y dirigir el proceso de producción: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (obra: el jefe reparte el trabajo y dirige a los albañiles hasta levantar la casa)
- Estructura formal de la empresa (organigrama, puestos, jerarquía): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (equipo con uniforme: todos siguen las mismas reglas y cada uno tiene su jefe)
- Estructura informal de la empresa (relaciones espontáneas entre compañeros): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (dos compañeros que se echan una mano sin que nadie lo haya planeado)

**Octubre 2026 — imágenes de `funciones-empresa-estructura`: la imagen
muestra la PISTA.** Las 5 fotos que tenía eran miniaturas de documentos
PDF (un libro sobre frutos ácidos, unos «slides» de *Risk Assessment*,
los anales de la construcción, un libro de arquitecto y una zarzuela),
es decir, la imagen no tenía nada que ver con la tarjeta, y el `alt`
era literalmente «(imagen)». Se sustituyeron por fotos que enseñan la
analogía marcada: un manzano con manzanas (crear empleo y riqueza), un
grupo de personas cruzando un paso de cebra (asumir riesgos), albañiles
en una obra (organizar y dirigir la producción), el plano de una casa
(estructura formal) y un pasaje entre edificios (estructura informal).
La sexta card —la fórmula del iceberg— no tenía imagen y se le puso una
(un iceberg con la parte que asoma y la masa que queda bajo el agua); más
abajo se explica por qué esa card ya no está.

**Octubre 2026 — «estructura formal» y «estructura informal» cambian de
foto y de analogía.** Las dos tarjetas tenían la imagen que ilustraba la
pista de entonces (el plano de una casa para la formal, un pasaje entre
edificios para la informal), pero se pidió que la foto enseñara el
concepto: unos trabajadores con el mismo uniforme para la estructura
formal y unos compañeros de oficina trabajando juntos para la informal.
Se sustituyen las dos fotos (cuatro trabajadores con chaleco naranja
reflectante, «Four men at night», CC BY 2.0; dos personas mirando la
pantalla de un portátil, «Discussing technology at WINTR», CC BY-SA 4.0)
y, para que la imagen siga enseñando la pista y no solo el concepto
(guía §2.5), se reescriben las dos analogías: la formal pasa de «el plano
de una casa hecho por un arquitecto» a «un equipo con uniforme: todos
siguen las mismas reglas y cada uno tiene su jefe», y la informal de
«atajos de un edificio que no salen en el plano» a «dos compañeros que se
echan una mano sin que nadie lo haya planeado».

**Octubre 2026 — se elimina la card «Formal e informal» (la del
iceberg).** La card de la fórmula de la organización real («lo formal más
lo informal = la organización real») sobraba: ya hay una card para cada
parte, «Estructura formal» y «Estructura informal», y una tercera que
repite la suma no añade nada al alumno. Se borra la card y con ella su
imagen (`iceberg.jpg`, que sale del repo y queda en `audit-out/`). La
baraja baja de 6 a 5 cards, todas con imagen, y el `amount` del manifest
se ajusta a 5. El temario del centro sí habla de la organización real
como la formal más la informal (`doc/revision-tecnicas-administrativas/
tema-01.md` §1.5): eso se conserva, porque es el libro.
- Comunicación escrita externa (empresa ↔ exterior): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (correo que entra y sale de casa, no todo queda dentro)
- Carta comercial (el ejemplo de comunicación externa que da el libro): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (carta personal con los datos de la empresa arriba)
- Documentos de la comunicación escrita de una empresa (ejercicio 5 del tema): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (el montón de papeles que te dan cuando compras algo)
- Qué son las comunicaciones escritas (uso del lenguaje escrito): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (escribir en vez de hablar)
- Comunicación escrita interna (el origen y el destino es la propia empresa): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (una nota que se pasa de una mesa a otra)
- Comunicación interna (actividades para crear y mantener buenas relaciones): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (mantener la convivencia en un grupo)
- Función de la comunicación ascendente (quejas, ideas, contestación): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (levantar la mano en clase)
- Formas de la comunicación ascendente (buzón de sugerencias, encuestas, entrevistas, informes, reuniones y quejas): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (las seis maneras de dejarle un recado al jefe)
- Dificultades de la comunicación ascendente (lentitud, retrasos, necesidad de respuesta rápida, inseguridad en la recepción): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (un buzón que tarda en vaciarse)
- Función de la comunicación descendente (funciones, resultados, actividades y objetivos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (el profesor explica el tema y los objetivos)
- Formas de la comunicación descendente (órdenes, programación de tareas, reuniones, recomendaciones e instrucciones): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (las cinco formas de repartir el trabajo)
- Dificultades de la comunicación descendente (exceso de información, no aceptar el mensaje, órdenes contradictorias, inseguridad y transmisión lenta): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (dos papeles que se contradicen)
- Función de la comunicación transversal (coordinar trabajadores y grupos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (pasarse el testigo en una carrera)
- Formas de la comunicación transversal (informes, comunicados interiores y reuniones): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (la reunión donde cada grupo cuenta qué ha hecho)
- Dificultades de la comunicación transversal (carácter informal y rivalidad entre departamentos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/tipos-informacion-comunicacion.json (dos grupos del cole que no se llevan bien)
- Comunicación oral como medio de transmisión: fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (una conversación de café)
- Comunicación escrita como medio de transmisión: fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (dejar una nota en la mesa)
- Comunicación no verbal como medio de transmisión: fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (entender que tu compañero está cansado solo por cómo mira)
- Estructura del memorándum (cabecera, De/A, cuerpo y pie): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (un email de la empresa: de quién es, a quién va, qué pide y quién lo firma)
- Elementos de la circular interna (membrete, número, asunto, fecha y firma): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (un cartel oficial con número, título y firma)
- Elementos del oficio interno (membrete, sello de salida, asunto, fecha y recibo): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (una carta con sello de salida y resguardo firmado)
- Manual del empleado (información, condiciones de trabajo y reglamento interno): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (el cuaderno de normas del cole, pero de la empresa)
- Newsletter (revistas internas): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (el periodical del cole, pero para la plantilla)
- Correo electrónico como medio interno (mensajes entre ordenadores en red): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (el buzón que llega a todas partes a la vez)
- Reuniones como medio interno (individuales o en grupo): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (la reunión en el patio del cole)
- Intranet (red interna para acceder a la información de los empleados): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (una biblioteca digital donde solo entra la empresa)
- Sistema de sugerencias y quejas: fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (un buzón de sugerencias en la puerta de la oficina)
- Encuestas (recoger la opinión de los empleados): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (una papeleta en el cole para saber qué les gusta más)
- Tablón de anuncios (escritos, gráficos y carteles): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (el tablón del patio del cole con los avisos)
- Redes sociales como medio interno: fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (un grupo donde todo el mundo de la empresa está unido)
- Mensajería instantánea (crear grupos de trabajo): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/medios-comunicacion-interna.json (un grupo de WhatsApp del trabajo)
- Correos como empresa pública española de paquetería: fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-lineas.json (servicio de mensajería del Estado)
- Las seis líneas operativas de Correos (básica, urgente, paquetería, económica, servicios telegráficos y gestión de buzón): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-lineas.json (autobús normal, exprés y descuento)
- Servicio certificado de Correos (garantiza recepción con firma + indemnización): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/modalidades-envio.json (envío con acuse de recibo y seguro)
- Reembolso (el destinatario paga el importe en la oficina de Correos): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/modalidades-envio.json (la etiqueta que dice lo que hay que pagar al recogerlo)
- Aviso de recibo (garantiza recepción con firma, fecha y hora; se devuelve al remitente): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/modalidades-envio.json (recibo de correo firmado que vuelve al emisor)
- Correo digital de Correos (carta y publicidad enviadas electrónicamente): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/modalidades-envio.json (email con infraestructura de Correos)
- Embalaje de paquetes (resistente, protector, adaptado al contenido): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/envio-correspondencia-paqueteria.json (embalajar una mudanza para que no se rompa nada)
- Normalización de envíos (normas de formato, color, grafía para máquinas): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/envio-correspondencia-paqueteria.json (normas de presentación de examen: limpio y legible)
- Orden correcto de la dirección postal (provincia → C.P. → calle → destinatario): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/envio-correspondencia-paqueteria.json (formulario: de arriba abajo, sin saltarse líneas)
- Empresas de mensajería externa vs Correos: fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/mensajeria-externa.json (taxis de paquetes vs autobús público)
- Los once servicios de mensajería externa (depósito en oficina, acuse de recibo, urgente diurno/nocturno, entrega en mano, internacionales, 24 horas, mensajero en exclusiva, con retorno, manipulación, valijas y hora fijada): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/mensajeria-externa.json (cada uno con su propia imagen)
- Control continuo de existencias (cuenta diaria de entrada/salida del almacén): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (libro de cuentas del supermercado)
- Inventario (recuento periódico y completo de todos los bienes): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (cenco de población: completo pero periódico)
- Inventario general de la empresa (material, maquinaria, mobiliario): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (inventario de biblioteca: todos los libros contados)
- Generar pedido cuando escasea el material: fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (revisar la nevera y hacer la lista de la compra)
- Objetivos del aprovisionamiento (necesidades, tiempo, almacenamiento, control): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (despensa: saber qué falta, comprar lo justo, guardar bien, no desperdiciar)
- Barra de título de Excel (nombre del archivo y aplicación): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (salpicadero del coche: cada instrumento en su sitio)
- Barra de herramientas de acceso rápido de Excel: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (botones de un mando a distancia)
- Barra de estado de Excel (zoom, vista, estado del archivo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (barra inferior del navegador)
- Zoom de Excel (del 10% al 400%, acercar o alejar la vista): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (prismáticos: acercarse o alejarse del mapa)
- Las vistas de Excel (normal, diseño de página y saltos de página): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (distintos puntos de vista de un mapa)
- IBAN (código internacional que identifica una cuenta bancaria): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (dirección de la cuenta en el sistema financiero mundial)
- Pagaré (compromiso de pago en fecha futura): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (cheque postfechado: te pago tal día)
- Letra de cambio (orden de pago entre librador, banco y beneficiario): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (cadena de tres: deudor → banco → acreedor)
- Formación del IBAN: ES + 2 dígitos de control + CCC: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (prefijo de país en teléfono internacional pero para cuentas)
- Pago aplazado o a crédito (el vencimiento es posterior a la entrega): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (dejar la deuda anotada para más tarde)
- Pago anticipado (una cantidad a cuenta del precio final): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (dejar una seña y saldar después)
- Pago en efectivo (papel moneda y moneda metálica, nacionales o extranjeros): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (soltar monedas en el mostrador)
- El recibo como justificante que entrega la persona que cobra: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (la prueba en papel de que se pagó)
- Comercio electrónico (compraventa a distancia por medios electrónicos): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/pago-online.json (pedir por el móvil y que te lo traigan)
- Pago con tarjeta de crédito: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/pago-online.json (el banco te presta el dinero y lo devuelves luego)
- Pago contra reembolso: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/pago-online.json (pagar al repartidor cuando te abre la puerta)
- La pasarela de pago: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/pago-online.json (el puente que lleva tu dinero del banco a la tienda)
- La pantalla inicial de Excel: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (el cuadro de mandos de un coche)
- La barra de menús de Excel (las pestañas): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (las pestañas de un archivador)
- La banda de opciones de Excel (la cinta): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (el cajón de herramientas que abres cuando la necesitas)
- La barra de etiquetas de Excel (las hojas): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (las pestañas de un archivador de carpetas)
- Las barras de desplazamiento de Excel: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (correr el texto para ver lo que viene detrás)
- Cómo introducir datos en una celda (situar el cursor y teclear): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-conceptos-basicos.json (rellenar las casillas de un formulario)
- Guardar un libro de trabajo (Guardar y Guardar como): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-conceptos-basicos.json (guardar el documento en la carpeta antes de cerrar el programa)

## Revisión de fidelidad al temario del tema 1 (octubre 2026)

Contraste con `doc/revision-tecnicas-administrativas/tema-01.md` y con las fotos
del cuaderno de autoevaluación del centro (`D:/img_memofun/tecnicas_administrativas/tema1/`):

- La baraja `departamentos` (17 cards) no era del temario del tema 1: era un
  "repaso general" con contenido de los temas 2, 3, 4 y 6. Se ha deshecho:
  - `departamentos`, `compras`, `RR.HH.` y `organigrama` → `tema-2-areas-funcionales/departamentos-organigrama.json` (nueva)
  - `factura`, `albarán`, `pedido` y su diferencia → `tema-6-operaciones-cobro-excel/documentos-comerciales.json` (nueva)
  - `tramitar correspondencia` y `comprobar un paquete` → `tema-4-correos-mensajeria/correos-paqueteria.json`
  - `importancia de la organización` → `tema-1-la-empresa/estructura-organizativa-tareas.json`
  - `correo postal vs. mensajería`, `servicios de mensajería` y `archivar`
    eliminados: ya estaban cubiertos en los temas 3 y 4
- `comunicacion-escrita-externa` (carta comercial) es del tema 3 (comunicación
  escrita externa), no del tema 1: baraja e imágenes reubicadas.
- Tarjeta `estructura real → Estructura informal` retirada: la respuesta era
  incorrecta (la organización real es formal + informal) y estaba duplicada.
- Nueva baraja `la-empresa.json` (3 cards): el punto 1.1 del temario
  ("qué es una empresa") no tenía ninguna tarjeta.
- Autoevaluación del tema 1 reescrita (12 preguntas) a partir del cuaderno de
  autoevaluación del centro, con las respuestas corregidas.
- - Las barajas del tema 6 son seis: `medios-pago` (medios e instrumentos de pago), `pago-online` (comercio electrónico), `excel-pantalla-inicial` (la ventana de Excel), `excel-conceptos-basicos` (columnas, filas, datos, guardado y fórmulas), `documentos-comerciales` (factura, albarán, pedido, nota de pedido, presupuesto, impresos) y `cobros-pagos-caja` (caja, cobro, pago, justificantes, nómina y registro).
  impresos, control de existencias) estaba en el tema 2 y su contenido es del
  tema 6 (operaciones de cobro y pago): mudada con sus 18 imágenes. El tema 2
  queda con la baraja de áreas funcionales, que es lo que dice su temario.
- Eliminadas 17 imágenes huérfanas que quedaban en la raíz de la carpeta del
  curso (restos de la antigua ubicación, sin ninguna tarjeta que las usara).
- La autoevaluación es **opt-in**: solo la tienen los temas marcados con
  `"selfTest": true` en `decks/manifest.json` (ahora: itinerario T1 y
  técnicas T1). Los demás temas no muestran la tarjeta final.

## Revisión de fidelidad al temario del tema 5 (octubre 2026)

Contraste con `doc/revision-tecnicas-administrativas/tema-05.md` y con las fotos
del cuaderno del centro (`D:/img_memofun/tecnicas_administrativas/tema5/`):

- Las cuatro barajas del tema 5 son `material-oficina` (5), `equipos-oficina` (13),
  `archivo-registro-oficina` (4) e `inventario-control-existencias` (5):
  **27 tarjetas** en total, sin altas ni bajas.
- Las dos tarjetas de `material-oficina` que pedían «un ejemplo» de material
  fungible y no fungible **enunciaban la respuesta**: la 4 listaba las grapas (su
  respuesta) y la 5 la calculadora. Reescritas: ahora preguntan **por qué** hay
  que reponer el fungible y **por qué** el no fungible puede usarse durante años.
- `archivo-registro-oficina` e `inventario-control-existencias` **no tienen
  sección propia** en las 7 páginas del tema 5: cubren bloques oficiales del
  módulo (Archivo ×2, Administración pública «sello y firma», Almacén ×2,
  Organización «agenda de trabajo») y los objetivos de la pág. 43
  (aprovisionamiento de material y gestión del almacén). Se conservan y la
  distinción queda documentada en `tema-05.md`.
- Autoevaluación de 11 a **12** preguntas: la nueva p12 es el **ejercicio 9** del
  temario (separar equipos de oficina y materiales de oficina).
- El **ejercicio 5** del cuaderno está mal escrito (pregunta por qué **no** se
  usan sillas ergonómicas, cuando el libro dice que sí se recomiendan). No se ha
  convertido en pregunta: la tarjeta de las sillas ergonómicas se mantiene como
  la escribe el libro.
- Auditoría de imágenes: las 27 imágenes se miraron **una a una**; 12 se
  sustituyeron, 3 se renombraron y los `alt` se redactaron sobre lo que se ve de
  verdad. 12 imágenes huérfanas quedan en `audit-out/huerfanos-tema5/`.

## Revisión de fidelidad al temario del tema 6 (octubre 2026)

Contraste con `doc/revision-tecnicas-administrativas/tema-06.md` y con las fotos
del cuaderno del centro (`D:/img_memofun/tecnicas_administrativas/tema6/`):

- Las seis barajas del tema 6 son `medios-pago` (12), `pago-online` (5),
  `cobros-pagos-caja` (7), `documentos-comerciales` (9), `excel-pantalla-inicial`
  (11) y `excel-conceptos-basicos` (7): **51 tarjetas**.
- **Tarjeta retirada: el CCC.** El libro nunca lo explica (solo aparece en la
  imagen del cheque del ejercicio) y la imagen que lo ilustraba mostraba un
  *sort code* británico, no un CCC español. Se ha eliminado la tarjeta y la
  entrada del CCC en este registro.
- **Tarjeta nueva: las vistas de Excel.** El §1 del libro (pág. 57) lista diez
  elementos de la pantalla inicial y faltaba «Vistas»; la tarjeta del zoom se
  ha quedado solo con el zoom.
- **Dos tarjetas repetían la respuesta** dentro de la misma baraja: el albarán
  (documentos comerciales) y la nómina (cobros y pagos). Se han reescrito para
  preguntar por lo que faltaba: qué información incluye una factura y qué
  información básica incluye una nómina.
- La tarjeta del **pagaré** decía «un papel promising pagar» (en inglés):
  corregido a «prometiendo pagar».
- La tarjeta de las **formas de pago en el comercio electrónico** tenía una
  respuesta vaga («pagos en comercio electrónico»): ahora pregunta cuántas hay
  y cuáles son, tal y como las lista el libro (pág. 54).
- Autoevaluación de 12 preguntas: la p6 pasa a ser el **ejercicio 15** del
  temario (clasificar los instrumentos de pago en al contado o a crédito); el
  `completar` gana un hueco sobre las filas de Excel y el `vf` una afirmación
  sobre las vistas.
- Auditoría de imágenes: las 51 imágenes se revisaron una a una; 10 se
  sustituyeron y los `alt` se redactaron sobre lo que se ve de verdad. 11
  imágenes huérfanas quedan en `audit-out/huerfanos-tema6/`.
