/* Memofun — textos de la pantalla de autoevaluación, en español. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    test: {
      loading: 'Cargando la autoevaluación…',
      error: 'No se pudo abrir esta autoevaluación.',
      intro: 'Responde con calma. No hay nota ni prisa: sirve para ver qué ya sabes y qué puedes repasar.',
      check: '✅ Comprobar',
      retry: '🔁 Repetir',
      correct: '✔ Correcto',
      wrong: '✘ Revisa',
      answerIs: 'Respuesta: {answer}',
      summary: 'Has acertado {n} de {total}.',
      summaryAll: '¡Muy bien! Lo tienes todo.',
      summaryMore: 'Vas bien. Repasa las que han fallado y vuelve cuando quieras.',
      blank: 'Sin responder',
      pairsIn: 'Escribe el número de la explicación',
      trueFalseTrue: 'V',
      trueFalseFalse: 'F',
      gapLabel: 'Escribe la palabra que falta'
    }
  }, 'es');
}
