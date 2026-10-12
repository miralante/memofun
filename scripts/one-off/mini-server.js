/* Tiny static server just for the topic-icon verification — the in-repo
   dev-server.js crashes on Node 24 because of an unrelated `let → const`
   refactor in dev-server.js, which is a separate file from the navigation
   tree audit. This file is a runtime-only helper, kept under one-off/ so
   it does not drift into the prod stack. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const MIME = { '.html': 'text/html;charset=utf-8', '.css': 'text/css;charset=utf-8', '.js': 'application/javascript;charset=utf-8', '.json': 'application/json;charset=utf-8' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, p);
  fs.readFile(fp, (e, data) => {
    if (e) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(8090, '127.0.0.1', () => console.log('mini pid=' + process.pid + ' http://127.0.0.1:8090'));
