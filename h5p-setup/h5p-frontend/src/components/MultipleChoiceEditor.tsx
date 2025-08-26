import React, { useState } from "react";
import type { H5PAnswer } from "../types";
import type { MultipleChoiceContent } from "../schemas/h5pSchemas";

interface MultipleChoiceEditorProps {
  content: MultipleChoiceContent;
  onSave: (updatedContent: MultipleChoiceContent) => void;
}

export const MultipleChoiceEditor: React.FC<MultipleChoiceEditorProps> = ({
  content,
  onSave,
}) => {
  const [title, setTitle] = useState(content.title || "");
  const [question, setQuestion] = useState(content.parameters.question || "");
  const [answers, setAnswers] = useState<H5PAnswer[]>(
    content.parameters.answers || [
      { text: "", correct: false },
      { text: "", correct: false },
    ]
  );
  const [enableRetry, setEnableRetry] = useState(
    content.parameters.enableRetry ?? true
  );
  const [enableSolutionsButton, setEnableSolutionsButton] = useState(
    content.parameters.enableSolutionsButton ?? true
  );
  const [passPercentage, setPassPercentage] = useState(
    content.parameters.passPercentage ?? 80
  );
  const [showResults, setShowResults] = useState(
    content.parameters.showResults ?? true
  );

  const addAnswer = () => {
    setAnswers([...answers, { text: "", correct: false }]);
  };

  const removeAnswer = (index: number) => {
    if (answers.length > 1) {
      setAnswers(answers.filter((_, i) => i !== index));
    }
  };

  const updateAnswer = (
    index: number,
    field: keyof H5PAnswer,
    value: string | boolean
  ) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    setAnswers(updatedAnswers);
  };

  const handleSave = () => {
    const updatedContent: MultipleChoiceContent = {
      id: content.id,
      title,
      mainLibrary: content.mainLibrary,
      parameters: {
        question,
        answers: answers.map((answer) => ({
          text: answer.text,
          correct: answer.correct,
          tipAndFeedback: answer.tipAndFeedback,
        })),
        enableRetry,
        enableSolutionsButton,
        passPercentage,
        showResults,
      },
      metadata: content.metadata,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };

    onSave(updatedContent);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter content title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your question here"
          />
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium text-gray-900">Answer Options</h4>
          <button
            onClick={addAnswer}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Add Answer
          </button>
        </div>

        <div className="space-y-3">
          {answers.map((answer, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={answer.correct}
                    onChange={(e) =>
                      updateAnswer(index, "correct", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Correct Answer
                  </label>
                </div>

                <textarea
                  value={answer.text}
                  onChange={(e) => updateAnswer(index, "text", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter answer text"
                />
              </div>

              {answers.length > 1 && (
                <button
                  onClick={() => removeAnswer(index)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Settings</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={enableRetry}
              onChange={(e) => setEnableRetry(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Enable Retry Button
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={enableSolutionsButton}
              onChange={(e) => setEnableSolutionsButton(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Enable Solutions Button
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={showResults}
              onChange={(e) => setShowResults(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Show Results
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pass Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={passPercentage}
              onChange={(e) => setPassPercentage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
