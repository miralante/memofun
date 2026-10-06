/* Locale-picker configuration. Lives in a file rather than an inline <script>
   because the site's Content-Security-Policy is `script-src 'self'`, which
   blocks every inline script — including the one that used to set this
   config. With it blocked, locale-picker.js fell back to its default
   `js/strings` path and 404'd on every page, and the user's stored choice
   was ignored.

   Must load BEFORE assets/js/locale-picker.js. Both are deferred, and
   deferred scripts execute in document order, so listing this one first is
   enough.

   `path: null` means "same directory as the page": memofun keeps each
   page's strings next to its own HTML (index.html -> strings.es.js,
   site/index.html -> site/strings.es.js), not under a js/ folder.
   `storageKey` matches the key assets/js/i18n.js writes, so the picker's
   choice and the app's own i18n core stay in sync. */
window.LocalePickerConfig = {
  /* El selector de idioma va DENTRO del cajón del ⚙️, como primera
     fila, y el ⚙️ se queda solo en la cabecera. Antes vivía al lado
     del ⚙️ en la fila de controles y eran dos sitios donde cambiar
     preferencias. Coste: un clic más para llegar al idioma. */
  languageInDrawer: true,
  storageKey: 'memofun:locale',
  path: null,
  requiredLocales: ['es', 'en'],
  defaultLocale: 'en',
  /* No settingsHref: the drawer's "more settings" link is gone. Memofun
     already reaches config/ from its own navigation, and the /config/ route
     owns the success-sound switch, so the shared drawer keeps only theme,
     text size and high contrast. */
  soundSettings: false
};
