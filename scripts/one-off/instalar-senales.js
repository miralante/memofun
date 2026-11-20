'use strict';
/* One-off: install the freshly rendered official safety-sign thumbnails into
   the deck's image folder, replacing the blurry photo crops that were cut
   out of the course book (page 20).
   Usage: node scripts/one-off/instalar-senales.js */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const SRC = path.join(REPO, '.tmp-cards', 'signs');
const DEST = path.join(REPO, 'assets', 'img', 'decks', 'fpb_sa_1_itinerario-personal-empleabilidad',
  'tema-2-tecnicas-prevencion-proteccion', 'senalizacion-seguridad');

// rendered name -> file name in the deck folder
const MAP = {
  'ntp-inflamables': 'senal-inflamables.jpg',
  'w011-caida-nivel': 'senal-caida.jpg',
  'p003-no-fuego': 'senal-prohibido-fumar.jpg',
  'p010-no-tocar': 'senal-no-tocar.jpg',
  'm024-via-peatones': 'senal-via-peatones.jpg',
  'm003-proteccion-oido': 'senal-proteccion-oido.jpg',
  'f001-extintor': 'senal-extintor.jpg',
  'f002-manguera': 'senal-manguera-incendios.jpg',
  'e004-telefono': 'senal-telefono-salvamento.jpg',
};

for (const [from, to] of Object.entries(MAP)) {
  const src = path.join(SRC, from + '.jpg');
  const dst = path.join(DEST, to);
  if (!fs.existsSync(src)) { console.error('MISSING SOURCE: ' + src); process.exit(1); }
  const before = fs.existsSync(dst) ? fs.statSync(dst).size : 0;
  fs.copyFileSync(src, dst);
  const after = fs.statSync(dst).size;
  console.log(
    to.padEnd(32) +
    (before ? String(Math.round(before / 1024)).padStart(4) : '   -') + ' KB ->' +
    String(Math.round(after / 1024)).padStart(4) + ' KB'
  );
}
console.log('\n' + Object.keys(MAP).length + ' imagenes instaladas en ' + DEST);
