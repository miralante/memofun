/* Wires the greeting button on site/ to text-to-speech. Extracted from the
   inline script the page carried, which the CSP (`script-src 'self'`)
   blocked, so the button rendered but stayed silent in production. */
(function () {
  'use strict';
  if (typeof App === 'undefined' || !App.tts) return;

  var btn = document.getElementById('btnSaludo');
  if (!btn) return;

  btn.addEventListener('click', function () {
    App.tts.speak(App.i18n.t('saludo'));
  });
})();
