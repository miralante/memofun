/* Memofun — textos de Ajustes, en español. Esta zona es para la persona
   de apoyo (familia/docente), no para el flujo principal del estudiante. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    settings: {
      title: 'Ajustes',
      subtitle: 'Esta sección es para quien acompaña el estudio.',
      languageLabel: 'Idioma',
      textSizeLabel: 'Tamaño del texto',
      textSizeNormal: 'Normal',
      textSizeLarge: 'Grande',
      textSizeExtraLarge: 'Muy grande',
      soundsLabel: 'Sonidos de acierto',
      soundsOn: '🔊 Activados',
      soundsOff: '🔇 Desactivados',
      soundsNote: 'Esto no afecta a la voz que lee las tarjetas, solo al sonido corto al terminar una baraja.',
      backToDecks: 'Ir a las barajas',
      importTitle: 'Repasar una baraja propia',
      importHint: 'Abre cualquier archivo .json de baraja para repasarlo aquí, sin guardarlo.',
      dropHint: 'Toca o arrastra un archivo .json de baraja',
      importError: 'No se pudo abrir ese archivo.',
      resetTitle: 'Borrar progreso guardado',
      resetHint: 'Borra las estrellas y las barajas marcadas como completadas en este dispositivo.',
      resetButton: '🗑️ Borrar progreso',
      resetConfirm: '¿Seguro? Se borrará todo el progreso guardado aquí.',
      resetConfirmYes: 'Sí, borrar',
      resetDone: 'Progreso borrado.'
    }
  }, 'es');
}
