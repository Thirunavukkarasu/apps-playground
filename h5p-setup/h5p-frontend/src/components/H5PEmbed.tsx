import React, { useState, useEffect } from "react";
import { MultipleChoiceViewer } from "./MultipleChoiceViewer";
import { FlashcardViewer } from "./FlashcardViewer";
import { DragAndDropViewer } from "./DragAndDropViewer";
import { FillInBlanksViewer } from "./FillInBlanksViewer";
import { TextViewer } from "./TextViewer";
import type { H5PContent, H5PPlayerData } from "../types";

interface H5PEmbedProps {
  contentId: string;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const H5PEmbed: React.FC<H5PEmbedProps> = ({
  contentId,
  showHeader = true,
  showFooter = true,
  className = "",
}) => {
  const [contentData, setContentData] = useState<H5PContent | null>(null);
  const [playerData, setPlayerData] = useState<H5PPlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [contentId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load content metadata
      const contentResponse = await fetch(
        `http://localhost:3000/h5p/content/${contentId}`
      );
      if (!contentResponse.ok) {
        throw new Error("Content not found");
      }
      const content = await contentResponse.json();
      setContentData(content);

      // Load player data
      const playerResponse = await fetch(
        `http://localhost:3000/h5p/player/${contentId}`
      );
      if (!playerResponse.ok) {
        throw new Error("Failed to load player data");
      }
      const player = await playerResponse.json();
      setPlayerData(player);
    } catch (err) {
      console.error("Error loading H5P content:", err);
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!contentData || !playerData) return null;

    const mainLibrary = contentData.mainLibrary;

    switch (mainLibrary) {
      case "H5P.MultipleChoice 1.16":
        return <MultipleChoiceViewer playerData={playerData} />;

      case "H5P.Flashcards 1.0":
        return <FlashcardViewer playerData={playerData} />;

      case "H5P.DragAndDrop 1.0":
        return <DragAndDropViewer playerData={playerData} />;

      case "H5P.Blanks 1.14":
        return <FillInBlanksViewer playerData={playerData} />;

      case "H5P.Text 1.1":
        return <TextViewer playerData={playerData} />;

      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-yellow-600 mr-2"
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
                Unsupported Content Type
              </span>
            </div>
            <p className="text-yellow-700">
              Content type "{mainLibrary}" is not yet supported in the embed
              viewer.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading H5P content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
      >
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-red-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-red-800 font-medium">
            Error Loading Content
          </span>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {showHeader && contentData && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold mb-1">{contentData.title}</h1>
          <p className="text-blue-100 text-sm">{contentData.mainLibrary}</p>
        </div>
      )}

      <div className="p-6">{renderContent()}</div>

      {showFooter && (
        <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg">
          <div className="text-center text-sm text-gray-600">
            <p>Powered by H5P Content Management System</p>
            <p className="mt-1">Content ID: {contentId}</p>
          </div>
        </div>
      )}
    </div>
  );
};
