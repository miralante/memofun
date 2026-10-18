/* ==========================================================================
   Memofun — localStorage persistence
   Exposes window.App.storage.get(key) / .set(key, data) / .remove(key) /
   .clearAll(). Internal prefix: 'memofun:'. No personal data, no accounts.

   Progress contract (SPEC.md §2.2 and §2.6): stars live only in
   sessionStorage, for the session in which the person studies. They are
   never written to localStorage, so a returning visit starts at zero and
   the product gives no permanent score as an excuse not to come back.
   localStorage 'progress' holds only `completed` (which decks have been
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
      // Support both null (key absent) and the literal string 'null' that
      // results from buggy older code writing JSON.stringify(null).
      var data = (raw && raw !== 'null') ? JSON.parse(raw) : {};
      /* Migrate 'estrellas' → 'stars' (Apr 2025 rename). Read both keys so
         existing users keep their progress; prefer 'stars' if both are present. */
      if ('estrellas' in data && !('stars' in data)) {
        data.stars = data.estrellas;
        delete data.estrellas;
        try { localStorage.setItem(PREFIX + key, JSON.stringify(data)); } catch (e2) { /* tolerated */ }
      }
      return data;
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

  /* Session-only record of the stars earned in this visit (sessionStorage
     survives page changes in the same tab, and is dropped when the tab
     closes). Shape: { stars: N, done: { deckId: true } }. */
  var SESSION_KEY = PREFIX + 'session';

  function readSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      var data = raw ? JSON.parse(raw) : {};
      return (data && typeof data === 'object') ? data : {};
    } catch (e) {
      return {};
    }
  }

  function writeSession(data) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
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
    } catch (e) {
      /* keep going: the session record is cleared below regardless */
    }
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    return true;
  }

  /** Marks a deck as completed at least once (kept on the device) and
      earns one star for this session. A deck gives its star once per
      session, so repeating it in the same visit does not inflate the
      count (SPEC.md §2.2). Stars are never written to localStorage. */
  function completeDeck(deckId) {
    var session = readSession();
    session.stars = session.stars || 0;
    session.done = session.done || {};
    if (!session.done[deckId]) {
      session.done[deckId] = true;
      session.stars += 1;
    }
    writeSession(session);

    var progress = get('progress');
    progress.completed = progress.completed || {};
    progress.completed[deckId] = true;
    set('progress', progress);
    return session;
  }

  /** Stars earned in this session, shown in the header on every page. Reads
      only the session record: a visit that starts fresh shows 0. */
  function totalStars() {
    return readSession().stars || 0;
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
