import React from "react";
import type { H5PContent } from "../types";

interface ContentSidebarProps {
  contents: H5PContent[];
  selectedContent: string;
  setSelectedContent: (id: string) => void;
  loading: boolean;
  loadContentList: () => void;
  createContent: (type: string) => void;
  onDeleteContent?: (contentId: string) => void;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({
  contents,
  selectedContent,
  setSelectedContent,
  loading,
  loadContentList,
  createContent,
  onDeleteContent,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Content List</h2>
          <div className="flex space-x-2">
            <button
              onClick={loadContentList}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Refresh Content List"
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
              onClick={() => createContent("text")}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Create New Content"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick Create:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => createContent("flashcards")}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Flashcards"}
            </button>
            <button
              onClick={() => createContent("multiple-choice")}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Multiple Choice"}
            </button>
            <button
              onClick={() => createContent("blanks")}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Fill in Blanks"}
            </button>
            <button
              onClick={() => createContent("drag-drop")}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Drag & Drop"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {contents.map((content) => (
            <div
              key={content.id}
              className={`p-3 rounded-lg transition-colors ${
                selectedContent === content.id
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() => setSelectedContent(content.id)}
              >
                <h3 className="font-medium text-gray-900">{content.title}</h3>
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

              {/* Action Icons */}
              <div className="flex justify-end mt-2 space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedContent(content.id);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit Content"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                {onDeleteContent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${content.title}"?`
                        )
                      ) {
                        onDeleteContent(content.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Content"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
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
  );
};
