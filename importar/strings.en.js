/* Memofun — «Repasar una baraja propia» texts, in English. This area is for the
   person supporting the studying (family/teacher), not the student's main flow. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    import: {
      title: 'Review a deck of your own',
      hint: 'Open any deck .json file to review it here, without saving it.',
      dropHint: 'Tap or drag a deck .json file',
      error: 'That file could not be opened.'
    }
  }, 'en');
}
