/* Memofun — study screen: pass through one deck's cards, revealing the
   answer with a button (swipe or the prev/next buttons move between
   cards). No timers, no right/wrong grading — finishing a full pass
   earns one star (SPEC.md §2.2/§2.6: praise-only, progress only ever
   adds up). Ends on a persistent screen (not an auto-redirect): the
   person decides when to leave, matching Apptonomia's activity
   contract and SPEC.md §2.8. */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var deckFile = params.get('deck');
  var deckId = params.get('id') || deckFile || 'deck';
  var deckTitle = params.get('titulo') || 'Memofun';

  var cards = [];
  var index = 0;

  var statusEl = document.getElementById('study-status');
  var areaEl = document.getElementById('study-area');
  var endScreenEl = document.getElementById('end-screen');
  var progressEl = document.getElementById('progress');
  var progressFillEl = document.getElementById('progress-fill');
  var cardEl = document.getElementById('flashcard');
  var btnReveal = document.getElementById('btn-reveal');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var btnStudyAgain = document.getElementById('btn-study-again');
  var starsEl = document.getElementById('stars-total');

  document.getElementById('deck-title').textContent = deckTitle;
  document.title = deckTitle + ' | Memofun';

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
    if (!card.imagen) return '';
    var img = card.imagen;
    return '<figure class="tarjeta-imagen">' +
      '<img src="../../' + img.archivo + '" alt="' + App.utils.escapeHtml(img.alt) + '" loading="lazy">' +
      '</figure>';
  }

  function paintQuestion() {
    var card = cards[index];
    cardEl.innerHTML = imagenHtml(card) + '<div class="cara">' + card.pregunta + '</div>';
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
      '<div class="cara">' + card.pregunta + '</div>' +
      '<hr>' +
      '<div class="respuesta">' + card.respuesta + '</div>';
    btnReveal.classList.add('hidden');
    btnNext.classList.remove('secondary');
    cardEl.classList.add('revealed');
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
    if (flipping) return;
    if (index === cards.length - 1) {
      showEndScreen();
      return;
    }
    index++;
    renderCard();
  }

  function goPrev() {
    if (flipping) return;
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
  btnStudyAgain.addEventListener('click', function () {
    index = 0;
    endScreenEl.classList.add('hidden');
    areaEl.classList.remove('hidden');
    renderCard();
    btnReveal.focus();
  });

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
      cards = deck.tarjetas;
      if (!cards.length) throw new Error('deckVacio');
      statusEl.classList.add('hidden');
      areaEl.classList.remove('hidden');
      renderCard();
      btnReveal.focus();
    } catch (err) {
      statusEl.textContent = App.i18n.t('study.error');
    }
  }

  init();

  App.utils.registerServiceWorker('../../sw.js');
})();
