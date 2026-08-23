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
      pinnedButton: 'Curso fijado',
      completedOf: '{done}/{total} completadas',
      seoTitle: 'Tarjetas de memoria para aprender a tu ritmo',
      metaDescription: 'Memofun es una aplicación web gratuita y sin registro de tarjetas de memoria (flashcards) para estudiar y repasar a tu ritmo: barajas por curso y asignatura, sin distracciones. Parte de la suite Apptonomia.',
      enInviteTitle: '¿Nos ayudas con la versión en inglés?',
      enInviteBody: 'Todas las barajas están en español por ahora. Si quieres ayudar a crear barajas en inglés, únete al proyecto.',
      enInviteCta: 'Unirme al proyecto en GitHub',
      enCurriculumHeading: 'Temario en inglés (buscamos barajas)',
      enSubjectInvite: 'Aún no hay baraja — sé el primero en aportar',
      enSubjectInviteHelp: 'Elige esta asignatura y pide al agente de IA la baraja, o escríbela a mano siguiendo la guía.',
      enContributeGuide: 'Ver la guía para colaboradores'
    },
    core: {
      back: '← Volver',
      next: 'Siguiente',
      previous: 'Anterior',
      skipToContent: 'Ir al contenido',
      settings: 'Ajustes',
      dataProtection: 'Protección de datos'
    },
    study: {
      loading: 'Cargando la baraja…',
      showAnswer: '👀 Respuesta',
      doneTitle: '¡Has repasado toda la baraja!',
      studyAgain: 'Repasar otra vez',
      backToHome: 'Volver al inicio',
      starEarned: '¡+{n} ⭐!',
      progress: 'Tarjeta {n} de {total}',
      milestoneHalf: '¡Ya llevas la mitad!',
      milestoneThreeQuarters: '¡Casi lo tienes!',
      finish: 'Finalizar',
      transferPhrase: 'Has practicado con {tema}',
      finishPhrases: [
        '¡Lo has repasado todo!',
        '¡Gran trabajo!',
        '¡Has llegado al final!'
      ],
      error: 'No se ha podido cargar la baraja.',
      photoBy: 'Foto de'
    }
  }, 'es');
}
