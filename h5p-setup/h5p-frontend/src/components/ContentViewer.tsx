import React, { useState } from "react";
import type { H5PContent, H5PPlayerData } from "../types";
import type { MultipleChoiceContent } from "../schemas/h5pSchemas";
import { FlashcardViewer } from "./FlashcardViewer";
import { DragAndDropViewer } from "./DragAndDropViewer";
import { MultipleChoiceViewer } from "./MultipleChoiceViewer";
import { FillInBlanksViewer } from "./FillInBlanksViewer";
import { TextViewer } from "./TextViewer";
import { SchemaHelper } from "./SchemaHelper";
import { validateH5PContent } from "../schemas/h5pSchemas";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [isJsonEditMode, setIsJsonEditMode] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [showSchema, setShowSchema] = useState(false);
  const currentContent = contents.find((c) => c.id === selectedContent);

  const handleSaveContent = async (updatedContent: unknown) => {
    try {
      // Validate the content before saving
      const validation = validateH5PContent(updatedContent);
      if (!validation.success) {
        setJsonError(`Validation failed: ${validation.errors.join(", ")}`);
        return;
      }

      const response = await fetch(
        `http://localhost:3000/h5p/editor/${selectedContent}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
        }
      );

      if (response.ok) {
        // Reload the content list to reflect changes
        window.location.reload();
      } else {
        console.error("Failed to save content");
      }
    } catch (err) {
      console.error("Error saving content:", err);
    }
  };

  const handleJsonEdit = () => {
    if (currentContent) {
      setJsonContent(JSON.stringify(currentContent, null, 2));
      setJsonError("");
      setIsJsonEditMode(true);
      setIsEditMode(false);
    }
  };

  const handleJsonSave = async () => {
    try {
      const parsedContent = JSON.parse(jsonContent);
      setJsonError("");
      await handleSaveContent(parsedContent);
    } catch {
      setJsonError("Invalid JSON format. Please check your syntax.");
    }
  };

  const handleJsonCancel = () => {
    setIsJsonEditMode(false);
    setJsonContent("");
    setJsonError("");
  };

  const handleUseExample = (example: H5PContent) => {
    setJsonContent(JSON.stringify(example, null, 2));
  };

  return (
    <div className="lg:col-span-2">
      {/* Mode Toggle */}
      {currentContent && (
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setIsEditMode(false);
                setIsJsonEditMode(false);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !isEditMode && !isJsonEditMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              View
            </button>
            <button
              onClick={() => {
                setIsEditMode(true);
                setIsJsonEditMode(false);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isEditMode
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Edit
            </button>
            <button
              onClick={handleJsonEdit}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isJsonEditMode
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              JSON Editor
            </button>
          </div>

          {isEditMode && (
            <div className="text-sm text-gray-600">
              Edit mode: Make changes and click Save
            </div>
          )}
          {isJsonEditMode && (
            <div className="text-sm text-gray-600">
              JSON Editor: Edit raw content data
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      )}

      {/* Content Display */}
      {!loading && currentContent && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isEditMode
              ? "Content Editor"
              : isJsonEditMode
              ? "JSON Editor"
              : "Content Viewer"}
          </h3>

          {/* JSON Edit Mode */}
          {isJsonEditMode ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Edit the raw JSON content. Be careful with the structure!
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowSchema(!showSchema)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    {showSchema ? "Hide" : "Show"} Schema Help
                  </button>
                  <button
                    onClick={handleJsonCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJsonSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save JSON
                  </button>
                </div>
              </div>

              {/* Schema Helper */}
              {showSchema && currentContent && (
                <SchemaHelper
                  content={currentContent}
                  onUseExample={handleUseExample}
                />
              )}

              {jsonError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{jsonError}</p>
                </div>
              )}

              <textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter JSON content..."
              />

              <div className="text-xs text-gray-500">
                <p>
                  <strong>Tips:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>
                    Keep the <code>id</code> field unchanged
                  </li>
                  <li>
                    Maintain the <code>mainLibrary</code> field for proper
                    rendering
                  </li>
                  <li>
                    Update <code>updatedAt</code> timestamp when making changes
                  </li>
                  <li>
                    Ensure <code>parameters</code> structure matches the content
                    type
                  </li>
                  <li>Use the "Show Schema Help" button above for guidance</li>
                </ul>
              </div>
            </div>
          ) : isEditMode ? (
            /* Custom Edit Mode */
            <div>
              <div className="text-gray-600">
                <p className="mb-4">
                  Custom editor not yet implemented for{" "}
                  {currentContent.mainLibrary}
                </p>
                <p className="text-sm">
                  Use the JSON Editor button above to edit this content type.
                </p>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div>
              {/* Action Buttons */}
              <div className="mb-4 flex space-x-2">
                <button
                  onClick={() => loadEditorData(selectedContent)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Load Editor
                </button>
                <button
                  onClick={() => loadPlayerData(selectedContent)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load Player
                </button>
              </div>

              {/* Editor Data Display */}
              {editorData && (
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Editor Data
                    </h4>
                    <pre className="text-sm text-gray-700 overflow-auto">
                      {JSON.stringify(editorData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Player Data Display */}
              {playerData && (
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

                    {playerData.data?.mainLibrary ===
                      "H5P.MultipleChoice 1.16" &&
                      currentContent && (
                        <MultipleChoiceViewer
                          playerData={playerData}
                          currentContent={
                            currentContent as MultipleChoiceContent
                          }
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
              )}

              {/* Raw Data (Collapsible) */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Raw Content Data
                </summary>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(currentContent, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      )}

      {/* No Content Selected */}
      {!loading && !currentContent && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-center">
            Select a content item from the sidebar to view or edit it.
          </p>
        </div>
      )}
    </div>
  );
};
