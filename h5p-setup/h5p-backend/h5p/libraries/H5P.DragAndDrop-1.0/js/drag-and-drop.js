var H5P = H5P || {};

H5P.DragAndDrop = function (options, contentId) {
  this.options = options;
  this.contentId = contentId;
  this.draggableItems = options.draggableItems || [];
  this.dropZones = options.dropZones || [];
  this.isCompleted = false;
  this.correctAnswers = 0;
  this.totalItems = this.draggableItems.length;
  this.droppedItems = {};
  this.originalPositions = {};
};

H5P.DragAndDrop.prototype.attach = function ($container) {
  const self = this;

  // Create the main drag and drop container
  const $dragDropContainer = $('<div class="h5p-drag-drop-container"></div>');

  // Add title
  if (this.options.title) {
    $dragDropContainer.append(
      $('<h3 class="h5p-drag-drop-title"></h3>').text(this.options.title)
    );
  }

  // Add description
  if (this.options.description) {
    $dragDropContainer.append(
      $('<p class="h5p-drag-drop-description"></p>').text(
        this.options.description
      )
    );
  }

  // Add instructions
  if (this.options.instructions) {
    $dragDropContainer.append(
      $('<p class="h5p-drag-drop-instructions"></p>').text(
        this.options.instructions
      )
    );
  }

  // Create the main content area
  const $contentArea = $('<div class="h5p-drag-drop-content"></div>');

  // Create draggable items area
  const $draggableArea = $('<div class="h5p-draggable-area"></div>');
  const $draggableItemsContainer = $('<div class="h5p-draggable-items"></div>');

  // Create draggable items
  const itemsToShow = this.options.shuffleItems
    ? this.shuffleArray([...this.draggableItems])
    : this.draggableItems;

  itemsToShow.forEach((item, index) => {
    const $draggableItem = $(
      '<div class="h5p-draggable-item" draggable="true"></div>'
    )
      .text(item.text)
      .attr('data-item-index', index)
      .attr('data-correct-zone', item.correctDropZone);

    // Store original position
    this.originalPositions[index] = $draggableItem;

    // Add drag event listeners
    $draggableItem.on('dragstart', function (e) {
      e.originalEvent.dataTransfer.setData('text/plain', index);
      $(this).addClass('h5p-dragging');
    });

    $draggableItem.on('dragend', function () {
      $(this).removeClass('h5p-dragging');
    });

    $draggableItemsContainer.append($draggableItem);
  });

  $draggableArea.append($draggableItemsContainer);
  $contentArea.append($draggableArea);

  // Create drop zones area
  const $dropZonesArea = $('<div class="h5p-drop-zones-area"></div>');

  this.dropZones.forEach((zone, index) => {
    const $dropZone = $('<div class="h5p-drop-zone"></div>').attr(
      'data-zone-index',
      index + 1
    );

    const $zoneLabel = $('<div class="h5p-drop-zone-label"></div>').text(
      zone.label
    );
    const $zoneDescription = $(
      '<div class="h5p-drop-zone-description"></div>'
    ).text(zone.description);
    const $zoneContent = $('<div class="h5p-drop-zone-content"></div>');

    $dropZone.append($zoneLabel, $zoneDescription, $zoneContent);

    // Add drop event listeners
    $dropZone.on('dragover', function (e) {
      e.preventDefault();
      $(this).addClass('h5p-drag-over');
    });

    $dropZone.on('dragleave', function () {
      $(this).removeClass('h5p-drag-over');
    });

    $dropZone.on('drop', function (e) {
      e.preventDefault();
      $(this).removeClass('h5p-drag-over');

      const itemIndex = parseInt(
        e.originalEvent.dataTransfer.getData('text/plain')
      );
      const item = itemsToShow[itemIndex];
      const zoneIndex = index + 1;

      self.handleDrop(
        itemIndex,
        zoneIndex,
        item,
        $(this).find('.h5p-drop-zone-content')
      );
    });

    $dropZonesArea.append($dropZone);
  });

  $contentArea.append($dropZonesArea);
  $dragDropContainer.append($contentArea);

  // Create action buttons
  const $actions = $('<div class="h5p-drag-drop-actions"></div>');

  const $checkButton = $(
    '<button class="h5p-drag-drop-btn h5p-check-btn"></button>'
  )
    .text('Check Answers')
    .on('click', function () {
      self.checkAnswers();
    });

  const $resetButton = $(
    '<button class="h5p-drag-drop-btn h5p-reset-btn"></button>'
  )
    .text('Reset')
    .on('click', function () {
      self.resetActivity();
    });

  $actions.append($checkButton, $resetButton);
  $dragDropContainer.append($actions);

  // Create feedback area
  const $feedbackArea = $('<div class="h5p-drag-drop-feedback"></div>');
  $dragDropContainer.append($feedbackArea);

  // Store references
  this.$container = $dragDropContainer;
  this.$draggableItemsContainer = $draggableItemsContainer;
  this.$feedbackArea = $feedbackArea;
  this.$checkButton = $checkButton;
  this.$resetButton = $resetButton;
  this.itemsToShow = itemsToShow;

  // Add to container
  $container.append($dragDropContainer);
};

H5P.DragAndDrop.prototype.handleDrop = function (
  itemIndex,
  zoneIndex,
  item,
  $zoneContent
) {
  // Remove item from original position if it was already dropped
  if (this.droppedItems[itemIndex]) {
    this.droppedItems[itemIndex].remove();
  }

  // Create dropped item element
  const $droppedItem = $('<div class="h5p-dropped-item"></div>')
    .text(item.text)
    .attr('data-item-index', itemIndex)
    .attr('data-correct-zone', item.correctDropZone);

  // Add remove functionality
  $droppedItem.on('click', () => {
    this.removeDroppedItem(itemIndex, $droppedItem);
  });

  // Add to drop zone
  $zoneContent.append($droppedItem);

  // Store reference
  this.droppedItems[itemIndex] = $droppedItem;

  // Hide original item
  this.originalPositions[itemIndex].hide();
};

H5P.DragAndDrop.prototype.removeDroppedItem = function (
  itemIndex,
  $droppedItem
) {
  $droppedItem.remove();
  delete this.droppedItems[itemIndex];

  // Show original item again
  this.originalPositions[itemIndex].show();
};

H5P.DragAndDrop.prototype.checkAnswers = function () {
  let correct = 0;
  const total = this.itemsToShow.length;

  // Check each dropped item
  Object.keys(this.droppedItems).forEach(itemIndex => {
    const $droppedItem = this.droppedItems[itemIndex];
    const correctZone = parseInt($droppedItem.attr('data-correct-zone'));
    const currentZone = parseInt(
      $droppedItem.closest('.h5p-drop-zone').attr('data-zone-index')
    );

    if (correctZone === currentZone) {
      correct++;
      $droppedItem.addClass('h5p-correct');
      $droppedItem.removeClass('h5p-incorrect');
    } else {
      $droppedItem.addClass('h5p-incorrect');
      $droppedItem.removeClass('h5p-correct');
    }
  });

  // Check items that weren't dropped
  this.itemsToShow.forEach((item, index) => {
    if (!this.droppedItems[index]) {
      // Item wasn't dropped, mark as incorrect
      this.originalPositions[index].addClass('h5p-not-dropped');
    }
  });

  this.correctAnswers = correct;
  this.isCompleted = true;

  // Show feedback
  this.showFeedback(correct, total);

  // Update button states
  this.$checkButton.prop('disabled', true);
  if (this.options.allowRetry) {
    this.$resetButton.show();
  }
};

H5P.DragAndDrop.prototype.showFeedback = function (correct, total) {
  const percentage = Math.round((correct / total) * 100);
  const isPerfect = correct === total;

  let feedbackText = '';
  let feedbackClass = '';

  if (isPerfect) {
    feedbackText = `Perfect! All ${total} items are in their correct positions.`;
    feedbackClass = 'h5p-feedback-perfect';
  } else if (percentage >= 80) {
    feedbackText = `Good job! ${correct} out of ${total} items are correct (${percentage}%).`;
    feedbackClass = 'h5p-feedback-good';
  } else if (percentage >= 60) {
    feedbackText = `Not bad! ${correct} out of ${total} items are correct (${percentage}%). Keep trying!`;
    feedbackClass = 'h5p-feedback-okay';
  } else {
    feedbackText = `Try again! Only ${correct} out of ${total} items are correct (${percentage}%).`;
    feedbackClass = 'h5p-feedback-poor';
  }

  this.$feedbackArea
    .removeClass(
      'h5p-feedback-perfect h5p-feedback-good h5p-feedback-okay h5p-feedback-poor'
    )
    .addClass(feedbackClass)
    .html(`<p>${feedbackText}</p>`)
    .show();
};

H5P.DragAndDrop.prototype.resetActivity = function () {
  // Remove all dropped items
  Object.values(this.droppedItems).forEach($item => {
    $item.remove();
  });
  this.droppedItems = {};

  // Show all original items
  Object.values(this.originalPositions).forEach($item => {
    $item.show().removeClass('h5p-not-dropped');
  });

  // Clear drop zones
  $('.h5p-drop-zone-content').empty();

  // Clear feedback
  this.$feedbackArea.hide();

  // Reset state
  this.isCompleted = false;
  this.correctAnswers = 0;

  // Update button states
  this.$checkButton.prop('disabled', false);
  this.$resetButton.hide();
};

H5P.DragAndDrop.prototype.shuffleArray = function (array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
