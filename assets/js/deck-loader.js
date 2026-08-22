/* ==========================================================================
   Memofun — deck loader
   Exposes window.App.decks.readUrl(url) / .readFile(file), both returning
   a Promise<{tema, nivel, idioma, tarjetas}>. Decks are Memofun's own
   plain-JSON format (see doc/en/technical.md §3) — no Anki, no ZIP, no
   SQLite/WASM, no CDN dependency. readUrl() is the only network call, for
   a deck bundled in decks/; readFile() reads a local file the person picked.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  function normalize(deck) {
    if (!deck || !Array.isArray(deck.tarjetas)) {
      throw new Error('deckInvalido');
    }
    return {
      tema: typeof deck.tema === 'string' ? deck.tema : '',
      nivel: typeof deck.nivel === 'string' ? deck.nivel : '',
      idioma: deck.idioma || 'es',
      tarjetas: deck.tarjetas.map(function (c) {
        var card = {
          pregunta: typeof c.pregunta === 'string' ? c.pregunta : '',
          respuesta: typeof c.respuesta === 'string' ? c.respuesta : ''
        };
        if (c.imagen && typeof c.imagen === 'object') card.imagen = c.imagen;
        return card;
      })
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
