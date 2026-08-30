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

  /* Per-stage icons for the course grid: the home used to show the same
     🎓 for every course, which read as decorative noise. The mapping
     below gives each stage a distinct, meaningful icon so the home
     screen is easier to scan and to remember (still emoji, no extra
     assets, fully offline). Order matches how the manifest is grouped. */
  var COURSE_ICONS = {
    '1º de Primaria': '🌱',
    '2º de Primaria': '🌿',
    '3º de Primaria': '📗',
    '4º de Primaria': '📘',
    '5º de Primaria': '📙',
    '6º de Primaria': '📕',
    '1º de ESO': '🔭',
    '2º de ESO': '🧪',
    '3º de ESO': '📐',
    '4º de ESO': '🧭',
    '1º de FP GM Gestión Administrativa': '💼',
    '2º de FP GM Gestión Administrativa': '💼',
    '1º de FP Básica Servicios Administrativos': '🗂️',
    '2º de FP Básica Servicios Administrativos': '🗂️',
    'Mapa Mundi': '🗺️',
    'Key Stage 1': '🌱',
    'Key Stage 2': '📗',
    'Key Stage 3': '🔭',
    'Key Stage 4': '🧭',
    'Entry Level Business': '💼',
    'BTEC Business L2': '💼'
  };

  /* English curriculum mirror — when the UI locale is 'en' the home
     screen reads from this hardcoded structure instead of the manifest
     (the manifest only carries Spanish decks). Each stage lists its
     subjects; each subject renders an "invite to contribute" card
     instead of a deck link, because no English decks exist yet —
     the goal is to make the temario visible and inviting, not to
     fabricate cards that don't ship. Mirrors doc/curriculum/en/ and
     stays in sync with it as a workshop artefact (CLAUDE.md §1.3). */
  var EN_CURRICULUM = [
    {
      curso: 'Key Stage 1',
      subjects: [
        'English Literature',
        'Science',
        'History',
        'Geography'
      ]
    },
    {
      curso: 'Key Stage 2',
      subjects: [
        'English Literature',
        'Science',
        'History',
        'Geography'
      ]
    },
    {
      curso: 'Key Stage 3',
      subjects: [
        'English Literature',
        'Science',
        'History',
        'Geography'
      ]
    },
    {
      curso: 'Key Stage 4',
      subjects: [
        'English Literature',
        'Combined Science',
        'Biology',
        'Chemistry',
        'Physics',
        'History',
        'Geography'
      ]
    },
    {
      curso: 'Entry Level Business',
      subjects: [
        'Business Basics',
        'Customer Service'
      ]
    },
    {
      curso: 'BTEC Business L2',
      subjects: [
        'Business Administration',
        'Business Communication',
        'Business Finance',
        'Business Operations'
      ]
    }
  ];

  /* Per-subject icons for the subject grid (inside a course). Each
     subject gets a single, recognisable mark; if a subject isn't listed
     here it falls back to a generic book. Same reasoning as COURSE_ICONS:
     fewer generic 📘 repeats, easier to scan, still emoji. */
  var SUBJECT_ICONS = {
    'Lengua Castellana': '✍️',
    'Lengua y Literatura': '📖',
    'Literatura': '📖',
    'Biología y Geología': '🌿',
    'Física y Química': '⚗️',
    'Geografía e Historia': '🗺️',
    'Ciencias Aplicadas': '🔬',
    'Ciencias Sociales': '🌍',
    'Matemáticas': '📐',
    'Inglés': '🗣️',
    'Comunicación Empresarial y Atención al Cliente': '🗣️',
    'Atención al Cliente': '🤝',
    'Empresa y Administración': '🏢',
    'Empresa en el Aula': '🏢',
    'Operaciones Administrativas de Compraventa': '🛒',
    'Operaciones Auxiliares de Gestión de Tesorería': '💰',
    'Operaciones Administrativas de Recursos Humanos': '👥',
    'Técnica Contable': '🧾',
    'Tratamiento de la Documentación Contable': '🧾',
    'Tratamiento Informático de la Información': '💻',
    'Tratamiento Informático de Datos': '💻',
    'Aplicaciones Básicas de Ofimática': '💻',
    'Técnicas Administrativas Básicas': '🗂️',
    'Archivo y Comunicación': '🗂️',
    'Itinerario Personal para la Empleabilidad I': '🧭',
    'Itinerario Personal para la Empleabilidad II': '🧭',
    'Itinerario Personal para la Empleabilidad': '🧭',
    'Digitalización Aplicada a los Sectores Productivos': '🌐',
    'Sostenibilidad Aplicada al Sistema Productivo': '♻️',
    'Preparación de Pedidos y Venta de Productos': '📦',
    'Continentes y Océanos': '🌍',
    'Banderas del Mundo': '🚩',
    'Capitales del Mundo': '🏛️',
    'Ciudades Importantes': '🏙️',
    'Geografía Física': '🏔️',
    'Récords y Curiosidades': '🏆',
    'English Literature': '📖',
    'Science': '🔬',
    'Combined Science': '🔬',
    'Biology': '🧬',
    'Chemistry': '⚗️',
    'Physics': '🧲',
    'History': '🏺',
    'Geography': '🗺️',
    'Business Basics': '🏢',
    'Customer Service': '🤝',
    'Business Administration': '🏢',
    'Business Communication': '🗣️',
    'Business Finance': '💰',
    'Business Operations': '🛠️'
  };

  function courseIcon(curso) {
    return COURSE_ICONS[curso] || '🎓';
  }

  function subjectIcon(asignatura) {
    return SUBJECT_ICONS[asignatura] || '📘';
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

  /** Shown only above the top-level home screen when the UI locale is
      English: today every deck is Spanish content (deck content isn't
      covered by the i18n parity rule, see CLAUDE.md), so an English
      visitor gets an invite to help build that part instead of silent
      Spanish-only decks. */
  function localeInviteHtml() {
    if (App.i18n.locale() !== 'en') return '';
    return '<div class="locale-invite">' +
      '<p class="locale-invite-title">' + App.i18n.t('home.enInviteTitle') + '</p>' +
      '<p>' + App.i18n.t('home.enInviteBody') + '</p>' +
      '<a class="btn secondary" href="https://github.com/miralante/memofun" target="_blank" rel="noopener">' +
      App.i18n.t('home.enInviteCta') + '</a>' +
      '</div>';
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
      grid.innerHTML = localeInviteHtml() + (withoutCourse.length
        ? '<div class="deck-grid" role="list">' +
          withoutCourse.map(function (d, i) { return deckCardHtml(d, i, progreso); }).join('') +
          '</div>'
        : emptyStateHtml());
      return;
    }

    var html = localeInviteHtml();
    var prefs = App.storage.get('prefs');
    var pinned = prefs.cursoFijado;
    if (pinned && byCourse.map[pinned]) {
      html += '<section class="quick-access">' +
        '<p class="quick-access-label">⭐ ' + App.i18n.t('home.quickAccess') + '</p>' +
        '<div class="deck-grid" role="list">' +
        '<a class="deck-card" role="listitem" href="' + buildUrl(pinned) + '">' +
        '<span class="deck-icon" aria-hidden="true">' + courseIcon(pinned) + '</span>' +
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
        '<span class="deck-icon" aria-hidden="true">' + courseIcon(curso) + '</span>' +
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
        '<span class="deck-icon" aria-hidden="true">' + (single ? (subjectDecks[0].icono || subjectIcon(asignatura)) : subjectIcon(asignatura)) + '</span>' +
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
    html += '<h2 class="section-heading">' +
      App.utils.escapeHtml(asignatura) +
      ' <span class="section-heading-meta">' + App.utils.escapeHtml(curso) + '</span>' +
      '</h2>';
    html += '<div class="deck-grid" role="list">' +
      filtered.map(function (d, i) { return deckCardHtml(d, i, progreso); }).join('') +
      '</div>';
    grid.innerHTML = html;
  }

  /* ----- English curriculum (en locale, invite-only, no real decks) ----- */

  function enCourseByName(curso) {
    for (var i = 0; i < EN_CURRICULUM.length; i++) {
      if (EN_CURRICULUM[i].curso === curso) return EN_CURRICULUM[i];
    }
    return null;
  }

  /** Build the URL for an EN curriculum screen. Uses a distinct query
      key (`en=1`) so the Spanish flow can't accidentally land here
      and the EN flow can't accidentally trigger Spanish rendering if
      someone hand-edits the URL. */
  function enBuildUrl(curso, asignatura) {
    var qs = new URLSearchParams();
    qs.set('en', '1');
    if (curso) qs.set('curso', curso);
    if (asignatura) qs.set('asignatura', asignatura);
    return 'index.html?' + qs.toString();
  }

  /** A non-clickable card used for EN subjects: shows the subject, the
      "no deck yet" message, and a CTA that links to the contributor
      guide. It still uses the .deck-card shell so the grid layout and
      a11y pattern match the rest of the page — only the href is
      replaced by a CTA inside the card body. */
  function enSubjectCardHtml(asignatura, i) {
    return (
      '<div class="deck-card deck-card-invite' + badgeClassFor(i) + '" role="listitem">' +
      '<span class="deck-icon" aria-hidden="true">' + subjectIcon(asignatura) + '</span>' +
      '<h3>' + App.utils.escapeHtml(asignatura) + '</h3>' +
      '<span class="deck-meta">' + App.i18n.t('home.enSubjectInvite') + '</span>' +
      '<span class="deck-invite-cta">' +
      '<a class="btn secondary" href="https://github.com/miralante/memofun/blob/main/doc/en/internal-creating-decks-guide.md" target="_blank" rel="noopener">' +
      App.i18n.t('home.enContributeGuide') + '</a>' +
      '</span>' +
      '</div>'
    );
  }

  function renderEnCurriculumLevel(grid) {
    var html = localeInviteHtml();
    html += '<h2 class="section-heading">' + App.i18n.t('home.enCurriculumHeading') + '</h2>';
    html += '<div class="deck-grid" role="list">' + EN_CURRICULUM.map(function (entry, i) {
      var subjectCount = entry.subjects.length;
      var meta = subjectCount + ' ' + App.i18n.t('home.subjects');
      return '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + enBuildUrl(entry.curso) + '">' +
        '<span class="deck-icon" aria-hidden="true">' + courseIcon(entry.curso) + '</span>' +
        '<h3>' + App.utils.escapeHtml(entry.curso) + '</h3>' +
        '<span class="deck-meta">' + meta + '</span>' +
        '</a>';
    }).join('') + '</div>';
    grid.innerHTML = html;
  }

  function renderEnSubjectLevel(grid, curso) {
    var entry = enCourseByName(curso);
    if (!entry) {
      history.replaceState(null, '', enBuildUrl());
      renderEnCurriculumLevel(grid);
      return;
    }
    var html = backLinkHtml(enBuildUrl());
    html += '<div class="section-header">' +
      '<h2 class="section-heading">' + App.utils.escapeHtml(curso) + '</h2>' +
      '</div>';
    html += '<p class="en-curriculum-help">' + App.i18n.t('home.enSubjectInviteHelp') + '</p>';
    html += '<div class="deck-grid" role="list">' + entry.subjects.map(function (asignatura, i) {
      return enSubjectCardHtml(asignatura, i);
    }).join('') + '</div>';
    grid.innerHTML = html;
  }

  /** EN locale render entry. No manifest fetch, no real decks — just
      a course → subject drill-down with invite cards. Mirrors the
      Spanish navigation shape so back/forward, bookmarks and the
      "back" button all work the same way. */
  function renderEnHome(grid) {
    var params = new URLSearchParams(location.search);
    var curso = params.get('curso');
    var asignatura = params.get('asignatura');
    if (curso) renderEnSubjectLevel(grid, curso);
    else renderEnCurriculumLevel(grid);
  }

  async function loadDecks() {
    var grid = document.getElementById('deck-grid');
    var progreso = App.storage.get('progreso');

    /* English locale: bypass the manifest entirely (every deck is
       Spanish content) and render the EN curriculum with invite-only
       placeholder cards. Same DOM element, same i18n keys, same
       back-link semantics — just a different data source. */
    if (App.i18n.locale() === 'en') {
      renderEnHome(grid);
      return;
    }

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
