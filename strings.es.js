/* Memofun — textos de la pantalla de inicio (rejilla de barajas), en español. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    home: {
      title: 'Memofun',
      tagline: 'Elige una baraja y practica con tarjetas.',
      emptyTitle: 'Todavía no hay barajas',
      emptyBody: 'Pídele a la persona que te ayuda que prepare una baraja nueva.',
      cards: 'tarjetas',
      openDeck: 'Estudiar',
      chooseCourse: 'Elige tu curso',
      subjects: 'asignaturas',
      decks: 'barajas',
      otherTopics: 'Otros temas',
      quickAccess: 'Acceso rápido',
      continue: 'Continuar →',
      pinButton: 'Fijar como mi curso',
      pinnedButton: 'Curso fijado'
    }
  }, 'es');
}
