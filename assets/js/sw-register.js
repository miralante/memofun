/* Registers the service worker from any page, replacing the inline snippet
   each entry point used to carry. Two reasons to externalise it:

   1. The CSP (`script-src 'self'`) blocked those inline scripts, so the
      registration silently never ran from about/, legal/, site/ or team/.
   2. It removes the per-page relative path ('./sw.js' vs '../sw.js'), which
      is exactly the kind of thing that breaks when a page moves.

   The sw.js URL is resolved against this file's own location
   (assets/js/sw-register.js -> ../../sw.js), so it lands on the site root
   no matter how deep the calling page is.

   Lazy + try/catch: older browsers, and private modes where
   navigator.serviceWorker is unavailable, must no-op rather than throw. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  var here = document.currentScript && document.currentScript.src;
  var swUrl = here ? new URL('../../sw.js', here).href : '/sw.js';

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl).catch(function (err) {
      console.warn('[memofun] service worker registration failed:', err);
    });
  });
})();
