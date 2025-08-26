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
  const createContent = async () => {
    try {
      setLoading(true);
      setError("");

      const newContentId = `content_${Date.now()}`;
      const contentData = {
        title: "New H5P Content",
        mainLibrary: "H5P.Text 1.1",
        parameters: {
          introPage: {
            showIntroPage: true,
            title: "Welcome to H5P",
            showStartButton: true,
            startButtonText: "Start",
          },
          progressType: "dots",
          passPercentage: 80,
          questions: [],
        },
      };

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
    // Simple regex to find blanks marked with *** or ___ or similar patterns
    const blankPattern = /\*\*\*|___|\[\[.*?\]\]/g;
    const parts = text.split(blankPattern);

    return (
      <div className="text-gray-800 leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <input
                type="text"
                className="mx-1 px-2 py-1 border border-gray-300 rounded text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Answer"
                data-blank-index={index}
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

    // For demo purposes, we'll use some sample correct answers
    // In a real implementation, these would come from the H5P content data
    const sampleCorrectAnswers = [
      "interactive",
      "content",
      "learning",
      "experience",
    ];

    inputs.forEach((input, index) => {
      const userAnswer = (input as HTMLInputElement).value.trim().toLowerCase();
      const correctAnswer = sampleCorrectAnswers[index] || "demo";

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
                    onClick={createContent}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Creating..." : "New Content"}
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
                          {(playerData as any).data?.title ||
                            "Untitled Content"}
                        </h4>
                        {/* Fill in the Blanks Content */}
                        {(playerData as any).data?.mainLibrary ===
                          "H5P.Blanks 1.14" && (
                          <div className="h5p-blanks-content">
                            {(playerData as any).data?.parameters?.title && (
                              <h5 className="text-xl font-semibold text-gray-800 mb-2">
                                {(playerData as any).data.parameters.title}
                              </h5>
                            )}
                            {(playerData as any).data?.parameters
                              ?.description && (
                              <p className="text-gray-600 mb-4">
                                {
                                  (playerData as any).data.parameters
                                    .description
                                }
                              </p>
                            )}
                            {(playerData as any).data?.parameters?.text && (
                              <div className="fill-in-blanks-text">
                                {renderFillInBlanksText(
                                  (playerData as any).data.parameters.text
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

                        {/* Regular Text Content */}
                        {(playerData as any).data?.mainLibrary ===
                          "H5P.Text 1.1" &&
                          (playerData as any).data?.parameters?.text && (
                            <div
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: (playerData as any).data.parameters
                                  .text as string,
                              }}
                            />
                          )}
                        <div className="mt-4 text-sm text-gray-500">
                          <p>
                            Library: {(playerData as any).data?.mainLibrary}
                          </p>
                          <p>
                            Created:{" "}
                            {new Date(
                              (playerData as any).data?.createdAt as string
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
