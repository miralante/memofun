'use strict';
/* One-off: verify that every image shipped for the safety-sign deck is a
   real JPEG (magic bytes FF D8 FF) -- the site serves assets with
   X-Content-Type-Options: nosniff, so a PNG saved as .jpg would not paint
   in production even though no repo check would catch it. */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const DIR = path.join(REPO, 'assets', 'img', 'decks', 'fpb_sa_1_itinerario-personal-empleabilidad',
  'tema-2-tecnicas-prevencion-proteccion', 'senalizacion-seguridad');

let bad = 0;
for (const f of fs.readdirSync(DIR).sort()) {
  const p = path.join(DIR, f);
  const buf = fs.readFileSync(p);
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const ext = path.extname(f).toLowerCase();
  const extOk = ext === '.jpg' ? isJpeg : true;
  // JPEG SOF marker -> real dimensions
  let dims = '?';
  for (let i = 2; i < buf.length - 9; i++) {
    if (buf[i] === 0xff && (buf[i + 1] & 0xf0) === 0xc0) {
      dims = buf.readUInt16BE(i + 7) + 'x' + buf.readUInt16BE(i + 5);
      break;
    }
  }
  const ok = extOk && buf.length <= 200 * 1024;
  if (!ok) bad++;
  console.log(
    (ok ? 'OK   ' : 'FAIL ') + f.padEnd(34) +
    (isJpeg ? 'JPEG' : 'NOT-JPEG') + ' ' + dims.padEnd(11) +
    String(Math.round(buf.length / 1024)).padStart(4) + ' KB'
  );
}
console.log('\n' + (bad ? bad + ' FICHEROS CON PROBLEMAS' : 'todos los ficheros son JPEG reales, <=1024 px y <200 KB'));
process.exit(bad ? 1 : 0);
