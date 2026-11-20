/* Búsqueda de candidatos en Wikimedia Commons para las tres cartas nuevas
 * de la baraja «Buenas prácticas» (tema 2 de IPP):
 *   - seguir las instrucciones de seguridad
 *   - no usar máquinas si no sabes cómo funcionan
 *   - informar si ves algo peligroso
 *
 * Solo lista: imprime título, licencia, autor y URL del thumbnail para
 * 1024 px. No descarga nada (eso lo hace descargar-imagenes.js).
 *
 * Uso: node scripts/one-off/buscar-imagenes-buenas-practicas.js "consulta"
 */
'use strict';
const https = require('https');

const UA = 'Mozilla/5.0 (compatible; memofun-deck-tools/1.0; +educational)';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(res.headers.location));
      }
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function strip(html) {
  return String(html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function search(query, limit) {
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search' +
    '&gsrsearch=' + encodeURIComponent('filetype:bitmap ' + query) +
    '&gsrnamespace=6&gsrlimit=' + (limit || 12) +
    '&prop=imageinfo&iiprop=' + encodeURIComponent('url|extmetadata|size') +
    '&iiurlwidth=1024&format=json';
  const res = await get(api);
  if (res.status !== 200) {
    console.error('  HTTP ' + res.status);
    return [];
  }
  let data;
  try { data = JSON.parse(res.body); } catch (e) { console.error('  JSON inválido'); return []; }
  if (data.error) { console.error('  ERROR API: ' + data.error.info); return []; }
  const pages = (data.query && data.query.pages) ? Object.keys(data.query.pages).map((k) => data.query.pages[k]) : [];
  return pages.map((p) => {
    const ii = (p.imageinfo && p.imageinfo[0]) || {};
    const md = ii.extmetadata || {};
    return {
      title: p.title,
      lic: strip(md.LicenseShortName && md.LicenseShortName.value) || '?',
      autor: strip(md.Artist && md.Artist.value) || '?',
      w: ii.width, h: ii.height,
      thumb: ii.thumburl || ii.url,
      desc: strip(md.ImageDescription && md.ImageDescription.value).slice(0, 160)
    };
  });
}

(async function () {
  const queries = process.argv.slice(2);
  const list = queries.length ? queries : [
    'safety briefing workers supervisor factory',
    'worker reading machine manual instruction',
    'worker reporting hazard pointing workplace'
  ];
  for (const q of list) {
    console.log('\n=== ' + q + ' ===');
    const rows = await search(q, 12);
    console.error('  (filas: ' + rows.length + ')');(q, 12);
    rows.forEach((r, i) => {
      console.log(`${i + 1}. ${r.title}`);
      console.log(`   ${r.lic} | ${r.autor} | ${r.w}x${r.h}`);
      if (r.desc) console.log('   ' + r.desc);
      console.log('   ' + r.thumb);
    });
    await sleep(2000);
  }
})();
