/* One-off: servidor estático mínimo para revisar la app en el navegador.
 *
 *   node scripts/one-off/servidor-local.js [puerto]
 *
 * Sirve la raíz del repo en http://127.0.0.1:<puerto>/ sin cache, para que
 * los cambios de JSON/imágenes se vean al recargar.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = Number(process.argv[2] || 8123);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent((req.url || '/').split('?')[0]); }
  catch { res.writeHead(400); res.end('Bad request'); return; }

  let filePath = path.resolve(ROOT, pathname.replace(/^\/+/, '') || 'index.html');
  if (pathname === '/') filePath = path.join(ROOT, 'index.html');
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }

  const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('memofun en http://127.0.0.1:' + PORT + '/');
});
