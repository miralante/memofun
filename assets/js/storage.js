/* ==========================================================================
   Memofun — localStorage persistence
   Exposes window.App.storage.get(key) / .set(key, data) / .remove(key) /
   .clearAll(). Internal prefix: 'memofun:'. No personal data, no accounts.

   Progress contract (SPEC.md §2.6, same as Apptonomia): only 'progreso'
   is written by the study flow, and it only ever holds `estrellas`
   (integer, only added to) and `completado` (which decks have been
   studied through at least once). Never stored: failures, time taken,
   attempt counts, or anything that identifies the person.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var PREFIX = 'memofun:';

  (function applyTextSize() {
    try {
      var raw = localStorage.getItem(PREFIX + 'prefs');
      var prefs = raw ? JSON.parse(raw) : {};
      var SCALE = { normal: 1, large: 1.15, extraLarge: 1.3 };
      var scale = SCALE[prefs.textSize] || 1;
      document.documentElement.style.setProperty('--text-scale', scale);
    } catch (e) { /* silent: keeps the default size */ }
  })();

  function get(key) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function set(key, data) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearAll() {
    try {
      var toDelete = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) toDelete.push(k);
      }
      toDelete.forEach(function (k) { localStorage.removeItem(k); });
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Marks a deck as completed at least once and adds one star. Stars only
      ever go up (SPEC.md §2.2: never subtracted as punishment). */
  function completeDeck(deckId) {
    var progreso = get('progreso');
    progreso.estrellas = (progreso.estrellas || 0) + 1;
    progreso.completado = progreso.completado || {};
    progreso.completado[deckId] = true;
    set('progreso', progreso);
    return progreso;
  }

  /** Total stars earned across every deck, shown in the header on every
      page (same pattern as Apptonomia's estrellasTotales()). Memofun
      keeps a single 'progreso' record rather than one per deck, so this
      is a direct read rather than a sum across keys. */
  function totalStars() {
    return get('progreso').estrellas || 0;
  }

  window.App.storage = {
    get: get,
    set: set,
    remove: remove,
    clearAll: clearAll,
    completeDeck: completeDeck,
    totalStars: totalStars
  };
})();
