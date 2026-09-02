/* Memofun — settings (support area): text size, language, importing a
   personal deck .json for on-the-spot review, and clearing local progress. */
(function () {
  'use strict';

  var textSizeGroup = document.getElementById('text-size-group');
  var soundsGroup = document.getElementById('sounds-group');
  var langEs = document.getElementById('lang-es');
  var langEn = document.getElementById('lang-en');
  var dropzone = document.getElementById('dropzone');
  var fileInput = document.getElementById('file-input');
  var importStatus = document.getElementById('import-status');
  var importViewer = document.getElementById('import-viewer');
  var cardEl = document.getElementById('flashcard');
  var progressEl = document.getElementById('progress');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var btnListen = document.getElementById('btn-listen');
  var btnReset = document.getElementById('btn-reset');
  var resetStatus = document.getElementById('reset-status');

  /* ---------- Preference button groups (role=group, aria-pressed) ---------- */
  var prefs = App.storage.get('prefs');

  function paintPrefGroup(group, activeValue) {
    App.utils.$$('.btn-pref', group).forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.value === activeValue));
    });
  }

  function wirePrefGroup(group, activeValue, onSelect) {
    paintPrefGroup(group, activeValue);
    App.utils.$$('.btn-pref', group).forEach(function (btn) {
      btn.addEventListener('click', function () {
        onSelect(btn.dataset.value);
        paintPrefGroup(group, btn.dataset.value);
      });
    });
  }

  /* ---------- Text size ---------- */
  wirePrefGroup(textSizeGroup, prefs.textSize || 'normal', function (value) {
    prefs.textSize = value;
    App.storage.set('prefs', prefs);
    var SCALE = { normal: 1, large: 1.15, extraLarge: 1.3 };
    document.documentElement.style.setProperty('--text-scale', SCALE[value] || 1);
  });

  /* ---------- Success sounds ---------- */
  wirePrefGroup(soundsGroup, prefs.sounds === false ? 'off' : 'on', function (value) {
    prefs.sounds = value !== 'off';
    App.storage.set('prefs', prefs);
  });

  /* ---------- Language ---------- */
  langEs.addEventListener('click', function () { App.i18n.setLocale('es'); });
  langEn.addEventListener('click', function () { App.i18n.setLocale('en'); });

  /* ---------- Import & review a personal deck .json ---------- */
  var cards = [];
  var index = 0;
  var flipped = false;

  function renderCard() {
    var card = cards[index];
    flipped = false;
    cardEl.innerHTML = '<div class="cara">' + card.pregunta + '</div>';
    progressEl.textContent = (index + 1) + ' / ' + cards.length;
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === cards.length - 1;
  }

  function flipCard() {
    var card = cards[index];
    flipped = !flipped;
    if (flipped) {
      cardEl.innerHTML = '<div class="cara">' + card.pregunta + '</div><hr><div class="respuesta">' + card.respuesta + '</div>';
    } else {
      renderCard();
    }
  }

  cardEl.addEventListener('click', flipCard);
  cardEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipCard(); }
    else if (e.key === 'ArrowRight' && index < cards.length - 1) { index++; renderCard(); }
    else if (e.key === 'ArrowLeft' && index > 0) { index--; renderCard(); }
  });
  btnPrev.addEventListener('click', function () { if (index > 0) { index--; renderCard(); } });
  btnNext.addEventListener('click', function () { if (index < cards.length - 1) { index++; renderCard(); } });
  btnListen.addEventListener('click', function () {
    var card = cards[index];
    App.tts.speak(flipped ? (card.pregunta + '. ' + card.respuesta) : card.pregunta);
  });

  async function handleFile(file) {
    if (!file) return;
    importStatus.classList.add('hidden');
    try {
      var deck = await App.decks.readFile(file);
      cards = deck.tarjetas;
      if (!cards.length) throw new Error('deckVacio');
      index = 0;
      importViewer.classList.remove('hidden');
      renderCard();
      cardEl.focus();
    } catch (err) {
      importStatus.textContent = App.i18n.t('settings.importError');
      importStatus.classList.remove('hidden');
      importStatus.classList.add('encourage');
      importViewer.classList.add('hidden');
    }
  }

  dropzone.addEventListener('click', function () { fileInput.click(); });
  dropzone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  dropzone.addEventListener('dragover', function (e) { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('dragover'); });
  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function (e) { handleFile(e.target.files[0]); });

  /* ---------- Reset local progress (two-step, no native confirm()) ---------- */
  var resetArmed = false;
  btnReset.addEventListener('click', function () {
    if (!resetArmed) {
      resetArmed = true;
      btnReset.textContent = App.i18n.t('settings.resetConfirmYes');
      resetStatus.textContent = App.i18n.t('settings.resetConfirm');
      resetStatus.classList.remove('hidden', 'success');
      resetStatus.classList.add('encourage');
      return;
    }
    App.storage.remove('progreso');
    resetStatus.textContent = App.i18n.t('settings.resetDone');
    resetStatus.classList.remove('encourage');
    resetStatus.classList.add('success');
    btnReset.textContent = App.i18n.t('settings.resetButton');
    resetArmed = false;
  });

  App.utils.registerServiceWorker('../sw.js');
})();
