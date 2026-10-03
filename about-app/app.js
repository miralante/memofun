/* Memofun — "About the app" page (about-app/).
   Linked from the home footer, right before "Settings". Shows the
   achievements the person has earned. The catalog, the unlock rules
   and the badge renderer live in ../assets/js/achievements.js; the
   study screen unlocks them when a deck is finished, and this page
   re-checks them on load against the saved progress and the deck
   manifest, so earlier progress also counts. */
(function () {
  'use strict';

  function paintAchievements() {
    var list = App.achievements.list;
    var done = App.achievements.unlocked();
    var count = list.filter(function (a) { return !!done[a.id]; }).length;
    App.achievements.render(document.getElementById('achievementsGrid'));
    document.getElementById('achievementsCount').textContent = App.i18n.t('achievementsCount')
      .replace('{n}', String(count))
      .replace('{total}', String(list.length));
  }

  function init() {
    paintAchievements();
    App.achievements.syncWithManifest('../decks/manifest.json').then(paintAchievements);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
