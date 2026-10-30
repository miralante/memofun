#!/usr/bin/env node
/*
 * Auditoría del ANCLA de las barajas: ¿el anverso da alguna pista que
 * conecte con el término de la respuesta?
 *
 * NO modifica archivos. Solo informa por consola (y en
 * `audit-out/audit-anclas.json`).
 *
 * Criterio (guia-crear-elementos.md §2.3): el anverso debe contener una
 * palabra —la RAÍZ o un SINÓNIMO cercano del término de la respuesta— que
 * sirva de ancla al student. La analogía de <mark> es una pista aparte y no
 * cuenta como ancla.
 *
 * Reglas:
 *   R1  frase del anverso con más de 12 palabras (CLAUDE.md: 2-4 frases
 *       ≤ 12 palabras cada una).
 *   R2  más de 4 frases de pista antes de la pregunta final.
 *   R3  el anverso contiene una palabra de CONTENIDO de la respuesta
 *       (regala la respuesta). No cuenta el sustantivo genérico
 *       (empresa, sector, estructura, clasificación...).
 *   R4  el anverso NO contiene ninguna palabra que conecte con la
 *       respuesta: ni por raíz morfológica ni por el mapa de sinónimos.
 *   R5  el ancla NO está marcada con <u> en el anverso (regla del diseño:
 *       la palabra que devuelve el término va subrayada).
 *   R6  lo que está subrayado NO apunta al término: la palabra marcada
 *       no conecta con la respuesta ni por raíz ni por sinónimo.
 *   R7  el ancla está dentro de la analogía <mark> (la analogía es otra
 *       señal: el ancla va en el texto del anverso).
 *   R8  el ancla está en la pregunta final Y esa palabra sale ya en la
 *       pista: entonces la tarjeta se regala. (Un ancla en la pregunta
 *       final es legítima si es una referencia hacia atrás —«el peso de
 *       todo eso», «ese contacto»—: ahí se pregunta por el ancla.)
 *
 * R5, R6, R7 y R8 solo se comprueban con `--ancla-marcada`, porque son
 * la regla del diseño nueva y no todas las barajas de la suite la
 * cumplen todavía.
 *
 * Uso:
 *   node scripts/audit-deck-anchors.js <carpeta-de-barajas>
 *   node scripts/audit-deck-anchors.js decks/fpb_sa_1_tecnicas-administrativas-basicas
 *   node scripts/audit-deck-anchors.js decks/fpb_sa_1_tecnicas-administrativas-basicas --ancla-marcada
 */

'use strict';

var fs = require('fs');
var path = require('path');

var dir = process.argv[2];
/* R5/R6 (el ancla va subrayada con <u>) solo con --ancla-marcada: es la
 * regla del diseño nueva y no todas las barajas de la suite la cumplen. */
var EXIGIR_ANCLA = process.argv.indexOf('--ancla-marcada') !== -1;
if (!dir && require.main === module) {
  console.error('Falta la carpeta de barajas. Ejemplo:\n' +
    '  node scripts/audit-deck-anchors.js decks/fpb_sa_1_tecnicas-administrativas-basicas');
  process.exit(1);
}
var OUT_DIR = path.resolve(__dirname, '..', 'audit-out');

/* Raíces: el anverso puede apuntar al término con otra forma de la misma
 * palabra (organiza → Organización, plan → Planificación). */
var RAICES = {
  organigrama: 'organigram',
  jerarquica: 'jerarqu',
  funcional: 'funcion',
  mixta: 'mix',
  divisiones: 'divis',
  planificacion: 'plan',
  organizacion: 'organiz',
  direccion: 'direc',
  coordinacion: 'coordin',
  control: 'control',
  empleo: 'emple',
  riqueza: 'rique',
  riesgos: 'riesg',
  produccion: 'produc',
  formal: 'formal',
  informal: 'informal',
  materiales: 'material',
  humanos: 'human',
  bienes: 'bien',
  servicios: 'servic',
  necesidades: 'necesit',
  beneficios: 'benefici',
  tamano: 'tamano',
  gran: 'gran',
  mediana: 'median',
  pequena: 'pequen',
  microempresa: 'micro',
  primario: 'prim',
  secundario: 'secund',
  terciario: 'terc',
  local: 'local',
  locales: 'local',
  nacional: 'nacion',
  nacionales: 'nacion',
  internacional: 'internacional',
  internacionales: 'internacional',
  publicas: 'public',
  privadas: 'privad',
  publica: 'public',
  privada: 'privad',
  individual: 'individual',
  sociedad: 'sociedad',
  supervise: 'supervis',
  supervisar: 'supervis',
  dirigir: 'dirig',
  controlar: 'control',
  clasificacion: 'clasific',
  comercial: 'comerc',
  finanzas: 'finanz',
  financiero: 'finanz',
  contable: 'cont',
  administracion: 'administr',
  almacen: 'almacen',
  compras: 'compr',
  ventas: 'vent',
  departamento: 'departament',
  departamentos: 'departament',
  recursos: 'recurso',
  general: 'general',
  escritas: 'escrit',
  escrita: 'escrit',
  externa: 'extern',
  interna: 'intern',
  vertical: 'vertical',
  descendente: 'descend',
  ascendente: 'ascend',
  horizontal: 'horizontal',
  diagonal: 'diagonal',
  oral: 'oral',
  verbal: 'verbal',
  memorando: 'memorand',
  nota: 'nota',
  interior: 'interior',
  cabecera: 'cabecer',
  cuerpo: 'cuerpo',
  pie: 'pie',
  aviso: 'avis',
  circular: 'circular',
  oficio: 'ofici',
  informe: 'inform',
  informes: 'inform',
  acta: 'acta',
  manual: 'manual',
  newsletter: 'newsletter',
  correo: 'corre',
  electronico: 'electron',
  reuniones: 'reunion',
  intranet: 'intranet',
  sugerencias: 'suger',
  quejas: 'quej',
  encuestas: 'encuest',
  tablon: 'tablon',
  anuncios: 'anunci',
  redes: 'red',
  sociales: 'social',
  mensajeria: 'mensajer',
  instantanea: 'instantan',
  resultados: 'result',
  actividades: 'actividad',
  objetivos: 'objetiv',
  formas: 'forma',
  dificultades: 'dificult',
  lenta: 'lent',
  retrasos: 'retras',
  necesidad: 'necesidad',
  respuesta: 'respuest',
  rapida: 'rapid',
  inseguridad: 'insegur',
  recepcion: 'recepcion',
  exceso: 'exceso',
  aceptar: 'acept',
  contradictorias: 'contradict',
  transmision: 'transmision',
  caracter: 'caracter',
  rivalidad: 'rivalid',
  miembros: 'miembr',
  ordenes: 'orden',
  programacion: 'programac',
  tareas: 'tare',
  recomendaciones: 'recomend',
  instrucciones: 'instrucc',
  comunicados: 'comunic',
  entrevistas: 'entrevist',
  buzon: 'buzon',
  empresa: 'empres',
  carta: 'cart',
  membrete: 'membret',
  numero: 'numer',
  asunto: 'asunt',
  fecha: 'fech',
  firma: 'firm',
  recibo: 'recibo',
  'de/a': 'de/a',
  informar: 'inform',
  coordinar: 'coordin',
  funciones: 'funcion',
  basica: 'basic',
  urgente: 'urgent',
  paqueteria: 'paquet',
  economica: 'econom',
  telegraphicos: 'telegraph',
  gestion: 'gestion',
  tarjeta: 'tarjet',
  postal: 'postal',
  notificacion: 'notific',
  administrativa: 'administr',
  expres: 'expres',
  valija: 'valij',
  producto: 'product',
  azul: 'azul',
  paquete: 'paquet',
  publicorreo: 'publicorr',
  publibuzon: 'publibuz',
  creamailing: 'crema',
  libros: 'libro',
  periodicas: 'periodic',
  fax: 'fax',
  burofax: 'burofax',
  telegrama: 'telegram',
  casillero: 'casiller',
  titular: 'titular',
  certificado: 'certific',
  reembolso: 'reembolso',
  destinatario: 'destinatari',
  digital: 'digital',
  embalaje: 'embalaj',
  normalizar: 'normaliz',
  grafia: 'graf',
  provincia: 'provinc',
  localidad: 'localidad',
  remitente: 'remitent',
  esquina: 'esquin',
  transporte: 'transport',
  personalizada: 'personaliz',
  deposito: 'deposit',
  recogida: 'recogid',
  sucursal: 'sucursal',
  acuse: 'acuse',
  diurno: 'diurn',
  nocturno: 'nocturn',
  domicilio: 'domicili',
  aereos: 'aere',
  terrestres: 'terrestr',
  siguiente: 'siguient',
  fijada: 'fij'
};

/* Sinónimos: el anverso puede apuntar al término con otra palabra
 * (mezcla → mixta,|work|trabajo → empleo). */
/* Une varios mapas de sinónimos en uno: si una clave aparece en dos
 * trozos, sus listas se suman. Sin esto, una clave repetida dentro de un
 * literal de objeto se perdería en silencio (gana la última definición). */
function mergeMaps(maps) {
  var out = {};
  maps.forEach(function (m) {
    Object.keys(m).forEach(function (k) {
      out[k] = (out[k] || []).concat(m[k]);
    });
  });
  return out;
}
var SINONIMOS = mergeMaps([
  {
  organigrama: ['diagrama', 'esquema', 'plano'],
  jerarquica: ['autoridad', 'rango', 'jefe', 'mando'],
  funcional: ['funciones'],
  mixta: ['mezcla', 'mezclar'],
  divisiones: ['divide', 'division', 'zona'],
  planificacion: ['plan'],
  organizacion: ['organiza', 'reparte', 'estructura'],
  direccion: ['dirige', 'guia'],
  coordinacion: ['coordinan', 'acuerdo', 'juntos'],
  control: ['controla', 'comprueba', 'revisa', 'seguimiento', 'vigila', 'comprobacion'],
  empleo: ['trabajo', 'trabajadores'],
  riqueza: ['crece', 'crecer', 'crezca', 'crezca', 'dinero'],
  riesgos: ['arriesga', 'arriesgo'],
  produccion: ['producir', 'fabrica', 'fabricar'],
  formal: ['escrita', 'escrito', 'papel', 'oficial', 'normas'],
  informal: ['espontanea', 'surge', 'sola', 'pactado', 'sin nada'],
  materiales: ['medios', 'maquinas', 'dinero', 'herramientas'],
  humanos: ['personas'],
  bienes: ['productos', 'cosas'],
  servicios: ['presta', 'ofrece'],
  necesidades: ['necesita', 'necesitan'],
  beneficios: ['gana', 'ganar', 'dinero'],
  tamano: ['enorme', 'medianos', 'pocos', 'diminuta', 'diminuto', 'mitad', 'medio'],
  gran: ['enorme', 'grande', 'grandes', 'rascacielos', 'muchos'],
  mediana: ['mitad', 'medio', 'medianos', 'intermedio'],
  pequena: ['pocos', 'pocas', 'pequenas', 'casa', 'piso'],
  microempresa: ['diminuta', 'diminuto', 'minuscula', 'pequenisima'],
  primario: ['primero', 'primera', 'naturaleza', 'cultivan'],
  secundario: ['segundo', 'segunda', 'transforma', 'fabrican'],
  terciario: ['tercero', 'tercera', 'presta'],
  local: ['barrio', 'pueblo', 'ciudad', 'sitio', 'cerca'],
  locales: ['barrio', 'pueblo', 'ciudad'],
  nacional: ['pais', 'espana'],
  nacionales: ['pais', 'espana'],
  internacional: ['paises', 'mundo', 'europa', 'america'],
  internacionales: ['paises', 'mundo', 'europa', 'america'],
  publicas: ['estado', 'ciudad'],
  privadas: ['duenos', 'particulares', 'jardin'],
  publica: ['estado', 'ciudad'],
  privada: ['particulares', 'duenos', 'jardin'],
  individual: ['persona', 'solo', 'sola', 'uno'],
  sociedad: ['asocian', 'juntos', 'grupo', 'varios'],
  supervisar: ['revisa', 'vigila', 'comprueba'],
  dirigir: ['rumbo', 'manda', 'guia'],
  controlar: ['vigila', 'controla'],
  clasificacion: ['clasifica', 'criterio'],
  comercial: ['vende', 'vender', 'venta', 'publicitario', 'publicidad', 'cliente', 'mostrador'],
  finanzas: ['dinero', 'cuentas', 'gastos', 'pagos', 'inversion', 'prestamo'],
  financiero: ['dinero', 'cuentas', 'ingresos', 'pagos'],
  contable: ['cuentas', 'factura', 'contabilidad', 'libreta'],
  administracion: ['administra', 'archivo', 'correspondencia', 'cartas'],
  almacen: ['guarda', 'guardar', 'guardado', 'existencias', 'trastero'],
  compras: ['comprar', 'compra', 'materiales', 'proveedores'],
  ventas: ['vender', 'vende', 'venta', 'cliente'],
  },
  {
  direccion: ['dirige', 'objetivos', 'planes', 'capitan'],
  recursos: ['personas', 'personal', 'contratar', 'nominas', 'formacion', 'trabajadores'],
  },
  {
  humanos: ['personas', 'personal', 'trabajadores'],
  departamentos: ['division', 'divisiones'],
  jerarquia: ['manda', 'depende', 'arriba', 'abajo', 'tronco'],
  general: ['todas', 'todos', 'encima', 'arriba'],
  },
  {
  organigrama: ['esquema', 'diagrama', 'cajas', 'plano', 'estructura'],
  },
  {
  produccion: ['fabrica', 'producir', 'transforma', 'materias', 'productos'],
  escritas: ['escrito', 'por escrito', 'papel', 'pantalla', 'texto'],
  escrita: ['escrito', 'por escrito', 'texto', 'papel'],
  externa: ['fuera', 'sale', 'clientes', 'proveedores', 'entorno'],
  interna: ['dentro', 'propia', 'entre ellos'],
  vertical: ['sube', 'baja', 'arriba', 'abajo'],
  descendente: ['baja', 'abajo'],
  ascendente: ['sube', 'arriba'],
  horizontal: ['misma linea', 'mismo nivel', 'iguales'],
  diagonal: ['cruza', 'distintos niveles'],
  },
  {
  formal: ['oficial', 'normas', 'previsto', 'estructurada'],
  },
  {
  informal: ['charla', 'nadie lo anota', 'sin normas'],
  oral: ['voz', 'habla', 'escucha', 'hablar'],
  verbal: ['palabras', 'gestos'],
  memorando: ['nota', 'nota interior'],
  aviso: ['avisa', 'anuncia', 'cartel'],
  circular: ['recorre', 'todos', 'a la vez'],
  oficio: ['oficial', 'sellado'],
  informe: ['informa', 'datos', 'hechos', 'conclusiones'],
  acta: ['acuerdos', 'acuerdo', 'registro'],
  manual: ['libro', 'reglamento', 'cuaderno de normas'],
  newsletter: ['revista', 'noticias'],
  correo: ['buzon', 'mensajes', 'internet'],
  electronico: ['internet', 'pantalla', 'ordenadores', 'red'],
  reuniones: ['se junta', 'reunion', 'junta'],
  intranet: ['red interna', 'dentro', 'de la casa'],
  sugerencias: ['se les ocurre', 'ideas'],
  quejas: ['les molesta', 'queja', 'molesta'],
  encuestas: ['pregunta', 'opinan', 'hoja'],
  tablon: ['cartel', 'colgado', 'avisos'],
  anuncios: ['cartel', 'aviso', 'avisos'],
  redes: ['facebook', 'twitter', 'instagram'],
  sociales: ['facebook', 'twitter', 'instagram', 'grupo'],
  mensajeria: ['mensajes', 'al momento', 'aplicacion'],
  instantanea: ['al momento', 'inmediato'],
  formas: ['buzon', 'lista de preguntas', 'charla a solas', 'escrito con datos', 'reunion'],
  dificultades: ['despacio', 'tarda', 'demasiada', 'roces', 'contradicen', 'hace caso'],
  lenta: ['despacio', 'tarda'],
  retrasos: ['retrasa', 'tarda'],
  necesidad: ['contestar', 'contesta'],
  respuesta: ['contestar', 'contesta'],
  rapida: ['al momento', 'rapido'],
  inseguridad: ['no sabes', 'no se sabe', 'estar seguro'],
  recepcion: ['alguien la recibe', 'lo leer'],
  exceso: ['demasiada', 'mucha'],
  aceptar: ['hace caso', 'acepta'],
  contradictorias: ['contradicen'],
  transmision: ['lenta', 'tarda'],
  caracter: ['charla', 'sin papeles'],
  rivalidad: ['roces', 'llevan bien'],
  ordenes: ['instrucciones', 'trabajo a cada uno', 'reparto'],
  programacion: ['trabajo a cada uno', 'mandando un trabajo'],
  tareas: ['trabajo a cada uno', 'haciendo', 'trabajos'],
  recomendaciones: ['consejo', 'aconseja'],
  instrucciones: ['instrucciones', 'dando instrucciones'],
  informes: ['papel con los datos', 'escrito con datos'],
  comunicados: ['escrito para todos'],
  entrevistas: ['charla a solas'],
  buzon: ['buzon', 'recados'],
  },
  {
  comercial: ['clientes', 'proveedores', 'tratar con'],
  empresa: ['dentro', 'misma', 'propia'],
  cabecera: ['arriba', 'primero'],
  pie: ['abajo', 'ultimo'],
  cuerpo: ['pide', 'que pide'],
  membrete: ['papel', 'entidad'],
  numero: ['codigo'],
  asunto: ['tema'],
  fecha: ['dia'],
  firma: ['quien la pone', 'rubro', 'pone'],
  recibo: ['resguardo'],
  },
  {
  intranet: ['red', 'interna', 'casa'],
  informar: ['informa', 'saben', 'sepan', 'enteran', 'enterarse', 'avisa'],
  coordinar: ['de acuerdo', 'pongan'],
  funciones: ['cada uno', 'que hace'],
  resultados: ['como va la empresa'],
  objetivos: ['a donde se va', 'destino'],
  actividades: ['como va la empresa'],
  },
  {
  publica: ['estado', 'ayuntamiento', 'privada'],
  basica: ['siempre', 'lo de siempre'],
  urgente: ['prisa', 'corre prisa', 'rapidez', 'brevedad'],
  paqueteria: ['paquetes', 'cajas grandes', 'objetos'],
  economica: ['cuesta menos', 'barato', 'tarda mas'],
  telegraphicos: ['cable', 'telegrafo', 'telefono'],
  gestion: ['buzon', 'apartado'],
  },
  {
  buzon: ['buzon', 'apartado', 'caja con tu nombre'],
  carta: ['escribir'],
  tarjeta: ['postal'],
  postal: ['postal'],
  notificacion: ['tramite oficial'],
  administrativa: ['tramite oficial'],
  expres: ['envio mas rapido', 'mas rapido'],
  valija: ['bolsa de lona', 'bolsas de correo'],
  producto: ['producto', 'paquete'],
  azul: ['paquete de color', 'color'],
  paquete: ['paquete', 'cajas'],
  publicorreo: ['propaganda'],
  publibuzon: ['correo para el buzon'],
  creamailing: ['cartas personalizadas'],
  libros: ['libros'],
  periodicas: ['revistas'],
  fax: ['telefono'],
  burofax: ['entrega registrada', 'papel que llega'],
  telegrama: ['mensaje muy corto', 'por el cable'],
  casillero: ['caja con tu nombre', 'caja'],
  titular: ['tu nombre'],
  certificado: ['firmar', 'firma', 'indemnizacion'],
  reembolso: ['quien recibe es quien paga', 'paga el importe'],
  destinatario: ['quien recibe', 'quien lo espera', 'quien manda', 'recibe', 'el que recibe'],
  digital: ['internet'],
  embalaje: ['embalaje'],
  normalizar: ['normas de dimensiones'],
  grafia: ['letra', 'clara', 'verse bien'],
  provincia: ['lugar mas grande'],
  localidad: ['pueblo', 'codigo'],
  remitente: ['quien manda', 'rincon'],
  esquina: ['rincon', 'arriba a la izquierda'],
  personalizada: ['a tu medida', 'a medida'],
  deposito: ['mostrador', 'deja el paquete'],
  recogida: ['lo recoge', 'punto de recogida'],
  sucursal: ['punto de recogida de su ciudad'],
  acuse: ['llaman por telefono', 'le llaman'],
  diurno: ['de dia'],
  nocturno: ['de noche'],
  domicilio: ['casa del cliente', 'a casa'],
  aereos: ['por el aire'],
  terrestres: ['por tierra'],
  siguiente: ['un dia despues', 'dia despues'],
  fijada: ['a la hora', 'hora que has pactado'],
  urgencia: ['prisa'],
  },
  {
  expres: ['rapido', 'rapida'],
  },
  {
  valija: ['lona', 'bolsa'],
  },
  {
  telegrama: ['cable', 'telegrafos', 'corto'],
  resistir: ['rompa'],
  peso: ['rompa', 'dentro'],
  calidad: ['confianza'],
  material: ['confianza', 'articulos', 'consumible', 'consume', 'almacen', 'lo que hay'],
  forma: ['case'],
  },
  {
  tamano: ['case'],
  armonizado: ['case'],
  },
  {
  producto: ['lleva'],
  mecanismo: ['maquinas'],
  mecanizacion: ['maquinas'],
  manipular: ['trabajar', 'prepara'],
  automaticamente: ['nadie'],
  sistemas: ['maquinas'],
  adoptar: ['maquinas'],
  entienda: ['clara'],
  lea: ['verse'],
  facilmente: ['bien', 'primera'],
  contacting: ['llamas'],
  llevando: ['vas'],
  envio: ['paquete', 'mandar'],
  cliente: ['quien manda'],
  oficina: ['mostrador'],
  },
  {
  mensajeria: ['empresa'],
  },
  {
  destinatario: ['quien lo espera', 'quien recibe'],
  },
  {
  sucursal: ['punto'],
  destino: ['ciudad'],
  llamada: ['llaman'],
  },
  {
  remitente: ['quien mando'],
  mismo: ['jornada', 'solo'],
  dia: ['jornada', 'manana'],
  empleados: ['trabajadores'],
  desplazan: ['van'],
  },
  {
  domicilio: ['casa'],
  medios: ['aire', 'tierra'],
  },
  {
  aereos: ['aire'],
  },
  {
  terrestres: ['tierra'],
  entrega: ['llega'],
  },
  {
  siguiente: ['manana'],
  mensajero: ['repartidor'],
  exclusiva: ['fijo'],
  tiempo: ['rato', 'dias', 'antes', 'momento', 'pronto', 'tarde', 'semanas', 'meses'],
  horario: ['rato'],
  pactados: ['pacteis'],
  devolver: ['vuelva'],
  documentos: ['papeles', 'cosas', 'hojas', 'escritos'],
  remitentes: ['mando'],
  inmediata: ['enseguida'],
  envios: ['cajas'],
  expedicion: ['expidan'],
  sucursales: ['oficinas'],
  entidad: ['empresa'],
  hora: ['cita', 'momento'],
  acordada: ['pactado', 'momento'],
  },
  {
  fijada: ['cita', 'momento'],
  },
  {
  aviso: ['nota'],
  },
  {
  recibo: ['nota', 'papel'],
  distintivo: ['etiqueta'],
  fungible: ['consumible', 'consume', 'consumen', 'gasta', 'gastan', 'gastado', 'consumo'],
  },
  {
  oficina: ['despacho', 'mostrador', 'trabajo'],
  equipos: ['maquinas', 'dispositivos', 'aparatos', 'equipo'],
  equipo: ['maquinas', 'maquina', 'dispositivos', 'aparatos'],
  duraderos: ['dura', 'duran', 'anos', 'permanecen'],
  ahorran: ['ahorra', 'ahorrar', 'menos', 'facilita'],
  trabajo: ['tareas', 'faena', 'labor'],
  mantener: ['revisar', 'revisas', 'revisarlo', 'revisarlas', 'reparar', 'mantenimiento'],
  ordenadores: ['software', 'aplicaciones', 'informatico', 'archivos', 'procesador'],
  impresoras: ['papel', 'cartuchos', 'tinta', 'toner', 'imprimir', 'sacan'],
  fotocopiadoras: ['copia', 'copian', 'copiar', 'reproduce', 'duplicado', 'sacan'],
  escaneres: ['digitalizan', 'digitaliza', 'digital', 'archivo', 'papel'],
  telefonos: ['llamar', 'llamada', 'mensajes', 'comunicar', 'hablar', 'contacto'],
  multifuncion: ['varias', 'multiples', 'funciones', 'imprime', 'escanea', 'copia'],
  operativas: ['puesto', 'trabajo', 'propia', 'cada'],
  auxiliares: ['guardar', 'guarda', 'apoyo', 'complementarias', 'cosas'],
  reunion: ['junta', 'juntan', 'gente', 'grande', 'todos', 'reunirse'],
  sillas: ['asiento', 'asientos', 'respaldo', 'sentarse'],
  ergonomicas: ['salud', 'espalda', 'postura', 'adapta', 'sostiene', 'cuerpo', 'comodo'],
  custodian: ['guardar', 'guarda', 'guardan', 'almacen', 'archivo', 'mueble'],
  agenda: ['cuaderno', 'planificador', 'citas', 'calendario', 'libreta'],
  orden: ['ordenados', 'ordena', 'ordenar', 'alfabetico', 'numerico', 'criterio'],
  alfabetico: ['apellido', 'autor', 'letras', 'abecedario'],
  numerico: ['numero', 'numeros', 'cifra', 'codigo'],
  registro: ['libro', 'apunta', 'anota', 'control', 'entra', 'sale'],
  entrada: ['entra', 'entrantes', 'llega'],
  salida: ['sale', 'sali', 'salidas'],
  },
  {
  firma: ['quien la pone', 'rubro', 'pone', 'escrito', 'mano', 'identifique', 'autografo', 'rastro'],
  sello: ['marca', 'confirme', 'circulo', 'tinta', 'sellar'],
  avisos: ['aviso', 'cartel', 'urgente', 'pendiente'],
  horarios: ['turnos', 'jornadas', 'franjas'],
  continuo: ['diario', 'seguido', 'cada'],
  existencias: ['almacen', 'guardado', 'stock'],
  inventario: ['recuento', 'cuenta', 'censo', 'contar', 'listado'],
  },
  {
  bienes: ['productos', 'cosas', 'todo', 'tiene', 'empresa'],
  maquinaria: ['maquinas', 'aparatos'],
  mobiliario: ['muebles', 'mesas', 'sillas'],
  pedido: ['pide', 'pedir', 'encargar', 'compra', 'encargo'],
  generar: ['hacer', 'crear', 'prepara', 'pide', 'encargar'],
  escasea: ['falta', 'poco', 'acaba', 'termina'],
  },
  {
  objetivos: ['a donde se va', 'destino', 'metas', 'fines', 'propositos'],
  },
  {
  necesidades: ['necesita', 'necesitan', 'falta', 'falte', 'cuanto'],
  pedir: ['pide', 'pedirlo', 'encargar', 'compra'],
  almacenar: ['guardar', 'guarda', 'almacen', 'guardarlo'],
  },
  {
  controlar: ['vigila', 'controla', 'revisa', 'comprueba', 'vigilar', 'seguimiento'],
  consume: ['consumen', 'consume', 'gastan', 'gasta', 'gastado', 'consumo'],
  uso: ['utilizar', 'usar', 'emplear', 'usarlo', 'usarlos', 'usada', 'usado'],
  dura: ['durar', 'duran', 'duradero', 'anos'],
  saber: ['calcular', 'cuanto'],
  desperdicio: ['tirar', 'estra', 'desperdicia', 'desperdicie', 'desperdiciar'],
  /* Vocabulario del tema 5: material fungible y no fungible, inventario
   * general y sus cuatro objetivos. El anclo es la raíz o el sinónimo
   * cercano de cada palabra de contenido de la respuesta. */
  gasta: ['gastan', 'gastar', 'gastado', 'gasto', 'consumen'],
  deteriora: ['estropean', 'estropea', 'dano', 'dana', 'dan', 'rompen', 'peor'],
  desaparece: ['pierden', 'pierde', 'perdio', 'extravia', 'no aparece'],
  desgaste: ['desgasta', 'desgastarse', 'gastado', 'gasta'],
  muchos: ['muchas', 'varios', 'varias', 'bastantes', 'tanti', 'demasiados'],
  anos: ['semanas', 'meses', 'duracion', 'largo'],
  aparato: ['maquina', 'maquinas', 'equipo', 'equipos', 'dispositivo', 'dispositivos']
  },
  {
  /* Tema 1 de Itinerario Personal para la Empleabilidad (IPP): seguridad y
   * salud en el trabajo. El ancla es la palabra del anverso que devuelve el
   * término: por raíz o por sinónimo cercano. */
  prevencion: ['evitar', 'evita', 'prevenir', 'proteger', 'protegerse', 'accidentarse'],
  riesgos: ['peligro', 'peligros', 'peligroso', 'dano', 'accidente', 'accidentarse', 'premio'],
  riesgo: ['peligro', 'peligros', 'peligroso', 'dano', 'premio', 'posibilidad', 'suerte'],
  peligro: ['dano', 'peligroso', 'peligrosos', 'avisa', 'aviso', 'signo',
    'exclamacion', 'graves'],
  laborales: ['trabajo', 'trabajador', 'laboral', 'empresa'],
  salud: ['encuentras', 'encontrar', 'cuerpo', 'sano', 'enfermar', 'dolor', 'bien', 'equipo'],
  bienestar: ['bien', 'tranquilo', 'energia', 'claro', 'sientes', 'gusto', 'descansar'],
  fisico: ['cuerpo', 'musculos', 'fuerza', 'fuerzas', 'brazos', 'postura'],
  fisica: ['cuerpo', 'musculos', 'fuerza', 'fuerzas', 'brazos', 'postura'],
  fisicos: ['energia', 'formas', 'sonido', 'luz', 'calor', 'rayos'],
  mental: ['cabeza', 'pensar', 'piensa', 'piensas', 'sientes', 'cerebro', 'cansa', 'concentracion'],
  mentales: ['cabeza', 'pensar', 'piensa', 'cerebro', 'concentracion'],
  social: ['gente', 'companeros', 'colegas', 'demas', 'juntos', 'gusto'],
  psicosociales: ['sientes', 'emocional', 'psicologico', 'mente', 'sentimiento', 'gente'],
  seguridad: ['rodea', 'materiales', 'objetos', 'puesto', 'herramientas', 'suelo', 'pared', 'a salvo', 'seguro'],
  condiciones: ['conjunto', 'caracteristicas', 'puesto', 'detalles', 'circunstancias', 'entorno', 'agrupadas'],
  lugares: ['zonas', 'sitio', 'areas', 'sitios', 'espacio'],
  lugar: ['zonas', 'sitio', 'areas', 'sitios', 'espacio'],
  maquinas: ['aparato', 'instrumento', 'instalacion', 'equipo', 'utiles'],
  herramientas: ['aparato', 'instrumentos', 'instalacion', 'objetos', 'utiles'],
  electrico: ['corriente', 'cable', 'electricidad', 'luz'],
  incendio: ['fuego', 'llamas', 'llama', 'fuegos', 'arder'],
  agentes: ['sustancias', 'germenes', 'virus', 'bacterias', 'seres', 'factores', 'elementos', 'formas'],
  quimicos: ['sustancia', 'sustancias', 'comporta', 'comportamiento', 'producto', 'liquido'],
  biologicos: ['germenes', 'virus', 'bacterias', 'seres', 'microbios'],
  fisicoquimicas: ['comporta', 'comportamiento', 'presion', 'fisicas', 'propiedades', 'aspecto'],
  quimicas: ['transforman', 'transforma', 'mezclan', 'mezclarse', 'reaccion', 'cambian'],
  toxicologicas: ['sustancia', 'danino', 'dano', 'enferma', 'moho', 'veneno', 'contamina'],
  peligroso: ['peligro', 'peligros', 'danino', 'malo'],
  medio: ['entorno', 'natural', 'aire', 'agua', 'ecologico', 'naturaleza'],
  medioambiente: ['entorno', 'natural', 'aire', 'agua', 'ecologico', 'naturaleza', 'rodea'],
  presion: ['apretado', 'apretada', 'empujado', 'comprimido', 'botella'],
  gas: ['botella', 'cilindro', 'botellon', 'metalon'],
  explosivo: ['estalla', 'estallido', 'reventar', 'revienta', 'explosion', 'detona'],
  comburente: ['arder', 'arde', 'arda', 'oxida', 'oxidar', 'aviva'],
  inflamable: ['prende', 'fuego', 'arder', 'quema', 'llama'],
  corrosivo: ['destruye', 'destruir', 'come', 'corroe', 'corroer', 'ataca', 'disuelve'],
  toxicidad: ['danino', 'toxico', 'envenena', 'mata', 'mortal', 'peligroso'],
  grave: ['serio', 'serios', 'seria', 'mortal', 'permanente', 'graves'],
  exposicion: ['contacto', 'contactarse', 'expuesto', 'rodeado', 'cerca', 'alrededor'],
  carga: ['peso', 'pesa', 'cargar', 'exige', 'pide', 'demanda'],
  ergonomia: ['postura', 'incmoda', 'incmodo', 'adaptado', 'comodo', 'movimiento', 'mueves', 'mover', 'cuerpo'],
  ergonomicos: ['postura', 'incmoda', 'incmodo', 'adaptado', 'comodo', 'movimiento', 'mueves', 'mover', 'cuerpo'],
  forzadas: ['encorvado', 'encorvada', 'encorvados', 'encorvadas', 'doblado', 'torpe',
    'incmodo', 'agachado', 'forzado'],
  posturas: ['forma', 'encorvado', 'encorvada', 'doblado', 'agachado', 'torpe',
    'manera de estar'],
  esfuerzo: ['cargar', 'peso', 'cansa', 'cansan', 'fuerza', 'fuerzas', 'trabajo', 'mover'],
  movimientos: ['mover', 'gesto', 'gestos', 'mano', 'teclear', 'repetir'],
  repetitivos: ['repetir', 'repite', 'repetidos', 'mismo', 'gesto', 'gestos', 'siempre'],
  conocer: ['identificar', 'identificas', 'saber', 'distinguir', 'mirar'],
  protegerse: ['cubrir', 'cubrirse', 'cubierto', 'ponerse', 'guardarse', 'cubres',
    'cubre'],
  trabajo: ['trabajo', 'jornada', 'puesto', 'tareas', 'turno', 'haces'],
  ruido: ['sonido', 'estruendo', 'ruidoso', 'oidos'],
  iluminacion: ['luz', 'alumbra', 'alumbrar', 'bombilla', 'vista'],
  radiaciones: ['rayos', 'rayo', 'radiacion', 'sol'],
  vibraciones: ['temblores', 'temblor', 'vibrar', 'cosquilleo'],
  temperatura: ['calor', 'frio', 'grados', 'helado'],
  manual: ['manos', 'mano', 'a mano'],
  manipulacion: ['mueve', 'mover', 'cargar', 'coge', 'agarra']
  },
  {
  /* Tema 2 de Itinerario Personal para la Empleabilidad (IPP): técnicas de
   * prevención y protección. */
  equipos: ['cada uno', 'lo suyo', 'suya', 'prendas', 'ropa', 'elementos'],
  individual: ['cada uno', 'suyo', 'suya', 'propia', 'una sola persona', 'cada persona'],
  obligatorios: ['tiene que', 'hay que', 'no es opcional', 'obligatorio', 'obligatoria', 'siempre'],
  casco: ['cabeza', 'craneo', 'techo'],
  cascos: ['ruido', 'sonido', 'silencio', 'orejeras'],
  gafas: ['ojos', 'vista', 'mirada', 'cristales', 'lentillas'],
  guantes: ['manos', 'mano', 'dedos'],
  mascarilla: ['pulmones', 'aire', 'respirar', 'boca', 'nariz', 'cara'],
  filtro: ['retiene', 'filtra', 'deja pasar el aire', 'se queda con'],
  botas: ['pies', 'tobillos', 'suela'],
  reflectante: ['bandas', 'brillantes', 'brilla', 'refleja', 'visible', 'cintas', 'luz'],
  tapones: ['ruido', 'sonido', 'silencio', 'orejeras', 'silencioso'],
  oidos: ['ruido', 'sonido', 'orejeras', 'silencio'],
  integrar: ['incluye', 'incluir', 'mete', 'meter', 'incorpora', 'incorporar', 'en todo'],
  identificar: ['localizar', 'localiza', 'reconocer', 'reconoce', 'hallar', 'detectar'],
  evaluar: ['estudia', 'estudiar', 'juzga', 'juzgar', 'gravedad', 'apreciar', 'analiza', 'valorar', 'reducir'],
  adoptar: ['decide', 'toma', 'elige', 'aplica', 'pone en marcha'],
  medidas: ['decidir', 'acciones', 'que hacer', 'pasos'],
  tecnicas: ['grupo', 'grupos', 'conjunto', 'formas', 'maneras', 'metodos', 'pasos'],
  proteccion: ['despues', 'posterior', 'reduce el dano', 'cubre', 'tapa', 'protege', 'escudo'],
  persona: ['ti', 'personas', 'gente', 'trabajador', 'expuesto', 'alguien'],
  colectiva: ['todas', 'todos', 'a la vez', 'grupo', 'conjunto', 'cualquiera', 'varias personas'],
  colectivas: ['todas', 'todos', 'a la vez', 'grupo', 'conjunto', 'cualquiera', 'varias personas'],
  barandillas: ['valla', 'borde', 'alto', 'alta', 'caer', 'caiga', 'altura', 'pasamanos'],
  redes: ['mallas', 'malla', 'sujetan', 'sujeta', 'engancha', 'atrapa', 'caer', 'caiga', 'tela'],
  ventilacion: ['aire', 'viciado', 'renovar', 'renueva', 'respirar', 'circula', 'entra'],
  extintor: ['apagar', 'apaga', 'fuego', 'fuegos', 'rocia', 'manguera', 'sober'],
  salida: ['puerta', 'salir', 'deprisa', 'escapar', 'huir', 'evacuar', 'libre'],
  emergencia: ['incendio', 'fuego', 'accidente', 'urgencia', 'desastre'],
  empresario: ['empresa', 'dueño', 'patron', 'jefe', 'negocio', 'tienda', 'responsable'],
  trabajador: ['persona', 'cada uno', 'conductor', 'empleado', 'operario', 'personal', 'gente'],
  delegado: ['representa', 'representante', 'eligen', 'elegido', 'votan', 'habla por', 'defiende'],
  servicio: ['equipo', 'asesora', 'asesorar', 'tecnico', 'medico', 'atencion', 'asesoramiento'],
  prohibicion: ['tachado', 'tachada', 'prohibido', 'prohibida', 'no fumar', 'no pasar', 'circulo', 'veta'],
  advertencia: ['triangulo', 'amarillo', 'avisa', 'advierte', 'peligro', 'avisos', 'aviso'],
  obligacion: ['obligatorio', 'hay que', 'llevarlo', 'llevar', 'puesto', 'azul', 'implica'],
  salvamento: ['botiquin', 'verde', 'socorro', 'auxilio', 'cruce', 'asistencia', 'curar', 'flecha'],
  avisa: ['carteles', 'avisos', 'indican', 'informan', 'avisan'],
  sustituye: ['sustituye', 'sustituir', 'no seca', 'no quita', 'quitan', 'remplaza', 'sigue ahi'],
  senalizacion: ['carteles', 'senales', 'avisos', 'indica', 'indican', 'avisar', 'avisa', 'rotulo'],
  formacion: ['enseña', 'enseñar', 'aprende', 'explicar', 'informa', 'informar', 'aprender', 'clase', 'curso'],
  informacion: ['informa', 'informar', 'avisa', 'datos', 'noticias'],
  mantenimiento: ['revisar', 'revisa', 'arreglar', 'arregla', 'reparar', 'conservar', 'fallan', 'fallen', 'cuida'],
  evitar: ['elimina', 'eliminar', 'quita', 'quitar', 'se quita', 'no exista', 'apartar', 'primero'],
  combatir: ['quita', 'elimina', 'ataca', 'lucha', 'aparta', 'origen', 'fuente'],
  origen: ['origen', 'fuente', 'maquina', 'donde', 'empezando'],
  evolucion: ['nuevas', 'nueva', 'moderna', 'actualizada', 'de hoy', 'mejor', 'mejora', 'progreso'],
  tecnica: ['herramientas', 'herramienta', 'tecnologia', 'equipo', 'maquinas', 'moderno', 'utiles'],
  planificar: ['organiza', 'organizar', 'ordena', 'prepara', 'preparar', 'improvisar', 'plan', 'programa'],
  proteger: ['protegen', 'protege', 'proteger', 'cubre', 'tapa'],
  individualmente: ['una persona', 'cada uno', 'solo', 'individual', 'suya'],
  instrucciones: ['explica', 'normas', 'consignas', 'explicado', 'indicaciones', 'entiendan'],
  claras: ['claro', 'claras', 'facil', 'entender', 'entiendan', 'simple'],
  trabajadores: ['personas', 'todos', 'cada uno', 'gente'],
  fisico: ['ruido', 'calor', 'vibraciones', 'sonido', 'temperatura', 'electricidad'],
  quimico: ['gases', 'liquidos', 'quemar', 'envenena', 'sustancias', 'productos', 'acidos'],
  biologico: ['virus', 'bacterias', 'microorganismo', 'germenes', 'microbios', 'contagio'],
  ergonomico: ['dolor', 'espalda', 'cuello', 'posturas', 'postura', 'peso', 'cargar', 'cuerpo', 'agachado'],
  psicosocial: ['estres', 'agotamiento', 'acoso', 'ambiente', 'emocional', 'ansiedad', 'miedo', 'mental'],
  organizacion: ['ordena', 'ordenado', 'organiza', 'reparte', 'repartir', 'pausas', 'limpio', 'coordina']
  },
  {
  /* Tema 3 de Itinerario Personal para la Empleabilidad (IPP): técnicas
   * básicas y primeros auxilios. */
  cuidados: ['cuida', 'curar', 'atender', 'asistencia', 'lo que hagas', 'tira'],
  antes: ['mientras', 'durante', 'hasta que', 'previamente'],
  ayuda: ['ambulancia', 'auxilio', 'socorro', 'asistencia', 'ayudas'],
  medica: ['ambulancia', 'medico', 'sanitario', 'hospital', 'profesional', 'numero unico'],
  decisivos: ['deciden', 'decide', 'cambia', 'clave', 'importante', 'resultado'],
  evolucion: ['como acaba', 'como termina', 'desenlace', 'desarrollo', 'estado'],
  valoracion: ['comprobacion', 'comprobar', 'compruebas', 'revisar', 'examinar', 'inicial'],
  primaria: ['inicial', 'primero', 'primera', 'antes de tocar nada'],
  112: ['numero unico', 'emergencias', 'ambulancia', 'telefono', 'marcar'],
  usar: ['utilizar', 'emplear', 'abrir', 'coger', 'echar mano'],
  botiquin: ['armario', 'maletin', 'caja', 'kit', 'caja de herramientas', 'material'],
  mover: ['mueve', 'movarla', 'mover', 'tocar', 'arrastrar'],
  persona: ['ella', 'el herido', 'alguien', 'el accidentado', 'la persona'],
  parar: ['cortar', 'frenar', 'tapar', 'detener', 'parar'],
  hemorragia: ['sangra', 'sangrado', 'sangre', 'cortar la sangre', 'derramar'],
  calma: ['tranquilo', 'sereno', 'sin agobios', 'frio', 'con calma'],
  sabes: ['nunca', 'hecho', 'practica', 'no controlas', 'sin practica', 'experiencia'],
  comida: ['comer', 'alimentar', 'dar de comer', 'le das de comer', 'meterle nada'],
  bebida: ['beber', 'liquido', 'dar de beber', 'le das de beber'],
  lado: ['costado', 'de costado', 'tumbada', 'acostada', 'girada', 'posicion'],
  colocarla: ['poner', 'tumbarla', 'acostarla', 'girarla', 'colocas', 'dejas', 'dejar'],
  masaje: ['bombear', 'bombearle', 'comprimir', 'apretar', 'presionar'],
  cardiaco: ['corazon', 'pecho', 'bombear', 'torax'],
  gasa: ['telas', 'compresa', 'aposito', 'pano', 'tela'],
  limpia: ['aseada', 'sin suciedad', 'nueva', 'impia', 'sin polvo'],
  poner: ['colocar', 'poner', 'echar', 'aplicar', 'cubre', 'tapar', 'cubrir'],
  otra: ['nueva', 'hoja', 'cambia', 'reemplaza', 'sucesora', 'otra'],
  encima: ['encima', 'sobre', 'arriba', 'cubrir', 'cubre', 'tapa'],
  elevar: ['subir', 'levantar', 'alzar', 'arriba', 'elevar'],
  parte: ['zona', 'sitio', 'miembro', 'extremidad', 'brazo', 'cuerpo'],
  sangra: ['sangra', 'sangrado', 'sangre', 'pierde sangre', 'derrama'],
  vanda: ['tira', 'cinta', 'enrolla', 'sujetar', 'tela', 'rrollo'],
  esteriles: ['sin germenes', 'esteril', 'asepticas', 'limpias', 'sin suciedad'],
  tijeras: ['cortar', 'hojas', 'instrumento', 'se cierran', 'dos hojas'],
  guantes: ['manos', 'protegerte las manos', 'cubrirte las manos'],
  desechables: ['de un solo uso', 'desechable', 'se tiran', 'tirar', 'desechar'],
  suero: ['agua con sal', 'sal', 'gotero', 'frasco', 'ampolla'],
  fisiologico: ['agua con sal', 'sal', 'gotero', 'frasco'],
  termometro: ['grados', 'medir la temperatura', 'fiebre', 'temperatura', 'mide'],
  tiritas: ['tiras', 'parches', 'pegamento', 'adhesivo', 'apositos', 'pequenas'],
  antiseptico: ['infecte', 'desinfecta', 'liquido', 'gel', 'no se infecte'],
  toser: ['tose', 'tos', 'tosiendo'],
  dejarla: ['dejar', 'no hacer nada', 'permitir', 'no molestarla'],
  maniobra: ['movimiento', 'empujon', 'tecnica', 'aprieta', 'empujar'],
  heimlich: ['empujon', 'empuja', 'aprieta hacia dentro', 'hacia dentro y hacia arriba', 'atragantamiento'],
  enfriar: ['bajar la temperatura', 'enfria', 'fresca', 'frio', 'grifo', 'agua'],
  agua: ['grifo', 'fresca', 'del grifo', 'fria'],
  fria: ['fresca', 'frio', 'helada', 'fresco'],
  reventarlas: ['pinchar', 'pincharlas', 'romper', 'rasgar', 'reventar', 'abrir'],
  pano: ['tela', 'tapa', 'cubrir', 'tapadora', 'limpia'],
  inmovilizar: ['sujetar', 'fijar', 'no mover', 'tabla', 'entablillar', 'quieto'],
  rigido: ['duro', 'firme', 'tabla', 'carton', 'entablillar'],
  llamar: ['llamar', 'telefono', 'marcar', 'avisa', 'pedir la ambulancia'],
  sujetar: ['agarras', 'agarrar', 'retener', 'sujetar fuerte', 'tirar de ella'],
  objetos: ['cosas', 'sillas', 'mesas', 'herramientas', 'lo que hay alrededor'],
  peligrosos: ['peligroso', 'peligro', 'danino', 'golpear'],
  esperar: ['espera', 'vigila', 'hasta que llegue', 'aguanta'],
  proteger: ['barrera', 'cuidarse', 'fuera de peligro', 'ponerse el casco', 'no tocar'],
  avisar: ['llamas', 'llamar', 'telefono', 'comunica', 'cuenta', 'enforma'],
  socorrer: ['actuar', 'actuas', 'auxiliar', 'auxilia', 'ayudar', 'atender'],
  conciencia: ['responde', 'responder', 'despierta', 'reacciona', 'hablar', 'toque', 'consciente'],
  respiracion: ['respira', 'respirar', 'pecho', 'aire', 'subirse y bajarse', 'oxigeno'],
  pulso: ['latido', 'latidos', 'carotida', 'golpes', 'sensacion']
  },
  {
  /* Tema 4 de Itinerario Personal para la Empleabilidad (IPP):
   * autoconocimiento y habilidades personales. */
  autoconocimiento: ['sabes', 'eres', 'reaccionas', 'quien eres', 'personalidad', 'como eres', 'tu mismo', 'mapa de ti', 'saber quien eres', 'te conoces'],
  reflexion: ['espejo', 'mirarte', 'adentro', 'dentro', 'piensas en ti', 'contigo mismo', 'mirarse'],
  gustos: ['te gusta', 'prefieres', 'gustan', 'lo que prefieres', 'apreciar'],
  preferencias: ['te gusta', 'prefieres', 'gusta', 'elegir', 'apreciar'],
  dan: ['soltura', 'destacas', 'destacar', 'fuerzas', 'facilidad', 'puntos fuertes'],
  cosas: ['tareas', 'habilidades', 'puntos', 'letras'],
  bien: ['soltura', 'se te da bien', 'bien', 'fuerzas', 'destacas'],
  mejora: ['mejorar', 'pulir', 'puntos debiles', 'perfeccion', 'deficit', 'fallos'],
  areas: ['zonas', 'partes', 'aspectos', 'que necesitas', 'lista'],
  cualidades: ['caracteristicas', 'positivas', 'como eres', 'rasgos', 'tu manera de ser', 'forma de ser'],
  personales: ['como eres', 'propias', 'tuyas', 'cada persona', 'personales'],
  responsabilidad: ['responder', 'respondes', 'actos', 'prometes', 'cumplir', 'compromiso'],
  puntualidad: ['llegar a la hora', 'a la hora', 'hora', 'a tiempo', 'pronto', 'no se retrasa'],
  amabilidad: ['tratar bien', 'educacion', 'respeto', 'amable', 'cortesia', 'buenos dias'],
  nervios: ['nervioso', 'nervios', 'te pones nervioso'],
  hablar: ['hablar', 'al hablar', 'hablando', 'decir', 'presentar'],
  publico: ['delante de la gente', 'la gente', 'delante', 'ante otros'],
  concentracion: ['concentrarte', 'concentrar', 'foco', 'atencion', 'cabeza'],
  intereses: ['te gustan', 'gustan', 'actividades', 'temas', 'experiencias'],
  naturaleza: ['campo', 'arboles', 'bosque', 'montana', 'verde', 'plantas', 'aire libre'],
  informatica: ['pantalla', 'raton', 'ordenador', 'tecnologia', 'software', 'internet', 'teclado'],
  valores: ['principios', 'creencias', 'guia', 'criterios', 'ideas', 'tomar decisiones'],
  respeto: ['tratar', 'tratarlo', 'dejarle sitio', 'consideracion', 'mirada', 'demas'],
  honestidad: ['verdad', 'decir la verdad', 'claro', 'sin mentir', 'franqueza', 'sin enganos'],
  esfuerzo: ['esforzarte', 'lo mejor posible', 'cada dia', 'mejor posible', 'dedicacion', 'constancia'],
  solidaridad: ['ayuda', 'ayudar', 'el que ayuda', 'sin esperar nada', 'apoyo', 'juntos', 'hermano'],
  habilidades: ['capacidades', 'sabes hacer', 'se desarrolla', 'aptitudes', 'destrezas', 'te sale bien'],
  tecnicas: ['se aprenden', 'aprendidas', 'se practican', 'duras', 'se aprende'],
  duras: ['se aprenden', 'aprendidas', 'se practican', 'tecnicas'],
  blandas: ['relacionarte', 'con la gente', 'sociables', 'de trato', 'nacen contigo', 'las otras'],
  sociales: ['relacionarte', 'demas', 'con la gente', 'grupo', 'los demas'],
  cocinar: ['receta', 'preparar la comida', 'libro de cocina', 'cocina', 'preparar platos'],
  manejar: ['raton', 'botones', 'teclado', 'pantalla', 'darle a los botones'],
  ordenador: ['raton', 'botones', 'teclado', 'pantalla', 'apagar', 'encender'],
  escribir: ['letras', 'pluma', 'papel', 'tinta', 'mano', 'sin faltas', 'bien puestas'],
  correctamente: ['sin faltas', 'bien', 'bien puestas', 'sin errores', 'correcto', 'letras'],
  usar: ['martillo', 'destornillador', 'manejar', 'clavar', 'atornillar', 'herramientas'],
  herramientas: ['martillo', 'destornillador', 'maza', 'cunas', 'instrumentos'],
  escuchar: ['prestar oido', 'oido', 'atiende', 'prestar atencion', 'lo que te dice'],
  atencion: ['prestar oido', 'sin mirar el movil', 'con cuidado', 'atiendo', 'no te pierdes'],
  equipo: ['companeros', 'ayudar', 'en clase', 'con otros', 'juntos', 'grupo', 'varios', 'todos', 'misma tarea'],
  resolucion: ['no se entienden', 'acuerdo', 'buscar un punto en comun', 'dialogo', 'mesa de dialogo'],
  conflictos: ['no se entienden', 'disputa', 'discusion', 'no se ponen de acuerdo', 'punto en comun'],
  base: ['cimiento', 'sostiene', 'se apoya', 'punto de partida', 'informe'],
  todo: ['cada', 'resto', 'lo de arriba', 'demas'],
  elegir: ['encaja', 'encontrar', 'opcion', 'decision'],
  puesto: ['sitio', 'encaja', 'que te viene bien', 'acertar'],
  mejorar: ['rendir mas', 'mejor', 'mejorable', 'rendir'],
  rendimiento: ['rendir', 'rinde', 'productivo', 'resultados', 'hacer mas', 'rendir mas'],
  comunicarte: ['entiendan', 'explicar', 'hablar', 'decir las cosas', 'te entiendan'],
  mejor: ['te entiendan', 'claro', 'bien', 'mejor que'],
  demas: ['gente', 'otros', 'quienes te escuchan', 'entiendan', 'los demas'],
  matriz: ['cuadrantes', 'tabla', 'herramienta', 'cuatro partes', 'cuadricula'],
  daf: ['cuatro partes', 'cuadrantes', 'herramienta', 'tabla', 'fuerzas'],
  fortalezas: ['bien', 'fuerzas', 'destacas', 'se te da bien', 'lo que haces bien', 'puntos fuertes', 'tus virtudes'],
  debilidades: ['puedes mejorar', 'mejorar', 'lo que te cuesta', 'puntos debiles', 'fallos'],
  oportunidades: ['ventajas', 'ofrece el entorno', 'a tu alrededor', 'buen momento', 'lo que ofrece'],
  amenazas: ['dano', 'fuera', 'hacerte dano', 'desde fuera', 'peligros', 'riesgos', 'lo que viene de fuera'],
  escuchate: ['piensa', 'sientes', 'contigo', 'mismo', 'hablar contigo mismo', 'tu interior', 'como te sientes'],
  pide: ['preguntar', 'pregunta', 'consultar', 'a personas de confianza', 'preguntarles'],
  opinion: ['como te ven', 'lo que piensan de ti', 'que piensan', 'ven en ti'],
  reflexiona: ['piensa', 'pensar', 'repasas', 'revisas', 'repasar', 'mirar atras'],
  cada: ['al final', 'jornada', 'todos los dias', 'todos'],
  dia: ['jornada', 'al final', 'todos los dias'],
  prueba: ['probar', 'pruebas', 'experimenta', 'intenta', 'nunca', 'probado'],
  nuevas: ['nunca', 'nuevo', 'no probadas', 'algo']
  },
  {
  /* Tema 5 de Itinerario Personal para la Empleabilidad (IPP):
   * habilidades personales (competencias, gestión emocional, comunicación,
   * escucha activa y entrevista). */
  habilidades: ['capacidades', 'puedes aprender', 'aprendes y desarrollas', 'sabes hacer', 'dan', 'bien'],
  mejorar: ['se pueden mejorar', 'mejoran', 'entrenamiento', 'aprendes'],
  pueden: ['puedes', 'se pueden', 'aprendes', 'desarrollas'],
  practica: ['repetir', 'cada dia', 'ensayar', 'entrenar', 'hacer todos los dias'],
  diaria: ['cada dia', 'todos los dias', 'a diario', 'repetir'],
  esfuerzo: ['entrenar', 'entrenamiento', 'perseverar', 'no parar', 'todos los dias'],
  constancia: ['todos los dias', 'siempre', 'no abandonar', 'perseverar', 'entrenar', 'nadie nace sabiendo'],
  formacion: ['aprendiendo', 'seguir', 'aprender', 'no dejas de aprender', 'formarte', 'estudiar', 'cursos'],
  continua: ['aprendiendo', 'vida', 'toda la vida', 'seguir', 'siempre'],
  comunicacion: ['enviar', 'recibir', 'mensajes', 'hablar', 'dialogo', 'transmision'],
  emisor: ['el que habla', 'quien envia', 'envia', 'mandas', 'el que manda'],
  receptor: ['el que escucha', 'quien recibe', 'recibe', 'el que oye'],
  mensaje: ['dicen', 'dice', 'manda', 'envia', 'lo que te dicen', 'lo que dice', 'lo que uno envia', 'lo que le dices'],
  convivencia: ['relacionan', 'grupo', 'convivir', 'viven juntos', 'juntos', 'conviven'],
  eficaz: ['entienda', 'se te entienda', 'sin malentendidos', 'claro', 'se entienda', 'te entiendan'],
  escucha: ['prestas', 'atencion', 'detalles', 'entender', 'atender', 'oido', 'no te pierdes'],
  activa: ['prestas', 'esfuerzo', 'detalles', 'entender', 'no te pierdes', 'toda la atencion'],
  atencion: ['prestas', 'miras', 'prestas atencion', 'no haces otra cosa', 'toda la atencion', 'concentrarte'],
  prestar: ['prestas', 'miras', 'no haces otra cosa', 'atender', 'concentrarte'],
  concentrarse: ['prestas', 'atencion', 'dicen', 'foco', 'concentrate', 'sin pensar en tu respuesta'],
  gestion: ['reconocer', 'regular', 'poner orden', 'controlar', 'lo que sientes'],
  emocional: ['tus emociones', 'lo que sientes', 'que sientes', 'emociones'],
  inteligencia: ['entender', 'comprender', 'otro nombre', 'el mismo concepto', 'saber que pasa dentro de ti'],
  reconocer: ['saber que sientes', 'que sientes', 'distingues', 'identificar', 'nombrear', 'saber'],
  emociones: ['sientes', 'que sientes', 'alegria', 'tristeza', 'enfado', 'miedo', 'lo que sientes', 'tus emociones'],
  regular: ['calmarte', 'calmar', 'desbordan', 'que no te dominen', 'controlar', 'frenarte'],
  expresar: ['comunicar', 'decir', 'contar', 'lo que sientes', 'manifestar', 'decirlo'],
  empatia: ['ponerte en el lugar del otro', 'lugar del otro', 'entender', 'siente', 'otro', 'como el otro'],
  motivacion: ['impulso', 'te mueve', 'empuje', 'deseo', 'seguir adelante', 'dificultades', 'animo'],
  autoconciencia: ['engañarte', 'momento', 'sientes', 'reconocer', 'sin engañarte'],
  asertividad: ['piensas', 'con calma', 'sin agredir', 'defender tu opinion', 'calma', 'agredir'],
  conducta: ['el raton', 'el leon', 'la persona', 'comportamiento', 'actuar'],
  pasiva: ['no dice lo que piensa', 'miedo', 'siempre dice que si', 'dice que si', 'se calla', 'inseguridad'],
  agresiva: ['grita', 'manda', 'no escucha', 'gritar', 'imponer', 'se impone'],
  asertiva: ['habla tranquilo', 'dice lo que piensa', 'con educacion', 'respecta', 'tranquilo', 'defiende sus derechos'],
  decir: ['negarte', 'negarse', 'rechazar', 'sin ceder', 'oponer'],
  no: ['negarte', 'negarse', 'rechazar', 'sin ceder', 'oponer'],
  respetuosamente: ['con educacion', 'tranquilo', 'amablemente', 'sin ofender', 'sin ceder', 'respetuoso'],
  entrevista: ['entrar', 'prepararlo', 'proceso', 'encuentro', 'con la empresa', 'con quien te contrata'],
  tecnica: ['cuatro partes', 'situacion', 'tarea', 'accion', 'resultado', 'metodo'],
  star: ['cuatro partes', 'situacion', 'tarea', 'accion', 'resultado', 'iniciales'],
  situacion: ['contexto', 'donde estabas', 'punto de partida', 'donde estas'],
  adaptabilidad: ['me adapto', 'me ajuste', 'cambios', 'cambiaron', 'sin problema', 'horario'],
  competencias: ['habilidades', 'capacidades', 'cualidades', 'caracteristicas'],
  personales: ['individuales', 'solo tuyas', 'tuyas', 'tu ficha', 'propias'],
  sociales: ['interactuar', 'colaborar', 'con los demas', 'saber estar con la gente', 'grupo'],
  blandas: ['tecnicas', 'no son tecnicas', 'sin exigir', 'empresa funcione mejor', 'el aceite']
  },
  {
  /* Tema 6 de Itinerario Personal para la Empleabilidad (IPP): itinerarios
   * académicos y profesionales, opciones académicas, entorno sociolaboral y
   * herramientas para decidir. El ancla es la palabra del anverso que
   * devuelve el término de la respuesta. */
  itinerario: ['ruta', 'camino', 'trayectoria', 'plan'],
  academico: ['estudios', 'formacion', 'escolar', 'colegio', 'academica'],
  academica: ['estudios', 'formacion', 'escolar', 'colegio', 'academico'],
  profesional: ['laboral', 'trabajo', 'oficio', 'puesto', 'profesiones', 'empleo'],
  entorno: ['mercado', 'trabajo', 'trabajos', 'contexto', 'situacion', 'panorama'],
  sociolaboral: ['laboral', 'social', 'trabajo', 'trabajos', 'mercado'],
  empresas: ['negocios', 'organizaciones', 'empresarios', 'firmas'],
  sector: ['actividades', 'areas', 'rubros', 'campos'],
  sectores: ['areas', 'campos', 'rubros', 'actividades'],
  oferta: ['puestos', 'vacantes', 'vacante', 'empleos'],
  demanda: ['necesita', 'necesitan', 'buscan', 'salidas', 'profesiones'],
  emergentes: ['moda', 'actuales', 'nuevos', 'crecientes'],
  cualificaciones: ['capacidades', 'titulos', 'aptitudes'],
  clave: ['importantes', 'esenciales', 'transversales'],
  herramientas: ['recursos', 'medios', 'utilidades', 'instrumentos'],
  decidir: ['elegir', 'optar', 'escoger'],
  orientacion: ['asesoramiento', 'asesoria', 'asesor', 'orientador', 'consejo', 'guia'],
  pruebas: ['examen', 'examenes', 'convocatoria', 'test'],
  acceso: ['entrada', 'entrar', 'ingreso', 'admision'],
  personalizado: ['propio', 'propia', 'tuyo', 'suyo', 'unico', 'individual', 'a tu medida', 'a medida'],
  informacion: ['informes', 'datos', 'ficha', 'catalogo'],
  decision: ['elegir', 'pensar', 'deliberar', 'elegir bien'],
  informada: ['datos', 'investigada', 'documentada'],
  opciones: ['salidas', 'alternativas', 'caminos', 'elecciones', 'posibilidades'],
  ciclo: ['estudios', 'formacion', 'curso', 'etapa'],
  formativo: ['formacion', 'estudios', 'capacitacion', 'preparacion'],
  grado: ['nivel', 'titulo', 'intermedio', 'basico'],
  medio: ['intermedio', 'nivel medio'],
  superior: ['mayor', 'alto', 'siguiente', 'escalon', 'peldaño', 'avanzado', 'superiores'],
  bachillerato: ['generales', 'secundaria', 'preparatoria', 'estudios generales'],
  universidad: ['superiores', 'superior', 'universitarios', 'titulos', 'facultad', 'carrera'],
  certificado: ['acredita', 'acreditacion', 'titulo', 'diploma', 'documento'],
  profesionalidad: ['oficio', 'cualificacion', 'laboral', 'puesto', 'certificacion'],
  proyecto: ['plan', 'futuro', 'meta', 'idea'],
  futuro: ['proyecto', 'plan', 'meta', 'lo que viene'],
  propia: ['tuya', 'tu', 'hecha a tu medida'],
  vida: ['carrera', 'camino', 'trayectoria', 'historia']
  },
  {
  /* Tema 6 de Técnicas Administrativas (operaciones de cobro y pago, documentos
   * comerciales, medios de pago, comercio electrónico) y barajas de Excel:
   * el ancla es la raíz o el sinónimo cercano de cada palabra de contenido de
   * la respuesta. */
  operaciones: ['operaciones', 'operacion', 'movimiento', 'movimientos', 'cada entrada y salida'],
  caja: ['monedero', 'efectivo', 'dinero', 'billetes', 'monedas', 'la caja fuerte'],
  cobro: ['cobro', 'cobrar', 'cobra', 'cobrado', 'entra', 'recoger', 'dinero que entra', 'ingreso', 'te entrega dinero'],
  pago: ['pago', 'pagar', 'paga', 'pagado', 'gasto', 'sacas', 'sale', 'dinero que sale', 'abona', 'pagas'],
  guardarlos: ['guardar', 'guarda', 'guardas', 'guardalo', 'conservar', 'archivar', 'retener'],
  nomina: ['nomina', 'sueldo', 'resumen', 'recibo de sueldo', 'lo que te pagan', 'devengo', 'ganas'],
  datos: ['datos', 'nombres', 'ficha', 'informacion', 'casillas', 'lo que te identifica', 'apartados', 'identificacion'],
  empresa: ['empresa', 'compania', 'negocio', 'razon', 'donde trabajas', 'firma'],
  persona: ['persona', 'personas', 'trabajador', 'trabajadora', 'trabajadores', 'trabajas', 'empleado', 'personal', 'gente'],
  trabajadora: ['trabajadora', 'trabajador', 'trabajadores', 'trabajas', 'empleado', 'empleada', 'personal', 'gente'],
  sueldo: ['sueldo', 'ganas', 'ganar', 'paga', 'salario', 'remuneracion', 'lo que te pagan', 'cobras'],
  descuentos: ['descuentos', 'quitan', 'retienen', 'deducciones', 'lo que te quitan', 'restan', 'lo que te han descontado'],
  importe: ['importe', 'cantidad', 'cuanto', 'suma', 'precio', 'valor', 'lo que se paga'],
  cobra: ['cobra', 'cobrar', 'cobro', 'cobran', 'se cobra', 'lo que hay que cobrar'],
  registro: ['registro', 'anotar', 'anotas', 'apunta', 'libro', 'cuaderno', 'seguimiento'],
  claro: ['claro', 'cuadra', 'limpio', 'ordenado', 'se ve a simple vista'],
  factura: ['factura', 'recibo', 'oficial', 'lo que tiene que pagar', 'impuestos', 'precio', 'papel oficial'],
  albaran: ['albaran', 'nota de entrega', 'recibo', 'entrega', 'mercancia', 'transportista', 'llego', 'traido', 'lo que ha traido'],
  pedido: ['pedido', 'encargo', 'pide', 'pedir', 'escribe', 'proveedor', 'lo que pide', 'pidiendo', 'compra'],
  nota: ['nota', 'papel', 'formulario', 'escrito', 'ruego', 'anotacion', 'hoja'],
  emisor: ['emisor', 'el que manda', 'manda', 'quien manda', 'vendedor', 'el que envia', 'remite'],
  cliente: ['cliente', 'comprador', 'quien compra', 'el que compra', 'quien paga', 'compra'],
  fecha: ['fecha', 'dia', 'cuando', 'el dia'],
  numero: ['numero', 'codigo', 'referencia', 'cifra', 'identificador'],
  detalle: ['detalle', 'linea', 'lineas', 'casillas', 'apartado', 'descripcion', 'desglose'],
  cantidad: ['cantidad', 'cuantos', 'cuantas', 'unidades', 'piezas', 'cuanto'],
  concepto: ['concepto', 'articulo', 'articulos', 'producto', 'descripcion', 'linea'],
  precio: ['precio', 'vale', 'cuanto', 'cuesta', 'tarifa', 'valor'],
  unitario: ['unitario', 'cada', 'uno', 'por unidad', 'separado'],
  subtotal: ['subtotal', 'la suma', 'sin impuestos', 'precio', 'base', 'parcial', 'suma'],
  iva: ['iva', 'impuesto', 'impuestos', '21%'],
  '21%': ['21%', 'tasa', 'por ciento', 'veintiuno', '21', 'impuestos'],
  total: ['total', 'resultado', 'paga', 'suma', 'sumados', 'la suma final', 'importe final', 'final'],
  presupuesto: ['presupuesto', 'precio', 'estimacion', 'por escrito', 'calculadora', 'lo que te cuesta', 'oferta'],
  presupuestos: ['presupuestos', 'precios', 'propuestas', 'ofertas', 'comparar', 'estimaciones'],
  varios: ['varios', 'distintos', 'diversos', 'multiples', 'algunos', 'varias', 'comparar'],
  impresos: ['impresos', 'papeles', 'formato', 'formularios', 'plantilla', 'modelo', 'hojas'],
  oficiales: ['oficiales', 'tramites', 'administracion', 'del estado', 'municipio', 'formulario oficial'],
  rellenar: ['rellenar', 'rellena', 'completar', 'llenar', 'escribir', 'relleno'],
  rellenarlo: ['rellenarlo', 'rellenar', 'rellena', 'completar', 'llenar', 'escribir', 'relleno'],
  bien: ['bien', 'correcto', 'sin errores', 'como debe ser', 'cuidado', 'con cuidado'],
  contado: ['contado', 'al momento', 'en mano', 'inmediato', 'sin esperar', 'ahora', 'recibir', 'al recibir'],
  aplazado: ['aplazado', 'aplaza', 'dentro de treinta dias', 'mas tarde', 'despues', 'en diferido', 'luego', 'tarde'],
  credito: ['credito', 'fiado', 'deuda', 'prestamo', 'aplazado', 'pagar despues', 'presta', 'te presta'],
  anticipado: ['anticipado', 'a cuenta', 'cuenta', 'sena', 'adelantado', 'por adelantado', 'antes'],
  efectivo: ['efectivo', 'billetes', 'monedas', 'papel moneda', 'moneda', 'billete', 'en mano'],
  recibo: ['recibo', 'nota', 'papel', 'prueba', 'justificante', 'resguardo'],
  cheque: ['cheque', 'orden firmada', 'papel firmado', 'firmado', 'orden', 'banco', 'papel'],
  partes: ['partes', 'datos', 'casillas', 'apartados', 'elementos', 'campos', 'formulario', 'dentro'],
  transferencia: ['transferencia', 'mover', 'llevar', 'pasar', 'traslado', 'mandar', 'envio de dinero'],
  bancaria: ['bancaria', 'banco', 'bancario', 'entidad', 'sucursal'],
  tarjeta: ['tarjeta', 'plastico', 'trocito', 'la del banco'],
  debito: ['debito', 'gasta', 'ya tienes', 'propio dinero', 'se resta de la cuenta'],
  codigo: ['codigo', 'iban', 'siglas', 'numero', 'referencia', 'clave'],
  identifica: ['identifica', 'nombra', 'dice quien es', 'sirve para saber', 'saber', 'reconoce'],
  cuenta: ['cuenta', 'la tuya', 'tuya', 'del banco', 'la del banco', 'cuenta bancaria'],
  pagare: ['pagare', 'promete', 'prometiendo', 'promesa', 'papel firmado', 'firma', 'obligacion'],
  letra: ['letra', 'documento', 'papel', 'escribe', 'escrito', 'escritura'],
  cambio: ['cambio', 'aplaza', 'deuda', 'intercambio', 'trueque'],
  comercio: ['comercio', 'tienda', 'tiendas', 'vender', 'comprar', 'negocio', 'venta'],
  electronico: ['electronico', 'web', 'internet', 'en linea', 'por internet', 'tienda online', 'la red'],
  cuatro: ['cuatro', 'varias', 'distintas', 'varios', 'algunas', 'tantas'],
  reembolso: ['reembolso', 'al recibir', 'cuando llega', 'llega a casa', 'al repartidor', 'al entregarlo', 'entregar', 'entregarlo', 'recibir', 'recibirlo'],
  pasarela: ['pasarela', 'intermediario', 'puente', 'por medio'],
  columna: ['columna', 'vertical', 'letras', 'de arriba abajo'],
  fila: ['fila', 'horizontal', 'numeros', 'de lado a lado'],
  textos: ['textos', 'palabras', 'letras', 'escrito'],
  numeros: ['numeros', 'cifras', 'cantidades', 'cantidad', 'numero'],
  formulas: ['formulas', 'sumar', 'restar', 'multiplicar', 'dividir', 'cuenta', 'cuentas', 'operaciones', 'igual'],
  basicas: ['basicas', 'simples', 'sumar', 'restar', 'principiantes', 'sencillas'],
  situar: ['situar', 'colocas', 'colocar', 'pones', 'situa'],
  cursor: ['cursor', 'flechita', 'el puntero', 'la flecha', 'cruz'],
  teclear: ['teclear', 'tecleas', 'teclea', 'escribes', 'pulsas', 'teclado'],
  guardar: ['guardar', 'guardalo', 'guardas', 'disco', 'carpeta', 'archivo', 'meter', 'en el disco'],
  barra: ['barra', 'franja', 'franjas', 'botones', 'fila', 'pestanas', 'la de arriba'],
  titulo: ['titulo', 'nombre', 'nombre del archivo', 'la aplicacion', 'encabezado'],
  herramientas: ['herramientas', 'botones', 'mandos', 'la de las herramientas'],
  acceso: ['acceso', 'atajo', 'atajos', 'directo', 'a mano'],
  rapido: ['rapido', 'atajo', 'atajos', 'un toque', 'listo', 'toque', 'directo'],
  menus: ['menus', 'pestanas', 'pestana', 'inicio', 'insertar', 'diseno'],
  banda: ['banda', 'cinta', 'cajon', 'la grande'],
  opciones: ['opciones', 'botones', 'cinta', 'pestana elegida', 'herramientas'],
  etiquetas: ['etiquetas', 'hojas', 'pestanas', 'nombres'],
  mostrar: ['mostrar', 'indica', 'enseña', 'ver', 'muestra'],
  vistas: ['vistas', 'puntos de vista', 'punto de vista', 'vista', 'botones', 'como se ve'],
  acercar: ['acercar', 'grande', 'mas cerca', 'acercas', 'primer plano'],
  alejar: ['alejar', 'pequeña', 'mas lejos', 'alejas', 'lejos'],
  vista: ['vista', 'zoom', 'prismaticos', 'como se ve', 'la hoja'],
  desplazamiento: ['desplazamiento', 'mueven', 'mover', 'correr', 'corren', 'desplaza'],
  barras: ['barras', 'palanca', 'palanecas', 'franja', 'franjas', 'botones'],
  inicial: ['inicial', 'al abrir', 'abrir', 'la primera', 'al empezar', 'al entrar'],
  pantalla: ['pantalla', 'ventana', 'cuadro'],
  documento: ['documento', 'archivo', 'libro', 'hoja', 'ficha', 'expediente', 'texto']
  },
  {
  /* Tema 7 de Itinerario Personal para la Empleabilidad (IPP): la búsqueda
   * de empleo (qué significa, qué necesitas, dónde buscar, tipos de empleo,
   * currículum, carta de presentación y preparación de la entrevista). */
  buscar: ['encontrar', 'rastrear', 'indagar', 'buscas', 'busques', 'busqueda'],
  empleo: ['trabajo', 'puesto', 'ocupacion', 'chamba', 'curro'],
  trabajo: ['oficio', 'empleo', 'puesto', 'jornada', 'curro', 'faena'],
  conocerte: ['mirarse', 'mirarte', 'dentro', 'autoconocimiento', 'conocer'],
  saber: ['claro', 'entender', 'dominar', 'conocer', 'aprender', 'informarse'],
  quieres: ['apetece', 'deseas', 'gustos'],
  prepararte: ['preparar', 'preparacion', 'entrenar', 'ensayar', 'preparado'],
  curriculum: ['documento', 'ficha', 'dossier', 'redactar', 'redactarlo',
    'resumen', 'resume', 'cv', 'hoja'],
  vitae: ['vida', 'historial', 'recorrido', 'trayectoria'],
  carta: ['nota', 'texto', 'escrito', 'mensaje', 'papel'],
  presentacion: ['curriculum', 'cv', 'acompana', 'nota', 'texto', 'hoja'],
  presentarte: ['conocer', 'presentar', 'dar', 'introducir', 'saludar', 'hola'],
  explicar: ['contar', 'decir', 'motivo', 'razon', 'explicas'],
  interesa: ['encaja', 'llama', 'gusta', 'atrae', 'apetece'],
  puesto: ['oferta', 'trabajo', 'empleo', 'vacante', 'plaza', 'cargo'],
  destacar: ['resaltar', 'sabes', 'ensenan', 'demostrar', 'adaptado'],
  puntos: ['parte', 'cualidades', 'aspectos', 'sabes', 'lista'],
  fuertes: ['sabes', 'destacar', 'buenos', 'destacados', 'fuerte', 'vales'],
  idea: ['claro', 'claridad', 'objetivo', 'proposito'],
  clara: ['claro', 'claridad', 'nitido', 'sabes'],
  tipo: ['genero', 'clase', 'sector', 'modalidad', 'generales'],
  buscas: ['buscar', 'buscas', 'busques', 'persigues', 'ofertas'],
  informacion: ['informes', 'datos', 'ficha', 'catalogo', 'sitios', 'lugares'],
  donde: ['sitios', 'lugares', 'portales', 'webs', 'contactos', 'sitio'],
  ofertas: ['vacantes', 'puestos', 'empleos', 'anuncios', 'oferta', 'sitios'],
  actitud: ['ganas', 'animo', 'disposicion', 'interes', 'marcha'],
  positiva: ['buena', 'optimista', 'ganas', 'entusiasmo', 'vales'],
  activa: ['movida', 'marcha', 'seguir', 'ganas', 'proactiva', 'rapida'],
  portales: ['sitios', 'web', 'webs', 'paginas', 'anuncios', 'tablon', 'sitio'],
  internet: ['web', 'red', 'online', 'pantalla', 'webs'],
  oficinas: ['ventanilla', 'ventanillas', 'servicio', 'padron', 'atencion', 'centro'],
  redes: ['conocidos', 'contactos', 'familiares', 'amigos', 'gente'],
  contacto: ['conocido', 'conocidos', 'contactos', 'personas', 'gente'],
  entrega: ['acercate', 'llevas', 'presentas', 'entregar', 'persona', 'acercamiento'],
  directa: ['directamente', 'mismo', 'mano', 'intermediarios', 'persona'],
  recursos: ['sitios', 'paginas', 'portales', 'lugares', 'herramientas', 'ayuda', 'pantalla'],
  utiles: ['util', 'ayudan', 'serven', 'provechosos', 'interesantes'],
  constante: ['todos', 'dias', 'diario', 'seguido', 'parar', 'siempre'],
  organizado: ['lista', 'cuaderno', 'apuntado', 'ordenado', 'registro', 'fichaje'],
  activo: ['ve', 'pregunta', 'llama', 'entrega', 'esperes', 'mismo', 'acercate'],
  positivo: ['ganas', 'optimismo', 'animo', 'energia', 'vales', 'corredor'],
  formandote: ['aprendiendo', 'mejorando', 'estudiando', 'capacitando', 'formacion'],
  datos: ['nombre', 'telefono', 'correo', 'domicilio', 'contacto', 'identificacion'],
  personales: ['nombre', 'telefono', 'correo', 'privados', 'propios', 'identificacion'],
  formacion: ['estudios', 'cursos', 'titulos', 'aprendes', 'graduados'],
  academica: ['estudios', 'formacion', 'escolar', 'colegio', 'academico', 'titulos'],
  experiencia: ['trabajos', 'trabajo', 'puestos', 'trayectoria', 'recorrido', 'historial'],
  laboral: ['trabajo', 'trabajos', 'profesional', 'puestos', 'contrato'],
  habilidades: ['sabes', 'capacidades', 'destrezas', 'talentos', 'herramientas', 'manejas', 'piezas'],
  idiomas: ['lenguas', 'lengua', 'extranjeros', 'hablas', 'portatil'],
  conocimientos: ['manejas', 'sabes', 'informaticos', 'ordenadores', 'tecnologia'],
  informaticos: ['ordenadores', 'computadora', 'tecnologia', 'equipos', 'manejas', 'portatil'],
  claro: ['facil', 'legible', 'entendible', 'limpio'],
  breve: ['corta', 'conciso', 'poco'],
  pagina: ['hoja', 'folio', 'cara', 'lamina', 'sola'],
  faltas: ['errores', 'fallos', 'erratas'],
  ortografia: ['escrito', 'redaccion', 'letra', 'erratas', 'correcto'],
  entrevista: ['conversacion', 'charla', 'encuentro', 'reunion', 'preguntas', 'examen'],
  investigar: ['informarse', 'averiguar', 'estudiar', 'mirar', 'conocer', 'dia'],
  empresa: ['compañia', 'negocio', 'firma', 'organizacion'],
  repasar: ['revisar', 'vuelta', 'mirar', 'ojo', 'estudiar', 'repasarlo', 'echar'],
  cv: ['curriculum', 'documento', 'ficha', 'hoja', 'escrito'],
  preguntas: ['preguntar', 'preguntan', 'interrogar', 'dudas', 'test'],
  comunes: ['tipo', 'frecuentes', 'siempre', 'habituales', 'test', 'preguntan'],
  piensa: ['pensar', 'reflexionar', 'pensamiento', 'pienses'],
  puntual: ['margen', 'antes', 'tiempo', 'pronto', 'puntualmente'],
  vestir: ['ropa', 'vestimenta', 'ponerte', 'vestirte', 'traje'],
  forma: ['modo', 'manera', 'estilo'],
  adecuada: ['adecuado', 'apropiada', 'correcta', 'propia', 'conveniente', 'importante'],
  hablar: ['expresarte', 'expresarse', 'decir', 'comunicar', 'hablas', 'explicas'],
  claridad: ['calma', 'claro', 'ordenado', 'entendible', 'explicas'],
  respeto: ['educacion', 'cortesia', 'amabilidad', 'respetuoso'],
  practicas: ['trabajando', 'aprendiendo', 'stage', 'prueba', 'tiempo', 'practicando'],
  becas: ['ayuda', 'ayudas', 'estancia', 'mercado', 'subvencion', 'ayudan'],
  primer: ['primero', 'comienzo', 'inicial', 'debut', 'nuevo', 'primera'],
  temporal: ['limitado', 'tiempo', 'breve', 'temporada', 'acaba', 'fin'],
  parcial: ['media', 'jornada', 'menos', 'horas'],
  jornada: ['horario', 'horas', 'completa', 'diarias', 'completo'],
  completa: ['completo', 'entera', 'total', 'horas', 'diarias'],
  /* Sinónimos añadidos al revisar palabra por palabra (octubre 2026). */
  trabajo: ['oficio', 'empleo', 'puesto', 'jornada', 'curro', 'faena',
    'contratar', 'contratarte', 'trabajar', 'trabaja', 'trabajas'],
  empleo: ['trabajo', 'puesto', 'ocupacion', 'chamba', 'curro', 'ofertas', 'vacantes'],
  buscar: ['encontrar', 'rastrear', 'indagar', 'buscas', 'busques', 'busqueda',
    'vacantes'],
  comunes: ['tipo', 'frecuentes', 'siempre', 'habituales', 'test', 'preguntar', 'preguntan'],
  piensa: ['pensar', 'reflexionar', 'pensamiento', 'pienses', 'cabeza'],
  adecuada: ['adecuado', 'apropiada', 'correcta', 'propia', 'conveniente', 'encaje', 'importante'],
  forma: ['modo', 'manera', 'estilo'],
  preguntas: ['preguntar', 'preguntan', 'interrogar', 'dudas', 'test', 'cuestionario']
  },
  {
  /* Itinerario Personal para la Empleabilidad y Técnicas Administrativas:
   * vocabulario que el pase de anclas de octubre 2026 destapó al
   * subrayar el ancla de cada tarjeta (las anclas eran correctas, el
   * detector es el que no conocía las palabras). Sin tildes ni eñes: el
   * mapa se normaliza al cargar (ver SINONIMOS_NORM). */
  flexible: ['cambia', 'cambiar', 'se adapta'],
  metas: ['ponerse', 'fijarse', 'direccion', 'lo que quieres lograr', 'lograr', 'querer'],
  aprendiendo: ['enseña', 'experiencia', 'cada vez'],
  aprende: ['enseña', 'experiencia', 'cada vez'],
  pide: ['pedir', 'pedir ayuda', 'recurrir'],
  cree: ['uno mismo', 'creer en ti', 'confianza'],
  rumbo: ['volver a empezar', 'dar la vuelta', 'corregir', 'cambiar de camino', 'cambiar', 'otra direccion'],
  laborales: ['practicas', 'trabajos temporales', 'voluntariado'],
  decision: ['hay que decidir', 'saber que', 'se elige', 'elegir', 'elegir bien'],
  identificar: ['saber', 'averiguar', 'localizarlo'],
  conocerse: ['que te gusta', 'que se te da bien', 'saber de ti'],
  evaluar: ['comparar', 'comparacion', 'valorar'],
  actuar: ['dar el primer paso', 'paso', 'empezar', 'salir'],
  revisar: ['comprueba', 'comprobar', 'ajustar'],
  intereses: ['te gusta', 'te gustan', 'motiva'],
  familia: ['rodean', 'tus padres', 'gente que te rodea'],
  entorno: ['rodean', 'alrededor'],
  informacion: ['lo que sabes', 'sabes', 'conoces'],
  oportunidades: ['abren puertas', 'puertas', 'salidas'],
  desarrollo: ['creciendo', 'crecer', 'aprendiendo'],
  satisfaccion: ['sensacion', 'la sensacion', 'elegido bien'],
  conciencia: ['acertar', 'concientemente'],
  responsabilidad: ['a conciencia'],
  correcto: ['cada persona', 'el suyo', 'distintas calles'],
  decisiones: ['elegir', 'opciones', 'elegir entre'],
  practica: ['son importantes', 'cada vez', 'repetir', 'practica y esfuerzo', 'esfuerzo', 'clave', 'una clave', 'la tercera clave'],
  diaria: ['clave', 'una clave', 'la tercera clave'],
  formacion: ['tercera clave', 'la tercera clave', 'seguir aprendiendo'],
  continua: ['tercera clave', 'la tercera clave'],
  visualizar: ['imagina', 'imaginar', 'como te sentirias'],
  confianza: ['orientadores', 'profesores', 'familia', 'preguntar'],
  pros: ['ventajas', 'lo bueno', 'las ventajas'],
  contras: ['desventajas', 'lo malo'],
  miedo: ['corregir el rumbo', 'equivocarse', 'no es el final'],
  comunicacion: ['consiste en'],
  convivencia: ['une a las personas'],
  esperar: ['no adivines'],
  turno: ['no adivines'],
  habilidades: ['prepara ejemplos', 'prepara ejemplos reales', 'ejemplos', 'practica y esfuerzo'],
  mejorar: ['practica y esfuerzo', 'esfuerzo', 'practica'],
  cambiar: ['volver a empezar', 'dar la vuelta', 'cambia', 'cambiar'],
  terciario: ['dan servicios', 'servicios', 'presta servicios', 'el tercero de los tres'],
  direccion: ['volver a empezar', 'cambiar de direccion', 'otra direccion'],
  organizacion: ['frase util', 'frase util en entrevista'],
  equipo: ['cuando lo necesitan', 'companeros'],
  trabajo: ['cuando lo necesitan'],
  adaptabilidad: ['me ajusto', 'me ajuste'],
  '112': ['ayuda profesional', 'pedir ayuda profesional'],
  otra: ['empapado', 'se ha empapado'],
  heimlich: ['aprietas hacia dentro'],
  pano: ['taparla'],
  pulso: ['cuello', 'muneca'],
  elegir: ['conocerte te ayuda a'],
  rendimiento: ['tambien te ayuda a'],
  comunicarte: ['sabes como eres'],
  prueba: ['descubrir'],
  solidaridad: ['no espera nada', 'no espera nada a cambio'],
  manejar: ['usar el raton', 'raton', 'botones', 'usar'],
  hablar: ['delante de la gente', 'en publico'],
  naturaleza: ['arboles', 'el campo', 'campo', 'prados', 'montanas'],
  informatica: ['el raton', 'raton', 'pantalla', 'la pantalla'],
  respeto: ['tratarlo bien', 'tratar bien', 'dejarle sitio'],
  carga: ['cansan'],
  exposicion: ['pasarte'],
  senalizacion: ['avisan'],
  toxicologicas: ['ponerte malo', 'sustancia que te puede hacer dano'],
  oficinas: ['inscribir como demandante', 'la ventanilla'],
  investigar: ['a que se dedica y que hace', 'informarse'],
  primer: ['no necesitas experiencia previa', 'tu comienzo']
  }
]);

/* Palabras vacías: no cuentan como término de la respuesta. */
var VACIAS = ['por', 'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'sus', 'en', 'a', 'del', 'al', 'que', 'se', 'su', 'y', 'o', 'es', 'son',
  'como', 'para', 'con', 'entre', 'este', 'esta', 'esto', 'todos', 'otro',
  'estar', 'tener', 'haber', 'poder', 'hacer',
  /* Del tema 5: negación, impersonal y conjunciones. «Material no fungible»
   * lleva un «no» gramatical, no un contenido que haya que anclar. */
  'no', 'hay', 'cuando', 'porque',
  /* Del tema 5: conectores de la definición literal de los dos tipos de
   * material («aunque se desgaste», «controlar sin desperdicio»). */
  'sin', 'aunque',
  /* Del tema 6: preposición de «pago contra reembolso». */
  'contra'];

/* Sustantivos genéricos: nombrarlos en el anverso NO regala la respuesta
 * (la respuesta es "Empresa local", no "local"). */
var GENERICAS = ['empresa', 'empresas', 'empresario', 'empresarios', 'elemento',
  'elementos', 'estructura', 'estructuras', 'sector', 'sectores', 'clasificacion',
  'tipo', 'tipos', 'funcion', 'funciones', 'tarea', 'administrativa', 'parte',
  'organizacion', 'nombres', 'area', 'areas', 'departamento', 'departamentos',
  'actividad', 'actividades', 'trabajo', 'zonas', 'comunicacion',
  'comunicaciones', 'comunicativo', 'medio', 'medios', 'herramienta',
  'herramientas', 'forma', 'formas', 'dificultad', 'dificultades', 'funcion',
  'documento', 'documentos', 'sistema', 'sistemas', 'red', 'redes',
  'informacion', 'buzones'];

var ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' };

function norm(s) {
  return s.toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[¿?¡!.,;:"'()]/g, ' ')
    .replace(/[áéíóúüñ]/g, function (c) { return ACENTOS[c]; })
    .replace(/\s+/g, ' ').trim();
}

/* El anverso se compara YA normalizado (norm() quita tildes y eñes), así
 * que el mapa de sinónimos tiene que normalizarse también al cargarlo:
 * si no, «sin engañarte» nunca casa con «sin enganarte» ni «compañeros»
 * con «companeros», y el detector marca como R6 anclas que son correctas. */
var SINONIMOS_NORM = {};
Object.keys(SINONIMOS).forEach(function (k) {
  var nk = norm(k);
  var lista = SINONIMOS_NORM[nk] || [];
  SINONIMOS[k].forEach(function (s) {
    var ns = norm(s);
    if (ns && lista.indexOf(ns) === -1) lista.push(ns);
  });
  SINONIMOS_NORM[nk] = lista;
});

function raizDe(palabra) {
  var clave = Object.keys(RAICES).filter(function (k) {
    return palabra.indexOf(RAICES[k]) === 0 || RAICES[k].indexOf(palabra) === 0;
  })[0];
  return clave || palabra;
}

function collectDecks(root, current, prefix, out) {
  fs.readdirSync(current, { withFileTypes: true }).forEach(function (entry) {
    if (entry.isDirectory()) {
      if (entry.name === 'concepts' || entry.name === 'node_modules') return;
      collectDecks(root, path.join(current, entry.name), prefix + entry.name + '/', out);
    } else if (/\.json$/i.test(entry.name) && entry.name !== 'autoevaluacion.json' &&
               entry.name !== 'manifest.json') {
      out.push(path.join(root, prefix + entry.name));
    }
  });
  return out;
}

/* Rangos [ini, fin) ocupados por el contenido de un `<mark>`. */
function rangosMark(q) {
  var out = [];
  var re = /<mark>([\s\S]*?)<\/mark>/g;
  var m;
  while ((m = re.exec(q)) !== null) out.push([m.index, m.index + m[0].length]);
  return out;
}

function dentroDeMark(rangos, ini, fin) {
  return rangos.some(function (r) { return ini < r[1] && fin > r[0]; });
}

/* El ancla marcada: lo que va entre <u> en el anverso. */
function subrayados(q) {
  var out = [];
  var re = /<u>([\s\S]*?)<\/u>/g;
  var m;
  while ((m = re.exec(q)) !== null) out.push(m[1]);
  return out;
}

/* ¿Lo subrayado apunta al término de la respuesta (raíz o sinónimo)? */
function conecta(sub, ansWords) {
  var u = norm(sub);
  var us = u.split(' ');
  return ansWords.some(function (aw) {
    var raiz = raizDe(aw);
    var sin = SINONIMOS_NORM[aw] || [];
    if (sin.indexOf(u) !== -1) return true;
    return us.some(function (w) {
      if (!w) return false;
      if (w === aw) return false;
      if (raiz.length >= 4 && raizDe(w) === raiz) return true;
      return sin.indexOf(w) !== -1;
    });
  });
}

function auditCard(card, file, idx) {
  var q = card.question || card.pregunta || '';
  var a = card.answer || card.respuesta || '';
  var flags = [];
  var qNorm = norm(q);
  var ansNorm = norm(a);

  var sinMark = q.replace(/<mark>[\s\S]*?<\/mark>/g, '').replace(/<\/?u>/g, '');
  var frases = sinMark.split(/(?<=[.!?])\s+/).filter(function (s) {
    /* La marca inicial deja un punto suelto («</mark>. Una frase…»): no
     * cuenta como frase de pista. */
    return /\w/.test(s);
  });
  var pistas = frases.slice(0, -1);
  pistas.forEach(function (s) {
    var n = s.trim().split(/\s+/).length;
    if (n > 12) flags.push({ rule: 'R1', msg: 'frase de ' + n + ' palabras: "' + s.trim() + '"' });
  });
  if (pistas.length > 4) flags.push({ rule: 'R2', msg: pistas.length + ' frases de pista (max 4)' });

  var ansWords = ansNorm.split(' ').filter(function (w) {
    return w.length > 2 && VACIAS.indexOf(w) === -1;
  });

  /* R3: una palabra de CONTENIDO de la respuesta escrita en el anverso. */
  var spoiler = ansWords.filter(function (w) {
    return GENERICAS.indexOf(w) === -1 &&
      new RegExp('\\b' + w + '\\b').test(qNorm);
  });
  if (spoiler.length) flags.push({ rule: 'R3', msg: 'el anverso dice: ' + spoiler.join(', ') });

  /* R4: alguna palabra del anverso apunta al término. */
  var anclas = [];
  var qWords = qNorm.split(' ');
  ansWords.forEach(function (aw) {
    var raiz = raizDe(aw);
    var sin = SINONIMOS_NORM[aw] || [];
    qWords.forEach(function (w) {
      if (w === aw) return;
      if (raizDe(w) === raiz && raiz.length >= 4) anclas.push(w + '→' + aw);
      else if (sin.indexOf(w) !== -1) anclas.push(w + '→' + aw);
    });
  });
  if (!anclas.length) flags.push({ rule: 'R4', msg: 'sin ancla para: ' + ansWords.join(' / ') });

  /* R5/R6: el ancla tiene que estar marcada con <u> y apuntar al término.
   * R7: el ancla está dentro de la analogía <mark> (la analogía es otra
   *     señal: el ancla va en el texto plano del anverso).
   * R8: el ancla está dentro de la pregunta final (la que va en negrita,
   *     entre ¿...?): ahí ya no es una pista, es parte de lo que se
   *     pregunta. */
  if (EXIGIR_ANCLA) {
    var sub = subrayados(q);
    if (!sub.length) {
      flags.push({ rule: 'R5', msg: 'el ancla no está subrayada (falta <u>)' });
    } else {
      var malas = sub.filter(function (s) { return !conecta(s, ansWords); });
      if (malas.length) {
        flags.push({ rule: 'R6', msg: 'no apunta al término: "' + malas.join('", "') + '"' });
      }
      var rangos = rangosMark(q);
      var reU = /<u>([\s\S]*?)<\/u>/g;
      var mu;
      var enMark = false;
      var enPregunta = false;
      while ((mu = reU.exec(q)) !== null) {
        if (dentroDeMark(rangos, mu.index, mu.index + mu[0].length)) enMark = true;
      }
      var iPregunta = q.lastIndexOf('¿');
      if (iPregunta !== -1) {
        reU.lastIndex = 0;
        /* La pista es el texto SIN la analogía: lo que ya sale en ella
         * (fuera de <mark>) es lo que la tarjeta regalaría. */
        var pista = norm(q.slice(0, iPregunta).replace(/<mark>[\s\S]*?<\/mark>/g, ' '));
        while ((mu = reU.exec(q)) !== null) {
          if (mu.index <= iPregunta) continue;
          /* Un ancla en la pregunta final es legítima cuando es una
           * referencia hacia atrás («el peso de todo eso», «ese
           * contacto»): ahí se pregunta por el ancla. Solo es aviso
           * cuando la palabra sale YA en la pista: entonces no da
           * ninguna pista y la tarjeta se regala. */
          var n = norm(mu[1]);
          if (n && pista.indexOf(n) !== -1) enPregunta = true;
        }
      }
      if (enMark) flags.push({ rule: 'R7', msg: 'el ancla está dentro de la analogía <mark>' });
      if (enPregunta) flags.push({ rule: 'R8', msg: 'el ancla está en la pregunta final' });
    }
  }

  return {
    file: file,
    idx: idx,
    answer: ansNorm,
    ancla: anclas.filter(function (v, k, a) { return a.indexOf(v) === k; }),
    flags: flags
  };
}

function main(baseDir) {
  var raiz = baseDir || dir;
  var stat = fs.statSync(raiz);
  var files = stat.isDirectory()
    ? collectDecks(raiz, raiz, '', [])
    : [raiz];
  var results = [];
  files.forEach(function (f) {
    var deck = JSON.parse(fs.readFileSync(f, 'utf8'));
    var cards = deck.cards || deck.tarjetas;
    if (!Array.isArray(cards)) return;
    cards.forEach(function (card, i) {
      results.push(auditCard(card, f, i));
    });
  });

  var conAvisos = results.filter(function (r) { return r.flags.length; });
  var sinAncla = results.filter(function (r) {
    return r.flags.some(function (fl) { return fl.rule === 'R4'; });
  });
  var porFichero = {};
  results.forEach(function (r) {
    var key = path.basename(r.file);
    porFichero[key] = porFichero[key] || { total: 0, avisos: 0, sinAncla: 0 };
    porFichero[key].total++;
    if (r.flags.length) porFichero[key].avisos++;
    if (r.flags.some(function (fl) { return fl.rule === 'R4'; })) porFichero[key].sinAncla++;
  });

  console.log('Barajas analizadas: ' + files.length);
  console.log('Tarjetas: ' + results.length +
    ' | con ancla: ' + (results.length - sinAncla.length) +
    ' | sin ancla (R4): ' + sinAncla.length);
  console.log('');
  console.log('Fichero'.padEnd(46) + 'total  sin ancla  otros avisos');
  Object.keys(porFichero).sort().forEach(function (k) {
    var v = porFichero[k];
    console.log(k.padEnd(46) + String(v.total).padStart(5) +
      String(v.sinAncla).padStart(11) +
      String(v.avisos - v.sinAncla).padStart(14));
  });

  if (conAvisos.length) {
    console.log('\nDetalle:');
    conAvisos.forEach(function (r) {
      console.log('  [' + (r.idx + 1) + '] ' + path.basename(r.file) + ' — ' +
        r.answer + ' → ' + r.flags.map(function (fl) {
          return fl.rule + ': ' + fl.msg;
        }).join(' | '));
    });
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'audit-anclas.json'),
    JSON.stringify(results, null, 2), 'utf8');
  console.log('\nDetalle completo en audit-out/audit-anclas.json');
}

/* Ejecutado como script: audita. Requerido como módulo (scripts/
 * propose-anchors.js) expone los mapas y las funciones para reutilizar la
 * misma lógica de ancla sin duplicarla. */
if (require.main === module) main();

module.exports = {
  RAICES: RAICES,
  SINONIMOS: SINONIMOS,
  VACIAS: VACIAS,
  GENERICAS: GENERICAS,
  norm: norm,
  raizDe: raizDe,
  collectDecks: collectDecks,
  auditCard: auditCard,
  main: main
};
