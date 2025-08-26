/**
 * H5P Multiple Choice Content Type
 * Version 1.16
 */

(function ($) {
  'use strict';

  /**
   * Multiple Choice constructor
   * @param {Object} options - Configuration options
   * @param {number} id - Content ID
   */
  function MultipleChoice(options, id) {
    this.options = $.extend(true, {}, MultipleChoice.defaults, options);
    this.id = id;
    this.answered = false;
    this.score = 0;
    this.maxScore = 0;
    this.answers = [];

    this.init();
  }

  /**
   * Default options
   */
  MultipleChoice.defaults = {
    question: 'What is the correct answer?',
    answers: [
      {
        text: 'Option 1',
        correct: true,
        tipAndFeedback: {
          tip: '',
          chosenFeedback: 'Correct!',
          notChosenFeedback: '',
        },
      },
      {
        text: 'Option 2',
        correct: false,
        tipAndFeedback: {
          tip: '',
          chosenFeedback: 'Incorrect!',
          notChosenFeedback: '',
        },
      },
    ],
    overallFeedback: [
      {
        from: 0,
        to: 100,
      },
    ],
    enableRetry: true,
    enableSolutionsButton: true,
    passPercentage: 80,
    showResults: true,
  };

  /**
   * Initialize the multiple choice
   */
  MultipleChoice.prototype.init = function () {
    this.createQuestion();
    this.bindEvents();
    this.calculateMaxScore();
  };

  /**
   * Create the question HTML
   */
  MultipleChoice.prototype.createQuestion = function () {
    const self = this;
    const $container = $('<div class="h5p-multiple-choice"></div>');

    // Question text
    const $question = $(
      '<div class="h5p-question">' + this.options.question + '</div>'
    );
    $container.append($question);

    // Answers
    const $answers = $('<div class="h5p-answers"></div>');
    this.options.answers.forEach(function (answer, index) {
      const $answer = self.createAnswer(answer, index);
      $answers.append($answer);
    });
    $container.append($answers);

    // Buttons
    const $buttons = $('<div class="h5p-buttons"></div>');

    if (this.options.enableRetry) {
      const $retryButton = $(
        '<button class="h5p-retry-button" style="display: none;">Retry</button>'
      );
      $buttons.append($retryButton);
    }

    if (this.options.enableSolutionsButton) {
      const $solutionsButton = $(
        '<button class="h5p-solutions-button" style="display: none;">Show Solution</button>'
      );
      $buttons.append($solutionsButton);
    }

    $container.append($buttons);

    // Results
    const $results = $(
      '<div class="h5p-results" style="display: none;"></div>'
    );
    $container.append($results);

    this.$container = $container;
  };

  /**
   * Create an answer option
   */
  MultipleChoice.prototype.createAnswer = function (answer, index) {
    const self = this;
    const $answer = $('<div class="h5p-answer"></div>');

    const $checkbox = $(
      '<input type="checkbox" id="answer-' + this.id + '-' + index + '">'
    );
    const $label = $(
      '<label for="answer-' +
        this.id +
        '-' +
        index +
        '">' +
        answer.text +
        '</label>'
    );

    $answer.append($checkbox);
    $answer.append($label);

    // Store reference to answer
    this.answers.push({
      element: $checkbox,
      data: answer,
      index: index,
    });

    return $answer;
  };

  /**
   * Bind event handlers
   */
  MultipleChoice.prototype.bindEvents = function () {
    const self = this;

    // Answer selection
    this.answers.forEach(function (answer) {
      answer.element.on('change', function () {
        if (!self.answered) {
          self.checkAnswer();
        }
      });
    });

    // Retry button
    this.$container.find('.h5p-retry-button').on('click', function () {
      self.reset();
    });

    // Solutions button
    this.$container.find('.h5p-solutions-button').on('click', function () {
      self.showSolution();
    });
  };

  /**
   * Check the selected answers
   */
  MultipleChoice.prototype.checkAnswer = function () {
    this.answered = true;

    let correctAnswers = 0;
    let totalCorrect = 0;

    this.answers.forEach(function (answer) {
      const isSelected = answer.element.is(':checked');
      const isCorrect = answer.data.correct;

      if (isCorrect) {
        totalCorrect++;
        if (isSelected) {
          correctAnswers++;
        }
      }

      // Show feedback
      if (isSelected) {
        answer.element.closest('.h5p-answer').addClass('selected');
        if (answer.data.tipAndFeedback.chosenFeedback) {
          answer.element
            .closest('.h5p-answer')
            .append(
              '<div class="h5p-feedback">' +
                answer.data.tipAndFeedback.chosenFeedback +
                '</div>'
            );
        }
      }
    });

    // Calculate score
    this.score = correctAnswers;
    this.maxScore = totalCorrect;

    // Show results
    if (this.options.showResults) {
      this.showResults();
    }

    // Show/hide buttons
    this.updateButtons();
  };

  /**
   * Show results
   */
  MultipleChoice.prototype.showResults = function () {
    const percentage =
      this.maxScore > 0 ? (this.score / this.maxScore) * 100 : 0;
    const passed = percentage >= this.options.passPercentage;

    const $results = this.$container.find('.h5p-results');
    $results.html(
      '<div class="h5p-score">' +
        'Score: ' +
        this.score +
        ' / ' +
        this.maxScore +
        ' (' +
        Math.round(percentage) +
        '%)' +
        '</div>' +
        '<div class="h5p-status ' +
        (passed ? 'passed' : 'failed') +
        '">' +
        (passed ? 'Passed!' : 'Failed') +
        '</div>'
    );
    $results.show();
  };

  /**
   * Update button visibility
   */
  MultipleChoice.prototype.updateButtons = function () {
    if (this.options.enableRetry) {
      this.$container.find('.h5p-retry-button').show();
    }

    if (this.options.enableSolutionsButton) {
      this.$container.find('.h5p-solutions-button').show();
    }
  };

  /**
   * Reset the question
   */
  MultipleChoice.prototype.reset = function () {
    this.answered = false;
    this.score = 0;

    this.answers.forEach(function (answer) {
      answer.element.prop('checked', false);
      answer.element.closest('.h5p-answer').removeClass('selected');
      answer.element.closest('.h5p-answer').find('.h5p-feedback').remove();
    });

    this.$container.find('.h5p-results').hide();
    this.$container.find('.h5p-retry-button, .h5p-solutions-button').hide();
  };

  /**
   * Show solution
   */
  MultipleChoice.prototype.showSolution = function () {
    this.answers.forEach(function (answer) {
      if (answer.data.correct) {
        answer.element.closest('.h5p-answer').addClass('correct');
      }
    });
  };

  /**
   * Calculate maximum score
   */
  MultipleChoice.prototype.calculateMaxScore = function () {
    this.maxScore = this.options.answers.filter(function (answer) {
      return answer.correct;
    }).length;
  };

  /**
   * Get the container element
   */
  MultipleChoice.prototype.getElement = function () {
    return this.$container;
  };

  /**
   * Get current score
   */
  MultipleChoice.prototype.getScore = function () {
    return this.score;
  };

  /**
   * Get maximum score
   */
  MultipleChoice.prototype.getMaxScore = function () {
    return this.maxScore;
  };

  /**
   * Check if answered
   */
  MultipleChoice.prototype.isAnswered = function () {
    return this.answered;
  };

  // Export to global scope
  window.H5P = window.H5P || {};
  window.H5P.MultipleChoice = MultipleChoice;
})(jQuery);
