var H5P = H5P || {};

H5P.Flashcards = function (options, contentId) {
  this.options = options;
  this.contentId = contentId;
  this.currentCardIndex = 0;
  this.isFlipped = false;
  this.cards = options.cards || [];
  this.autoFlipTimer = null;
};

H5P.Flashcards.prototype.attach = function ($container) {
  const self = this;

  // Create the main flashcard container
  const $flashcardContainer = $('<div class="h5p-flashcards-container"></div>');

  // Add title
  if (this.options.title) {
    $flashcardContainer.append(
      $('<h3 class="h5p-flashcards-title"></h3>').text(this.options.title)
    );
  }

  // Add description
  if (this.options.description) {
    $flashcardContainer.append(
      $('<p class="h5p-flashcards-description"></p>').text(
        this.options.description
      )
    );
  }

  // Create progress indicator
  if (this.options.showProgress && this.cards.length > 1) {
    const $progress = $('<div class="h5p-flashcards-progress"></div>');
    $progress.append(
      $('<span class="h5p-flashcards-progress-text"></span>').text(
        '1 / ' + this.cards.length
      )
    );
    $flashcardContainer.append($progress);
  }

  // Create flashcard element
  const $flashcard = $('<div class="h5p-flashcard"></div>');
  const $cardInner = $('<div class="h5p-flashcard-inner"></div>');
  const $cardFront = $('<div class="h5p-flashcard-front"></div>');
  const $cardBack = $('<div class="h5p-flashcard-back"></div>');

  $cardInner.append($cardFront, $cardBack);
  $flashcard.append($cardInner);
  $flashcardContainer.append($flashcard);

  // Create navigation buttons
  const $navigation = $('<div class="h5p-flashcards-navigation"></div>');

  const $prevButton = $(
    '<button class="h5p-flashcards-btn h5p-flashcards-prev" disabled></button>'
  )
    .text('← Previous')
    .on('click', function () {
      self.previousCard();
    });

  const $flipButton = $(
    '<button class="h5p-flashcards-btn h5p-flashcards-flip"></button>'
  )
    .text('Flip Card')
    .on('click', function () {
      self.flipCard();
    });

  const $nextButton = $(
    '<button class="h5p-flashcards-btn h5p-flashcards-next"></button>'
  )
    .text('Next →')
    .on('click', function () {
      self.nextCard();
    });

  $navigation.append($prevButton, $flipButton, $nextButton);
  $flashcardContainer.append($navigation);

  // Add click handler for card flip
  $flashcard.on('click', function () {
    self.flipCard();
  });

  // Store references
  this.$container = $flashcardContainer;
  this.$cardFront = $cardFront;
  this.$cardBack = $cardBack;
  this.$progress = $flashcardContainer.find('.h5p-flashcards-progress-text');
  this.$prevButton = $prevButton;
  this.$nextButton = $nextButton;
  this.$flipButton = $flipButton;

  // Load first card
  this.loadCard(0);

  // Add to container
  $container.append($flashcardContainer);
};

H5P.Flashcards.prototype.loadCard = function (index) {
  if (index < 0 || index >= this.cards.length) {
    return;
  }

  this.currentCardIndex = index;
  this.isFlipped = false;

  const card = this.cards[index];

  // Update card content
  this.$cardFront.text(card.front || '');
  this.$cardBack.text(card.back || '');

  // Update progress
  if (this.$progress.length) {
    this.$progress.text(index + 1 + ' / ' + this.cards.length);
  }

  // Update navigation buttons
  this.$prevButton.prop('disabled', index === 0);
  this.$nextButton.prop('disabled', index === this.cards.length - 1);

  // Reset card to front
  this.$cardFront.parent().removeClass('h5p-flashcard-flipped');
  this.$flipButton.text('Flip Card');

  // Clear auto-flip timer
  if (this.autoFlipTimer) {
    clearTimeout(this.autoFlipTimer);
    this.autoFlipTimer = null;
  }

  // Start auto-flip if enabled
  if (this.options.autoFlip && this.options.autoFlipDelay > 0) {
    this.autoFlipTimer = setTimeout(() => {
      this.flipCard();
    }, this.options.autoFlipDelay * 1000);
  }
};

H5P.Flashcards.prototype.flipCard = function () {
  this.isFlipped = !this.isFlipped;

  if (this.isFlipped) {
    this.$cardFront.parent().addClass('h5p-flashcard-flipped');
    this.$flipButton.text('Show Front');
  } else {
    this.$cardFront.parent().removeClass('h5p-flashcard-flipped');
    this.$flipButton.text('Flip Card');
  }
};

H5P.Flashcards.prototype.nextCard = function () {
  if (this.currentCardIndex < this.cards.length - 1) {
    this.loadCard(this.currentCardIndex + 1);
  }
};

H5P.Flashcards.prototype.previousCard = function () {
  if (this.currentCardIndex > 0) {
    this.loadCard(this.currentCardIndex - 1);
  }
};
