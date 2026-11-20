'use strict';
/* One-off: rewrite the TASL metadata of the nine flashcards whose image was
   replaced by the official ISO 7010 / NTP 399 vector sign (the old ones were
   blurry crops of the course book, page 20).
   Usage: node scripts/one-off/actualizar-senales.js */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const DECK = path.join(REPO, 'decks', 'fpb_sa_1_itinerario-personal-empleabilidad',
  'tema-2-tecnicas-prevencion-proteccion', 'senalizacion-seguridad.json');

const BASE_IMG = 'assets/img/decks/fpb_sa_1_itinerario-personal-empleabilidad/' +
  'tema-2-tecnicas-prevencion-proteccion/senalizacion-seguridad/';

// file name -> new metadata
const META = {
  'senal-inflamables.jpg': {
    title: 'NTP 399 PELIGRO, SUSTANCIAS O MATERIAS INFLAMABLES O PELIGRO INFLAMABLE',
    source: 'https://commons.wikimedia.org/wiki/File:NTP_399_NTP_399_PELIGRO,_SUSTANCIAS_O_MATERIAS_INFLAMABLES_O_PELIGRO_INFLAMABLE.svg',
    alt: 'Triángulo de advertencia amarillo con una llama negra dentro',
    autor: 'Bigguy637',
    licencia: 'CC0',
  },
  'senal-caida.jpg': {
    title: 'ISO 7010 W011 – Caída a distinto nivel',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_W011.svg',
    alt: 'Triángulo de advertencia amarillo con una persona cayendo de una altura',
    autor: 'MaxxL',
    licencia: 'Public domain',
  },
  'senal-prohibido-fumar.jpg': {
    title: 'ISO 7010 P003 – Prohibido fumar y encender fuego',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_P003.svg',
    alt: 'Círculo rojo tachado en diagonal con un mechero encendido dentro',
    autor: 'ISO',
    licencia: 'Public domain',
  },
  'senal-no-tocar.jpg': {
    title: 'ISO 7010 P010 – No tocar',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_P010.svg',
    alt: 'Círculo rojo tachado en diagonal con una mano extendida dentro',
    autor: 'ISO',
    licencia: 'Public domain',
  },
  'senal-via-peatones.jpg': {
    title: 'ISO 7010 M024 – Vía obligatoria para peatones',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_M024.svg',
    alt: 'Círculo azul con una persona caminando dentro',
    autor: 'ISO',
    licencia: 'Public domain',
  },
  'senal-proteccion-oido.jpg': {
    title: 'ISO 7010 M003 – Protección obligatoria del oído',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_M003.svg',
    alt: 'Círculo azul con una cabeza con cascos de protección auditiva dentro',
    autor: 'ISO',
    licencia: 'Public domain',
  },
  'senal-extintor.jpg': {
    title: 'ISO 7010 F001 – Extintor',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_F001.svg',
    alt: 'Cuadrado rojo con el pictograma de un extintor y llamas',
    autor: 'MaxxL',
    licencia: 'Public domain',
  },
  'senal-manguera-incendios.jpg': {
    title: 'ISO 7010 F002 – Manguera contra incendios',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_F002.svg',
    alt: 'Cuadrado rojo con el pictograma de un carrete de manguera y llamas',
    autor: 'MaxxL',
    licencia: 'Public domain',
  },
  'senal-telefono-salvamento.jpg': {
    title: 'ISO 7010 E004 – Teléfono de salvamento',
    source: 'https://commons.wikimedia.org/wiki/File:ISO_7010_E004.svg',
    alt: 'Cuadrado verde con el pictograma de un auricular de teléfono y una cruz',
    autor: 'MaxxL',
    licencia: 'Public domain',
  },
};

const deck = JSON.parse(fs.readFileSync(DECK, 'utf8'));
let changed = 0;
const seen = new Set();

for (const card of deck.cards) {
  const img = card.image || card.imagen;
  if (!img) continue;
  const name = String(img.file || img.archivo || '').split('/').pop();
  const meta = META[name];
  if (!meta) continue;
  // keep the field names the deck already uses
  if ('title' in img) img.title = meta.title;
  if ('titulo' in img) img.titulo = meta.title;
  if ('source' in img) img.source = meta.source;
  if ('fuente' in img) img.fuente = meta.source;
  if ('alt' in img) img.alt = meta.alt;
  if ('autor' in img) img.autor = meta.autor;
  if ('licencia' in img) img.licencia = meta.licencia;
  seen.add(name);
  changed++;
  console.log('updated:', name);
}

const missing = Object.keys(META).filter((n) => !seen.has(n));
if (missing.length) {
  console.error('NOT MATCHED (card not found):', missing.join(', '));
  process.exit(1);
}

fs.writeFileSync(DECK, JSON.stringify(deck, null, 2) + '\n', 'utf8');
console.log('\n' + changed + ' tarjetas actualizadas en ' + path.basename(DECK));
