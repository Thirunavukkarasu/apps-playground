import { useState, useEffect } from "react";
import axios from "axios";

interface H5PContent {
  id: string;
  title: string;
  mainLibrary?: string;
  createdAt?: string;
  updatedAt?: string;
  parameters?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// H5P Answer interface for multiple choice questions
interface H5PAnswer {
  text: string;
  correct: boolean;
  tipAndFeedback?: {
    tip: string;
    chosenFeedback: string;
    notChosenFeedback: string;
  };
}

// H5P Flashcard interface
interface H5PFlashcard {
  front: string;
  back: string;
}

// H5P Drag and Drop interfaces
interface H5PDraggableItem {
  text: string;
  correctDropZone: number;
}

interface H5PDropZone {
  label: string;
  description: string;
}

// H5P Player Data interface
interface H5PPlayerData {
  data?: {
    title?: string;
    mainLibrary?: string;
    createdAt?: string;
    parameters?: {
      title?: string;
      description?: string;
      text?: string;
      question?: string;
      answers?: H5PAnswer[];
      cards?: H5PFlashcard[];
      showProgress?: boolean;
      autoFlip?: boolean;
      autoFlipDelay?: number;
      instructions?: string;
      draggableItems?: H5PDraggableItem[];
      dropZones?: H5PDropZone[];
      showFeedback?: boolean;
      allowRetry?: boolean;
      shuffleItems?: boolean;
    };
  };
}

function App() {
  const [contents, setContents] = useState<H5PContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [editorData, setEditorData] = useState<Record<string, unknown> | null>(
    null
  );
  const [playerData, setPlayerData] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [dragDropState, setDragDropState] = useState<{
    droppedItems: Record<number, { itemIndex: number; zoneIndex: number }>;
    isCompleted: boolean;
    correctAnswers: number;
  }>({
    droppedItems: {},
    isCompleted: false,
    correctAnswers: 0,
  });

  const API_BASE_URL = "http://localhost:3000";

  // Load existing content on component mount
  useEffect(() => {
    loadContentList();
  }, []);

  // Load content list from backend
  const loadContentList = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_BASE_URL}/h5p/content`);
      setContents(response.data);

      if (response.data.length > 0 && !selectedContent) {
        setSelectedContent(response.data[0].id);
      }
    } catch (err) {
      setError("Failed to load content list");
      console.error("Error loading content list:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new H5P content
  const createContent = async (contentType: string = "text") => {
    try {
      setLoading(true);
      setError("");

      const newContentId = `content_${Date.now()}`;
      let contentData;

      switch (contentType) {
        case "flashcards":
          contentData = {
            title: "New Flashcard Set",
            mainLibrary: "H5P.Flashcards 1.0",
            parameters: {
              title: "Sample Flashcards",
              description: "Interactive flashcards for learning",
              cards: [
                {
                  front: "What is the capital of France?",
                  back: "Paris",
                },
                {
                  front: "What is 2 + 2?",
                  back: "4",
                },
              ],
              showProgress: true,
              autoFlip: false,
              autoFlipDelay: 3,
            },
          };
          break;
        case "multiple-choice":
          contentData = {
            title: "New Multiple Choice",
            mainLibrary: "H5P.MultipleChoice 1.16",
            parameters: {
              question: "Sample question?",
              answers: [
                { text: "Option 1", correct: true },
                { text: "Option 2", correct: false },
                { text: "Option 3", correct: false },
              ],
            },
          };
          break;
        case "blanks":
          contentData = {
            title: "New Fill in the Blanks",
            mainLibrary: "H5P.Blanks 1.14",
            parameters: {
              title: "Sample Fill in the Blanks",
              description: "Complete the sentences",
              text: "The *sun/sun* rises in the *east/east*.",
            },
          };
          break;
        case "drag-drop":
          contentData = {
            title: "New Drag and Drop",
            mainLibrary: "H5P.DragAndDrop 1.0",
            parameters: {
              title: "Sample Drag and Drop",
              description: "Drag items to their correct positions",
              instructions: "Drag each item to its correct category.",
              draggableItems: [
                { text: "Apple", correctDropZone: 1 },
                { text: "Car", correctDropZone: 2 },
                { text: "Book", correctDropZone: 3 },
              ],
              dropZones: [
                { label: "Fruit", description: "Food that grows on trees" },
                { label: "Vehicle", description: "Machine for transportation" },
                { label: "Object", description: "Item for reading" },
              ],
              showFeedback: true,
              allowRetry: true,
              shuffleItems: false,
            },
          };
          break;
        default:
          contentData = {
            title: "New H5P Content",
            mainLibrary: "H5P.Text 1.1",
            parameters: {
              text: "<p>Enter your content here...</p>",
            },
          };
      }

      await axios.post(
        `${API_BASE_URL}/h5p/editor/${newContentId}`,
        contentData
      );

      // Refresh content list
      await loadContentList();
      setSelectedContent(newContentId);

      // Load editor data
      await loadEditorData(newContentId);
    } catch (err) {
      setError("Failed to create content");
      console.error("Error creating content:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load editor data for a content
  const loadEditorData = async (contentId: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/h5p/editor/${contentId}`
      );
      setEditorData(response.data);
    } catch (err) {
      setError("Failed to load editor data");
      console.error("Error loading editor data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load player data for a content
  const loadPlayerData = async (contentId: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/h5p/player/${contentId}`
      );
      setPlayerData(response.data);
    } catch (err) {
      setError("Failed to load player data");
      console.error("Error loading player data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render Fill in the Blanks text with input fields
  const renderFillInBlanksText = (text: string) => {
    // H5P Fill in the Blanks format: *correct/alternative*
    const blankPattern = /\*([^/]+)\/[^*]+\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blankIndex = 0;

    // Reset the regex
    const regex = new RegExp(blankPattern);

    while ((match = regex.exec(text)) !== null) {
      // Add text before the blank
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      // Add the blank
      parts.push({
        type: "blank",
        correctAnswer: match[1].trim(),
        index: blankIndex++,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }

    return (
      <div className="text-gray-800 leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part.type === "text" ? (
              part.content
            ) : (
              <input
                type="text"
                className="mx-1 px-2 py-1 border border-gray-300 rounded text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Answer"
                data-blank-index={part.index}
                data-correct-answer={part.correctAnswer}
              />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Check answers for Fill in the Blanks
  const checkBlanksAnswers = () => {
    const inputs = document.querySelectorAll("input[data-blank-index]");
    const resultDiv = document.getElementById("blanks-result");

    if (!resultDiv) return;

    let correctAnswers = 0;
    const totalBlanks = inputs.length;

    inputs.forEach((input) => {
      const userAnswer = (input as HTMLInputElement).value.trim().toLowerCase();
      const correctAnswer =
        (input as HTMLInputElement)
          .getAttribute("data-correct-answer")
          ?.toLowerCase() || "";

      if (userAnswer === correctAnswer) {
        correctAnswers++;
        input.classList.add("border-green-500", "bg-green-50");
        input.classList.remove("border-red-500", "bg-red-50");
      } else {
        input.classList.add("border-red-500", "bg-red-50");
        input.classList.remove("border-green-500", "bg-green-50");
      }
    });

    const percentage = Math.round((correctAnswers / totalBlanks) * 100);

    resultDiv.innerHTML = `
      <div class="text-center">
        <p class="text-lg font-semibold ${
          percentage >= 80 ? "text-green-600" : "text-red-600"
        }">
          ${correctAnswers} out of ${totalBlanks} correct (${percentage}%)
        </p>
        <p class="text-sm text-gray-600 mt-1">
          ${percentage >= 80 ? "Great job!" : "Keep trying!"}
        </p>
      </div>
    `;

    resultDiv.classList.remove("hidden");
  };

  // Render Multiple Choice answers
  const renderMultipleChoiceAnswers = (answers: H5PAnswer[]) => {
    return (
      <div className="space-y-3">
        {answers.map((answer, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <input
              type="checkbox"
              id={`mc-answer-${index}`}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              data-answer-index={index}
            />
            <label
              htmlFor={`mc-answer-${index}`}
              className="flex-1 text-gray-900 cursor-pointer"
            >
              {answer.text}
            </label>
          </div>
        ))}
      </div>
    );
  };

  // Render Flashcards
  const renderFlashcards = (
    cards: H5PFlashcard[],
    showProgress: boolean = true
  ) => {
    const handleFlip = () => {
      setIsFlashcardFlipped(!isFlashcardFlipped);
    };

    const handleNext = () => {
      if (currentFlashcardIndex < cards.length - 1) {
        setCurrentFlashcardIndex(currentFlashcardIndex + 1);
        setIsFlashcardFlipped(false);
      }
    };

    const handlePrevious = () => {
      if (currentFlashcardIndex > 0) {
        setCurrentFlashcardIndex(currentFlashcardIndex - 1);
        setIsFlashcardFlipped(false);
      }
    };

    const currentCard = cards[currentFlashcardIndex];

    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        {showProgress && cards.length > 1 && (
          <div className="text-center mb-4">
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {currentFlashcardIndex + 1} / {cards.length}
            </span>
          </div>
        )}

        {/* Flashcard */}
        <div
          className="relative w-full h-64 mb-6 cursor-pointer"
          onClick={handleFlip}
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full h-full transition-transform duration-600"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlashcardFlipped
                ? "rotateY(180deg)"
                : "rotateY(0deg)",
            }}
          >
            {/* Front of card */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-lg flex items-center justify-center p-6 text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-xl font-medium leading-relaxed">
                {currentCard.front}
              </div>
            </div>

            {/* Back of card */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-lg shadow-lg flex items-center justify-center p-6 text-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="text-xl font-medium leading-relaxed">
                {currentCard.back}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentFlashcardIndex === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <button
            onClick={handleFlip}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isFlashcardFlipped ? "Show Front" : "Flip Card"}
          </button>

          <button
            onClick={handleNext}
            disabled={currentFlashcardIndex === cards.length - 1}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    );
  };

  // Render Drag and Drop
  const renderDragAndDrop = (
    draggableItems: H5PDraggableItem[],
    dropZones: H5PDropZone[],
    showFeedback: boolean = true,
    allowRetry: boolean = true
  ) => {
    const handleDragStart = (e: React.DragEvent, itemIndex: number) => {
      e.dataTransfer.setData("text/plain", itemIndex.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, zoneIndex: number) => {
      e.preventDefault();
      const itemIndex = parseInt(e.dataTransfer.getData("text/plain"));

      setDragDropState((prev) => ({
        ...prev,
        droppedItems: {
          ...prev.droppedItems,
          [itemIndex]: { itemIndex, zoneIndex },
        },
      }));
    };

    const handleRemoveItem = (itemIndex: number) => {
      setDragDropState((prev) => {
        const newDroppedItems = { ...prev.droppedItems };
        delete newDroppedItems[itemIndex];
        return {
          ...prev,
          droppedItems: newDroppedItems,
        };
      });
    };

    const checkAnswers = () => {
      let correct = 0;

      Object.entries(dragDropState.droppedItems).forEach(
        ([itemIndexStr, data]) => {
          const itemIndex = parseInt(itemIndexStr);
          const item = draggableItems[itemIndex];
          if (item.correctDropZone === data.zoneIndex) {
            correct++;
          }
        }
      );

      setDragDropState((prev) => ({
        ...prev,
        isCompleted: true,
        correctAnswers: correct,
      }));
    };

    const resetActivity = () => {
      setDragDropState({
        droppedItems: {},
        isCompleted: false,
        correctAnswers: 0,
      });
    };

    const getFeedbackMessage = () => {
      const percentage = Math.round(
        (dragDropState.correctAnswers / draggableItems.length) * 100
      );

      if (dragDropState.correctAnswers === draggableItems.length) {
        return {
          text: `Perfect! All ${draggableItems.length} items are in their correct positions.`,
          class: "text-green-600 bg-green-50",
        };
      } else if (percentage >= 80) {
        return {
          text: `Good job! ${dragDropState.correctAnswers} out of ${draggableItems.length} items are correct (${percentage}%).`,
          class: "text-yellow-600 bg-yellow-50",
        };
      } else if (percentage >= 60) {
        return {
          text: `Not bad! ${dragDropState.correctAnswers} out of ${draggableItems.length} items are correct (${percentage}%). Keep trying!`,
          class: "text-orange-600 bg-orange-50",
        };
      } else {
        return {
          text: `Try again! Only ${dragDropState.correctAnswers} out of ${draggableItems.length} items are correct (${percentage}%).`,
          class: "text-red-600 bg-red-50",
        };
      }
    };

    const isItemDropped = (itemIndex: number) => {
      return Object.prototype.hasOwnProperty.call(
        dragDropState.droppedItems,
        itemIndex
      );
    };

    const isItemCorrect = (itemIndex: number) => {
      if (!dragDropState.isCompleted) return null;
      const droppedData = dragDropState.droppedItems[itemIndex];
      if (!droppedData) return false;
      return (
        draggableItems[itemIndex].correctDropZone === droppedData.zoneIndex
      );
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Draggable Items Area */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
            <h4 className="font-semibold text-gray-700 mb-3">Items to Drag</h4>
            <div className="space-y-2">
              {draggableItems.map((item, index) => (
                <div
                  key={index}
                  draggable={!isItemDropped(index)}
                  onDragStart={(e) => handleDragStart(e, index)}
                  className={`p-3 rounded-lg cursor-grab transition-all ${
                    isItemDropped(index)
                      ? "opacity-50 bg-gray-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-md"
                  } ${
                    dragDropState.isCompleted && !isItemDropped(index)
                      ? "bg-red-500 opacity-70"
                      : ""
                  } ${
                    dragDropState.isCompleted && isItemDropped(index)
                      ? isItemCorrect(index)
                        ? "bg-green-500"
                        : "bg-red-500"
                      : ""
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Drop Zones Area */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 mb-3">Drop Zones</h4>
            {dropZones.map((zone, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index + 1)}
                className={`border-2 border-gray-300 rounded-lg p-4 min-h-[80px] transition-all ${
                  dragDropState.isCompleted
                    ? "border-gray-400"
                    : "hover:border-blue-400"
                }`}
              >
                <div className="font-semibold text-gray-800 mb-1">
                  {zone.label}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {zone.description}
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {Object.entries(dragDropState.droppedItems)
                    .filter(([, data]) => data.zoneIndex === index + 1)
                    .map(([itemIndexStr]) => {
                      const itemIndex = parseInt(itemIndexStr);
                      const item = draggableItems[itemIndex];
                      return (
                        <div
                          key={itemIndex}
                          className={`px-3 py-1 rounded text-sm font-medium cursor-pointer transition-all ${
                            dragDropState.isCompleted
                              ? isItemCorrect(itemIndex)
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                          onClick={() =>
                            !dragDropState.isCompleted &&
                            handleRemoveItem(itemIndex)
                          }
                        >
                          {item.text}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={checkAnswers}
            disabled={
              dragDropState.isCompleted ||
              Object.keys(dragDropState.droppedItems).length === 0
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Check Answers
          </button>
          {allowRetry && dragDropState.isCompleted && (
            <button
              onClick={resetActivity}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Feedback */}
        {dragDropState.isCompleted && showFeedback && (
          <div
            className={`mt-4 p-4 rounded-lg text-center ${
              getFeedbackMessage().class
            }`}
          >
            <p className="font-medium">{getFeedbackMessage().text}</p>
          </div>
        )}
      </div>
    );
  };

  // Check answers for Multiple Choice
  const checkMultipleChoiceAnswers = () => {
    const checkboxes = document.querySelectorAll("input[data-answer-index]");
    const resultDiv = document.getElementById("multiple-choice-result");

    if (!resultDiv) return;

    let totalCorrect = 0;
    let userCorrect = 0;

    // Get the answers data from the player data
    if (
      !playerData ||
      !(playerData as H5PPlayerData).data?.parameters?.answers
    ) {
      resultDiv.innerHTML =
        '<p class="text-red-600">Error: Could not load answer data</p>';
      resultDiv.classList.remove("hidden");
      return;
    }

    const answers = (playerData as H5PPlayerData).data!.parameters!.answers!;

    checkboxes.forEach((checkbox, index) => {
      const isSelected = (checkbox as HTMLInputElement).checked;
      const answer = answers[index];

      if (answer.correct) {
        totalCorrect++;
        if (isSelected) {
          userCorrect++;
        }
      }

      // Visual feedback
      const answerDiv = checkbox.closest(".flex");
      if (answerDiv) {
        if (isSelected) {
          answerDiv.classList.add("bg-green-50", "border-green-300");
          if (answer.correct) {
            answerDiv.classList.add("border-green-500");
          } else {
            answerDiv.classList.add("border-red-500");
          }
        } else if (answer.correct) {
          answerDiv.classList.add("bg-yellow-50", "border-yellow-500");
        }
      }
    });

    const percentage =
      totalCorrect > 0 ? Math.round((userCorrect / totalCorrect) * 100) : 0;
    const passed = percentage >= 80;

    resultDiv.innerHTML = `
      <div class="text-center">
        <p class="text-lg font-semibold ${
          passed ? "text-green-600" : "text-red-600"
        }">
          ${userCorrect} out of ${totalCorrect} correct (${percentage}%)
        </p>
        <p class="text-sm text-gray-600 mt-1">
          ${
            passed
              ? "Great job! You passed!"
              : "Keep trying! You need 80% to pass."
          }
        </p>
      </div>
    `;

    resultDiv.classList.remove("hidden");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            H5P Content Manager
          </h1>
          <p className="text-gray-600">
            Create and manage interactive H5P content
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Content List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Content List
                </h2>
                <div className="space-x-2">
                  <button
                    onClick={loadContentList}
                    disabled={loading}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Loading..." : "Refresh"}
                  </button>
                  <button
                    onClick={() => createContent()}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Creating..." : "New Content"}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Quick Create:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => createContent("flashcards")}
                    disabled={loading}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Creating..." : "Flashcards"}
                  </button>
                  <button
                    onClick={() => createContent("multiple-choice")}
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Creating..." : "Multiple Choice"}
                  </button>
                  <button
                    onClick={() => createContent("blanks")}
                    disabled={loading}
                    className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Creating..." : "Fill in Blanks"}
                  </button>
                  <button
                    onClick={() => createContent("drag-drop")}
                    disabled={loading}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Creating..." : "Drag & Drop"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {contents.map((content) => (
                  <div
                    key={content.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedContent === content.id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedContent(content.id)}
                  >
                    <h3 className="font-medium text-gray-900">
                      {content.title}
                    </h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Library: {content.mainLibrary}</p>
                      <p>
                        Created:{" "}
                        {content.createdAt
                          ? new Date(content.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                ))}

                {contents.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No content created yet. Click "New Content" to get started.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Area - Editor/Player */}
          <div className="lg:col-span-2">
            {selectedContent ? (
              <div className="space-y-6">
                {/* Content Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Content:{" "}
                      {contents.find((c) => c.id === selectedContent)?.title}
                    </h2>
                    <div className="space-x-2">
                      <button
                        onClick={() => loadEditorData(selectedContent)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? "Loading..." : "Load Editor"}
                      </button>
                      <button
                        onClick={() => loadPlayerData(selectedContent)}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? "Loading..." : "Load Player"}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Content ID: {selectedContent}
                  </p>
                </div>

                {/* Editor Data Display */}
                {editorData && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Editor Data
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                        {JSON.stringify(editorData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Player Data Display */}
                {playerData && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Content Viewer
                    </h3>

                    {/* H5P Content Display */}
                    <div className="mb-4">
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {(playerData as H5PPlayerData).data?.title ||
                            "Untitled Content"}
                        </h4>
                        {/* Fill in the Blanks Content */}
                        {(playerData as H5PPlayerData).data?.mainLibrary ===
                          "H5P.Blanks 1.14" && (
                          <div className="h5p-blanks-content">
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.title && (
                              <h5 className="text-xl font-semibold text-gray-800 mb-2">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.title
                                }
                              </h5>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.description && (
                              <p className="text-gray-600 mb-4">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.description
                                }
                              </p>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.text && (
                              <div className="fill-in-blanks-text">
                                {renderFillInBlanksText(
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.text || ""
                                )}
                              </div>
                            )}
                            <button
                              onClick={() => checkBlanksAnswers()}
                              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Check Answers
                            </button>
                            <div
                              id="blanks-result"
                              className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg hidden"
                            >
                              <p className="text-blue-800 font-medium">
                                Results will appear here
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Multiple Choice Content */}
                        {(playerData as H5PPlayerData).data?.mainLibrary ===
                          "H5P.MultipleChoice 1.16" && (
                          <div className="h5p-multiple-choice-content">
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.question && (
                              <h5 className="text-xl font-semibold text-gray-800 mb-4">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.question
                                }
                              </h5>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.answers && (
                              <div className="multiple-choice-answers">
                                {renderMultipleChoiceAnswers(
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.answers || []
                                )}
                              </div>
                            )}
                            <button
                              onClick={() => checkMultipleChoiceAnswers()}
                              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Check Answers
                            </button>
                            <div
                              id="multiple-choice-result"
                              className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg hidden"
                            >
                              <p className="text-blue-800 font-medium">
                                Results will appear here
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Flashcard Content */}
                        {(playerData as H5PPlayerData).data?.mainLibrary ===
                          "H5P.Flashcards 1.0" && (
                          <div className="h5p-flashcards-content">
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.title && (
                              <h5 className="text-xl font-semibold text-gray-800 mb-2">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.title
                                }
                              </h5>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.description && (
                              <p className="text-gray-600 mb-4">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.description
                                }
                              </p>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.cards && (
                              <div className="flashcards-container">
                                {renderFlashcards(
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.cards || [],
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.showProgress || true
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Drag and Drop Content */}
                        {(playerData as H5PPlayerData).data?.mainLibrary ===
                          "H5P.DragAndDrop 1.0" && (
                          <div className="h5p-drag-drop-content">
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.title && (
                              <h5 className="text-xl font-semibold text-gray-800 mb-2">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.title
                                }
                              </h5>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.description && (
                              <p className="text-gray-600 mb-2">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.description
                                }
                              </p>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.instructions && (
                              <p className="text-gray-700 mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                                {
                                  (playerData as H5PPlayerData).data?.parameters
                                    ?.instructions
                                }
                              </p>
                            )}
                            {(playerData as H5PPlayerData).data?.parameters
                              ?.draggableItems &&
                              (playerData as H5PPlayerData).data?.parameters
                                ?.dropZones && (
                                <div className="drag-drop-container">
                                  {renderDragAndDrop(
                                    (playerData as H5PPlayerData).data
                                      ?.parameters?.draggableItems || [],
                                    (playerData as H5PPlayerData).data
                                      ?.parameters?.dropZones || [],
                                    (playerData as H5PPlayerData).data
                                      ?.parameters?.showFeedback || true,
                                    (playerData as H5PPlayerData).data
                                      ?.parameters?.allowRetry || true
                                  )}
                                </div>
                              )}
                          </div>
                        )}

                        {/* Regular Text Content */}
                        {(playerData as H5PPlayerData).data?.mainLibrary ===
                          "H5P.Text 1.1" &&
                          (playerData as H5PPlayerData).data?.parameters
                            ?.text && (
                            <div
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html:
                                  ((playerData as H5PPlayerData).data
                                    ?.parameters?.text as string) || "",
                              }}
                            />
                          )}
                        <div className="mt-4 text-sm text-gray-500">
                          <p>
                            Library:{" "}
                            {(playerData as H5PPlayerData).data?.mainLibrary}
                          </p>
                          <p>
                            Created:{" "}
                            {new Date(
                              (playerData as H5PPlayerData).data
                                ?.createdAt as string
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Raw Data (Collapsible) */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                        View Raw Data
                      </summary>
                      <div className="mt-2 bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {JSON.stringify(playerData, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Content Selected
                </h3>
                <p className="text-gray-500">
                  Select a content from the list or create a new one to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
