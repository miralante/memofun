/* ==========================================================================
   Memofun — achievements catalogue ("logros").

   The policy is the suite's (apptonomia/doc/es/spec.md §2.6): milestones
   computed from saved progress, no streaks, no timers, no losses, shown once
   as a neutral notice when a deck is finished, never on the "About the app"
   page. The mechanism itself lives in ./achievements-engine.js (identical in
   every app). This file holds only Memofun's rules and its public API:

     App.achievements.list                    the catalogue
     App.achievements.unlocked()              { id: timestamp }
     App.achievements.sync(decks, opts)       check the rules now; saves the
                                              new ones silently; returns their ids
     App.achievements.syncWithManifest(url, opts)
                                              sync with the saved progress, then
                                              again with the deck manifest; resolves
                                              to the ids unlocked by the call
     App.achievements.notify(el, ids)         write the neutral notice into el

   Rules (Memofun particularities):
     firstStar    1 star earned
     tenStars     10 stars earned
     reviewAgain  a deck was reviewed again (more stars than finished decks)
     tenDecks     10 different decks finished
     bigDeck      a deck of BIG_DECK_CARDS cards or more finished
     fullSubject  every deck of one course and subject finished
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var BIG_DECK_CARDS = 20;

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

  var CATALOG = [
    { id: 'firstStar', icon: '⭐', nameKey: 'achievementFirstStar', descKey: 'achievementFirstStarDesc',
      test: function (p) { return p.stars >= 1; } },
    { id: 'tenStars', icon: '🌟', nameKey: 'achievementTenStars', descKey: 'achievementTenStarsDesc',
      test: function (p) { return p.stars >= 10; } },
    { id: 'reviewAgain', icon: '🔁', nameKey: 'achievementReviewAgain', descKey: 'achievementReviewAgainDesc',
      /* Every finished pass adds one star (App.storage.completeDeck), so more
         stars than distinct decks means some deck was reviewed again. */
      test: function (p) { return p.done.length >= 1 && p.stars > p.done.length; } },
    { id: 'tenDecks', icon: '🏆', nameKey: 'achievementTenDecks', descKey: 'achievementTenDecksDesc',
      test: function (p) { return p.done.length >= 10; } },
    { id: 'bigDeck', icon: '🧠', nameKey: 'achievementBigDeck', descKey: 'achievementBigDeckDesc',
      test: function (p) {
        return p.finishedCards >= BIG_DECK_CARDS || (!!p.decks && hasBigDeck(p.decks, p.done));
      } },
    { id: 'fullSubject', icon: '🎓', nameKey: 'achievementFullSubject', descKey: 'achievementFullSubjectDesc',
      test: function (p) { return !!p.decks && hasFullSubject(p.decks, p.done); } }
  ];

  var board = window.MiralanteAchievements.create({
    storageKey: 'memofun:achievements',
    catalog: CATALOG,
    t: function (key) { return App.i18n.t(key); }
  });

  /** Snapshot of the saved progress plus the optional deck list and the
      size of the deck just finished. */
  function snapshot(decks, opts) {
    var progress = App.storage.get('progress');
    return {
      stars: progress.stars || 0,
      done: completedIds(progress),
      decks: Array.isArray(decks) && decks.length ? decks : null,
      finishedCards: opts && opts.finishedCards ? opts.finishedCards : 0
    };
  }

  function sync(decks, opts) {
    return board.evaluate(snapshot(decks, opts));
  }

  /** sync() now with what is saved, then again once the manifest arrives.
      Resolves to the ids unlocked by this call (possibly none). */
  function syncWithManifest(url, opts) {
    var first = sync(null, opts);
    return fetch(url).then(function (res) {
      return res.ok ? res.json() : null;
    }).then(function (decks) {
      var second = Array.isArray(decks) ? sync(decks, opts) : [];
      return first.concat(second);
    }).catch(function () {
      return first;
    });
  }

  App.achievements = {
    list: CATALOG,
    unlocked: board.unlocked,
    sync: sync,
    syncWithManifest: syncWithManifest,
    notify: function (el, ids) { board.notify(el, ids); }
  };
})();
