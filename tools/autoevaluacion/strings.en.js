/* Memofun — self-assessment screen strings, in English. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    test: {
      loading: 'Loading the self-assessment…',
      error: 'This self-assessment could not be opened.',
      intro: 'Take your time. There is no grade and no rush: it helps you see what you already know and what to review.',
      check: '✅ Check',
      retry: '🔁 Try again',
      fixWrong: '✏️ Fix only the mistakes',
      correct: '✔ Correct',
      wrong: '✘ Review',
      answerIs: 'Answer: {answer}',
      summary: 'You got {n} out of {total} right.',
      summaryAll: 'Well done! You have it all.',
      summaryMore: 'You are doing well. Review the ones you missed and come back whenever you like.',
      blank: 'No answer',
      pairsIn: 'Write the number of the explanation',
      trueFalseTrue: 'T',
      trueFalseFalse: 'F',
      gapLabel: 'Write the missing word'
    }
  }, 'en');
}
