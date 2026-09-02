/* Memofun — home screen (deck grid) strings, in English. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    home: {
      title: 'Memofun',
      tagline: 'Pick a deck and practice with flashcards.',
      emptyTitle: 'No decks yet',
      emptyBody: 'Ask the person who supports you to prepare a new deck.',
      cards: 'cards',
      openDeck: 'Study',
      chooseCourse: 'Choose your course',
      subjects: 'subjects',
      decks: 'decks',
      otherTopics: 'Other topics',
      quickAccess: 'Quick access',
      continue: 'Continue →',
      pinButton: 'Pin as my course',
      pinnedButton: 'Course pinned',
      completedOf: '{done}/{total} completed',
      seoTitle: 'Flashcards to learn at your own pace',
      metaDescription: 'Memofun is a free, no-signup flashcard web app for studying at your own pace: decks organised by course and subject, with no distractions. Part of the Apptonomia suite.',
      enInviteTitle: 'Help us build the English version',
      enInviteBody: "All decks are in Spanish for now. If you'd like to help create decks in English, join the project.",
      enInviteCta: 'Join the project on GitHub',
      enCurriculumHeading: 'English curriculum (call for decks)',
      enSubjectInvite: 'No deck yet — be the first to contribute',
      enSubjectInviteHelp: 'Pick this subject and ask the AI coding agent for the matching deck, or write one by hand following the guide.',
      enContributeGuide: 'See the contributor guide'
    },
    core: {
      back: '← Back',
      next: 'Next',
      previous: 'Previous',
      skipToContent: 'Skip to content',
      settings: 'Settings',
      config: 'Settings',
      dataProtection: 'Data protection'
    },
    study: {
      loading: 'Loading deck…',
      showAnswer: '👀 Answer',
      doneTitle: 'You reviewed the whole deck!',
      studyAgain: 'Study again',
      backToHome: 'Back to home',
      starEarned: '+{n} ⭐!',
      progress: 'Card {n} of {total}',
      milestoneHalf: 'You\'re halfway!',
      milestoneThreeQuarters: 'Almost there!',
      finish: 'Finish',
      transferPhrase: 'You practised {tema}',
      finishPhrases: [
        'You reviewed everything!',
        'Great job!',
        'You made it to the end!'
      ],
      error: 'Could not load the deck.',
      photoBy: 'Photo by'
    }
  }, 'en');
}
