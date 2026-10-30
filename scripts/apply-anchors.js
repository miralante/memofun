#!/usr/bin/env node
/*
 * Aplica las PALABRAS ANCLA a las barajas: envuelve el ancla elegida en
 * `<u></u>` dentro del anverso (`question`), para que se dibuje
 * subrayada en la pantalla de estudio (guia-crear-elementos.md §2.3).
 *
 * NO decide cuál es el ancla: eso lo hace quien revisa la tarjeta. Aquí
 * solo se ejecuta una decisión ya tomada, que viene en un fichero de
 * mapa con esta forma:
 *
 *   [
 *     { "file": "decks/.../baraja.json", "idx": 3, "ancla": "organiza" },
 *     { "file": "decks/.../otra.json",  "idx": 0, "ancla": "el primero de los tres" }
 *   ]
 *
 * `file` es la ruta relativa a la raíz del repo. `idx` es el índice de
 * la tarjeta dentro de `cards`. `ancla` es el TEXTO EXACTO del anverso
 * que se quiere subrayar (se busca sin distinguir mayúsculas, tildes ni
 * el número de espacios).
 *
 * Reglas al aplicar:
 *   - La ocurrencia tiene que estar FUERA de `<mark>`: la analogía es
 *     otra señal, el ancla va en el texto del anverso.
 *   - Idempotente: si el ancla ya está entre `<u>`, no se toca.
 *   - Si no encuentra el texto, NO lo inventa: lo informa y deja la
 *     tarjeta como estaba.
 *
 * Uso:
 *   node scripts/apply-anchors.js audit-out/anclas/mi-mapa.json
 *   node scripts/apply-anchors.js audit-out/anclas/mi-mapa.json --check
 */

'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
var check = args.indexOf('--check') !== -1;
var mapa = args.filter(function (a) { return a !== '--check'; })[0];
if (!mapa) {
  console.error('Falta el fichero de mapa. Ejemplo:\n' +
    '  node scripts/apply-anchors.js audit-out/anclas/tema-1.json');
  process.exit(1);
}

var ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' };

function norm(s) {
  return s.toLowerCase()
    .replace(/[áéíóúüñ]/g, function (c) { return ACENTOS[c]; });
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

/* Busca el ancla en el anverso. Devuelve {inicio, fin} o null.
 * La frase puede llevar espacios flexibles entre palabras. */
function buscar(q, ancla) {
  var rangos = rangosMark(q);
  var partes = norm(ancla).trim().split(/\s+/);
  var patron = partes.map(function (p) {
    return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('\\s+');
  var re = new RegExp(patron, 'g');
  var qn = norm(q);
  var m;
  var fallback = null;
  while ((m = re.exec(qn)) !== null) {
    var ini = m.index;
    var fin = m.index + m[0].length;
    /* ¿La coincidencia cae dentro de una etiqueta? entonces no vale:
     * el ancla es texto del anverso, no marcado. */
    var enMarca = dentroDeMark(rangos, ini, fin);
    var cruzaEtiqueta = /[<>]/.test(q.slice(ini, fin));
    if (enMarca || cruzaEtiqueta) {
      if (!fallback) fallback = { inicio: ini, fin: fin, enMarca: enMarca };
      continue;
    }
    return { inicio: ini, fin: fin };
  }
  return fallback;
}

function aplicar() {
  var entradas = JSON.parse(fs.readFileSync(mapa, 'utf8'));
  if (!Array.isArray(entradas)) {
    console.error('El mapa debe ser un array de entradas.');
    process.exit(1);
  }
  var porFichero = {};
  var problemas = [];

  entradas.forEach(function (e) {
    var rel = e.file.replace(/\\/g, '/');
    var abs = path.resolve(ROOT, rel);
    if (!fs.existsSync(abs)) {
      problemas.push('NO EXISTE el fichero: ' + rel);
      return;
    }
    var deck = JSON.parse(fs.readFileSync(abs, 'utf8'));
    var cards = deck.cards || deck.tarjetas;
    if (!cards || !cards[e.idx]) {
      problemas.push('NO EXISTE la tarjeta ' + e.idx + ' en ' + rel);
      return;
    }
    var card = cards[e.idx];
    var q = card.question || card.pregunta || '';
    var ancla = (e.ancla || '').trim();
    if (!ancla) {
      problemas.push('ANCLA VACÍA en ' + rel + ' [' + e.idx + ']');
      return;
    }
    if (/<u>[\s\S]*?<\/u>/.test(q)) {
      var ya = q.match(/<u>([\s\S]*?)<\/u>/);
      if (ya && norm(ya[1]).indexOf(norm(ancla)) !== -1) {
        porFichero[rel] = porFichero[rel] || { ok: 0, ya: 0, mal: 0 };
        porFichero[rel].ya++;
        return;
      }
    }
    var pos = buscar(q, ancla);
    if (!pos) {
      problemas.push('NO SE ENCUENTRA "' + ancla + '" en ' + rel + ' [' + e.idx + ']');
      return;
    }
    if (pos.enMarca) {
      problemas.push('SOLO DENTRO DE <mark>: "' + ancla + '" en ' + rel + ' [' + e.idx + ']');
      return;
    }
    if (!check) {
      var nueva = q.slice(0, pos.inicio) + '<u>' + q.slice(pos.inicio, pos.fin) +
        '</u>' + q.slice(pos.fin);
      card.question = nueva;
      if (card.pregunta) card.pregunta = nueva;
      fs.writeFileSync(abs, JSON.stringify(deck, null, 2) + '\n', 'utf8');
    }
    porFichero[rel] = porFichero[rel] || { ok: 0, ya: 0, mal: 0 };
    porFichero[rel].ok++;
  });

  console.log((check ? 'CHEQUEO (no escribe)' : 'APLICADO') + ' — ' + entradas.length + ' entradas');
  Object.keys(porFichero).sort().forEach(function (k) {
    var v = porFichero[k];
    console.log('  ' + k + ' → ' + v.ok + ' subrayadas' +
      (v.ya ? ', ' + v.ya + ' ya estaban' : ''));
  });
  if (problemas.length) {
    console.log('\nPROBLEMAS (' + problemas.length + '):');
    problemas.forEach(function (p) { console.log('  ' + p); });
    process.exitCode = 1;
  }
}

aplicar();
