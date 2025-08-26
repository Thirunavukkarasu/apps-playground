import React, { useState } from "react";
import type { H5PPlayerData } from "../types";

interface MultipleChoiceViewerProps {
  playerData: H5PPlayerData;
}

export const MultipleChoiceViewer: React.FC<MultipleChoiceViewerProps> = ({
  playerData,
}) => {
  const question = playerData.data?.parameters?.question;
  const answers = playerData.data?.parameters?.answers || [];
  const [selectedAnswers, setSelectedAnswers] = useState<boolean[]>(
    new Array(answers.length).fill(false)
  );
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState<boolean[]>(
    new Array(answers.length).fill(false)
  );
  const [results, setResults] = useState<{
    userCorrect: number;
    totalCorrect: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  const handleAnswerChange = (index: number, checked: boolean) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = checked;
    setSelectedAnswers(newSelectedAnswers);
  };

  const toggleFeedback = (index: number) => {
    const newShowFeedback = [...showFeedback];
    newShowFeedback[index] = !newShowFeedback[index];
    setShowFeedback(newShowFeedback);
  };

  const checkMultipleChoiceAnswers = () => {
    if (!answers || answers.length === 0) {
      console.error("No answers available for checking");
      return;
    }

    let totalCorrect = 0;
    let userCorrect = 0;

    answers.forEach((answer, index) => {
      if (answer.correct) {
        totalCorrect++;
        if (selectedAnswers[index]) {
          userCorrect++;
        }
      }
    });

    const percentage =
      totalCorrect > 0 ? Math.round((userCorrect / totalCorrect) * 100) : 0;
    const passed = percentage >= 80;

    setResults({
      userCorrect,
      totalCorrect,
      percentage,
      passed,
    });
    setShowResults(true);
  };

  const getFeedbackText = (
    answer: {
      tipAndFeedback?: {
        tip?: string;
        chosenFeedback?: string;
        notChosenFeedback?: string;
      };
    },
    isSelected: boolean
  ) => {
    if (!answer.tipAndFeedback) return null;

    const { tip, chosenFeedback, notChosenFeedback } = answer.tipAndFeedback;

    if (isSelected) {
      return chosenFeedback || tip;
    } else {
      return notChosenFeedback || tip;
    }
  };

  return (
    <div>
      {question && (
        <h5 className="text-xl font-semibold text-gray-800 mb-4">{question}</h5>
      )}
      {answers.length > 0 && (
        <div className="space-y-3">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers[index];
            const feedbackText = getFeedbackText(answer, isSelected);
            const showAnswerFeedback = showResults && feedbackText;

            return (
              <div
                key={index}
                className={`border rounded-lg transition-colors ${
                  showResults
                    ? isSelected
                      ? answer.correct
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                      : answer.correct
                      ? "bg-yellow-50 border-yellow-300"
                      : "border-gray-200"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3 p-3">
                  <input
                    type="checkbox"
                    id={`mc-answer-${index}`}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={isSelected}
                    onChange={(e) =>
                      handleAnswerChange(index, e.target.checked)
                    }
                    disabled={showResults}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`mc-answer-${index}`}
                      className="text-gray-900 cursor-pointer block"
                    >
                      {answer.text}
                    </label>

                    {/* Tip (always visible if available) */}
                    {answer.tipAndFeedback?.tip && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                        <div className="flex items-start">
                          <svg
                            className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-blue-800">
                            {answer.tipAndFeedback.tip}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback Toggle Button */}
                  {showAnswerFeedback && (
                    <button
                      onClick={() => toggleFeedback(index)}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      title="Toggle feedback"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Feedback Display */}
                {showAnswerFeedback && showFeedback[index] && (
                  <div
                    className={`px-3 pb-3 border-t ${
                      isSelected
                        ? answer.correct
                          ? "border-green-200"
                          : "border-red-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`mt-3 p-3 rounded-lg ${
                        isSelected
                          ? answer.correct
                            ? "bg-green-100 border border-green-200"
                            : "bg-red-100 border border-red-200"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <svg
                          className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                            isSelected
                              ? answer.correct
                                ? "text-green-600"
                                : "text-red-600"
                              : "text-gray-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span
                          className={`text-sm ${
                            isSelected
                              ? answer.correct
                                ? "text-green-800"
                                : "text-red-800"
                              : "text-gray-700"
                          }`}
                        >
                          {feedbackText}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex space-x-3">
        <button
          onClick={checkMultipleChoiceAnswers}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Check Answers
        </button>

        {showResults && (
          <button
            onClick={() => {
              setShowResults(false);
              setSelectedAnswers(new Array(answers.length).fill(false));
              setShowFeedback(new Array(answers.length).fill(false));
              setResults(null);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      {showResults && results && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-center">
            <p
              className={`text-lg font-semibold ${
                results.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {results.userCorrect} out of {results.totalCorrect} correct (
              {results.percentage}%)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {results.passed
                ? "Great job! You passed!"
                : "Keep trying! You need 80% to pass."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
