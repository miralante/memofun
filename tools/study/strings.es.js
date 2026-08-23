/* Memofun — textos de la pantalla de estudio, en español. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    study: {
      showAnswer: '👀 Respuesta',
      progress: 'Tarjeta {n} de {total}',
      finish: '✅ He terminado',
      loading: 'Cargando la baraja…',
      error: 'No se pudo abrir esta baraja.',
      doneTitle: '¡Has repasado toda la baraja!',
      transferPhrase: 'Ya sabes un poco más sobre {tema}.',
      studyAgain: '🔁 Repasar otra vez',
      backToHome: '🏠 Volver al inicio',
      finishPhrases: ['¡Has repasado toda la baraja!', '¡Listo! Sigue cuando quieras.', '¡Bien hecho! Otra vez cuando te apetezca.'],
      milestoneHalf: '¡Vas por la mitad!',
      milestoneThreeQuarters: '¡Ya casi está!',
      starEarned: '+{n} ⭐'
    }
  }, 'es');
}
