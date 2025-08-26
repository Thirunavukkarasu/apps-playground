import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { useContent } from "./hooks/useContent";
import { ContentSidebar } from "./components/ContentSidebar";
import { ContentViewer } from "./components/ContentViewer";
import { Navbar } from "./components/Navbar";
import { EmbedPage } from "./pages/EmbedPage";
import { EmbedExamples } from "./pages/EmbedExamples";

// Component for the main authoring interface
function AuthoringApp() {
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
    deleteContent,
  } = useContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
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
            onDeleteContent={deleteContent}
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

// Component for embed pages
function EmbedRoute() {
  const { contentId } = useParams<{ contentId: string }>();

  if (!contentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Content Not Found
          </h1>
          <p className="text-gray-600">No content ID provided</p>
        </div>
      </div>
    );
  }

  return <EmbedPage contentId={contentId} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthoringApp />} />
        <Route path="/embed/:contentId" element={<EmbedRoute />} />
        <Route path="/embed-examples" element={<EmbedExamples />} />
      </Routes>
    </Router>
  );
}

export default App;
