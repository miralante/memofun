/* ==========================================================================
   Memofun — Text to speech (Web Speech API)
   Exposes window.App.tts.speak(text, [onEnd]) and App.tts.stop().
   Voice and language follow App.i18n.lang() at a slower rate (0.9) for
   easier listening comprehension. Only called on demand from a 🔊 button
   next to the specific block being read — never automatic (SPEC.md rule:
   audio only when it adds something the text on screen doesn't already
   give). Requires i18n.js loaded first.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var available = 'speechSynthesis' in window;
  var voices = [];

  function activeLang() {
    return (window.App.i18n && window.App.i18n.lang()) || 'es-ES';
  }

  function pickVoice(prefix) {
    var chosen = null;
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang && voices[i].lang.indexOf(prefix) === 0) {
        chosen = voices[i];
        if (voices[i].lang === activeLang()) break;
      }
    }
    return chosen;
  }

  function loadVoices() {
    if (!available) return;
    voices = window.speechSynthesis.getVoices();
  }

  if (available) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  /**
   * Reads a text aloud. Cancels any previous reading. Strips simple HTML
   * tags (e.g. <mark>, <b>) so the tags themselves are never read aloud.
   * @param {string} text
   * @param {function} [onEnd]
   */
  function speak(text, onEnd) {
    var plain = String(text || '').replace(/<[^>]+>/g, '');
    if (!available || !plain) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    var lang = activeLang();
    var utterance = new SpeechSynthesisUtterance(plain);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    var voice = pickVoice(lang.slice(0, 2));
    if (voice) utterance.voice = voice;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if (available) window.speechSynthesis.cancel();
  }

  window.App.tts = {
    speak: speak,
    stop: stop,
    available: available
  };
})();
