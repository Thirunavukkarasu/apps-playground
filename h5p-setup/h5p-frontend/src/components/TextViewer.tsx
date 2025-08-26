import React from "react";
import type { H5PPlayerData } from "../types";

interface TextViewerProps {
  playerData: H5PPlayerData;
}

export const TextViewer: React.FC<TextViewerProps> = ({ playerData }) => {
  const text = playerData.data?.parameters?.text;

  if (!text) {
    return <div>No text content available.</div>;
  }

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: text as string,
      }}
    />
  );
};
