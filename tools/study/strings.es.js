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
      backToTopic: '📚 Volver al tema',
      finishPhrases: ['¡Has repasado toda la baraja!', '¡Listo! Sigue cuando quieras.', '¡Bien hecho! Otra vez cuando te apetezca.'],
      milestoneHalf: '¡Vas por la mitad!',
      milestoneThreeQuarters: '¡Ya casi está!',
      starEarned: '+{n} ⭐',
      starsReached: 'Ya tienes {n} estrellas',
      starsGoal: 'A por las {n} estrellas'
    }
  }, 'es');
  /* Achievements (assets/js/achievements.js): neutral notice at the end of a deck. */
  App.i18n.register({
    achievementNew: 'Nuevo logro: {name}',
    achievementFirstStar: 'Primera estrella',
    achievementFirstStarDesc: 'Termina tu primera baraja.',
    achievementTenStars: 'Diez estrellas',
    achievementTenStarsDesc: 'Consigue diez estrellas.',
    achievementReviewAgain: 'Otra vuelta',
    achievementReviewAgainDesc: 'Repasa otra vez una baraja que ya terminaste.',
    achievementFullSubject: 'Asignatura completa',
    achievementFullSubjectDesc: 'Termina todas las barajas de una asignatura.',
    achievementTenDecks: 'Diez barajas',
    achievementTenDecksDesc: 'Termina diez barajas distintas.',
    achievementBigDeck: 'Baraja grande',
    achievementBigDeckDesc: 'Termina una baraja de 20 tarjetas o más.'
  }, 'es');
}
