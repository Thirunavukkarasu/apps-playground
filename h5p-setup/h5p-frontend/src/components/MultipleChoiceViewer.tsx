import React from "react";
import type { H5PPlayerData } from "../types";
import type { MultipleChoiceContent } from "../schemas/h5pSchemas";

interface MultipleChoiceViewerProps {
  playerData: H5PPlayerData;
  currentContent: MultipleChoiceContent;
}

export const MultipleChoiceViewer: React.FC<MultipleChoiceViewerProps> = ({
  playerData,
  currentContent,
}) => {
  const question = playerData.data?.parameters?.question;
  const answers = playerData.data?.parameters?.answers || [];

  const checkMultipleChoiceAnswers = () => {
    const checkboxes = document.querySelectorAll("input[data-answer-index]");
    const resultDiv = document.getElementById("multiple-choice-result");

    if (!resultDiv) return;

    let totalCorrect = 0;
    let userCorrect = 0;

    // Get the answers data from the current content
    if (!currentContent || !currentContent.parameters.answers) {
      resultDiv.innerHTML =
        '<p class="text-red-600">Error: Could not load answer data</p>';
      resultDiv.classList.remove("hidden");
      return;
    }

    const answers = currentContent.parameters.answers;

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
    <div>
      {question && (
        <h5 className="text-xl font-semibold text-gray-800 mb-4">{question}</h5>
      )}
      {answers.length > 0 && (
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
      )}
      <button
        onClick={checkMultipleChoiceAnswers}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Check Answers
      </button>
      <div
        id="multiple-choice-result"
        className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg hidden"
      >
        <p className="text-blue-800 font-medium">Results will appear here</p>
      </div>
    </div>
  );
};
