/* Memofun — textos de «Sonidos de acierto», en español. Página de apoyo:
   no aparece en el menú de la aplicación. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    sounds: {
      title: 'Sonidos de acierto',
      label: 'Sonidos de acierto',
      on: '🔊 Activados',
      off: '🔇 Desactivados',
      note: 'Esto no afecta a la voz que lee las tarjetas, solo al sonido corto al terminar una baraja.'
    }
  }, 'es');
}
