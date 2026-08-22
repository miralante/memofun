/* Standalone static dev server for Memofun. Vanilla Node `http`, no
   dependencies. Reads files from the repo root, serves 404.html on
   miss, no-cache headers so every reload reflects the latest changes
   (we don't want the SW cache to mask edits during local dev).

   Starts detached: the parent process exits as soon as the listener is
   bound, so the server keeps running independently of the shell that
   launched it. Stop with `taskkill /F /IM node.exe /FI "PID eq <pid>"`
   (the PID is printed on stdout) or by killing all node.exe. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PORT = 8080;
const HOST = '127.0.0.1';
const MIME = {
  '.html': 'text/html;charset=utf-8',
  '.css':  'text/css;charset=utf-8',
  '.js':   'application/javascript;charset=utf-8',
  '.json': 'application/json;charset=utf-8',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const server = http.createServer(function (req, res) {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.normalize(path.join(ROOT, p));
  if (!fp.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(fp, function (err, st) {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
      fs.createReadStream(path.join(ROOT, '404.html')).pipe(res);
      return;
    }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    fs.createReadStream(fp).pipe(res);
  });
});

server.listen(PORT, HOST, function () {
  console.log('memofun dev server pid=' + process.pid + ' http://' + HOST + ':' + PORT);
});