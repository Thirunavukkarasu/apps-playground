import React from "react";
import type { H5PPlayerData } from "../types";

interface FillInBlanksViewerProps {
  playerData: H5PPlayerData;
}

export const FillInBlanksViewer: React.FC<FillInBlanksViewerProps> = ({
  playerData,
}) => {
  const title = playerData.data?.parameters?.title;
  const description = playerData.data?.parameters?.description;
  const text = playerData.data?.parameters?.text;

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

  return (
    <div>
      {title && (
        <h5 className="text-xl font-semibold text-gray-800 mb-2">{title}</h5>
      )}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {text && (
        <div className="fill-in-blanks-text">
          {renderFillInBlanksText(text)}
        </div>
      )}
      <button
        onClick={checkBlanksAnswers}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Check Answers
      </button>
      <div
        id="blanks-result"
        className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg hidden"
      >
        <p className="text-blue-800 font-medium">Results will appear here</p>
      </div>
    </div>
  );
};
