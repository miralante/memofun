/* Bootstrap for team/, which does not use App.i18n: it ships only
   strings.es.js and loads strings.<locale>.js on demand, then rewrites the
   page from [data-i18n] attributes itself.

   Extracted verbatim from the inline script the page carried. The CSP
   (`script-src 'self'`) blocked it, so the team page rendered in English
   regardless of the stored language and its language buttons did nothing. */
(function () {
  var supported = ['es', 'en'];
  var stored = null;
  try { stored = localStorage.getItem('locale'); } catch (e) { stored = null; }
  var browser = (navigator.language || navigator.userLanguage || 'en').slice(0, 2);
  var locale = supported.indexOf(stored) >= 0 ? stored
             : supported.indexOf(browser) >= 0 ? browser
             : 'en';

  if (locale !== 'es') {
    var s = document.createElement('script');
    s.src = 'strings.' + locale + '.js';
    s.onload = function () { applyLocale(locale); };
    document.head.appendChild(s);
  } else {
    applyLocale(locale);
  }

  function applyLocale(loc) {
    var strings = (window.__i18n_strings__ || {})[loc] || {};
    document.documentElement.lang = loc;
    document.documentElement.dataset.locale = loc;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      if (typeof strings[k] !== 'undefined') nodes[i].textContent = strings[k];
    }
    var titleEl = document.querySelector('title[data-i18n]');
    if (titleEl && typeof strings.pageTitle !== 'undefined') document.title = strings.pageTitle;
    var desc = document.querySelector('meta[name="description"][data-i18n]');
    if (desc && typeof strings.pageDescription !== 'undefined') desc.setAttribute('content', strings.pageDescription);
    var btns = document.querySelectorAll('[data-locale-switch]');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', (function (b) {
        return function () {
          try { localStorage.setItem('locale', b); } catch (e) {}
          location.reload();
        };
      })(btns[j].dataset.localeSwitch));
    }
    for (var k2 = 0; k2 < btns.length; k2++) {
      btns[k2].setAttribute('aria-pressed', btns[k2].dataset.localeSwitch === loc ? 'true' : 'false');
    }
  }
})();
