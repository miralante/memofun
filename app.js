/* Memofun — home screen: renders the deck grid from decks/manifest.json.
   No file upload, no settings here — this is the person-using-the-app
   flow, kept to a single decision: "which deck do I want to study?"

   Decks that carry an optional `curso`/`asignatura` pair (see
   doc/en/technical.md §4) are browsed in two levels — courses, then
   subjects within a course — driven by ?curso=&asignatura= query
   params so back/forward and bookmarking work with no router. Decks
   without curso/asignatura (one-off "modo simple" decks) stay a flat
   grid, exactly like before. A pinned course (localStorage prefs.cursoFijado,
   set from the subject screen) surfaces as a quick-access shortcut on
   the course screen. */
(function () {
  'use strict';

  var ICONS = ['🧠', '📚', '🔧', '🌍', '💡', '🧩', '🔬', '🎨'];

  function iconFor(index) {
    return ICONS[index % ICONS.length];
  }

  var BADGE_CLASSES = ['', 'badge-b', 'badge-c', 'badge-d'];

  function badgeClassFor(index) {
    var cls = BADGE_CLASSES[index % BADGE_CLASSES.length];
    return cls ? ' ' + cls : '';
  }

  function buildUrl(curso, asignatura) {
    var qs = new URLSearchParams();
    if (curso) qs.set('curso', curso);
    if (asignatura) qs.set('asignatura', asignatura);
    var s = qs.toString();
    return 'index.html' + (s ? '?' + s : '');
  }

  function studyUrl(deck) {
    return 'tools/study/index.html?deck=' + encodeURIComponent(deck.file) +
      '&id=' + encodeURIComponent(deck.id) +
      '&titulo=' + encodeURIComponent(deck.tema);
  }

  function deckCardHtml(deck, i, progreso) {
    var done = progreso.completado && progreso.completado[deck.id];
    return (
      '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + studyUrl(deck) + '">' +
      '<span class="deck-icon" aria-hidden="true">' + (deck.icono || iconFor(i)) + '</span>' +
      '<h3>' + App.utils.escapeHtml(deck.tema) + '</h3>' +
      '<span class="deck-meta">' + (deck.cantidad || '') + ' ' + App.i18n.t('home.cards') + '</span>' +
      (done ? '<span class="deck-stamp" aria-hidden="true"></span>' : '') +
      '</a>'
    );
  }

  function emptyStateHtml() {
    return '<div class="empty-state">' +
      '<p><strong>' + App.i18n.t('home.emptyTitle') + '</strong></p>' +
      '<p>' + App.i18n.t('home.emptyBody') + '</p>' +
      '</div>';
  }

  function backLinkHtml(href) {
    return '<a class="btn secondary" href="' + href + '">' + App.i18n.t('core.back') + '</a>';
  }

  /** How many of these decks are already marked completed — a derived
      read of the same progreso.completado map used for the per-deck ⭐
      badge, never a new tracked field (SPEC.md §2.6). */
  function completedCount(decks, progreso) {
    var done = (progreso && progreso.completado) || {};
    return decks.filter(function (d) { return done[d.id]; }).length;
  }

  /** Groups decks by a key, preserving first-seen order (manifest order). */
  function groupBy(decks, keyFn) {
    var map = {};
    var order = [];
    decks.forEach(function (d) {
      var key = keyFn(d);
      if (!key) return;
      if (!map[key]) { map[key] = []; order.push(key); }
      map[key].push(d);
    });
    return { map: map, order: order };
  }

  function renderCourseLevel(decks, grid, progreso) {
    var withCourse = decks.filter(function (d) { return d.curso; });
    var withoutCourse = decks.filter(function (d) { return !d.curso; });
    var byCourse = groupBy(withCourse, function (d) { return d.curso; });

    if (!byCourse.order.length) {
      grid.innerHTML = withoutCourse.length
        ? '<div class="deck-grid" role="list">' +
          withoutCourse.map(function (d, i) { return deckCardHtml(d, i, progreso); }).join('') +
          '</div>'
        : emptyStateHtml();
      return;
    }

    var html = '';
    var prefs = App.storage.get('prefs');
    var pinned = prefs.cursoFijado;
    if (pinned && byCourse.map[pinned]) {
      html += '<section class="quick-access">' +
        '<p class="quick-access-label">⭐ ' + App.i18n.t('home.quickAccess') + '</p>' +
        '<div class="deck-grid" role="list">' +
        '<a class="deck-card" role="listitem" href="' + buildUrl(pinned) + '">' +
        '<span class="deck-icon" aria-hidden="true">🎓</span>' +
        '<h3>' + App.utils.escapeHtml(pinned) + '</h3>' +
        '<span class="deck-meta">' + App.i18n.t('home.continue') + '</span>' +
        '</a></div></section>';
    }

    html += '<h2 class="section-heading">' + App.i18n.t('home.chooseCourse') + '</h2>';
    html += '<div class="deck-grid" role="list">' + byCourse.order.map(function (curso, i) {
      var courseDecks = byCourse.map[curso];
      var subjectCount = groupBy(courseDecks, function (d) { return d.asignatura || ''; }).order.length;
      var done = completedCount(courseDecks, progreso);
      var meta = subjectCount + ' ' + App.i18n.t('home.subjects');
      if (done > 0) {
        meta += ' · ' + App.i18n.t('home.completedOf')
          .replace('{done}', done).replace('{total}', courseDecks.length);
      }
      return '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + buildUrl(curso) + '">' +
        '<span class="deck-icon" aria-hidden="true">🎓</span>' +
        '<h3>' + App.utils.escapeHtml(curso) + '</h3>' +
        '<span class="deck-meta">' + meta + '</span>' +
        '</a>';
    }).join('') + '</div>';

    if (withoutCourse.length) {
      html += '<h2 class="section-heading">' + App.i18n.t('home.otherTopics') + '</h2>';
      html += '<div class="deck-grid" role="list">' +
        withoutCourse.map(function (d, i) { return deckCardHtml(d, i, progreso); }).join('') +
        '</div>';
    }

    grid.innerHTML = html;
  }

  function togglePinnedCourse(curso) {
    var prefs = App.storage.get('prefs');
    prefs.cursoFijado = (prefs.cursoFijado === curso) ? null : curso;
    App.storage.set('prefs', prefs);
  }

  function renderSubjectLevel(decks, grid, progreso, curso) {
    var inCourse = decks.filter(function (d) { return d.curso === curso; });
    if (!inCourse.length) {
      history.replaceState(null, '', buildUrl());
      renderCourseLevel(decks, grid, progreso);
      return;
    }
    var bySubject = groupBy(inCourse, function (d) { return d.asignatura || ''; });
    var pinned = App.storage.get('prefs').cursoFijado === curso;

    var html = backLinkHtml(buildUrl());
    html += '<div class="section-header">' +
      '<h2 class="section-heading">' + App.utils.escapeHtml(curso) + '</h2>' +
      '<button type="button" class="btn secondary" id="btn-pin-course" aria-pressed="' + pinned + '">' +
      (pinned ? '⭐ ' + App.i18n.t('home.pinnedButton') : '☆ ' + App.i18n.t('home.pinButton')) +
      '</button></div>';

    html += '<div class="deck-grid" role="list">' + bySubject.order.map(function (asignatura, i) {
      var subjectDecks = bySubject.map[asignatura];
      var single = subjectDecks.length === 1;
      var href = single ? studyUrl(subjectDecks[0]) : buildUrl(curso, asignatura);
      var meta = single
        ? (subjectDecks[0].cantidad || '') + ' ' + App.i18n.t('home.cards')
        : subjectDecks.length + ' ' + App.i18n.t('home.decks');
      return '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + href + '">' +
        '<span class="deck-icon" aria-hidden="true">' + (single ? (subjectDecks[0].icono || '📘') : '📘') + '</span>' +
        '<h3>' + App.utils.escapeHtml(asignatura) + '</h3>' +
        '<span class="deck-meta">' + meta + '</span>' +
        '</a>';
    }).join('') + '</div>';

    grid.innerHTML = html;

    document.getElementById('btn-pin-course').addEventListener('click', function () {
      togglePinnedCourse(curso);
      renderSubjectLevel(decks, grid, progreso, curso);
    });
  }

  function renderDeckLevel(decks, grid, progreso, curso, asignatura) {
    var filtered = decks.filter(function (d) {
      return d.curso === curso && (d.asignatura || '') === asignatura;
    });
    if (!filtered.length) {
      history.replaceState(null, '', buildUrl(curso));
      renderSubjectLevel(decks, grid, progreso, curso);
      return;
    }
    var html = backLinkHtml(buildUrl(curso));
    html += '<h2 class="section-heading">' + App.utils.escapeHtml(asignatura) + '</h2>';
    html += '<div class="deck-grid" role="list">' +
      filtered.map(function (d, i) { return deckCardHtml(d, i, progreso); }).join('') +
      '</div>';
    grid.innerHTML = html;
  }

  async function loadDecks() {
    var grid = document.getElementById('deck-grid');
    var progreso = App.storage.get('progreso');

    try {
      var res = await fetch('decks/manifest.json', { cache: 'no-store' });
      var decks = res.ok ? await res.json() : [];

      if (!decks.length) {
        grid.innerHTML = emptyStateHtml();
        return;
      }

      var params = new URLSearchParams(location.search);
      var curso = params.get('curso');
      var asignatura = params.get('asignatura');

      if (curso && asignatura) renderDeckLevel(decks, grid, progreso, curso, asignatura);
      else if (curso) renderSubjectLevel(decks, grid, progreso, curso);
      else renderCourseLevel(decks, grid, progreso);
    } catch (err) {
      grid.innerHTML = '<div class="empty-state">' + App.i18n.t('home.emptyBody') + '</div>';
    }
  }

  function paintLanguageSelector() {
    var active = App.i18n.locale();
    document.getElementById('lang-es').setAttribute('aria-pressed', String(active === 'es'));
    document.getElementById('lang-en').setAttribute('aria-pressed', String(active === 'en'));
  }
  document.getElementById('lang-es').addEventListener('click', function () { App.i18n.setLocale('es'); });
  document.getElementById('lang-en').addEventListener('click', function () { App.i18n.setLocale('en'); });
  paintLanguageSelector();

  document.getElementById('stars-total').innerHTML =
    '<span class="stars-icon" aria-hidden="true">⭐<span class="spark">✦</span></span>' +
    '<span class="stars-count">' + App.storage.totalStars() + '</span>';

  loadDecks();

  App.utils.registerServiceWorker('sw.js');
})();
