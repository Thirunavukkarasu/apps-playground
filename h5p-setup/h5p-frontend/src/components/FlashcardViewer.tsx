import React from "react";
import type { H5PPlayerData } from "../types";
import { useFlashcards } from "../hooks/useFlashcards";

interface FlashcardViewerProps {
  playerData: H5PPlayerData;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  playerData,
}) => {
  const {
    currentFlashcardIndex,
    isFlashcardFlipped,
    handleFlip,
    handleNext,
    handlePrevious,
  } = useFlashcards();

  const cards = playerData.data?.parameters?.cards || [];
  const showProgress = playerData.data?.parameters?.showProgress ?? true;

  if (!cards.length) {
    return <div>No flashcard data available.</div>;
  }

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
            transform: isFlashcardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
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
          onClick={() => handlePrevious()}
          disabled={currentFlashcardIndex === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <button
          onClick={handleFlip}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isFlashcardFlipped ? "Show Front" : "Flip Card"}
        </button>

        <button
          onClick={() => handleNext(cards.length)}
          disabled={currentFlashcardIndex === cards.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
