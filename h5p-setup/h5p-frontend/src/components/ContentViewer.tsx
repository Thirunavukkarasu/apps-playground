import React, { useState, useEffect } from "react";
import type { H5PContent, H5PPlayerData } from "../types";
import { FlashcardViewer } from "./FlashcardViewer";
import { DragAndDropViewer } from "./DragAndDropViewer";
import { MultipleChoiceViewer } from "./MultipleChoiceViewer";
import { FillInBlanksViewer } from "./FillInBlanksViewer";
import { TextViewer } from "./TextViewer";
import { SchemaHelper } from "./SchemaHelper";
import { validateH5PContent } from "../schemas/h5pSchemas";

// Type for editor data structure
interface EditorData {
  mock?: boolean;
  message?: string;
  contentId: string;
  editor?: {
    title: string;
    library: string;
    params: Record<string, unknown>;
  };
}

interface ContentViewerProps {
  selectedContent: string;
  contents: H5PContent[];
  playerData: H5PPlayerData | null;
  editorData: EditorData | null;
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
  const [isEditorDataCollapsed, setIsEditorDataCollapsed] = useState(true);
  const currentContent = contents.find((c) => c.id === selectedContent);

  // Automatically load editor and player data when content is selected
  useEffect(() => {
    if (selectedContent) {
      loadEditorData(selectedContent);
      loadPlayerData(selectedContent);
    }
  }, [selectedContent]); // Only depend on selectedContent

  // Load full JSON content when JSON editor mode is activated or content changes
  useEffect(() => {
    if (isJsonEditMode && currentContent) {
      loadFullJsonContent();
    }
  }, [isJsonEditMode, currentContent]);

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

  const loadFullJsonContent = async () => {
    if (currentContent) {
      try {
        // Load the full content data from the backend
        const response = await fetch(
          `http://localhost:3000/h5p/content/${selectedContent}/full`
        );
        if (response.ok) {
          const fullContent = await response.json();
          if (fullContent.data) {
            setJsonContent(JSON.stringify(fullContent.data, null, 2));
          } else {
            // Fallback to current content if full data not available
            setJsonContent(JSON.stringify(currentContent, null, 2));
          }
        } else {
          // Fallback to current content if request fails
          setJsonContent(JSON.stringify(currentContent, null, 2));
        }
        setJsonError("");
      } catch (error) {
        console.error("Error loading full content:", error);
        // Fallback to current content if request fails
        setJsonContent(JSON.stringify(currentContent, null, 2));
        setJsonError("");
      }
    }
  };

  const handleJsonEdit = () => {
    setIsJsonEditMode(true);
    setIsEditMode(false);
    loadFullJsonContent();
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

  const handleDeleteContent = async () => {
    if (
      currentContent &&
      window.confirm(
        `Are you sure you want to delete "${currentContent.title}"? This action cannot be undone.`
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3000/h5p/content/${selectedContent}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Reload the content list to reflect changes
          window.location.reload();
        } else {
          console.error("Failed to delete content");
          alert("Failed to delete content. Please try again.");
        }
      } catch (err) {
        console.error("Error deleting content:", err);
        alert("Error deleting content. Please try again.");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    // Optional: Show a brief success message
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.classList.add("bg-green-200", "text-green-900");
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("bg-green-200", "text-green-900");
      }, 1000);
    }
  };

  const handleUseExample = async (example: H5PContent) => {
    try {
      // Load the full content data from the backend
      const response = await fetch(
        `http://localhost:3000/h5p/content/${example.id}/full`
      );
      if (response.ok) {
        const fullContent = await response.json();
        if (fullContent.data) {
          setJsonContent(JSON.stringify(fullContent.data, null, 2));
        } else {
          // Fallback to example if full data not available
          setJsonContent(JSON.stringify(example, null, 2));
        }
      } else {
        // Fallback to example if request fails
        setJsonContent(JSON.stringify(example, null, 2));
      }
    } catch (error) {
      console.error("Error loading full content for example:", error);
      // Fallback to example if request fails
      setJsonContent(JSON.stringify(example, null, 2));
    }
  };

  return (
    <div className="lg:col-span-2">
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Content Viewer - {currentContent.title} (
              {currentContent.mainLibrary})
            </h3>

            {/* Action Icons */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  loadEditorData(selectedContent);
                  loadPlayerData(selectedContent);
                }}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={handleDeleteContent}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Content"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setIsJsonEditMode(false);
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    !isEditMode && !isJsonEditMode
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => {
                    setIsEditMode(true);
                    setIsJsonEditMode(false);
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isEditMode
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Visual Editor
                </button>
                <button
                  onClick={handleJsonEdit}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isJsonEditMode
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  JSON Editor
                </button>
              </nav>
            </div>

            {/* Tab Description */}
            {isEditMode && (
              <div className="mt-2 text-sm text-gray-600">
                Visual Editor: Make changes using the visual interface
              </div>
            )}
            {isJsonEditMode && (
              <div className="mt-2 text-sm text-gray-600">
                JSON Editor: Edit raw content data and structure
              </div>
            )}
          </div>

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
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {showSchema ? "Hide" : "Show"} Schema Help
                  </button>
                  <button
                    onClick={handleJsonCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
              {/* Loading indicator when data is being fetched */}
              {loading && (
                <div className="mb-4 flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700">Loading content data...</span>
                </div>
              )}

              {/* Content Preview - Moved to top */}
              {playerData && (
                <div className="mb-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Content Preview
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        {playerData.data?.mainLibrary}
                      </span>
                    </div>

                    {/* Render different content types */}
                    {playerData.data?.mainLibrary === "H5P.Flashcards 1.0" && (
                      <FlashcardViewer playerData={playerData} />
                    )}

                    {playerData.data?.mainLibrary === "H5P.DragAndDrop 1.0" && (
                      <DragAndDropViewer playerData={playerData} />
                    )}

                    {playerData.data?.mainLibrary ===
                      "H5P.MultipleChoice 1.16" && (
                      <MultipleChoiceViewer playerData={playerData} />
                    )}

                    {playerData.data?.mainLibrary === "H5P.Blanks 1.14" && (
                      <FillInBlanksViewer playerData={playerData} />
                    )}

                    {playerData.data?.mainLibrary === "H5P.Text 1.1" && (
                      <TextViewer playerData={playerData} />
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
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

              {/* Editor Data - Collapsible */}
              {editorData && (
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                      onClick={() =>
                        setIsEditorDataCollapsed(!isEditorDataCollapsed)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h4 className="text-lg font-semibold text-blue-900">
                          Editor Data & Embed Snippets
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          {editorData.mock ? "Mock Data" : "Live Data"}
                        </span>
                        <svg
                          className={`w-5 h-5 text-blue-600 transition-transform ${
                            isEditorDataCollapsed ? "rotate-0" : "rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    {!isEditorDataCollapsed && (
                      <div className="p-6 border-t border-blue-200">
                        {editorData.mock ? (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 text-yellow-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              <span className="text-yellow-800 font-medium">
                                Mock Editor Response
                              </span>
                            </div>
                            <p className="text-yellow-700 text-sm mt-1">
                              This is sample data because H5P libraries are not
                              installed. Install H5P libraries to see real
                              editor data.
                            </p>
                          </div>
                        ) : null}

                        {/* React Snippets Section */}
                        <div className="mb-4">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-semibold text-green-900 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                  />
                                </svg>
                                React Embed Snippets
                              </h5>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                Ready to Copy
                              </span>
                            </div>

                            <div className="space-y-3">
                              {/* Basic Embed */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-green-800">
                                    Basic Embed Component
                                  </span>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(`import { H5PEmbed } from './components/H5PEmbed';

// Basic usage
<H5PEmbed contentId="${currentContent?.id || "your-content-id"}" />`)
                                    }
                                    className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors"
                                    title="Copy React snippet"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-white rounded border border-green-200 overflow-hidden">
                                  <pre className="text-xs text-gray-800 p-3 leading-relaxed font-mono">
                                    {`import { H5PEmbed } from './components/H5PEmbed';

// Basic usage
<H5PEmbed contentId="${currentContent?.id || "your-content-id"}" />`}
                                  </pre>
                                </div>
                              </div>

                              {/* Customized Embed */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-green-800">
                                    Customized Embed
                                  </span>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(`import { H5PEmbed } from './components/H5PEmbed';

// Customized with options
<H5PEmbed 
  contentId="${currentContent?.id || "your-content-id"}"
  showHeader={false}
  showFooter={true}
  className="max-w-2xl mx-auto my-4"
/>`)
                                    }
                                    className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors"
                                    title="Copy React snippet"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-white rounded border border-green-200 overflow-hidden">
                                  <pre className="text-xs text-gray-800 p-3 leading-relaxed font-mono">
                                    {`import { H5PEmbed } from './components/H5PEmbed';

// Customized with options
<H5PEmbed 
  contentId="${currentContent?.id || "your-content-id"}"
  showHeader={false}
  showFooter={true}
  className="max-w-2xl mx-auto my-4"
/>`}
                                  </pre>
                                </div>
                              </div>

                              {/* Iframe Embed */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-green-800">
                                    Iframe Embed URL
                                  </span>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(`// Direct iframe embed
<iframe 
  src="http://localhost:5173/embed/${currentContent?.id || "your-content-id"}"
  width="100%" 
  height="600" 
  frameBorder="0"
  title="${currentContent?.title || "H5P Content"}"
/>`)
                                    }
                                    className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors"
                                    title="Copy iframe snippet"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-white rounded border border-green-200 overflow-hidden">
                                  <pre className="text-xs text-gray-800 p-3 leading-relaxed font-mono">
                                    {`// Direct iframe embed
<iframe 
  src="http://localhost:5173/embed/${currentContent?.id || "your-content-id"}"
  width="100%" 
  height="600" 
  frameBorder="0"
  title="${currentContent?.title || "H5P Content"}"
/>`}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b border-blue-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Content Structure
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    JSON.stringify(editorData, null, 2)
                                  )
                                }
                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition-colors"
                                title="Copy to clipboard"
                              >
                                Copy JSON
                              </button>
                            </div>
                          </div>
                          <div className="max-h-96 overflow-auto">
                            <pre className="text-sm text-gray-800 p-4 leading-relaxed font-mono">
                              {JSON.stringify(editorData, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {editorData.editor &&
                          typeof editorData.editor === "object" && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Content Info
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-600">
                                      Title:
                                    </span>
                                    <span className="ml-2 font-medium">
                                      {editorData.editor?.title || "Untitled"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Library:
                                    </span>
                                    <span className="ml-2 font-medium">
                                      {editorData.editor?.library || "Unknown"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Content ID:
                                    </span>
                                    <span className="ml-2 font-medium">
                                      {editorData.contentId || "Unknown"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Parameters
                                </h5>
                                <div className="text-sm text-gray-600">
                                  {editorData.editor?.params &&
                                  Object.keys(editorData.editor.params).length >
                                    0 ? (
                                    <ul className="space-y-1">
                                      {Object.entries(
                                        editorData.editor.params
                                      ).map(([key, value]) => (
                                        <li key={key}>
                                          <span className="font-medium">
                                            {key}:
                                          </span>
                                          <span className="ml-2">
                                            {typeof value === "string" &&
                                            value.length > 50
                                              ? `${value.substring(0, 50)}...`
                                              : String(value)}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-500">
                                      No parameters defined
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Raw Data (Collapsible) */}
              {/* <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Raw Content Data
                </summary>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(currentContent, null, 2)}
                  </pre>
                </div>
              </details> */}
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
