/* ==========================================================================
   Memofun — Internationalization (i18n)
   Exposes window.App.i18n. Load AFTER utils.js and BEFORE tts.js/storage.js/
   feedback.js. Standard order: utils.js -> i18n.js -> tts.js -> storage.js
   -> feedback.js -> strings.<locale>.js -> app.js.

   Active language: localStorage 'memofun:locale' if supported; otherwise
   detected from navigator.language ('es' prefix -> 'es', anything else ->
   'en', falls back to 'es', the source of truth for UI copy.

   Each strings.<locale>.js calls App.i18n.register({key: 'text', ...}, 'es'|'en').
   The UI shell (buttons, navigation, feedback) always has ES/EN parity.
   Deck CONTENT is not translated by this system: a deck ships in whichever
   language it was generated and is labelled with that language.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var LOCALE_KEY = 'memofun:locale';
  var SUPPORTED = ['es', 'en'];
  var DEFAULT_LOCALE = 'es';
  var BCP47 = { es: 'es-ES', en: 'en-US' };

  var DICT = {
    es: {
      core: {
        appName: 'Memofun',
        back: '← Volver',
        close: 'Cerrar',
        next: 'Siguiente →',
        previous: '← Anterior',
        save: 'Guardar',
        cancel: 'Cancelar',
        understood: 'Entendido',
        listen: '🔊 Escuchar',
        listenInstructions: 'Escuchar en voz alta',
        loading: 'Cargando…',
        dataProtection: 'Protección de datos',
        settings: 'Ajustes',
        home: 'Inicio',
        skipToContent: 'Ir al contenido'
      },
      feedback: {
        success: ['¡Muy bien!', '¡Genial!', '¡Lo has conseguido!', '¡Estupendo!'],
        encourage: ['Casi. ¡Inténtalo otra vez!', 'No pasa nada. ¡Sigue practicando!']
      }
    },
    en: {
      core: {
        appName: 'Memofun',
        back: '← Back',
        close: 'Close',
        next: 'Next →',
        previous: '← Previous',
        save: 'Save',
        cancel: 'Cancel',
        understood: 'Got it',
        listen: '🔊 Listen',
        listenInstructions: 'Listen out loud',
        loading: 'Loading…',
        dataProtection: 'Data protection',
        settings: 'Settings',
        config: 'Settings',
        home: 'Home',
        skipToContent: 'Skip to content'
      },
      feedback: {
        success: ['Well done!', 'Great!', 'You got it!', 'Fantastic!'],
        encourage: ['Almost. Try again!', "That's okay. Keep practicing!"]
      }
    }
  };

  function detect() {
    try {
      var langs = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
      for (var i = 0; i < langs.length; i++) {
        var prefix = (langs[i] || '').slice(0, 2).toLowerCase();
        if (SUPPORTED.indexOf(prefix) !== -1) return prefix;
      }
    } catch (e) { /* ignore */ }
    return DEFAULT_LOCALE;
  }

  /** ?lang=es|en in the URL (e.g. from the hreflang alternate links in
      index.html) overrides the saved locale for this read. init() below
      persists it to localStorage too, so it sticks past this one page. */
  function urlLocale() {
    try {
      var fromUrl = new URLSearchParams(location.search).get('lang');
      if (fromUrl && SUPPORTED.indexOf(fromUrl) !== -1) return fromUrl;
    } catch (e) { /* ignore */ }
    return null;
  }

  function locale() {
    var fromUrl = urlLocale();
    if (fromUrl) return fromUrl;
    try {
      var saved = localStorage.getItem(LOCALE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* ignore */ }
    return detect();
  }

  function setLocale(loc) {
    if (SUPPORTED.indexOf(loc) === -1) return;
    try {
      localStorage.setItem(LOCALE_KEY, loc);
    } catch (e) { /* ignore */ }
    location.reload();
  }

  function lang() {
    return BCP47[locale()] || BCP47[DEFAULT_LOCALE];
  }

  function register(dict, loc) {
    if (SUPPORTED.indexOf(loc) === -1 || !dict || typeof dict !== 'object') return;
    DICT[loc] = DICT[loc] || {};
    for (var key in dict) {
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        DICT[loc][key] = dict[key];
      }
    }
  }

  function lookup(dictForLocale, key) {
    if (typeof key !== 'string') return undefined;
    var parts = key.split('.');
    var current = dictForLocale;
    for (var i = 0; i < parts.length; i++) {
      if (current == null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function t(key) {
    if (typeof key !== 'string') return '';
    var loc = locale();
    var value = lookup(DICT[loc], key);
    if (value === undefined && loc !== DEFAULT_LOCALE) {
      value = lookup(DICT[DEFAULT_LOCALE], key);
    }
    if (value === undefined || value === null) {
      // No echo the raw key into the UI: it surfaces as "home.tagline"
      // in the page when a strings.<locale>.js didn't load or is out of
      // date. The empty string keeps the layout stable; the missing
      // key still shows up in console for the developer.
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[i18n] missing key:', key, '(locale=' + loc + ')');
      }
      return '';
    }
    if (Array.isArray(value)) return value.join(', ');
    return value;
  }

  function pick(key) {
    if (typeof key !== 'string') return '';
    var loc = locale();
    var value = lookup(DICT[loc], key);
    if (!Array.isArray(value) && loc !== DEFAULT_LOCALE) {
      value = lookup(DICT[DEFAULT_LOCALE], key);
    }
    if (!Array.isArray(value) || !value.length) return '';
    return value[Math.floor(Math.random() * value.length)];
  }

  function apply(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
    }
    var ariaNodes = root.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < ariaNodes.length; j++) {
      ariaNodes[j].setAttribute('aria-label', t(ariaNodes[j].getAttribute('data-i18n-aria')));
    }
    var metaNodes = root.querySelectorAll('[data-i18n-meta]');
    for (var k = 0; k < metaNodes.length; k++) {
      metaNodes[k].setAttribute('content', t(metaNodes[k].getAttribute('data-i18n-meta')));
    }
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
      document.title = t(titleKey) + ' | Memofun';
    }
  }

  function init() {
    var fromUrl = urlLocale();
    if (fromUrl) {
      try { localStorage.setItem(LOCALE_KEY, fromUrl); } catch (e) { /* ignore */ }
    }
    document.documentElement.lang = locale();
    apply(document);
    /* Inject the shared footer into every <footer data-pie-app>
       marker on the page. App.utils.inyectarPie is defined in
       utils.js, which loads before i18n.js per the standard order. */
    if (window.App && window.App.utils && typeof window.App.utils.inyectarPie === 'function') {
      window.App.utils.inyectarPie();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.App.i18n = {
    SUPPORTED: SUPPORTED,
    DEFAULT_LOCALE: DEFAULT_LOCALE,
    locale: locale,
    setLocale: setLocale,
    lang: lang,
    register: register,
    t: t,
    pick: pick,
    apply: apply
  };

  var LABEL = { es: 'Español', en: 'English' };
  var FLAG = { es: '🇪🇸', en: '🇬🇧' };
  window.App.i18n.LABEL = LABEL;
  window.App.i18n.FLAG = FLAG;
})();
