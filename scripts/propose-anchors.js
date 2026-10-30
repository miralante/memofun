#!/usr/bin/env node
/*
 * Propone la PALABRA ANCLA de cada tarjeta: la palabra del anverso que
 * devuelve el término de la respuesta (guia-crear-elementos.md §2.3) y que
 * hay que subrayar con `<u>`.
 *
 * NO modifica ningún fichero de baraja. Solo informa por consola y deja
 * `audit-out/anclas-propuestas.json` con la propuesta de cada tarjeta.
 *
 * Reutiliza los mapas y la lógica de `audit-deck-anchors.js` (mismo módulo,
 * sin duplicar vocabulario). Mejoras sobre el auditor:
 *   - Busca también sinónimos de VARIAS PALABRAS ("red interna", "punto de
 *     recogida"), que el auditor no ve porque parte el anverso en palabras.
 *   - Prioriza la coincidencia por RAÍZ morfológica sobre el sinónimo.
 *   - Distingue la coincidencia que está en texto plano de la que cae
 *     dentro de la analogía de `<mark>` (la analogía NO cuenta como ancla:
 *     el ancla tiene que estar en el anverso, no solo en la analogía).
 *
 * Uso:
 *   node scripts/propose-anchors.js decks/fpb_sa_1_tecnicas-administrativas-basicas
 *   node scripts/propose-anchors.js decks/fpb_sa_1_tecnicas-administrativas-basicas --json
 *   node scripts/propose-anchors.js decks/... --salida=audit-out/anclas/mi-tema.json
 */

'use strict';

var fs = require('fs');
var path = require('path');
var auditor = require('./audit-deck-anchors.js');

var RAICES = auditor.RAICES;
var SINONIMOS = auditor.SINONIMOS;
var VACIAS = auditor.VACIAS;
var GENERICAS = auditor.GENERICAS;
var raizDe = auditor.raizDe;
var collectDecks = auditor.collectDecks;

var args = process.argv.slice(2).filter(function (a) {
  return a !== '--json' && a.indexOf('--salida=') !== 0;
});
var base = args[0];
var salida = 'audit-out/anclas-propuestas.json';
process.argv.slice(2).forEach(function (a) {
  if (a.indexOf('--salida=') === 0) salida = a.slice('--salida='.length);
});
if (!base) {
  console.error('Falta la carpeta de barajas. Ejemplo:\n' +
    '  node scripts/propose-anchors.js decks/fpb_sa_1_tecnicas-administrativas-basicas');
  process.exit(1);
}
var OUT_DIR = path.resolve(__dirname, '..', 'audit-out');

/* Quita las etiquetas y devuelve el texto plano con la MISMA separación de
 * palabras que usa el auditor (para que raíz y sinónimos casen igual). */
function plain(texto) {
  return texto.replace(/<mark>[\s\S]*?<\/mark>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Trocea el anverso en: texto plano + zonas dentro de `<mark>` (analogía). */
function zonas(q) {
  var out = [];
  var re = /<mark>([\s\S]*?)<\/mark>/g;
  var last = 0;
  var m;
  while ((m = re.exec(q)) !== null) {
    if (m.index > last) out.push({ txt: q.slice(last, m.index), mark: false });
    out.push({ txt: m[1], mark: true });
    last = re.lastIndex;
  }
  if (last < q.length) out.push({ txt: q.slice(last), mark: false });
  return out;
}

/* Palabras de contenido de la respuesta. */
function palabrasRespuesta(a) {
  return auditor.norm(a).split(' ').filter(function (w) {
    return w.length > 2 && VACIAS.indexOf(w) === -1;
  });
}

/* Todas las sinónimos de una palabra, incluidos los de varias palabras. */
function sinonimosDe(aw) {
  var sin = SINONIMOS[aw] || [];
  var extra = Object.keys(SINONIMOS).filter(function (k) {
    return SINONIMOS[k].indexOf(aw) !== -1;
  }).map(function (k) { return k; });
  return sin.concat(extra);
}

/* Busca una frase (o palabra) dentro de un texto plano, sin acentos ni
 * mayúsculas, devolviendo la posición en el texto ORIGINAL (para poder
 * marcar el rango exacto). */
function buscar(texto, plano, frase) {
  var f = frase.toLowerCase()
    .replace(/[áéíóúüñ]/g, function (c) {
      return { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' }[c];
    });
  var p = plano.toLowerCase();
  var desde = 0;
  while (true) {
    var i = p.indexOf(f, desde);
    if (i === -1) return null;
    /* Que sea palabra completa por los dos lados. */
    var antes = i === 0 ? ' ' : p.charAt(i - 1);
    var despues = p.charAt(i + f.length);
    if (!/[a-z0-9áéíóúüñ]/i.test(antes) && !/[a-z0-9áéíóúüñ]/i.test(despues || ' ')) {
      return { inicio: i, fin: i + f.length };
    }
    desde = i + 1;
  }
}

/* ¿El candidato repite una palabra de la respuesta? entonces NO es un
 * ancla: el término ya está en el anverso (la tarjeta se regala). Se
 * comparan también las variantes de número ("empresa" / "empresas"), pero
 * NO la raíz: «organiza» SÍ ancla «organización» (guia §2.3). */
function repiteRespuesta(w, ans) {
  function formas(x) {
    var out = [x];
    if (/es$/.test(x) && x.length > 3) out.push(x.slice(0, -2));
    if (/s$/.test(x) && x.length > 3) out.push(x.slice(0, -1));
    return out;
  }
  var ws = formas(w);
  return ans.some(function (a) {
    var as = formas(a);
    return ws.some(function (x) { return as.indexOf(x) !== -1; });
  });
}

/* Candidatos de ancla de una tarjeta, ordenados de mejor a peor. */
function candidatos(q, a) {
  var zs = zonas(q);
  var plano = zs.map(function (z) { return z.txt; }).join(' ');
  plano = plano.replace(/\s+/g, ' ');
  var planoNorm = plano.toLowerCase()
    .replace(/[áéíóúüñ]/g, function (c) {
      return { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' }[c];
    });

  var res = [];
  var ans = palabrasRespuesta(a);
  var ansTodas = auditor.norm(a).split(' ').filter(function (w) { return w.length > 2; });
  ans.forEach(function (aw) {
    var raiz = raizDe(aw);
    /* 1) Misma raíz morfológica: la mejor señal. */
    Object.keys(RAICES).forEach(function (k) {
      var r = RAICES[k];
      if (raiz.length < 4) return;
      if (r !== raiz) return;
      zs.forEach(function (z) {
        var zp = z.txt.toLowerCase()
          .replace(/[áéíóúüñ]/g, function (c) {
            return { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' }[c];
          });
        zp.split(/[^a-z0-9]+/).forEach(function (w) {
          if (!w) return;
          if (w === aw) return; /* el término exacto regala la respuesta */
          if (repiteRespuesta(w, ansTodas)) return;
          if (raizDe(w) !== raiz) return;
          res.push({ palabra: w, tipo: 'raiz', termino: aw, mark: z.mark, zona: z.txt });
        });
      });
    });
    /* 2) Sinónimos: palabra o frase. */
    sinonimosDe(aw).forEach(function (s) {
      if (!s) return;
      var sNorm = s.toLowerCase()
        .replace(/[áéíóúüñ]/g, function (c) {
          return { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' }[c];
        });
      if (!repiteRespuesta(sNorm, ansTodas)) {
        zs.forEach(function (z) {
          var zp = z.txt.toLowerCase()
            .replace(/[áéíóúüñ]/g, function (c) {
              return { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' }[c];
            });
          if (sNorm.indexOf(' ') === -1) {
            if (zp.split(/[^a-z0-9]+/).indexOf(sNorm) === -1) return;
          } else {
            if (zp.indexOf(sNorm) === -1) return;
          }
          res.push({ palabra: s, tipo: 'sinonimo', termino: aw, mark: z.mark, zona: z.txt });
        });
      }
    });
  });

  /* Dedup + prioridad: raíz > sinónimo; fuera de `<mark>` > dentro. */
  var vistos = {};
  var out = [];
  res.forEach(function (c) {
    var k = c.palabra + '|' + c.termino;
    if (vistos[k]) { if (!c.mark) vistos[k].mark = false; return; }
    vistos[k] = c;
    out.push(c);
  });
  out.sort(function (x, y) {
    if (x.mark !== y.mark) return x.mark ? 1 : -1;
    if (x.tipo !== y.tipo) return x.tipo === 'raiz' ? -1 : 1;
    if (x.palabra.length !== y.palabra.length) return y.palabra.length - x.palabra.length;
    return 0;
  });
  return out;
}

function main() {
  var stat = fs.statSync(base);
  var files = stat.isDirectory() ? collectDecks(base, base, '', []) : [base];
  var out = [];
  files.forEach(function (f) {
    var deck = JSON.parse(fs.readFileSync(f, 'utf8'));
    var cards = deck.cards || deck.tarjetas;
    if (!Array.isArray(cards)) return;
    cards.forEach(function (card, i) {
      var q = card.question || card.pregunta || '';
      var a = card.answer || card.respuesta || '';
      var cands = candidatos(q, a);
      var elegida = cands[0] || null;
      out.push({
        file: path.relative(path.resolve(__dirname, '..'), f),
        idx: i,
        answer: auditor.norm(a),
        propuesta: elegida ? elegida.palabra : null,
        tipo: elegida ? elegida.tipo : null,
        dentroDeMark: elegida ? elegida.mark : null,
        candidatos: cands.map(function (c) {
          return c.palabra + '→' + c.termino + (c.mark ? ' (mark)' : '');
        })
      });
    });
  });

  var sinPropuesta = out.filter(function (r) { return !r.propuesta; });
  var soloEnMark = out.filter(function (r) {
    return r.propuesta && r.dentroDeMark;
  });

  console.log('Barajas: ' + files.length + ' | tarjetas: ' + out.length);
  console.log('Con ancla propuesta: ' + (out.length - sinPropuesta.length) +
    ' | sin propuesta: ' + sinPropuesta.length +
    ' | solo dentro de <mark>: ' + soloEnMark.length);
  console.log('');

  if (!process.argv.includes('--json')) {
    console.log('=== SIN PROPUESTA (revisar a mano) ===');
    sinPropuesta.forEach(function (r) {
      console.log('  [' + (r.idx + 1) + '] ' + path.basename(r.file) + ' — ' + r.answer);
    });
    console.log('');
    console.log('=== PROPUESTA SOLO DENTRO DE <mark> ===');
    soloEnMark.forEach(function (r) {
      console.log('  [' + (r.idx + 1) + '] ' + path.basename(r.file) + ' — ' +
        r.answer + ' → ' + r.propuesta);
    });
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  var destino = path.resolve(__dirname, '..', salida);
  var dirDestino = path.dirname(destino);
  if (!fs.existsSync(dirDestino)) fs.mkdirSync(dirDestino, { recursive: true });
  fs.writeFileSync(destino,
    JSON.stringify(out, null, 2), 'utf8');
  console.log('\nPropuestas en ' + salida);
}

main();
