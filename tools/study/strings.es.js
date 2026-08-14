/* Memofun — textos de la pantalla de estudio, en español. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    study: {
      showAnswer: '👀 Ver la respuesta',
      progress: 'Tarjeta {n} de {total}',
      finish: '✅ He terminado',
      loading: 'Cargando la baraja…',
      error: 'No se pudo abrir esta baraja.',
      doneTitle: '¡Has repasado toda la baraja!',
      transferPhrase: 'Ya sabes un poco más sobre {tema}.',
      studyAgain: '🔁 Repasar otra vez',
      backToHome: '🏠 Volver al inicio'
    }
  }, 'es');
}
