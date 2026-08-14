/* ==========================================================================
   Memofun — Positive reinforcement and encouragement messages
   Exposes window.App.feedback.success(zone) / .encourage(zone) /
   .celebrate(message, [after]). Mistakes are never punished; there is no
   "wrong answer" state in Memofun at all — only success/celebrate are
   used in practice, encourage() is kept for parity with the sibling
   projects' shared contract. Messages follow the active language
   (App.i18n.pick). Requires utils.js and i18n.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  function random(key) {
    if (window.App.i18n) return window.App.i18n.pick(key);
    return '';
  }

  var audioCtx = null;

  function soundsEnabled() {
    if (!window.App.storage) return true;
    return App.storage.get('prefs').sounds !== false;
  }

  function tone(frequency, duration, type) {
    if (!soundsEnabled()) return;
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) { /* silent */ }
  }

  function soundSuccess() {
    tone(523.25, 0.15);
    setTimeout(function () { tone(659.25, 0.2); }, 120);
  }

  function soundEncourage() {
    tone(392, 0.2, 'sine');
  }

  function success(zone) {
    var msg = random('feedback.success');
    if (zone) {
      zone.textContent = '✅ ' + msg;
      zone.classList.remove('encourage');
      zone.classList.add('success');
    }
    soundSuccess();
    return msg;
  }

  function encourage(zone) {
    var msg = random('feedback.encourage');
    if (zone) {
      zone.textContent = msg;
      zone.classList.remove('success');
      zone.classList.add('encourage');
    }
    soundEncourage();
    return msg;
  }

  /**
   * Brief fullscreen celebration (uses .celebration from componentes.css).
   * @param {string} message
   * @param {function} [after] - called when it hides
   */
  function celebrate(message, after) {
    var layer = document.getElementById('app-celebration');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'app-celebration';
      layer.className = 'celebration hidden';
      layer.setAttribute('role', 'status');
      layer.innerHTML = '<div class="emoji">⭐</div><div class="message"></div>';
      document.body.appendChild(layer);
    }
    layer.querySelector('.message').textContent = message;
    layer.classList.remove('hidden');
    soundSuccess();

    var duration = (window.App.utils && window.App.utils.reducedMotion()) ? 1200 : 1800;
    setTimeout(function () {
      layer.classList.add('hidden');
      if (after) after();
    }, duration);
  }

  window.App.feedback = {
    success: success,
    encourage: encourage,
    celebrate: celebrate
  };
})();
