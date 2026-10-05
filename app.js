/* Memofun — home screen: renders the deck grid from decks/manifest.json.
   No file upload, no settings here — this is the person-using-the-app
   flow, kept to a single decision: "which deck do I want to study?"

   Decks that carry an optional `course`/`subject` pair (see
   doc/en/technical.md §4) are browsed in two levels — courses, then
   subjects within a course — driven by ?course=&subject= query
   params so back/forward and bookmarking work with no router. A subject
   whose decks carry an optional `topicGroup` (see §4) gets a third
   level: the subject lists its topics, and a topic lists the sections that
   make it up, so a section title is just the section's name instead of
   "Tema 1 · <section>". Decks without course/subject (one-off "modo
   simple" decks) stay a flat grid, exactly like before. A pinned course
   (localStorage prefs.cursoFijado, set from the subject screen)
   surfaces as a quick-access shortcut on the course screen.

   Courses that aren't launched yet keep their card on the home but locked
   (no href, "Próximamente") — see OPEN_COURSES below. The /dev/ mirror
   sets data-access="full" and opens every one of them. */
(function () {
  'use strict';

  /* ----- What the page is allowed to show, and where it lives -----
     Two facts come from the HTML, not from JS, so the same app.js can
     serve the public home and the /dev/ mirror without a second build:

     BASE — every internal URL this file builds (the manifest fetch, the
     course/subject/topic links, the study-tool link) is prefixed with it.
     Empty on index.html, so the public URLs stay byte-identical to what
     they were; '../' on dev/index.html, which lives one level down.
     Without it the /dev/ page would fetch /dev/decks/manifest.json (404)
     and link every deck to /dev/tools/study/.

     FULL_ACCESS — the /dev/ mirror sets data-access="full" and opens
     every course. See OPEN_COURSES below for the public rule. */
  var BASE = document.body.dataset.appBase || '';
  var FULL_ACCESS = document.body.dataset.access === 'full';

  /* Courses open to the public. Every other course still shows its card
     on the home, but locked: a <div role="listitem"> with a "Próximamente"
     badge instead of an anchor, exactly the pattern the Apptonomia portal
     uses for its not-yet-shipped siblings (css .suite-card--soon) — the
     card keeps its place in the grid but advertises no destination, so a
     course that isn't ready can't be entered from the home by mistake.

     Only the card is locked, not the route: this follows Apptonomia, where
     the card is not a link but the path behind ?course= still resolves.
     The lock is about what the home offers, not an access control.

     To launch another course, add its name here. Names are the manifest's
     `course` values (exact strings, accents included). */
  var OPEN_COURSES = [
    '1º de FP Básica Servicios Administrativos',
    'Mapa Mundi'
  ];

  function isCourseOpen(course) {
    return FULL_ACCESS || OPEN_COURSES.indexOf(course) !== -1;
  }

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
      course: 'Key Stage 1',
      subjects: [
        'English Literature',
        'Science',
        'History',
        'Geography'
      ]
    },
    {
      course: 'Key Stage 2',
      subjects: [
        'English Literature',
        'Science',
        'History',
        'Geography'
      ]
    },
    {
      course: 'Key Stage 3',
      subjects: [
        'English Literature',
        'Science',
        'History',
        'Geography'
      ]
    },
    {
      course: 'Key Stage 4',
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
      course: 'Entry Level Business',
      subjects: [
        'Business Basics',
        'Customer Service'
      ]
    },
    {
      course: 'BTEC Business L2',
      subjects: [
        'Business Administration',
        'Business Communication',
        'Business Finance',
        'Business Operations'
      ]
    }
  ];

  /* Icons for the topic level (inside a subject) — the grouping card that
     opens the sections of one topic. Same convention as the two maps
     above: a meaning per known topic, 📂 as the neutral fallback for a
     folder-of-sections that isn't listed yet.
     The keys are DATA — the `topicGroup` values from decks/manifest.json —
     not identifiers, so they stay in the language the manifest uses. Keep
     them in sync: a key that stops matching just silently falls back to
     📂 instead of showing the real icon.

     All eight topics of the IPE subject, not just the first: with only
     Tema 1 mapped, the other seven section cards in "Itinerario Personal
     para la Empleabilidad" all rendered the same 📂 folder, which is
     exactly the repeat the map exists to avoid. The icons are the ones
     the manifest already gives those decks. */
  var TOPIC_ICONS = {
    'Tema 1 · Seguridad y salud en el trabajo': '🛡️',
    'Tema 2 · Técnicas de prevención y protección': '🦺',
    'Tema 3 · Técnicas básicas de primeros auxilios': '🚑',
    'Tema 4 · Autoconocimiento y habilidades personales': '🔍',
    'Tema 5 · Habilidades sociales': '🤝',
    'Tema 6 · Itinerarios académicos y profesionales': '🎓',
    'Tema 7 · La búsqueda de empleo': '📋',
    'Tema 8 · Toma de decisiones e itinerario personal': '⚖️'
  };

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

  function courseIcon(course) {
    return COURSE_ICONS[course] || '🎓';
  }

  function subjectIcon(subject) {
    return SUBJECT_ICONS[subject] || '📘';
  }

  function topicIcon(topicGroup) {
    return TOPIC_ICONS[topicGroup] || '📂';
  }

  var BADGE_CLASSES = ['', 'badge-b', 'badge-c', 'badge-d'];

  function badgeClassFor(index) {
    var cls = BADGE_CLASSES[index % BADGE_CLASSES.length];
    return cls ? ' ' + cls : '';
  }

  function buildUrl(course, subject, topicGroup) {
    var qs = new URLSearchParams();
    if (course) qs.set('course', course);
    if (subject) qs.set('subject', subject);
    if (topicGroup) qs.set('topicGroup', topicGroup);
    var s = qs.toString();
    return BASE + 'index.html' + (s ? '?' + s : '');
  }

  function studyUrl(deck) {
    var url = BASE + 'tools/study/index.html?deck=' + encodeURIComponent(deck.file) +
      '&id=' + encodeURIComponent(deck.id) +
      '&titulo=' + encodeURIComponent(deck.topic);
    /* Carries the course/subject/topic the deck was opened from so the
       study screen's "Volver" can return to that same level instead of
       always resetting to the top-level home (see buildUrl /
       renderSubjectLevel / renderSectionLevel above — same
       query-param-driven levels). */
    if (deck.course) {
      url += '&course=' + encodeURIComponent(deck.course);
      if (deck.subject) url += '&subject=' + encodeURIComponent(deck.subject);
      if (deck.topicGroup) url += '&topicGroup=' + encodeURIComponent(deck.topicGroup);
    }
    return url;
  }

  function deckCardHtml(deck, i, progress) {
    var done = progress.completed && progress.completed[deck.id];
    return (
      '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + studyUrl(deck) + '">' +
      '<span class="deck-icon" aria-hidden="true">' + (deck.icon || iconFor(i)) + '</span>' +
      '<h3>' + App.utils.escapeHtml(deck.topic) + '</h3>' +
      '<span class="deck-meta">' + (deck.amount || '') + ' ' + App.i18n.t('home.cards') + '</span>' +
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
    return '<a class="btn secondary icon" href="' + href + '" aria-label="' +
      App.utils.escapeHtml(App.i18n.t('core.back')) + '">←</a>';
  }

  /** How many of these decks are already marked completed — a derived
      read of the same progress.completed map used for the per-deck ⭐
      badge, never a new tracked field (SPEC.md §2.6). */
  function completedCount(decks, progress) {
    var done = (progress && progress.completed) || {};
    return decks.filter(function (d) { return done[d.id]; }).length;
  }

  /** "5 secciones · 89 tarjetas" for a group of decks, or just
      "18 tarjetas" when the group is one single deck — saying "1
      sección" would be noise. Totals come from `amount`, the same
      number each deck card shows, so the two levels can't disagree. */
  function groupMeta(groupDecks) {
    if (groupDecks.length === 1) {
      return (groupDecks[0].amount || '') + ' ' + App.i18n.t('home.cards');
    }
    var totalCards = groupDecks.reduce(function (sum, d) {
      return sum + (Number(d.amount) || 0);
    }, 0);
    return groupDecks.length + ' ' + App.i18n.t('home.sections') +
      ' · ' + totalCards + ' ' + App.i18n.t('home.cards');
  }

  /** A "Tema N · …" group card: opens the topic level, where its sections
      are listed on their own. Falls back to the deck itself when a topic
      only ever has one section — the same shortcut
      renderSubjectLevel applies to a subject with a single deck, so a
      one-deck group never costs an extra click. */
  function topicCardHtml(topicGroup, i, groupDecks) {
    var single = groupDecks.length === 1;
    var href = single ? studyUrl(groupDecks[0]) : buildUrl(groupDecks[0].course, groupDecks[0].subject, topicGroup);
    return '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + href + '">' +
      '<span class="deck-icon" aria-hidden="true">' + (single ? (groupDecks[0].icon || topicIcon(topicGroup)) : topicIcon(topicGroup)) + '</span>' +
      '<h3>' + App.utils.escapeHtml(topicGroup) + '</h3>' +
      '<span class="deck-meta">' + groupMeta(groupDecks) + '</span>' +
      '</a>';
  }

  /** One course on the home grid.

      Open course → the usual anchor. A course that isn't launched yet →
      a plain div carrying the same icon, name and meta, with a
      "Próximamente" badge and no href at all, so the grid keeps its
      rhythm and the card cannot be entered by clicking it.

      Both keep role="listitem" on purpose: the grid is a role="list", and
      a list whose items stop being listitems is no longer a list. The
      invite card (deck-card--invite, English locale) is the same shape for
      the same reason. */
  function courseCardHtml(course, i, meta) {
    var body =
      '<span class="deck-icon" aria-hidden="true">' + courseIcon(course) + '</span>' +
      '<h3>' + App.utils.escapeHtml(course) + '</h3>' +
      '<span class="deck-meta">' + meta + '</span>';
    if (!isCourseOpen(course)) {
      return '<div class="deck-card deck-card--soon' + badgeClassFor(i) + '" role="listitem">' +
        body +
        '<span class="deck-soon-badge">' + App.i18n.t('home.comingSoon') + '</span>' +
        '</div>';
    }
    return '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + buildUrl(course) + '">' +
      body +
      '</a>';
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

  function renderCourseLevel(decks, grid, progress) {
    var withCourse = decks.filter(function (d) { return d.course; });
    var withoutCourse = decks.filter(function (d) { return !d.course; });
    var byCourse = groupBy(withCourse, function (d) { return d.course; });

    if (!byCourse.order.length) {
      grid.innerHTML = localeInviteHtml() + (withoutCourse.length
        ? '<div class="deck-grid" role="list">' +
          withoutCourse.map(function (d, i) { return deckCardHtml(d, i, progress); }).join('') +
          '</div>'
        : emptyStateHtml());
      return;
    }

    var html = localeInviteHtml();
    var prefs = App.storage.get('prefs');
    var pinned = prefs.cursoFijado;
    /* The pinned shortcut obeys the same rule as the grid below. Someone
       who pinned this course before it was locked would otherwise keep a
       working link to it on the home, which is exactly what the lock is
       there to prevent. */
    if (pinned && byCourse.map[pinned] && isCourseOpen(pinned)) {
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
    html += '<div class="deck-grid" role="list">' + byCourse.order.map(function (course, i) {
      var courseDecks = byCourse.map[course];
      var subjectCount = groupBy(courseDecks, function (d) { return d.subject || ''; }).order.length;
      var done = completedCount(courseDecks, progress);
      var meta = subjectCount + ' ' + App.i18n.t('home.subjects');
      if (done > 0) {
        meta += ' · ' + App.i18n.t('home.completedOf')
          .replace('{done}', done).replace('{total}', courseDecks.length);
      }
      return courseCardHtml(course, i, meta);
    }).join('') + '</div>';

    if (withoutCourse.length) {
      html += '<h2 class="section-heading">' + App.i18n.t('home.otherTopics') + '</h2>';
      html += '<div class="deck-grid" role="list">' +
        withoutCourse.map(function (d, i) { return deckCardHtml(d, i, progress); }).join('') +
        '</div>';
    }

    grid.innerHTML = html;
  }

  function togglePinnedCourse(course) {
    var prefs = App.storage.get('prefs');
    prefs.cursoFijado = (prefs.cursoFijado === course) ? null : course;
    App.storage.set('prefs', prefs);
  }

  function renderSubjectLevel(decks, grid, progress, course) {
    var inCourse = decks.filter(function (d) { return d.course === course; });
    if (!inCourse.length) {
      history.replaceState(null, '', buildUrl());
      renderCourseLevel(decks, grid, progress);
      return;
    }
    var bySubject = groupBy(inCourse, function (d) { return d.subject || ''; });
    var pinned = App.storage.get('prefs').cursoFijado === course;

    var html = '<div class="section-header">' +
      '<div class="heading-with-back">' + backLinkHtml(buildUrl()) +
      '<h2 class="section-heading">' + App.utils.escapeHtml(course) + '</h2></div>' +
      '<button type="button" class="btn secondary" id="btn-pin-course" aria-pressed="' + pinned + '">' +
      (pinned ? '⭐ ' + App.i18n.t('home.pinnedButton') : '☆ ' + App.i18n.t('home.pinButton')) +
      '</button></div>';

    html += '<div class="deck-grid" role="list">' + bySubject.order.map(function (subject, i) {
      var subjectDecks = bySubject.map[subject];
      /* A subject can hold two shapes, in this order of precedence:
         - decks grouped into topics (`topicGroup`) → one card per topic, so
           the sections inside a topic are never flattened into this
           level with a repeated "Tema N · " prefix on every title;
         - otherwise a single deck → link straight to it; several decks
           → a flat grid, exactly as before this level existed. */
      var byTopic = groupBy(subjectDecks, function (d) { return d.topicGroup || ''; });
      var topics = byTopic.order.filter(function (t) { return !!t; });
      var href, meta, icon;
      if (topics.length) {
        var soloDeck = topics.length === 1 && byTopic.map[topics[0]].length === 1;
        href = soloDeck ? studyUrl(byTopic.map[topics[0]][0]) : buildUrl(course, subject);
        icon = soloDeck ? (byTopic.map[topics[0]][0].icon || topicIcon(topics[0])) : topicIcon(topics[0]);
        /* Counts the sections inside the topics, not the topics
           themselves: a subject with one topic would otherwise read
           "1 topics", and what the person cares about here is how much
           there is to study. */
        var grouped = [];
        topics.forEach(function (t) { grouped = grouped.concat(byTopic.map[t]); });
        meta = groupMeta(grouped);
      } else {
        var single = subjectDecks.length === 1;
        href = single ? studyUrl(subjectDecks[0]) : buildUrl(course, subject);
        icon = single ? (subjectDecks[0].icon || subjectIcon(subject)) : subjectIcon(subject);
        meta = single
          ? (subjectDecks[0].amount || '') + ' ' + App.i18n.t('home.cards')
          : subjectDecks.length + ' ' + App.i18n.t('home.decks');
      }
      return '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + href + '">' +
        '<span class="deck-icon" aria-hidden="true">' + icon + '</span>' +
        '<h3>' + App.utils.escapeHtml(subject) + '</h3>' +
        '<span class="deck-meta">' + meta + '</span>' +
        '</a>';
    }).join('') + '</div>';

    grid.innerHTML = html;

    document.getElementById('btn-pin-course').addEventListener('click', function () {
      togglePinnedCourse(course);
      renderSubjectLevel(decks, grid, progress, course);
    });
  }

  /** Asignatura level (`?course=&subject=`): what's inside one subject.
      Two shapes, decided by whether the subject uses `topicGroup`:
      - with topics → one card per topic (the level the subject card
        links to when the subject is split into sections);
      - without topics → the flat deck grid, unchanged from before.
      A subject that mixes both keeps its ungrouped decks in a second
      grid under a heading, so nothing is ever hidden. */
  function renderTopicLevel(decks, grid, progress, course, subject) {
    var inSubject = decks.filter(function (d) {
      return d.course === course && (d.subject || '') === subject;
    });
    if (!inSubject.length) {
      history.replaceState(null, '', buildUrl(course));
      renderSubjectLevel(decks, grid, progress, course);
      return;
    }
    var byTopic = groupBy(inSubject, function (d) { return d.topicGroup || ''; });
    var topics = byTopic.order.filter(function (t) { return !!t; });
    var ungrouped = byTopic.map[''] || [];

    var html = '<div class="heading-with-back">' + backLinkHtml(buildUrl(course)) +
      '<h2 class="section-heading">' +
      App.utils.escapeHtml(subject) +
      ' <span class="section-heading-meta">' + App.utils.escapeHtml(course) + '</span>' +
      '</h2></div>';

    if (topics.length) {
      html += '<div class="deck-grid" role="list">' + topics.map(function (t, i) {
        return topicCardHtml(t, i, byTopic.map[t]);
      }).join('') + '</div>';
      if (ungrouped.length) {
        html += '<h2 class="section-heading">' + App.i18n.t('home.otherSections') + '</h2>';
        html += '<div class="deck-grid" role="list">' +
          ungrouped.map(function (d, i) { return deckCardHtml(d, i + topics.length, progress); }).join('') +
          '</div>';
      }
    } else {
      html += '<div class="deck-grid" role="list">' +
        inSubject.map(function (d, i) { return deckCardHtml(d, i, progress); }).join('') +
        '</div>';
    }
    grid.innerHTML = html;
  }

  /** Topic level: the sections that make up one topic, listed with their
      own names. This is the level that replaces flattening "Tema 1 · …"
      into every section's title at the subject level. */
  function renderSectionLevel(decks, grid, progress, course, subject, topicGroup) {
    var filtered = decks.filter(function (d) {
      return d.course === course &&
        (d.subject || '') === subject &&
        (d.topicGroup || '') === topicGroup;
    });
    if (!filtered.length) {
      /* A hand-edited or stale ?topicGroup= must not dead-end: drop back
         to the subject level (one step up, not two — the course's
         subject list would be a level the URL never asked for). */
      history.replaceState(null, '', buildUrl(course, subject));
      renderTopicLevel(decks, grid, progress, course, subject);
      return;
    }
    var html = '<div class="heading-with-back">' + backLinkHtml(buildUrl(course, subject)) +
      '<h2 class="section-heading">' +
      App.utils.escapeHtml(topicGroup) +
      ' <span class="section-heading-meta">' + App.utils.escapeHtml(subject) + '</span>' +
      '</h2></div>';
    html += '<div class="deck-grid" role="list">' +
      filtered.map(function (d, i) { return deckCardHtml(d, i, progress); }).join('') +
      '</div>';
    grid.innerHTML = html;
  }

  /* ----- English curriculum (en locale, invite-only, no real decks) ----- */

  function enCourseByName(course) {
    for (var i = 0; i < EN_CURRICULUM.length; i++) {
      if (EN_CURRICULUM[i].course === course) return EN_CURRICULUM[i];
    }
    return null;
  }

  /** Build the URL for an EN curriculum screen. Uses a distinct query
      key (`en=1`) so the Spanish flow can't accidentally land here
      and the EN flow can't accidentally trigger Spanish rendering if
      someone hand-edits the URL. */
  function enBuildUrl(course, subject) {
    var qs = new URLSearchParams();
    qs.set('en', '1');
    if (course) qs.set('course', course);
    if (subject) qs.set('subject', subject);
    return BASE + 'index.html?' + qs.toString();
  }

  /** A non-clickable card used for EN subjects: shows the subject, the
      "no deck yet" message, and a CTA that links to the contributor
      guide. It still uses the .deck-card shell so the grid layout and
      a11y pattern match the rest of the page — only the href is
      replaced by a CTA inside the card body. */
  function enSubjectCardHtml(subject, i) {
    return (
      '<div class="deck-card deck-card-invite' + badgeClassFor(i) + '" role="listitem">' +
      '<span class="deck-icon" aria-hidden="true">' + subjectIcon(subject) + '</span>' +
      '<h3>' + App.utils.escapeHtml(subject) + '</h3>' +
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
      return '<a class="deck-card' + badgeClassFor(i) + '" role="listitem" href="' + enBuildUrl(entry.course) + '">' +
        '<span class="deck-icon" aria-hidden="true">' + courseIcon(entry.course) + '</span>' +
        '<h3>' + App.utils.escapeHtml(entry.course) + '</h3>' +
        '<span class="deck-meta">' + meta + '</span>' +
        '</a>';
    }).join('') + '</div>';
    grid.innerHTML = html;
  }

  function renderEnSubjectLevel(grid, course) {
    var entry = enCourseByName(course);
    if (!entry) {
      history.replaceState(null, '', enBuildUrl());
      renderEnCurriculumLevel(grid);
      return;
    }
    var html = '<div class="section-header">' +
      '<div class="heading-with-back">' + backLinkHtml(enBuildUrl()) +
      '<h2 class="section-heading">' + App.utils.escapeHtml(course) + '</h2></div>' +
      '</div>';
    html += '<p class="en-curriculum-help">' + App.i18n.t('home.enSubjectInviteHelp') + '</p>';
    html += '<div class="deck-grid" role="list">' + entry.subjects.map(function (subject, i) {
      return enSubjectCardHtml(subject, i);
    }).join('') + '</div>';
    grid.innerHTML = html;
  }

  /** EN locale render entry. No manifest fetch, no real decks — just
      a course → subject drill-down with invite cards. Mirrors the
      Spanish navigation shape so back/forward, bookmarks and the
      "back" button all work the same way. */
  function renderEnHome(grid) {
    var params = new URLSearchParams(location.search);
    var course = params.get('course');
    var subject = params.get('subject');
    if (course) renderEnSubjectLevel(grid, course);
    else renderEnCurriculumLevel(grid);
  }

  async function loadDecks() {
    var grid = document.getElementById('deck-grid');
    var progress = App.storage.get('progress');

    /* English locale: bypass the manifest entirely (every deck is
       Spanish content) and render the EN curriculum with invite-only
       placeholder cards. Same DOM element, same i18n keys, same
       back-link semantics — just a different data source. */
    if (App.i18n.locale() === 'en') {
      renderEnHome(grid);
      return;
    }

    try {
      var res = await fetch(BASE + 'decks/manifest.json', { cache: 'no-store' });
      var decks = res.ok ? await res.json() : [];

      if (!decks.length) {
        grid.innerHTML = emptyStateHtml();
        return;
      }

      var params = new URLSearchParams(location.search);
      var course = params.get('course');
      var subject = params.get('subject');
      var topicGroup = params.get('topicGroup');

      if (course && subject && topicGroup) renderSectionLevel(decks, grid, progress, course, subject, topicGroup);
      else if (course && subject) renderTopicLevel(decks, grid, progress, course, subject);
      else if (course) renderSubjectLevel(decks, grid, progress, course);
      else renderCourseLevel(decks, grid, progress);
    } catch (err) {
      grid.innerHTML = '<div class="empty-state">' + App.i18n.t('home.emptyBody') + '</div>';
    }
  }

  function paintLanguageSelector() {
    var el;
    el = document.getElementById('lang-es'); if (el) el.setAttribute('aria-pressed', String(App.i18n.locale() === 'es'));
    el = document.getElementById('lang-en'); if (el) el.setAttribute('aria-pressed', String(App.i18n.locale() === 'en'));
  }
  paintLanguageSelector();

  document.getElementById('stars-total').innerHTML =
    '<span class="stars-icon" aria-hidden="true">⭐<span class="spark">✦</span></span>' +
    '<span class="stars-count">' + App.storage.totalStars() + '</span>';

  loadDecks();

  /* BASE-aware so the /dev/ mirror registers the same sw.js as the public
     home instead of asking for a /dev/sw.js that doesn't exist. Empty on
     index.html, so the public URL is unchanged. (sw-register.js resolves
     the same file from its own location; both registrations are
     idempotent.) */
  App.utils.registerServiceWorker(BASE + 'sw.js');
})();
