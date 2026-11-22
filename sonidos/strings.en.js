/* Memofun — «Success sounds» texts, in English. Support page: it does not
   appear in the app menu. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    sounds: {
      title: 'Success sounds',
      label: 'Success sounds',
      on: '🔊 On',
      off: '🔇 Off',
      note: 'This does not affect the voice that reads the cards, only the short sound at the end of a deck.'
    }
  }, 'en');
}
