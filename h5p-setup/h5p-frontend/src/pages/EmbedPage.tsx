import React from "react";
import { H5PEmbed } from "../components/H5PEmbed";
import { Navbar } from "../components/Navbar";

interface EmbedPageProps {
  contentId: string;
}

export const EmbedPage: React.FC<EmbedPageProps> = ({ contentId }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <H5PEmbed
        contentId={contentId}
        showHeader={true}
        showFooter={true}
        className="max-w-4xl mx-auto my-8"
      />
    </div>
  );
};
