/* Memofun — success sounds on or off (hidden route for the person supporting the study).
   Saved in the shared 'prefs' object as prefs.sounds; feedback.js reads it. */
(function () {
  'use strict';

  var soundsGroup = document.getElementById('sounds-group');

  function paint(value) {
    App.utils.$$('.btn-pref', soundsGroup).forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.value === value));
    });
  }

  paint(App.storage.get('prefs').sounds === false ? 'off' : 'on');

  App.utils.$$('.btn-pref', soundsGroup).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var prefs = App.storage.get('prefs');
      prefs.sounds = btn.dataset.value !== 'off';
      App.storage.set('prefs', prefs);
      paint(btn.dataset.value);
    });
  });

  App.utils.registerServiceWorker('../sw.js');
})();
