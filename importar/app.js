/* Memofun — review a personal deck (.json) without saving it. Hidden route for the
   person supporting the studying; the deck stays in this page, nothing is stored. */
(function () {
  'use strict';

  var dropzone = document.getElementById('dropzone');
  var fileInput = document.getElementById('file-input');
  var importStatus = document.getElementById('import-status');
  var importViewer = document.getElementById('import-viewer');
  var cardEl = document.getElementById('flashcard');
  var progressEl = document.getElementById('progress');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');

  var cards = [];
  var index = 0;
  var flipped = false;

  function renderCard() {
    var card = cards[index];
    flipped = false;
    cardEl.innerHTML = '<div class="face">' + card.question + '</div>';
    progressEl.textContent = '';
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === cards.length - 1;
  }

  function flipCard() {
    var card = cards[index];
    flipped = !flipped;
    if (flipped) {
      cardEl.innerHTML = '<div class="face">' + card.question + '</div><hr><div class="answer">' + card.answer + '</div>';
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

  async function handleFile(file) {
    if (!file) return;
    importStatus.classList.add('hidden');
    try {
      var deck = await App.decks.readFile(file);
      cards = deck.cards;
      if (!cards.length) throw new Error('deckVacio');
      index = 0;
      importViewer.classList.remove('hidden');
      renderCard();
      cardEl.focus();
    } catch (err) {
      importStatus.textContent = App.i18n.t('import.error');
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

  App.utils.registerServiceWorker('../sw.js');
})();
