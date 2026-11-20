/* Descarga de imágenes de Wikimedia Commons para la baraja «Buenas prácticas»
 * (tema 2 de IPP). Secuencial, con pausa entre peticiones: la API limita las
 * peticiones y upload.wikimedia.org devuelve 429 ante ráfagas.
 *
 * Uso:
 *   node scripts/one-off/descargar-imagenes-buenas-practicas.js
 *
 * La lista de ficheros está en DESCARGAS. Cada entrada dice el título en
 * Commons y el nombre final en la carpeta del deck. */
'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (compatible; memofun-deck-tools/1.0; +educational)';
const DEST = path.resolve(__dirname, '..', '..', 'assets', 'img', 'decks',
  'fpb_sa_1_itinerario-personal-empleabilidad', 'tema-2-tecnicas-prevencion-proteccion', 'buenas-practicas');

/* [título en Commons, nombre final] */
const DESCARGAS = [
  ['File:Safety Briefing (5640351037).jpg', 'instrucciones-seguridad.jpg'],
  ['File:Lockout Tagout (14853353063).jpg', 'candidata-maquina-lockout.jpg'],
  ['File:Power Lockout (13421721974).jpg', 'candidata-maquina-power-lockout.jpg'],
  ['File:Lockout Station at National Synchrotron Light Source II.jpg', 'candidata-maquina-lockout-station.jpg'],
  ['File:Safety Inspector Shawna Harden shares information with a driver.jpg', 'candidata-informar-inspector.jpg'],
  ['File:Safety Inspector Shawna Harden speaks to a driver.jpg', 'candidata-informar-inspector2.jpg'],
  ['File:Safety briefing before digging (53544262805).jpg', 'candidata-instrucciones-digging.jpg'],
  ['File:25-2LA Helicopter Safety Briefing (8832293).jpg', 'candidata-instrucciones-helicopter.jpg'],
  ['File:Bronze casting at Kunstgießerei München 01 - cropped.jpg', 'candidata-epi-bronce.jpg'],
  ['File:Prevencionderiesgoslaborales.jpg', 'candidata-formacion-prevencion.jpg']
];

function get(url, binary) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(res.headers.location, binary));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve({ status: res.statusCode, buffer: null });
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve({ status: 200, buffer: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function strip(html) {
  return String(html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function info(title) {
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' +
    encodeURIComponent(title) + '&prop=imageinfo&iiprop=' +
    encodeURIComponent('url|extmetadata|size') + '&iiurlwidth=1024&format=json';
  const res = await get(api);
  if (res.status !== 200) return null;
  const data = JSON.parse(res.buffer.toString('utf8'));
  const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];
  if (!pages.length || !pages[0].imageinfo) return null;
  const ii = pages[0].imageinfo[0];
  const md = ii.extmetadata || {};
  return {
    thumb: ii.thumburl || ii.url,
    w: ii.width, h: ii.height,
    lic: strip(md.LicenseShortName && md.LicenseShortName.value),
    autor: strip(md.Artist && md.Artist.value),
    desc: strip(md.ImageDescription && md.ImageDescription.value)
  };
}

(async function () {
  fs.mkdirSync(DEST, { recursive: true });
  for (const [title, name] of DESCARGAS) {
    process.stdout.write(title + ' -> ');
    let meta = null;
    for (let tries = 0; tries < 3 && !meta; tries++) {
      meta = await info(title);
      if (!meta) await sleep(2500);
    }
    if (!meta) { console.log('NO ENCONTRADA'); continue; }
    let guard = 0;
    while (guard++ < 4) {
      const res = await get(meta.thumb);
      if (res.status === 200 && res.buffer.length) {
        const out = path.join(DEST, name);
        fs.writeFileSync(out, res.buffer);
        console.log(name + ' (' + Math.round(res.buffer.length / 1024) + ' KB) | ' + meta.lic + ' | ' + meta.autor);
        console.log('   ' + meta.desc.slice(0, 140));
        break;
      }
      console.log('  HTTP ' + res.status + ', reintentando…');
      await sleep(3000);
    }
    await sleep(2000);
  }
})();
