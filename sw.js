/* ============================================================
   Memofun — Service Worker
   Cache-first strategy for the app shell (works offline).
   When adding new files: add them to FILES and bump VERSION.
   Decks in decks/*.json are cached on first visit too (via fetch
   caching below), so a deck a student already opened keeps working
   offline; a brand-new deck needs one online visit first.
   ============================================================ */
var VERSION = 'memofun-v108';

var FILES = [
  './',
  './offline.html',
  './404.html',
  './manifest.json',
  './app.js',
  './strings.es.js',
  './strings.en.js',
  './about/',
  './about/styles.css',
  './about/strings.es.js',
  './about/strings.en.js',
  './legal/',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  './config/',
  './config/app.js',
  './config/strings.es.js',
  './config/strings.en.js',
  './tools/study/',
  './tools/study/app.js',
  './tools/study/strings.es.js',
  './tools/study/strings.en.js',
  './decks/manifest.json',
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/componentes.css',
  './assets/css/locale-picker.css',
  './assets/js/locale-picker.js',
  './assets/js/locale-picker-config.js',
  './assets/js/site-greeting.js',
  './assets/js/team-i18n.js',
  './assets/js/sw-register.js',
  './assets/fonts/atkinson-hyperlegible-400.woff2',
  './assets/fonts/atkinson-hyperlegible-700.woff2',
  './assets/fonts/nunito-variable.woff2',
  './assets/img/icono.svg',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/js/deck-loader.js',

  /* Public landing site/. Added when /site/ was created; bump VERSION
     so installed PWAs refetch the shell and pick the new files. */
  './site/',
  './site/styles.css',
  './site/strings.es.js',
  './site/strings.en.js',

  /* IPP course — FPB Servicios Administrativos 1º.
     Alcance: Temas 1-8 del temario oficial. La 5ª baraja de Tema 1
     (mapa conceptual que mezclaba contenido de los temas 2 y 3)
     queda fuera por no ser fiel al material fuente capturado
     en D:/img_memofun/ipp/. */
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-1-seguridad-y-salud/salud-y-riesgo-laboral.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-1-seguridad-y-salud/riesgos-condiciones-seguridad.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-1-seguridad-y-salud/riesgos-ambientales.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-1-seguridad-y-salud/carga-de-trabajo-y-ergonomia.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-2-tecnicas-prevencion-proteccion/prevencion-y-proteccion-definicion.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-2-tecnicas-prevencion-proteccion/tecnicas-de-prevencion.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-2-tecnicas-prevencion-proteccion/tecnicas-de-proteccion.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-3-tecnicas-basicas-primeros-auxilios/concepto-de-primeros-auxilios.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-3-tecnicas-basicas-primeros-auxilios/lo-mas-importante-pas.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-3-tecnicas-basicas-primeros-auxilios/que-hacer-en-emergencias.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-3-tecnicas-basicas-primeros-auxilios/el-botiquin-basico.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-4-autoconocimiento-habilidades-personales/que-es-el-autoconocimiento.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-4-autoconocimiento-habilidades-personales/que-debo-conocer-de-mi.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-4-autoconocimiento-habilidades-personales/habilidades-personales.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-4-autoconocimiento-habilidades-personales/analisis-personal-importancia.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-5-habilidades-personales/importancia-competencias-personales.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-5-habilidades-personales/como-mejorar-habilidades.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-5-habilidades-personales/gestion-emocional-y-asertividad.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-5-habilidades-personales/comunicacion.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-5-habilidades-personales/escucha-activa.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-5-habilidades-personales/habilidades-en-entrevista.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-6-itinerarios-academicos-profesionales/que-es-itinerario-academico.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-6-itinerarios-academicos-profesionales/opciones-academicas.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-6-itinerarios-academicos-profesionales/entorno-sociolaboral.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-6-itinerarios-academicos-profesionales/herramientas-decision.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-7-la-busqueda-de-empleo/que-significa-buscar-empleo.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-7-la-busqueda-de-empleo/que-necesito-antes-de-empezar.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-7-la-busqueda-de-empleo/donde-buscar-empleo.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-7-la-busqueda-de-empleo/tipos-de-empleo.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-7-la-busqueda-de-empleo/curriculum-vitae.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-7-la-busqueda-de-empleo/carta-de-presentacion.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-7-la-busqueda-de-empleo/prepararse-para-entrevista.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-8-toma-de-decisiones-itinerario-personal/que-es-tomar-decisiones.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-8-toma-de-decisiones-itinerario-personal/que-es-itinerario-personal.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-8-toma-de-decisiones-itinerario-personal/importancia-buenas-decisiones.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-8-toma-de-decisiones-itinerario-personal/etapas-toma-decisiones.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-8-toma-de-decisiones-itinerario-personal/factores-que-influyen.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-8-toma-de-decisiones-itinerario-personal/construccion-itinerario.json',
  './decks/fpb_sa_1_itinerario-personal-empleabilidad/tema-8-toma-de-decisiones-itinerario-personal/tecnicas-mejores-decisiones.json',
  './decks/fpgm_ga_1_itinerario-personal-empleabilidad-1.json',
  './decks/fpgm_ga_1_itinerario-personal-empleabilidad-1_2.json',
  './decks/fpgm_ga_1_itinerario-personal-empleabilidad-1_3.json',
  './decks/fpgm_ga_2_itinerario-personal-empleabilidad-2.json',
  './decks/fpgm_ga_2_itinerario-personal-empleabilidad-2_2.json',
  './decks/fpgm_ga_2_itinerario-personal-empleabilidad-2_3.json',

  /* Técnicas Administrativas — FPB SA 1 — reorganized into topic folders */
  './decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-1-la-empresa/',
  './decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-2-areas-funcionales/',
  './decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-3-comunicacion/',
  './decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-4-correos-mensajeria/',
  './decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-5-material-oficina/',
  './decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-6-operaciones-cobro-excel/',
  './decks/fpb_sa_1_tecnicas-administrativas-basicas/tema-7-busqueda-empleo/'
];

/* Cloudflare answers EVERY "/x.html" URL with a 307 to its extensionless form
   (/index.html -> /, /404.html -> /404, /offline.html -> /offline). Following
   that redirect yields a response with `redirected === true`, and the Cache API
   PRESERVES that flag across a store/load round trip, so cache.addAll()
   silently poisons the entry under its original key. Chrome refuses to hand
   such a response to a top-level navigation ("Response served by service
   worker has redirections"). That is why going offline, or pressing Back onto
   a cached .html entry, broke the whole page.

   Rebuilding the response produces a brand-new object whose flag is false while
   keeping body, status and headers. */
function deRedirect(res) {
  if (!res || !res.redirected) return res;
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
}

/* addAll() stores the followed response as-is, so precache entry by entry and
   sanitise. Still all-or-nothing: a missing file rejects, as addAll did. */
function precache(cache, files) {
  return Promise.all(files.map(function (file) {
    /* cache: 'reload' avoids stale copies from the browser HTTP cache */
    return fetch(new Request(file, { cache: 'reload' })).then(function (res) {
      if (!res || !res.ok) throw new Error('precache failed: ' + file);
      return cache.put(file, deRedirect(res));
    });
  }));
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return precache(cache, FILES);
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
      /* A hit can come from a precache written by an older worker. */
      if (cached) return deRedirect(cached);
      return fetch(event.request).then(function (r) {
        if (r.status === 200) {
          caches.open(VERSION).then(function (cache) {
            cache.put(event.request, deRedirect(r.clone()));
          });
        }
        return deRedirect(r);
      }).catch(function () {
        return caches.match('./offline.html').then(function (offline) {
          /* This one IS a navigation response, so a poisoned entry here is
             exactly the reported failure. Sanitise it. */
          if (offline) return deRedirect(offline);
          return new Response(
            '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<title>Offline</title></head><body>' +
            '<h1>Offline</h1>' +
            '<p><a href="./">Back to Memofun</a></p>' +
            '</body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        });
      });
    })
  );
});
