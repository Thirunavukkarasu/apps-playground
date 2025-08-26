import React from "react";
import type { H5PContent, H5PPlayerData } from "../types";
import { FlashcardViewer } from "./FlashcardViewer";
import { DragAndDropViewer } from "./DragAndDropViewer";
import { MultipleChoiceViewer } from "./MultipleChoiceViewer";
import { FillInBlanksViewer } from "./FillInBlanksViewer";
import { TextViewer } from "./TextViewer";

interface ContentViewerProps {
  selectedContent: string;
  contents: H5PContent[];
  playerData: H5PPlayerData | null;
  editorData: Record<string, unknown> | null;
  loading: boolean;
  loadEditorData: (contentId: string) => void;
  loadPlayerData: (contentId: string) => void;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({
  selectedContent,
  contents,
  playerData,
  editorData,
  loading,
  loadEditorData,
  loadPlayerData,
}) => {
  if (!selectedContent) {
    return (
      <div className="lg:col-span-2">
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
            Select a content from the list or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  const currentContent = contents.find((c) => c.id === selectedContent);

  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        {/* Content Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Content: {currentContent?.title}
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

          <p className="text-sm text-gray-600">Content ID: {selectedContent}</p>
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
                  {playerData.data?.title || "Untitled Content"}
                </h4>

                {/* Render different content types */}
                {playerData.data?.mainLibrary === "H5P.Flashcards 1.0" && (
                  <FlashcardViewer playerData={playerData} />
                )}

                {playerData.data?.mainLibrary === "H5P.DragAndDrop 1.0" && (
                  <DragAndDropViewer playerData={playerData} />
                )}

                {playerData.data?.mainLibrary === "H5P.MultipleChoice 1.16" && (
                  <MultipleChoiceViewer
                    playerData={playerData}
                    contents={contents}
                    selectedContent={selectedContent}
                  />
                )}

                {playerData.data?.mainLibrary === "H5P.Blanks 1.14" && (
                  <FillInBlanksViewer playerData={playerData} />
                )}

                {playerData.data?.mainLibrary === "H5P.Text 1.1" && (
                  <TextViewer playerData={playerData} />
                )}

                <div className="mt-4 text-sm text-gray-500">
                  <p>Library: {playerData.data?.mainLibrary}</p>
                  <p>
                    Created:{" "}
                    {new Date(
                      playerData.data?.createdAt as string
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
    </div>
  );
};
