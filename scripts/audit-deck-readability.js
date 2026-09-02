#!/usr/bin/env node
/*
 * Auditoría de barajas frente a los criterios "persona tipo" de
 * doc/es/SPEC.md §2.4 y CLAUDE.md → "Generating deck content".
 *
 * NO modifica archivos. Solo produce un informe JSON + texto en
 * audit-out/. Las reglas son detectores objetivos sobre el contenido
 * ya publicado; las decisiones de reescritura se hacen a mano después
 * leyendo los casos dudosos.
 *
 * Reglas:
 *   R1  > 5 frases en `respuesta`.
 *   R2  Alguna frase de `respuesta` con > 12 palabras.
 *   R3  `pregunta` es sí/no (empieza por verbo ser/estar/tener/se puede
 *       o termina en ¿...? ¿verdad? ¿no?).
 *   R4  Markdown en `pregunta`/`respuesta` (asteriscos dobles,
 *       almohadillas, guiones bajos, bloques ```).
 *   R5  Sarcasmo / dobles sentidos (signos de admiración duplicados,
 *       emojis, "literal", "básicamente", "en realidad"...).
 *   R6  Varios conceptos abstractos nuevos en una misma tarjeta
 *       (heurística: ≥ 3 sustantivos abstractos candidatos en
 *       `respuesta` — lista cerrada).
 *   R7  `pregunta` o `respuesta` vacíos / solo espacios.
 *   R8  Falta `<mark>` en la respuesta (sugiere respuesta no
 *       "anclada").
 *   R9  Longitud total de `respuesta` excesiva (> ~400 caracteres,
 *       aviso pedagógico).
 *
 * Uso:
 *   node scripts/audit-deck-readability.js
 *   node scripts/audit-deck-readability.js --json   # solo JSON, sin
 *                                                    cabecera
 */

'use strict';

var fs = require('fs');
var path = require('path');

var DECKS_DIR = path.resolve(__dirname, '..', 'decks');
var OUT_DIR = path.resolve(__dirname, '..', 'audit-out');

var ABSTRACT_NOUNS = [
  'magnitud', 'magnitudes', 'función', 'funciones',
  'proceso', 'procesos', 'método', 'métodos', 'método científico',
  'teoría', 'teorías', 'ley', 'leyes', 'principio', 'principios',
  'propiedad', 'propiedades', 'característica', 'características',
  'variable', 'variables', 'constante', 'constantes',
  'hipótesis', 'experimento', 'experimentos', 'observación',
  'observaciones', 'conclusión', 'conclusiones',
  'átomo', 'átomos', 'molécula', 'moléculas', 'célula', 'células',
  'elemento', 'elementos', 'compuesto', 'compuestos',
  'reacción', 'reacciones', 'energía', 'fuerza', 'fuerzas',
  'movimiento', 'movimientos', 'velocidad', 'aceleración',
  'masa', 'peso', 'volumen', 'densidad', 'presión', 'temperatura',
  'corriente', 'voltaje', 'resistencia', 'potencia',
  'género', 'géneros', 'movimiento literario', 'corriente literaria',
  'época', 'épocas', 'período', 'períodos', 'siglo', 'siglos',
  'estilo', 'estilos', 'figura retórica', 'figuras retóricas',
  'verbo', 'verbos', 'sustantivo', 'sustantivos', 'adjetivo',
  'adjetivos', 'oración', 'oraciones', 'párrafo', 'párrafos',
  'texto', 'textos', 'narrador', 'personaje', 'personajes',
  'trama', 'clímax', 'desenlace'
];

var SARCASTIC_PATTERNS = [
  /!!/,                       // admiración duplicada
  /\?\?/,                     // interrogación duplicada
  /[\u{1F300}-\u{1FAFF}]/u,  // emojis / pictogramas
  /\bliteral(mente)?\b/i,
  /\bbásicamente\b/i,
  /\ben realidad\b/i,
  /\bni idea\b/i,
  /\brollo\b/i
];

var YESNO_PREFIX = /^(es|son|está|están|tiene|tienen|se puede|se pueden|hay|debe|deben)\b/i;
var YESNO_SUFFIX = /[¿?] *(verdad|no|correcto)\s*[?!]?\s*$/i;

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function splitSentences(text) {
  if (!text) return [];
  // Divide por . ? ! o <br>, conservando contenido. Los signos van
  // pegados a la frase anterior; limpiamos espacios sobrantes.
  return text
    .split(/(?:\.|;|\?|!|<br\s*\/?>|\n)+/g)
    .map(function (s) { return s.replace(/^\s+|\s+$/g, ''); })
    .filter(Boolean);
}

function wordCount(s) {
  return s ? s.trim().split(/\s+/).filter(Boolean).length : 0;
}

function auditCard(card, idx, deckFile) {
  var flags = [];
  var pregunta = (card.pregunta || '').trim();
  var respuesta = (card.respuesta || '').trim();

  // R7
  if (!pregunta || !respuesta) {
    flags.push({ rule: 'R7', msg: 'pregunta o respuesta vacía' });
    return { file: deckFile, idx: idx, pregunta: pregunta, flags: flags };
  }

  // R3
  if (YESNO_PREFIX.test(pregunta) || YESNO_SUFFIX.test(pregunta)) {
    flags.push({ rule: 'R3', msg: 'pregunta sí/no o cerrada' });
  }

  // R4
  if (/(\*\*|__|```|^#{1,6}\s)/m.test(pregunta) ||
      /(\*\*|__|```|^#{1,6}\s)/m.test(respuesta)) {
    flags.push({ rule: 'R4', msg: 'markdown detectado' });
  }

  // R5
  SARCASTIC_PATTERNS.forEach(function (re) {
    if (re.test(pregunta) || re.test(respuesta)) {
      flags.push({ rule: 'R5', msg: 'posible sarcasmo / dobles sentidos: ' + re.toString() });
    }
  });

  // R8
  if (!/<mark>/.test(respuesta)) {
    flags.push({ rule: 'R8', msg: 'sin <mark>' });
  }

  // R1 / R2
  var sentences = splitSentences(respuesta);
  if (sentences.length > 5) {
    flags.push({ rule: 'R1', msg: sentences.length + ' frases (>5)' });
  }
  sentences.forEach(function (s, si) {
    var wc = wordCount(s);
    if (wc > 12) {
      flags.push({
        rule: 'R2',
        msg: 'frase #' + (si + 1) + ' tiene ' + wc + ' palabras (>12): ' +
             s.slice(0, 80)
      });
    }
  });

  // R6
  var abstractHits = ABSTRACT_NOUNS.filter(function (w) {
    var re = new RegExp('\\b' + w + '\\b', 'i');
    return re.test(respuesta);
  });
  if (abstractHits.length >= 3) {
    flags.push({
      rule: 'R6',
      msg: 'varios conceptos abstractos: ' + abstractHits.join(', ')
    });
  }

  // R9
  if (respuesta.length > 400) {
    flags.push({ rule: 'R9', msg: respuesta.length + ' chars (>400)' });
  }

  return {
    file: deckFile,
    idx: idx,
    pregunta: pregunta,
    flags: flags
  };
}

function auditDeck(deckFile) {
  var raw = fs.readFileSync(path.join(DECKS_DIR, deckFile), 'utf8');
  var deck;
  try { deck = JSON.parse(raw); }
  catch (e) { return [{ file: deckFile, idx: -1, pregunta: '<parse error>', flags: [{ rule: 'X', msg: e.message }] }]; }

  if (!Array.isArray(deck.tarjetas)) return [];
  return deck.tarjetas.map(function (card, i) {
    return auditCard(card, i, deckFile);
  });
}

function main() {
  ensureDir(OUT_DIR);
  var jsonOnly = process.argv.indexOf('--json') !== -1;

  var files = fs.readdirSync(DECKS_DIR)
    .filter(function (f) { return /\.json$/i.test(f); })
    .sort();

  var all = [];
  files.forEach(function (f) {
    var res = auditDeck(f);
    all = all.concat(res);
  });

  var withFlags = all.filter(function (r) { return r.flags.length; });

  fs.writeFileSync(
    path.join(OUT_DIR, 'audit.json'),
    JSON.stringify(withFlags, null, 2),
    'utf8'
  );

  if (!jsonOnly) {
    var byRule = {};
    withFlags.forEach(function (r) {
      r.flags.forEach(function (f) {
        byRule[f.rule] = (byRule[f.rule] || 0) + 1;
      });
    });

    console.log('Barajas analizadas:', files.length);
    console.log('Tarjetas con avisos:', withFlags.length);
    console.log('Distribución por regla:');
    Object.keys(byRule).sort().forEach(function (k) {
      console.log('  ' + k + ': ' + byRule[k]);
    });
    console.log('Detalle completo en audit-out/audit.json');
  }
}

main();