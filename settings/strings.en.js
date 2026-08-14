/* Memofun — Settings strings, in English. This area is for the
   supporting adult (family/teacher), not the main student flow. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    settings: {
      title: 'Settings',
      subtitle: 'This section is for whoever supports the studying.',
      languageLabel: 'Language',
      textSizeLabel: 'Text size',
      textSizeNormal: 'Normal',
      textSizeLarge: 'Large',
      textSizeExtraLarge: 'Extra large',
      soundsLabel: 'Success sounds',
      soundsOn: '🔊 On',
      soundsOff: '🔇 Off',
      soundsNote: "This doesn't affect the voice that reads cards aloud, only the short sound when you finish a deck.",
      backToDecks: 'Go to decks',
      importTitle: 'Review your own deck',
      importHint: 'Open any deck .json file to review it here, without saving it.',
      dropHint: 'Tap or drag a deck .json file',
      importError: 'That file could not be opened.',
      resetTitle: 'Clear saved progress',
      resetHint: 'Clears the stars and the decks marked as completed on this device.',
      resetButton: 'Clear progress',
      resetConfirm: 'Are you sure? All progress saved here will be cleared.',
      resetConfirmYes: 'Yes, clear it',
      resetDone: 'Progress cleared.'
    }
  }, 'en');
}
