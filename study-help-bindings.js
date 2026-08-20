(function () {
  'use strict';

  function bind(formId, inputId, answerId, resourcesId, activity) {
    const form = document.getElementById(formId);
    if (!form || !window.PoAStudyHelp) return;
    form.onsubmit = event => {
      event.preventDefault();
      const question = document.getElementById(inputId).value.trim();
      if (!question) return;
      PoAStudyHelp.render(
        PoAStudyHelp.answer(question, { activity }),
        document.getElementById(answerId),
        document.getElementById(resourcesId)
      );
    };
  }

  bind('week3QuestionForm', 'week3Question', 'week3Answer', 'week3AnswerResources', 'week3');
  bind('week4QuestionForm', 'week4Question', 'week4Answer', 'week4AnswerResources', 'week4');
  bind('week5QuestionForm', 'week5Question', 'week5Answer', 'week5AnswerResources', 'week5');
  bind('week6QuestionForm', 'week6Question', 'week6Answer', 'week6AnswerResources', 'week6');
}());
