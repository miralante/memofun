'use strict';
/* One-off: rasterise the downloaded safety-sign vectors (SVG or PNG) to
   clean JPEG thumbnails (1024x1024, white background, sign centred).
   Chromium via Playwright renders the SVG; the PNG variants are re-encoded
   through the same page so every output file is a real JPEG.
   Usage: node scripts/one-off/renderizar-vectores.js
   Output: .tmp-cards/signs/<name>.jpg */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const TMP = path.resolve(__dirname, '..', '..', '.tmp-cards');
const SRC = path.join(TMP, 'signs-svg');
const OUT = path.join(TMP, 'signs');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const names = [...new Set(fs.readdirSync(SRC)
    .filter((f) => /\.(svg|png)$/i.test(f))
    .map((f) => f.replace(/\.(svg|png)$/i, '')))]
    .sort();

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });

  for (const name of names) {
    const svgPath = path.join(SRC, name + '.svg');
    const pngPath = path.join(SRC, name + '.png');
    let inner;
    if (fs.existsSync(svgPath)) {
      inner = fs.readFileSync(svgPath, 'utf8');
      // The ISO 7010 files carry width/height but no viewBox, so scaling
      // them to the canvas needs an explicit viewBox derived from those
      // attributes -- otherwise the drawing keeps its pixel size and sits
      // unscaled in the corner of the canvas.
      if (!/viewBox\s*=/i.test(inner.slice(0, 400))) {
        const w = inner.match(/<svg[^>]*\bwidth\s*=\s*["']?([\d.]+)/i);
        const h = inner.match(/<svg[^>]*\bheight\s*=\s*["']?([\d.]+)/i);
        if (w && h) {
          inner = inner.replace(/<svg\b/i, `<svg viewBox="0 0 ${w[1]} ${h[1]}"`);
        }
      }
      inner = inner.replace(/<svg\b([^>]*)>/i, (m, attrs) => {
        const cleaned = attrs.replace(/\s(width|height)\s*=\s*["'][^"']*["']/gi, '');
        return `<svg${cleaned} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`;
      });
    } else {
      const b64 = fs.readFileSync(pngPath).toString('base64');
      inner = `<img src="data:image/png;base64,${b64}" style="max-width:100%;max-height:100%">`;
    }
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:0;background:#fff;width:1024px;height:1024px;overflow:hidden}
      .wrap{width:1024px;height:1024px;display:flex;align-items:center;justify-content:center;padding:32px;box-sizing:border-box}
      svg{display:block}
      img{max-width:100%;max-height:100%}
    </style></head><body><div class="wrap">${inner}</div></body></html>`;
    await page.setContent(html, { waitUntil: 'load' });
    const out = path.join(OUT, name + '.jpg');
    await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
    console.log('  ', name, Math.round(fs.statSync(out).size / 1024) + ' KB');
  }
  await browser.close();
  console.log('rendered', names.length);
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
