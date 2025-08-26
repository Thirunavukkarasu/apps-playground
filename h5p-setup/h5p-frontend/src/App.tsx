import { useContent } from "./hooks/useContent";
import { ContentSidebar } from "./components/ContentSidebar";
import { ContentViewer } from "./components/ContentViewer";

function App() {
  const {
    contents,
    selectedContent,
    setSelectedContent,
    editorData,
    playerData,
    loading,
    error,
    loadContentList,
    createContent,
    loadEditorData,
    loadPlayerData,
  } = useContent();

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
          <ContentSidebar
            contents={contents}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            loading={loading}
            loadContentList={loadContentList}
            createContent={createContent}
          />

          {/* Main Area - Editor/Player */}
          <ContentViewer
            selectedContent={selectedContent}
            contents={contents}
            playerData={playerData}
            editorData={editorData}
            loading={loading}
            loadEditorData={loadEditorData}
            loadPlayerData={loadPlayerData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
