import React from "react";
import type { H5PContent } from "../types";

interface ContentSidebarProps {
  contents: H5PContent[];
  selectedContent: string;
  setSelectedContent: (id: string) => void;
  loading: boolean;
  loadContentList: () => void;
  createContent: (type: string) => void;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({
  contents,
  selectedContent,
  setSelectedContent,
  loading,
  loadContentList,
  createContent,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Content List</h2>
          <div className="space-x-2">
            <button
              onClick={loadContentList}
              disabled={loading}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={() => createContent("text")}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "New Content"}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick Create:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => createContent("flashcards")}
              disabled={loading}
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Flashcards"}
            </button>
            <button
              onClick={() => createContent("multiple-choice")}
              disabled={loading}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Multiple Choice"}
            </button>
            <button
              onClick={() => createContent("blanks")}
              disabled={loading}
              className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Fill in Blanks"}
            </button>
            <button
              onClick={() => createContent("drag-drop")}
              disabled={loading}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Drag & Drop"}
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
