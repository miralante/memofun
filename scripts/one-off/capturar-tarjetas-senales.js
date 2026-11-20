'use strict';
/* One-off: captura la imagen de cada una de las nueve señales tal y como se ve
   dentro de la tarjeta de la app (herramienta de estudio) y monta una hoja
   3x3 para revisarlas de un vistazo.
   Usage: node scripts/one-off/capturar-tarjetas-senales.js [puerto] */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = Number(process.argv[2] || 8123);
const DECK = 'fpb_sa_1_itinerario-personal-empleabilidad/tema-2-tecnicas-prevencion-proteccion/senalizacion-seguridad.json';
const APP_URL = 'http://127.0.0.1:' + PORT + '/tools/study/index.html?deck=' +
  encodeURIComponent(DECK) + '&id=fpb-sa-1-ipe-t2-senalizacion&titulo=' +
  encodeURIComponent('Señalización de seguridad');
const OUT = path.resolve(__dirname, '..', '..', 'audit-out', 'tarjetas-senales');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#flashcard img', { timeout: 15000 });

  const shots = [];
  for (let i = 1; i <= 14; i++) {
    if (i >= 5 && i <= 13) {
      const file = path.join(OUT, String(i).padStart(2, '0') + '.png');
      await page.locator('#flashcard .card-image').screenshot({ path: file });
      shots.push(file);
    }
    if (i < 14) {
      await page.click('#btn-next');
      await page.waitForTimeout(350);
    }
  }

  // Hoja 3x3 con Chromium, sin dependencias de imagen.
  const cells = shots.map((f) =>
    '<figure><img src="file:///' + f.replace(/\\/g, '/') + '"><figcaption>' +
    path.basename(f, '.png') + '</figcaption></figure>').join('');
  const html = '<!doctype html><meta charset="utf-8"><style>' +
    'body{margin:0;background:#fff;font:16px system-ui;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px}' +
    'figure{margin:0;background:#f6f6f6;border:1px solid #ddd;padding:6px}' +
    'img{width:100%;display:block;background:#fff}' +
    'figcaption{text-align:center;color:#333;padding-top:4px}' +
    '</style>' + cells;
  const page2 = await browser.newPage({ viewport: { width: 1100, height: 1200 } });
  await page2.setContent(html, { waitUntil: 'load' });
  const out = path.resolve(__dirname, '..', '..', 'audit-out', 'tarjetas-senales.jpg');
  await page2.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 90 });
  console.log('hoja de tarjetas -> ' + out);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
