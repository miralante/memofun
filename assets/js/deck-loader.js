/* ==========================================================================
   Memofun — deck loader
   Exposes window.App.decks.readUrl(url) / .readFile(file), both returning
   a Promise<{topic, level, locale, cards}>. Decks are Memofun's own
   plain-JSON format (see doc/en/technical.md §3) — no Anki, no ZIP, no
   SQLite/WASM, no CDN dependency. readUrl() is the only network call, for
   a deck bundled in decks/; readFile() reads a local file the person picked.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  function normalize(deck) {
    /* Backwards compat: support both old (Spanish) and new (English) keys
       so existing deck files continue to work after the Apr-2025 migration. */
    var cardsArr = deck.cards || deck.cards || [];
    var cards = cardsArr.map(function (c) {
      var question = c.question || c.question || '';
      var answer   = c.answer   || c.response || '';
      var img = c.image || c.imagen || null;
      return { question: question, answer: answer, image: img };
    });
    if (!Array.isArray(cards)) throw new Error('deckInvalido');
    return {
      topic:  deck.topic  || deck.tema  || '',
      level:  deck.level  || deck.nivel || '',
      locale: deck.locale || deck.idioma || 'es',
      cards: cards
    };
  }

  async function readUrl(url) {
    var res = await fetch(url);
    if (!res.ok) throw new Error('deckNoEncontrado');
    return normalize(await res.json());
  }

  async function readFile(file) {
    var text = await file.text();
    return normalize(JSON.parse(text));
  }

  window.App.decks = {
    readUrl: readUrl,
    readFile: readFile
  };
})();
