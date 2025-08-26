import React from "react";
import { H5PEmbed } from "../components/H5PEmbed";
import { Navbar } from "../components/Navbar";

export const EmbedExamples: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            H5P React Embed Examples
          </h1>
          <p className="text-xl text-gray-600">
            Examples of using the React-based H5P embed component
          </p>
        </div>

        {/* Example 1: Full embed with header and footer */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Example 1: Full Embed
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <H5PEmbed
              contentId="mc-test-1"
              showHeader={true}
              showFooter={true}
            />
          </div>
        </div>

        {/* Example 2: Minimal embed without header/footer */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Example 2: Minimal Embed
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <H5PEmbed
              contentId="mc-test-1"
              showHeader={false}
              showFooter={false}
            />
          </div>
        </div>

        {/* Example 3: Different content types */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Example 3: Different Content Types
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Multiple Choice
              </h3>
              <H5PEmbed
                contentId="mc-test-1"
                showHeader={false}
                showFooter={false}
              />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Flashcards
              </h3>
              <H5PEmbed
                contentId="flashcards-example-1"
                showHeader={false}
                showFooter={false}
              />
            </div>
          </div>
        </div>

        {/* Example 4: Custom styling */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Example 4: Custom Styling
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <H5PEmbed
              contentId="mc-test-1"
              showHeader={true}
              showFooter={true}
              className="border-4 border-blue-200 rounded-xl"
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            How to Use
          </h2>
          <div className="space-y-4 text-blue-800">
            <div>
              <h3 className="font-semibold mb-2">1. Import the Component</h3>
              <pre className="bg-blue-100 p-3 rounded text-sm overflow-x-auto">
                {`import { H5PEmbed } from './components/H5PEmbed';`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Basic Usage</h3>
              <pre className="bg-blue-100 p-3 rounded text-sm overflow-x-auto">
                {`<H5PEmbed contentId="mc-test-1" />`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Custom Options</h3>
              <pre className="bg-blue-100 p-3 rounded text-sm overflow-x-auto">
                {`<H5PEmbed 
  contentId="mc-test-1"
  showHeader={false}
  showFooter={false}
  className="custom-styles"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Available Props</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <code>contentId</code> (required): The ID of the H5P content
                  to embed
                </li>
                <li>
                  <code>showHeader</code> (optional): Show/hide the content
                  header (default: true)
                </li>
                <li>
                  <code>showFooter</code> (optional): Show/hide the footer
                  (default: true)
                </li>
                <li>
                  <code>className</code> (optional): Additional CSS classes for
                  styling
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Available Content IDs */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-semibold text-green-900 mb-6">
            Available Content IDs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800">
            <div>
              <h3 className="font-semibold mb-2">Test Content</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <code>mc-test-1</code> - Multiple Choice Quiz
                </li>
                <li>
                  <code>flashcards-example-1</code> - Flashcards
                </li>
                <li>
                  <code>blanks-example-1</code> - Fill in the Blanks
                </li>
                <li>
                  <code>drag-drop-example-1</code> - Drag and Drop
                </li>
                <li>
                  <code>frontend-test-123</code> - Text Content
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">URL Structure</h3>
              <p className="text-sm mb-2">For direct embed URLs:</p>
              <code className="bg-green-100 px-2 py-1 rounded text-sm">
                http://localhost:5173/embed/mc-test-1
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
