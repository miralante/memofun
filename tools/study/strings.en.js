/* Memofun — study screen strings, in English. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    study: {
      showAnswer: '👀 Answer',
      progress: 'Card {n} of {total}',
      finish: "✅ I'm done",
      loading: 'Loading the deck…',
      error: 'This deck could not be opened.',
      doneTitle: "You've reviewed the whole deck!",
      transferPhrase: 'You now know a little more about {tema}.',
      studyAgain: '🔁 Study again',
      backToHome: '🏠 Back to home',
      finishPhrases: ["You've reviewed the whole deck!", "All done! Pick it up whenever you like.", "Nice work! Again whenever you feel like it."],
      milestoneHalf: "You're halfway there!",
      milestoneThreeQuarters: 'Almost there!',
      starEarned: '+{n} ⭐'
    }
  }, 'en');
}
