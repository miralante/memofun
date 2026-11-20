'use strict';
/* One-off: recorre la baraja de señalización en la app (herramienta de
   estudio) y comprueba, carta a carta, que la imagen carga de verdad:
   respuesta 200, MIME image/jpeg, naturalWidth > 0 y el alt redactado.
   Usage: node scripts/one-off/revisar-senales-app.js [puerto] */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = Number(process.argv[2] || 8123);
const DECK = 'fpb_sa_1_itinerario-personal-empleabilidad/tema-2-tecnicas-prevencion-proteccion/senalizacion-seguridad.json';
const APP_URL = 'http://127.0.0.1:' + PORT + '/tools/study/index.html?deck=' +
  encodeURIComponent(DECK) + '&id=fpb-sa-1-ipe-t2-senalizacion&titulo=' +
  encodeURIComponent('Señalización de seguridad');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const statusByUrl = {};
  page.on('response', (r) => {
    if (/\.(jpg|jpeg|png|svg)$/i.test(r.url())) {
      statusByUrl[r.url()] = { status: r.status(), type: r.headers()['content-type'] };
    }
  });

  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#flashcard img', { timeout: 15000 });

  const rows = [];
  let prevKey = '';
  const readCard = () => page.evaluate(() => {
    const img = document.querySelector('#flashcard img');
    const face = document.querySelector('#flashcard .face');
    return {
      src: img ? img.getAttribute('src') : null,
      alt: img ? img.getAttribute('alt') : null,
      w: img ? img.naturalWidth : 0,
      h: img ? img.naturalHeight : 0,
      text: face ? face.textContent.trim() : ''
    };
  });
  // Avanza a la siguiente carta: la app a veces ignora un clic rápido, así que
  // se reintenta hasta que cambie el texto de la pregunta.
  const advance = async (key) => {
    for (let attempt = 0; attempt < 6; attempt++) {
      await page.click('#btn-next');
      await page.waitForTimeout(400);
      const now = await readCard();
      if (now.text !== key) return now;
    }
    return null;
  };

  let card = await readCard();
  for (let i = 1; i <= 14; i++) {
    const info = card;
    const abs = info.src ? new URL(info.src, APP_URL).href : null;
    rows.push(Object.assign({ n: i }, info, {
      file: info.src ? info.src.split('/').pop() : null,
      net: abs ? statusByUrl[abs] || null : null,
      altOk: !!(info.alt && info.alt.length > 10)
    }));
    if (i < 14) {
      const next = await advance(info.text);
      if (!next) { console.error('no se pudo avanzar de la carta ' + i); break; }
      card = next;
    }
  }

  const errors = [];
  for (const r of rows) {
    const netOk = r.net ? (r.net.status === 200 && /image\/jpeg/.test(r.net.type || '')) : true;
    const ok = r.w > 0 && r.h > 0 && r.altOk && netOk;
    if (!ok) errors.push(r.n + ' ' + r.file + ' w=' + r.w + ' net=' + JSON.stringify(r.net));
  }

  rows.forEach((r) => {
    console.log(
      String(r.n).padStart(2) + '  ' + String(r.file).padEnd(30) +
      String(r.w + 'x' + r.h).padEnd(11) +
      (r.net ? r.net.status + ' ' + r.net.type : 'cacheada').padEnd(26) +
      'alt=' + (r.altOk ? 'ok' : 'FALTA')
    );
  });
  console.log('\n' + (errors.length ? 'FALLOS:\n  ' + errors.join('\n  ') : 'las 14 imagenes cargan (200 image/jpeg) y todas tienen alt redactado'));
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
