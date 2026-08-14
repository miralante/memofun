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
    starsEl.textContent = '⭐ ' + App.storage.totalStars();
  }

  function progressText() {
    return App.i18n.t('study.progress')
      .replace('{n}', index + 1)
      .replace('{total}', cards.length);
  }

  function updateProgress() {
    progressEl.textContent = progressText();
    progressFillEl.style.width = Math.round(((index + 1) / cards.length) * 100) + '%';
  }

  /* Small "pop" on every card change — purely CSS (@keyframes cardPop),
     and already neutralized site-wide by the prefers-reduced-motion
     rule in base.css, so no JS-level motion check is needed here. */
  function popIn() {
    cardEl.classList.remove('pop');
    void cardEl.offsetWidth;
    cardEl.classList.add('pop');
  }

  function renderCard() {
    var card = cards[index];
    cardEl.innerHTML = '<div class="cara">' + card.pregunta + '</div>';
    btnReveal.classList.remove('hidden');
    btnNext.classList.add('secondary');
    popIn();
    updateProgress();
    btnNext.textContent = (index === cards.length - 1)
      ? App.i18n.t('study.finish')
      : App.i18n.t('core.next');
    btnPrev.disabled = index === 0;
  }

  function revealAnswer() {
    var card = cards[index];
    cardEl.innerHTML =
      '<div class="cara">' + card.pregunta + '</div>' +
      '<hr>' +
      '<div class="respuesta">' + card.respuesta + '</div>';
    btnReveal.classList.add('hidden');
    btnNext.classList.remove('secondary');
    popIn();
    updateProgress();
  }

  function showEndScreen() {
    App.storage.completeDeck(deckId);
    renderStars();
    areaEl.classList.add('hidden');
    document.getElementById('transfer-phrase').textContent =
      App.i18n.t('study.transferPhrase').replace('{tema}', deckTitle);
    endScreenEl.classList.remove('hidden');
    App.feedback.celebrate(App.i18n.t('study.doneTitle'));
  }

  function goNext() {
    if (index === cards.length - 1) {
      showEndScreen();
      return;
    }
    index++;
    renderCard();
  }

  function goPrev() {
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
