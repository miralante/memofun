/* ============================================================
   Memofun — Service Worker
   Cache-first strategy for the app shell (works offline).
   When adding new files: add them to FILES and bump VERSION.
   Decks in decks/*.json are cached on first visit too (via fetch
   caching below), so a deck a student already opened keeps working
   offline; a brand-new deck needs one online visit first.
   ============================================================ */
var VERSION = 'memofun-v30';

var FILES = [
  './index.html',
  './offline.html',
  './404.html',
  './manifest.json',
  './app.js',
  './strings.es.js',
  './strings.en.js',
  './legal/index.html',
  './settings/index.html',
  './settings/app.js',
  './settings/strings.es.js',
  './settings/strings.en.js',
  './tools/study/index.html',
  './tools/study/app.js',
  './tools/study/strings.es.js',
  './tools/study/strings.en.js',
  './decks/manifest.json',
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/componentes.css',
  './assets/fonts/atkinson-hyperlegible-400.woff2',
  './assets/fonts/atkinson-hyperlegible-700.woff2',
  './assets/fonts/nunito-variable.woff2',
  './assets/img/icono.svg',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/js/deck-loader.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      var requests = FILES.map(function (a) {
        return new Request(a, { cache: 'reload' });
      });
      return cache.addAll(requests);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== VERSION; })
          .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (r) {
        if (r.status === 200) {
          var copy = r.clone();
          caches.open(VERSION).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return r;
      }).catch(function () {
        return caches.match('./offline.html').then(function (offline) {
          if (offline) return offline;
          return new Response(
            '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<title>Offline</title></head><body>' +
            '<h1>Offline</h1>' +
            '<p><a href="./index.html">Back to Memofun</a></p>' +
            '</body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        });
      });
    })
  );
});
