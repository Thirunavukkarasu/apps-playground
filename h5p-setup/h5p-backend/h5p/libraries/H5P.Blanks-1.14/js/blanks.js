/**
 * H5P Fill in the Blanks
 *
 * A simple implementation of the Fill in the Blanks content type
 */

(function ($) {
  "use strict";

  /**
   * Initialize the Fill in the Blanks content type
   */
  function Blanks(options, contentId) {
    this.options = options;
    this.contentId = contentId;
    this.answers = [];
    this.score = 0;
    this.maxScore = 0;
  }

  /**
   * Attach the content to the DOM
   */
  Blanks.prototype.attach = function ($container) {
    var self = this;

    // Create the main content
    var $content = $('<div class="h5p-blanks"></div>');

    // Add title if provided
    if (this.options.title) {
      $content.append(
        '<h2 class="h5p-blanks-title">' + this.options.title + "</h2>"
      );
    }

    // Add description if provided
    if (this.options.description) {
      $content.append(
        '<div class="h5p-blanks-description">' +
          this.options.description +
          "</div>"
      );
    }

    // Process the text and create blanks
    var processedText = this.processText(this.options.text);
    $content.append('<div class="h5p-blanks-text">' + processedText + "</div>");

    // Add submit button
    var $submitButton = $(
      '<button class="h5p-blanks-submit">Check Answers</button>'
    );
    $submitButton.on("click", function () {
      self.checkAnswers();
    });
    $content.append($submitButton);

    // Add result display
    var $result = $(
      '<div class="h5p-blanks-result" style="display: none;"></div>'
    );
    $content.append($result);

    $container.append($content);
    this.$container = $container;
    this.$result = $result;
  };

  /**
   * Process text and replace blanks with input fields
   */
  Blanks.prototype.processText = function (text) {
    var self = this;
    var blankIndex = 0;

    // Replace *text* with input fields
    return text.replace(/\*([^*]+)\*/g, function (match, answers) {
      var blankId = "blank-" + blankIndex;
      var answerList = answers.split("/").map(function (answer) {
        return answer.trim().toLowerCase();
      });

      // Store the correct answers
      self.answers[blankIndex] = answerList;
      self.maxScore++;

      // Create input field
      var input =
        '<input type="text" class="h5p-blanks-input" id="' +
        blankId +
        '" data-blank-index="' +
        blankIndex +
        '" placeholder="Fill in the blank">';
      blankIndex++;

      return input;
    });
  };

  /**
   * Check user answers
   */
  Blanks.prototype.checkAnswers = function () {
    var self = this;
    this.score = 0;

    // Check each input
    this.$container.find(".h5p-blanks-input").each(function () {
      var $input = $(this);
      var blankIndex = parseInt($input.data("blank-index"));
      var userAnswer = $input.val().trim().toLowerCase();
      var correctAnswers = self.answers[blankIndex];

      // Check if answer is correct
      var isCorrect = correctAnswers.indexOf(userAnswer) !== -1;

      if (isCorrect) {
        self.score++;
        $input.removeClass("incorrect").addClass("correct");
      } else {
        $input.removeClass("correct").addClass("incorrect");
      }
    });

    // Show results
    this.showResults();
  };

  /**
   * Show results to user
   */
  Blanks.prototype.showResults = function () {
    var percentage = Math.round((this.score / this.maxScore) * 100);
    var message =
      "You got " +
      this.score +
      " out of " +
      this.maxScore +
      " correct (" +
      percentage +
      "%)";

    this.$result
      .html('<div class="h5p-blanks-score">' + message + "</div>")
      .show();
  };

  /**
   * Get the current score
   */
  Blanks.prototype.getScore = function () {
    return this.score;
  };

  /**
   * Get the maximum score
   */
  Blanks.prototype.getMaxScore = function () {
    return this.maxScore;
  };

  /**
   * Get the current answers
   */
  Blanks.prototype.getCurrentState = function () {
    var state = {
      answers: [],
    };

    this.$container.find(".h5p-blanks-input").each(function () {
      state.answers.push($(this).val());
    });

    return state;
  };

  /**
   * Set the current state
   */
  Blanks.prototype.setCurrentState = function (state) {
    if (state && state.answers) {
      var self = this;
      this.$container.find(".h5p-blanks-input").each(function (index) {
        if (state.answers[index]) {
          $(this).val(state.answers[index]);
        }
      });
    }
  };

  // Export the constructor
  H5P.Blanks = Blanks;
})(H5P.jQuery);
