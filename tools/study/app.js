/* Memofun — study screen: pass through one deck's cards, revealing the
   answer with a button (swipe or the prev/next buttons move between
   cards). Cards always go in the deck's own order (sequential): the
   JSON order IS the teaching sequence, and memorising works from that
   sequence, not from a shuffle — so there is no order picker (the old
   Normal/Aleatorio/Inverso row was removed on purpose, see
   doc/es/spec.md §2.2). No timers, no right/wrong grading — finishing a
   full pass earns one star (SPEC.md §2.2/§2.6: praise-only, progress
   only ever adds up). Ends on a persistent screen (not an
   auto-redirect): the person decides when to leave, matching
   Apptonomia's activity contract and SPEC.md §2.8. */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var deckFile = params.get('deck');
  var deckId = params.get('id') || deckFile || 'deck';
  var deckTitle = params.get('titulo') || 'Memofun';
  var deckCurso = params.get('curso');
  var deckAsignatura = params.get('asignatura');
  var deckTemaGrupo = params.get('temaGrupo');

  var cards = [];
  var index = 0;

  var statusEl = document.getElementById('study-status');
  var areaEl = document.getElementById('study-area');
  var endScreenEl = document.getElementById('end-screen');
  var progressEl = document.getElementById('progress');
  var progressLabelEl = document.getElementById('progress-label');
  var progressFillEl = document.getElementById('progress-fill');
  var cardEl = document.getElementById('flashcard');
  var btnReveal = document.getElementById('btn-reveal');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var btnStudyAgain = document.getElementById('btn-study-again');
  var starsEl = document.getElementById('stars-total');
  var btnBack = document.getElementById('btn-back');

  document.getElementById('deck-title').textContent = deckTitle;
  document.title = deckTitle + ' | Memofun';

  /* Which tema the section belongs to, when the deck was opened from a
     tema level (app.js renderTemaLevel). Shown as a quiet line under
     the title: the deck title is the section name on its own, so
     without this the header loses the "Tema 1 · …" context that used
     to be flattened into every section's title. */
  if (deckTemaGrupo) {
    var contextEl = document.getElementById('deck-context');
    contextEl.textContent = deckTemaGrupo;
    contextEl.classList.remove('hidden');
  }

  /* "Volver" returns to the screen this deck was opened from — the tema
     level when the deck carries `temaGrupo`, the subject level
     otherwise (same query-param levels app.js's buildUrl /
     renderSubjectLevel / renderTemaLevel use) instead of always
     resetting to the top-level home — see studyUrl() in the root
     app.js for where these params come from. Falls back to plain home
     for ad-hoc decks with no curso/asignatura, or when the page was
     opened directly. */
  if (deckCurso) {
    var backUrl = '../../index.html?curso=' + encodeURIComponent(deckCurso);
    if (deckAsignatura) backUrl += '&asignatura=' + encodeURIComponent(deckAsignatura);
    if (deckTemaGrupo) backUrl += '&temaGrupo=' + encodeURIComponent(deckTemaGrupo);
    btnBack.href = backUrl;
  }

  function renderStars() {
    starsEl.innerHTML =
      '<span class="stars-icon" aria-hidden="true">⭐<span class="spark">✦</span></span>' +
      '<span class="stars-count">' + App.storage.totalStars() + '</span>';
  }

  /* Pop a "+1 ⭐" badge out of the header stars chip when a deck
     finishes. Visual flourish only — the count itself is already
     updated by the renderStars() call in showEndScreen(); this just
     makes the moment legible. Single-use: any prior toast is removed
     first so a fast repeat doesn't stack. Skipped silently if the
     new total is not strictly greater than the previous one
     (e.g. deck already completed — see App.storage.completeDeck's
     completion guard), matching SPEC.md §2.2 "stars only ever go up". */
  function showStarToast() {
    var newTotal = App.storage.totalStars();
    var prev = starsEl.__lastTotalStars;
    starsEl.__lastTotalStars = newTotal;
    if (typeof prev !== 'number' || newTotal <= prev) return;
    var gain = newTotal - prev;
    var old = starsEl.querySelector('.star-toast');
    if (old) old.remove();
    var toast = document.createElement('span');
    toast.className = 'star-toast';
    toast.setAttribute('aria-hidden', 'true');
    toast.textContent = App.i18n.t('study.starEarned').replace('{n}', gain);
    starsEl.appendChild(toast);
    /* force reflow so .show triggers the transition on the same frame
       the node is in the DOM */
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(function () { if (toast.parentNode) toast.remove(); }, 1700);
  }

  function progressText() {
    var base = App.i18n.t('study.progress')
      .replace('{n}', index + 1)
      .replace('{total}', cards.length);
    /* Gentle milestone nudge (halfway / three-quarters), read by the
       screen reader via the existing aria-live="polite". Not gamified:
       no points, no streak, just a warm text cue that the person is
       making progress. Only fires when the deck is long enough for the
       midpoint to actually feel like progress (≥ 6 cards). */
    if (cards.length >= 6) {
      var pos = (index + 1) / cards.length;
      var key = pos >= 0.75 ? 'study.milestoneThreeQuarters'
             : pos >= 0.5  ? 'study.milestoneHalf'
             : null;
      if (key) base += ' — ' + App.i18n.t(key);
    }
    return base;
  }

  function updateProgress() {
    progressEl.textContent = progressText();
    progressLabelEl.textContent = '';
    progressFillEl.style.width = Math.round(((index + 1) / cards.length) * 100) + '%';
  }

  /* "The Flip" — every card change (a new question, or its answer being
     revealed) plays as a 2D squash-and-release rather than a plain
     content swap (see .flashcard.flip-out in componentes.css). `flipping`
     blocks a second flip from starting mid-transition — without it a
     rapid double-swipe/double-tap could stack transitions and desync the
     visible card from `index`. `transitionend` is the real signal the
     squash finished; the timeout is a fallback because
     prefers-reduced-motion sets the transition to a near-zero duration,
     where transitionend can be unreliable in some browsers. */
  var flipping = false;
  var isUnrevealing = false; /* true while goPrev() is un-revealing so paintAnswer() knows not to hide btn-reveal */
  window.__studyFlipping = function() { return flipping; };
  window._studyIndex = function() { return index; };
  window._studyCardsLen = function() { return cards.length; };
  window._goNextCalls = 0;

  function onceSquashed(cb) {
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      cardEl.removeEventListener('transitionend', onEnd);
      clearTimeout(timer);
      cb();
    }
    function onEnd(e) { if (e.target === cardEl && e.propertyName === 'transform') finish(); }
    cardEl.addEventListener('transitionend', onEnd);
    var timer = setTimeout(finish, 200);
  }

  function flip(paint) {
    if (flipping) return;
    flipping = true;
    cardEl.classList.add('flip-out');
    onceSquashed(function () {
      paint();
      cardEl.classList.remove('flip-out');
      onceSquashed(function () { flipping = false; });
    });
  }

  /* Renders a card's optional `imagen` (visual support — see
     technical.md §3.1) as a small thumbnail to the side of the text.
     The attribution (Title/Author/Source/License) is intentionally NOT
     shown on the card itself: that data stays in the JSON and in the
     repo's CONTRIBUTING.md, but the reader doesn't need to parse it
     mid-session. Images are bundled in the repo (never hotlinked), so
     `archivo` is resolved relative to the site root, same as a deck's
     own JSON. */
  function imagenHtml(card) {
    if (!card.image) return '';
    var img = card.image;
    var src = img.file || img.archivo || '';
    var alt = img.alt || '';
    return '<figure class="card-image">' +
      '<img src="../../' + src + '" alt="' + App.utils.escapeHtml(alt) + '" loading="lazy">' +
      '</figure>';
  }

  /* Bolds the clue's closing question (format rule: `question` is always
     2-4 clue sentences ending in one short "¿...?" question — CLAUDE.md
     §B.8 step 3) so it stands out from the descriptive sentences before
     it, without editing the 300+ existing deck files. Anchored on the
     last "¿" rather than on sentence-ending punctuation: a card whose
     clue is a single sentence with no "." before the question has
     nothing else to split on, and a punctuation-based split ends up
     bolding the entire string instead of just the question. Spanish
     questions always open with "¿", so its last occurrence is exactly
     where the closing question starts. */
  function boldClosingQuestion(html) {
    var idx = html.lastIndexOf('¿');
    if (idx === -1) return html;
    return html.slice(0, idx) + '<b>' + html.slice(idx) + '</b>';
  }

  function paintQuestion() {
    var card = cards[index];
    cardEl.innerHTML = imagenHtml(card) +
      '<div class="card-content"><div class="face">' + boldClosingQuestion(card.question) + '</div></div>';
    btnReveal.classList.remove('hidden');
    btnNext.classList.add('secondary');
    cardEl.classList.remove('revealed');
    updateProgress();
    btnNext.setAttribute('aria-label', (index === cards.length - 1)
      ? App.i18n.t('study.finish')
      : App.i18n.t('core.next'));
    btnPrev.disabled = index === 0;
  }

  function paintAnswer() {
    var card = cards[index];
    cardEl.innerHTML =
      imagenHtml(card) +
      '<div class="card-content">' +
      '<div class="answer">' + card.answer + '</div>' +
      '<hr>' +
      '<div class="face">' + boldClosingQuestion(card.question) + '</div>' +
      '</div>';
    /* Only hide btn-reveal when arriving at the answer normally (a real
       reveal). When goPrev() triggers paintAnswer() during an un-reveal,
       isUnrevealing is true and the button must stay visible. */
    if (!isUnrevealing) btnReveal.classList.add('hidden');
    isUnrevealing = false;
    btnNext.classList.remove('secondary');
    cardEl.classList.add('revealed');
    /* Unlike moving to a different card, "prev" from a revealed answer
       first goes back to this same card's question (see goPrev()) — so
       it must stay enabled even on card 1, where paintQuestion() just
       disabled it. */
    btnPrev.disabled = false;
    updateProgress();
    /* Soft positive reinforcement on reveal — the only moment a card
       "responds". Tied to the existing sounds-on/off toggle (handled
       inside App.feedback); no new mechanic, just connects what was
       already designed. Skipped on the very last card so the bigger
       finish-time celebration stays the moment of the session. */
    if (index < cards.length - 1) {
      App.feedback.encourage();
    }
  }

  function renderCard() { flip(paintQuestion); }
  function revealAnswer() { flip(paintAnswer); }

  function showEndScreen() {
    App.storage.completeDeck(deckId);
    if (App.feedback && App.feedback.star) App.feedback.star();
    renderStars();
    showStarToast();
    areaEl.classList.add('hidden');
    document.getElementById('transfer-phrase').textContent =
      App.i18n.t('study.transferPhrase').replace('{tema}', deckTitle);
    endScreenEl.classList.remove('hidden');
    /* Vary the headline message across sessions via App.i18n.pick so
       finishing a deck never feels scripted (still no right/wrong, no
       streak — SPEC.md §2.2). The static title stays in the end screen
       for accessibility and i18n parity; this only changes what flashes
       in the overlay. */
    var finishPhrases = App.i18n.t('study.finishPhrases');
    var msg = (Array.isArray(finishPhrases) && finishPhrases.length)
      ? finishPhrases[Math.floor(Math.random() * finishPhrases.length)]
      : App.i18n.t('study.doneTitle');
    App.feedback.celebrate(msg);
  }

  function goNext() {
    window._goNextCalls = (window._goNextCalls || 0) + 1;
    var callNum = window._goNextCalls;
    cardEl.classList.remove('revealed');
    /* Last card: show end screen immediately — no animation.
       Must be checked before renderCard() so it fires even when
       the squash animation from revealing the last card is still running. */
    console.log('GN' + callNum + ': idx=' + index + '/len=' + cards.length + ' flip=' + flipping);
    if (index === cards.length - 1) {
      console.log('GN' + callNum + ': showEndScreen');
      showEndScreen();
      return;
    }
    /* Block mid-flip navigation so the reveal callback doesn't race
       with a new renderCard() — same protection goPrev() has. */
    if (flipping) { console.log('GN' + callNum + ': blocked by flipping'); return; }
    index++;
    renderCard();
  }

  function goPrev() {
    /* First press undoes the reveal (back to this card's own question)
       instead of jumping straight to the previous card — otherwise
       there's no way back to the question once the answer is showing,
       and on card 1 there's no earlier card to go to at all.
       The flipping guard is intentionally omitted here: goPrev() must
       be able to interrupt a mid-flip navigation (e.g. user clicks prev
       while the reveal animation is still running) so that the reveal
       state is properly reset and btn-reveal is shown again. */
    if (cardEl.classList.contains('revealed')) {
      isUnrevealing = true;
      btnReveal.classList.remove('hidden');
      renderCard();
      return;
    }
    if (index === 0) return;
    index--;
    renderCard();
  }

  /* Swipe left/right on the card — pass to the next one or go back,
     like flicking a physical card. Doesn't preventDefault on touchmove,
     so vertical scrolling of a long answer still works. */
  var touchStartX = null;
  var touchStartY = null;
  cardEl.addEventListener('touchstart', function (e) {
    var t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });
  cardEl.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var t = e.changedTouches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    touchStartX = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goNext(); else goPrev();
    }
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') goNext();
    else if (e.key === 'ArrowLeft') goPrev();
  });
  btnReveal.addEventListener('click', revealAnswer);
  btnNext.addEventListener('click', goNext);
  btnPrev.addEventListener('click', goPrev);
  btnStudyAgain.addEventListener('click', startSession);

  /* Start (or restart) a pass through the deck from its first card, in
     the deck's own order. Shared by "Repasar otra vez" and by init()
     after the deck loads, so both paths reset the end screen, the card
     counter and the focus the same way. */
  function startSession() {
    index = 0;
    endScreenEl.classList.add('hidden');
    areaEl.classList.remove('hidden');
    renderCard();
    btnReveal.focus();
  }

  async function init() {
    renderStars();
    /* seed the toast baseline so the first completion can detect the +1
       (see showStarToast); without this the initial render would set
       __lastTotalStars via showStarToast's own assignment and the very
       first finish would compare 0 vs N silently. */
    starsEl.__lastTotalStars = App.storage.totalStars();
    if (!deckFile) {
      statusEl.textContent = App.i18n.t('study.error');
      return;
    }
    try {
      var deck = await App.decks.readUrl('../../decks/' + deckFile);
      cards = deck.cards;
      if (!cards || !cards.length) throw new Error('deckVacio');
      statusEl.classList.add('hidden');
      startSession();
    } catch (err) {
      statusEl.textContent = App.i18n.t('study.error');
    }
  }

  init();

  App.utils.registerServiceWorker('../../sw.js');
})();
