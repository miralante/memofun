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
      backToTopic: '📚 Back to the topic',
      finishPhrases: ["You've reviewed the whole deck!", "All done! Pick it up whenever you like.", "Nice work! Again whenever you feel like it."],
      milestoneHalf: "You're halfway there!",
      milestoneThreeQuarters: 'Almost there!',
      starEarned: '+{n} ⭐',
      starsReached: 'You already have {n} stars',
      starsGoal: 'Go for {n} stars'
    }
  }, 'en');
  /* Achievements (assets/js/achievements.js): neutral notice at the end of a deck. */
  App.i18n.register({
    achievementNew: 'New achievement: {name}',
    achievementFirstStar: 'First star',
    achievementFirstStarDesc: 'Finish your first deck.',
    achievementTenStars: 'Ten stars',
    achievementTenStarsDesc: 'Get ten stars.',
    achievementReviewAgain: 'One more time',
    achievementReviewAgainDesc: 'Review again a deck you already finished.',
    achievementFullSubject: 'Whole subject',
    achievementFullSubjectDesc: 'Finish all the decks of one subject.',
    achievementTenDecks: 'Ten decks',
    achievementTenDecksDesc: 'Finish ten different decks.',
    achievementBigDeck: 'Big deck',
    achievementBigDeckDesc: 'Finish a deck with 20 cards or more.'
  }, 'en');
}
