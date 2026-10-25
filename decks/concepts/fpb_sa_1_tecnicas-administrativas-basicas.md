# fpb_sa_1_tecnicas-administrativas-basicas — conceptos ya cubiertos

> Registro de trabajo del agente de IA (ver CLAUDE.md → "Generating deck content" paso 7).
> No lo lee la app ni el service worker; no necesita subir VERSION en sw.js.

## Migración a Wikimedia Commons (octubre 2026)

Las barajas se migraron del modelo antiguo (imágenes en raíz del curso, autor
Flickr/CC-BY) al modelo nuevo (carpeta
`assets/img/decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-N-slug/<baraja>/<slug>.jpg`,
atribución completa de Wikimedia Commons).

Concretamente:
- **Tema 1** (5 barajas, 64 cards, 58/64 con imagen CC):
  - `departamentos` 17/17
  - `estructura-organizativa-tareas` 10/15 (text-only: `organizacion-funcional` + las 4 cartas de ejemplo de organigrama)
  - `tipos-empresa-empresario` 20/20
  - `funciones-empresa-estructura` 5/6 (falla `formula-organizacion-real` — text-only)
  - `comunicacion-escrita-externa` 6/6
- **Tema 2** (2 barajas, 24 cards, todas con imagen CC): `areas-funcionales` 11/11 +
  `departamentos-organigrama` 13/13 (auditoría de fidelidad al temario de octubre 2026:
  la baraja cubría solo «departamentos y organigrama» y dejaba fuera las cinco áreas
  funcionales; se añadió `areas-funcionales` y se reordenó la existente)
- **Tema 3** (3 barajas, 41 cards): auditoría de fidelidad al temario de octubre 2026
  - `comunicacion-interna-documentos` 23/23 con imagen (clasificación, funciones, medios de transmisión y documentación)
  - `medios-comunicacion-interna` 10/10 (nueva, con la tabla de medios de la pág. 29 del libro)
  - `comunicacion-escrita-externa` 8/8 (las dos ramas del §1: externas e internas)
  - `agenda-archivo-sello-inventario` (17 cards) **disuelta**: era un repaso general de otro curso, no contenido del tema 3. Sus 12 tarjetas ya cubiertas en los temas 2, 5 y 6 se eliminaron; agenda, archivar, registro y sello pasaron al tema 5, y la nota de pedido al tema 6.
- **Tema 4** (1 baraja, 10 cards): `correos-paqueteria` 10/10 con imagen Wikimedia
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
de 12 a 16 cards y el curso de 150 a 154. Sin imagen: la foto de la carta se
renderiza como miniatura de 140 px y un organigrama no se lee así; el ejemplo
va descrito en la pista.

**Octubre 2026 — fusión de las dos cartas de «organización»:** la carta de la
tarea «Organización» y la carta de «La organización» (su importancia) se
funden en una sola carta: la pista explica el reparto del trabajo y añade
que, si algo falla, la empresa entera se retrasa. La baraja queda con 15
cards (el curso, con 153) y la imagen huérfana `importancia-organizacion.jpg`
se ha eliminado.

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
- Tramitar correspondencia (recibir, registrar, clasificar, entregar): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (repartir el correo buzón a buzón)
- Comprobar un paquete al recibirlo: fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (comprobar que el pedido llegó bien)
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
- Organización jerárquica (cadena de mando clara de arriba a abajo): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (ejército con rangos claros de general a soldado)
- Organización funcional (varios mando dan órdenes sobre el mismo empleado): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (equipo donde varios capitanes mandan a la vez)
- Organización mixta (jerárquica con asesores): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (militares con asesores civiles)
- Organización por divisiones (cada división funciona como empresa independiente): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (padre con tres hijos adultos, cada uno con su casa y presupuesto)
- Ejemplo de organización jerárquica (organigrama del temario: Director general → jefes de Ventas, Compras y Almacén → sus dos empleados cada uno): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (árbol: la raíz arriba y las ramas abajo)
- Ejemplo de organización funcional (organigrama del temario: Consejo de administración → Director general → directores de Producción, Comercial y Financiero, y el empleado depende de los tres): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (un empleado con tres jefes el mismo día)
- Ejemplo de organización mixta (organigrama del temario: Director general con Adjunto director, Asesoría fiscal y Gabinete de estudios técnicos como asesores, más los tres directores de departamento): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (un jefe que manda en su empresa y, al lado, un equipo de expertos que le ayudan)
- Ejemplo de organización por divisiones (organigrama del temario: Director general con un director para cada zona, Europa, América y Asia): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (tres tiendas con el mismo dueño, cada una va por su cuenta)
- Áreas funcionales (secciones como Producción, Comercial, Finanzas): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (orquesta dividida en cuerdas, viento y percusión)
- Planificación administrativa (decidir objetivos y cómo llegar): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (pensar la ruta antes de un viaje)
- Organización administrativa (repartir trabajo y recursos; si algo falla, todo se retrasa): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (cocina: alguien corta, alguien cocina, alguien sirve)
- Dirección administrativa (guiar al equipo, dar órdenes, motivar): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (director de orquesta que marca el ritmo)
- Coordinación administrativa (que los departamentos no se crucen): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (relay: pasarse el testigo en el momento justo)
- Control administrativo (comprobar si se cumplieron los objetivos): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/estructura-organizativa-tareas.json (comparar respuestas del examen con lo que sabías)
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
- Material fungible (se gasta y hay que reponerlo): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/material-oficina.json (comida del frigorífico: se acaba y se compra otra vez)
- Material no fungible (duro mucho, no se consume): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/material-oficina.json (sartén: la compras una vez y la usas años)
- Equipos de oficina (máquinas duraderas como ordenadores, impresoras): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (electrodomésticos de una cocina)
- Aparato multifunción (imprime, escanea, fotocopia, envía correos): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/equipos-oficina.json (Swiss Army Knife: muchas funciones en una sola herramienta)
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
- Sector primario, secundario y terciario de actividad: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (campo, fábrica, servicios: los tres pisos de la economía)
- Empresas locales, nacionales e internacionales según ámbito geográfico: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (calle de barrio vs autopista transfronteriza)
- Empresas públicas y privadas según propiedad del capital: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (parque público vs jardín privado)
- Empresario individual vs empresario social (sociedad): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (solo vs equipo: exámenes en solitario vs en grupo)
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
- Empresa pública (el capital es del Estado): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (parque público: lo paga la ciudad)
- Empresa privada (el capital es de particulares): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/tipos-empresa-empresario.json (jardín de tu casa: lo paga su dueño)
- Crear empleo y riqueza como función de la empresa: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (árbol que da frutos para la comunidad)
- Asumir riesgos técnicos y económicos: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (cruzar la calle: riesgo pero necesario para avanzar)
- Organizar y dirigir el proceso de producción: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (obra: el jefe reparte el trabajo y dirige a los albañiles hasta levantar la casa)
- Estructura formal de la empresa (organigrama, puestos, jerarquía): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (plano de la casa hecho por el arquitecto)
- Estructura informal de la empresa (relaciones espontáneas entre compañeros): fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (atajos y pasillos que la gente usa aunque no estén en el plano)
- Fórmula organización real = estructura formal + estructura informal: fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/funciones-empresa-estructura.json (iceberg: parte visible + parte bajo el agua)
- Comunicación escrita externa (empresa ↔ exterior, puede tener valor legal): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (correo que entra y sale de casa, no todo queda dentro)
- Carta comercial (documento formal para comunicarse con clientes/proveedores): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (carta personal con formato profesional)
- Membrete de la carta comercial (datos de la empresa emissora): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (cabecera que identifica al remitente)
- Partes de la carta comercial (destinatario, cuerpo, saludo, firma): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (estructura de un email profesional)
- Qué son las comunicaciones escritas (uso del lenguaje escrito): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (escribir en vez de hablar)
- Comunicación escrita interna (el origen y el destino es la propia empresa): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-escrita-externa.json (una nota que se pasa de una mesa a otra)
- Comunicación interna (actividades para crear y mantener buenas relaciones): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (mantener la convivencia en un grupo)
- Función de la comunicación ascendente (quejas, ideas, contestación): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (levantar la mano en clase)
- Función de la comunicación descendente (funciones, resultados, actividades y objetivos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (el profesor explica el tema y los objetivos)
- Función de la comunicación transversal (coordinar trabajadores y grupos): fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/comunicacion-interna-documentos.json (pasarse el testigo en una carrera)
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
- Correos como empresa pública española de paquetería: fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (servicio de mensajería del Estado)
- Líneas de Correos: básica, urgente y económica: fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (autobús normal, exprés y descuento)
- Servicio certificado de Correos (garantiza recepción con firma + indemnización): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (envío con acuse de recibo y seguro)
- Reembolso (el destinatario paga al repartidor en el momento de la entrega): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (pagar al repartidor de pizza a la puerta)
- Aviso de recibo (garantiza recepción con firma, fecha y hora; se devuelve al remitente): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (recibo de correo firmado que vuelve al emisor)
- Correo digital de Correos (carta y publicidad enviadas electrónicamente): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (email con infraestructura de Correos)
- Embalaje de paquetes (resistente, protector, adaptado al contenido): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (embalajar una mudanza para que no se rompa nada)
- Normalización de envíos (normas de formato, color, grafía para máquinas): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (normas de presentación de examen: limpio y legible)
- Orden correcto de la dirección postal (provincia → C.P. → calle → destinatario): fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (servidor + usuario en dirección de email)
- Empresas de mensajería externa (MRW, SEUR, UPS, DHL) vs Correos: fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/correos-paqueteria.json (taxis de paquetes vs autobús público)
- Control continuo de existencias (cuenta diaria de entrada/salida del almacén): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (libro de cuentas del supermercado)
- Inventario (recuento periódico y completo de todos los bienes): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (cenco de población: completo pero periódico)
- Inventario general de la empresa (material, maquinaria, mobiliario): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (inventario de biblioteca: todos los libros contados)
- Generar pedido cuando escasea el material: fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (revisar la nevera y hacer la lista de la compra)
- Objetivos del aprovisionamiento (necesidades, tiempo, almacenamiento, control): fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/inventario-control-existencias.json (despensa: saber qué falta, comprar lo justo, guardar bien, no desperdiciar)
- Barra de título de Excel (nombre del archivo y aplicación): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (salpicadero del coche: cada instrumento en su sitio)
- Barra de herramientas de acceso rápido de Excel: fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (botones de un mando a distancia)
- Barra de estado de Excel (zoom, vista, estado del archivo): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (barra inferior del navegador)
- Zoom y vistas de Excel (10%-400%, Normal/Diseo de página/Saltos): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/excel-pantalla-inicial.json (prismáticos: acercarse o alejarse del mapa)
- IBAN (código internacional que identifica una cuenta bancaria): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (dirección de la cuenta en el sistema financiero mundial)
- CCC: 20 dígitos (entidad + oficina + control + cuenta): fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/medios-pago.json (matrícula del banco: marca + modelo + número)
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
