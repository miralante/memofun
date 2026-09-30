/* Wires the two-button language switch used by about/, legal/ and site/.
   Extracted from the inline script each of those pages used to carry: the
   CSP (`script-src 'self'`) blocked it, so on those pages the buttons
   rendered but did nothing and never showed their pressed state.

   No live repaint hook is needed — App.i18n.setLocale() persists the choice
   and reloads the page, so painting once on load is enough.

   The home page does not use these buttons (it has the shared #locale-picker
   component instead), and team/ boots its own i18n without App.i18n, so this
   is a no-op on both. */
(function () {
  'use strict';
  if (typeof App === 'undefined' || !App.i18n) return;

  var esBtn = document.getElementById('btnLangEs');
  var enBtn = document.getElementById('btnLangEn');
  if (!esBtn || !enBtn) return;

  var active = App.i18n.locale();
  esBtn.setAttribute('aria-pressed', String(active === 'es'));
  enBtn.setAttribute('aria-pressed', String(active === 'en'));

  esBtn.addEventListener('click', function () { App.i18n.setLocale('es'); });
  enBtn.addEventListener('click', function () { App.i18n.setLocale('en'); });
})();
