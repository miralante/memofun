/* ==========================================================================
   Memofun — Shared utilities
   Exposes window.App.utils
   Load with: <script src="assets/js/utils.js"></script>
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  /** Shortcut for querySelector. */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  /** Shortcut for querySelectorAll (returns an Array). */
  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /** true if the user prefers less animation. */
  function reducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Generates a short, non-cryptographic unique id for local records. */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  var ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Escapes free text before it is concatenated into an innerHTML string. */
  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) { return ESCAPE_MAP[c]; });
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  /** Registers the service worker at `path` (relative to the current
      page) and, only on an actual update — not the first-ever install —
      reloads the page once the new version takes control, so an open
      tab never stays stuck on an old cached version. */
  function registerServiceWorker(path) {
    if (!('serviceWorker' in navigator)) return;
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register(path).catch(function () {});
    if (!hadController) return;
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (reloaded) return;
      reloaded = true;
      location.reload();
    });
  }

  window.App.utils = {
    $: $,
    $$: $$,
    reducedMotion: reducedMotion,
    uid: uid,
    escapeHtml: escapeHtml,
    downloadBlob: downloadBlob,
    registerServiceWorker: registerServiceWorker
  };
})();
