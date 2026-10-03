/* ==========================================================================
   Memofun — Achievements catalog, unlock rules and badge grid
   Exposes window.App.achievements.list / .unlocked() / .achieve(id) /
   .sync(decks, opts) / .syncWithManifest(url, opts) / .render(container).

   Same shape as the sibling Teclatlon: unlocked achievements are stored
   as { id: timestamp } (localStorage 'memofun:achievements', through
   App.storage). Every rule is derived from data the app already keeps
   in 'progress' (stars + completed decks) plus decks/manifest.json, so
   people who already studied get their achievements the next time any
   page that calls sync() loads. Nothing here ever removes a star or an
   achievement, and there is no streak or timed goal on purpose
   (SPEC.md §2.2, §2.3 and the closed list in §3.7).

   Shown on the "About the app" page (about-app/), linked from the home
   footer right before "Settings". Texts come from App.i18n (keys
   achievement<Name>, achievement<Name>Desc, achievementLocked,
   achievementUnlockedAt), registered by about-app/strings.<locale>.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var KEY = 'achievements';
  var BIG_DECK_CARDS = 20;

  var LIST = [
    { id: 'firstStar',   icon: '⭐', key: 'achievementFirstStar' },
    { id: 'tenStars',    icon: '🌟', key: 'achievementTenStars' },
    { id: 'reviewAgain', icon: '🔁', key: 'achievementReviewAgain' },
    { id: 'fullSubject', icon: '🎓', key: 'achievementFullSubject' },
    { id: 'tenDecks',    icon: '🏆', key: 'achievementTenDecks' },
    { id: 'bigDeck',     icon: '🧠', key: 'achievementBigDeck' }
  ];

  /** Unlocked achievements as { id: timestamp }. */
  function unlocked() {
    var data = App.storage.get(KEY);
    return (data && typeof data === 'object') ? data : {};
  }

  /** Idempotent: stores the first unlock time and never overwrites it.
      Returns true only when the achievement is new. */
  function achieve(id) {
    var data = unlocked();
    if (data[id]) return false;
    data[id] = Date.now();
    App.storage.set(KEY, data);
    return true;
  }

  function completedIds(progress) {
    var done = progress.completed || {};
    return Object.keys(done).filter(function (id) { return !!done[id]; });
  }

  /** Every course+subject pair whose decks are all completed. */
  function hasFullSubject(decks, done) {
    var groups = {};
    decks.forEach(function (d) {
      if (!d || !d.course || !d.subject) return;
      var k = d.course + '|' + d.subject;
      groups[k] = groups[k] || [];
      groups[k].push(d.id);
    });
    return Object.keys(groups).some(function (k) {
      return groups[k].every(function (id) { return done.indexOf(id) !== -1; });
    });
  }

  function hasBigDeck(decks, done) {
    return decks.some(function (d) {
      return d && done.indexOf(d.id) !== -1 && Number(d.amount) >= BIG_DECK_CARDS;
    });
  }

  /** Unlocks every achievement whose rule is met by the saved progress.
      `decks` (the manifest array) is optional: without it, the rules
      that need the deck list are simply checked later. `opts.finishedCards`
      is the size of the deck just finished (covers decks outside the
      manifest). Returns the ids unlocked by this call. */
  function sync(decks, opts) {
    var progress = App.storage.get('progress');
    var stars = progress.stars || 0;
    var done = completedIds(progress);
    var fresh = [];
    function check(id, condition) {
      if (condition && achieve(id)) fresh.push(id);
    }
    check('firstStar', stars >= 1);
    check('tenStars', stars >= 10);
    /* Every finished pass adds one star (App.storage.completeDeck), so
       more stars than distinct decks means some deck was reviewed again. */
    check('reviewAgain', done.length >= 1 && stars > done.length);
    check('tenDecks', done.length >= 10);
    check('bigDeck', !!(opts && opts.finishedCards >= BIG_DECK_CARDS));
    if (Array.isArray(decks) && decks.length) {
      check('fullSubject', hasFullSubject(decks, done));
      check('bigDeck', hasBigDeck(decks, done));
    }
    return fresh;
  }

  /** sync() now with what is saved, then again once the manifest arrives.
      Resolves to the deck list (or null when it could not be read). */
  function syncWithManifest(url, opts) {
    sync(null, opts);
    return fetch(url).then(function (res) {
      return res.ok ? res.json() : null;
    }).then(function (decks) {
      if (Array.isArray(decks)) sync(decks, opts);
      return Array.isArray(decks) ? decks : null;
    }).catch(function () { return null; });
  }

  /** Draws one badge per achievement inside `container` (a <ul>). */
  function render(container) {
    if (!container) return;
    var t = App.i18n.t;
    var done = unlocked();
    container.innerHTML = '';
    LIST.forEach(function (a) {
      var isUnlocked = !!done[a.id];
      var dateStr = isUnlocked ? new Date(done[a.id]).toLocaleDateString(App.i18n.lang()) : null;
      var item = document.createElement('li');
      item.className = 'achievement-badge' + (isUnlocked ? ' unlocked' : ' locked');
      item.innerHTML =
        '<span class="achievement-badge-icon" aria-hidden="true">' + a.icon + '</span>' +
        '<span class="achievement-badge-name">' + t(a.key) + '</span>' +
        '<span class="achievement-badge-desc">' + t(a.key + 'Desc') + '</span>' +
        '<span class="achievement-badge-status">' +
          (isUnlocked ? t('achievementUnlockedAt').replace('{date}', dateStr) : t('achievementLocked')) +
        '</span>';
      container.appendChild(item);
    });
  }

  window.App.achievements = {
    list: LIST,
    unlocked: unlocked,
    achieve: achieve,
    sync: sync,
    syncWithManifest: syncWithManifest,
    render: render
  };
})();
