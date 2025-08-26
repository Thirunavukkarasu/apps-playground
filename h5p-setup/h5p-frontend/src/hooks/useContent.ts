import { useState, useEffect } from 'react';
import axios from 'axios';
import type { H5PContent, H5PPlayerData } from '../types';

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

const API_BASE_URL = "http://localhost:3000";

export const useContent = () => {
    const [contents, setContents] = useState<H5PContent[]>([]);
    const [selectedContent, setSelectedContent] = useState<string>("");
    const [editorData, setEditorData] = useState<EditorData | null>(null);
    const [playerData, setPlayerData] = useState<H5PPlayerData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // Load content list from backend
    const loadContentList = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${API_BASE_URL}/h5p/content`);
            // Sort by createdAt date, newest first (fallback in case backend doesn't sort)
            const sortedContents = response.data.sort((a: H5PContent, b: H5PContent) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB.getTime() - dateA.getTime();
            });
            setContents(sortedContents);

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
    const createContent = async (contentType: string = "text") => {
        try {
            setLoading(true);
            setError("");

            const newContentId = `content_${Date.now()}`;
            let contentData;

            switch (contentType) {
                case "flashcards":
                    contentData = {
                        title: "New Flashcard Set",
                        mainLibrary: "H5P.Flashcards 1.0",
                        parameters: {
                            title: "Sample Flashcards",
                            description: "Interactive flashcards for learning",
                            cards: [
                                {
                                    front: "What is the capital of France?",
                                    back: "Paris"
                                },
                                {
                                    front: "What is 2 + 2?",
                                    back: "4"
                                }
                            ],
                            showProgress: true,
                            autoFlip: false,
                            autoFlipDelay: 3
                        },
                    };
                    break;
                case "multiple-choice":
                    contentData = {
                        title: "New Multiple Choice",
                        mainLibrary: "H5P.MultipleChoice 1.16",
                        parameters: {
                            question: "Sample question?",
                            answers: [
                                { text: "Option 1", correct: true },
                                { text: "Option 2", correct: false },
                                { text: "Option 3", correct: false }
                            ]
                        },
                    };
                    break;
                case "blanks":
                    contentData = {
                        title: "New Fill in the Blanks",
                        mainLibrary: "H5P.Blanks 1.14",
                        parameters: {
                            title: "Sample Fill in the Blanks",
                            description: "Complete the sentences",
                            text: "The *sun/sun* rises in the *east/east*."
                        },
                    };
                    break;
                case "drag-drop":
                    contentData = {
                        title: "New Drag and Drop",
                        mainLibrary: "H5P.DragAndDrop 1.0",
                        parameters: {
                            title: "Sample Drag and Drop",
                            description: "Drag items to their correct positions",
                            instructions: "Drag each item to its correct category.",
                            draggableItems: [
                                { text: "Apple", correctDropZone: 1 },
                                { text: "Car", correctDropZone: 2 },
                                { text: "Book", correctDropZone: 3 },
                            ],
                            dropZones: [
                                { label: "Fruit", description: "Food that grows on trees" },
                                { label: "Vehicle", description: "Machine for transportation" },
                                { label: "Object", description: "Item for reading" },
                            ],
                            showFeedback: true,
                            allowRetry: true,
                            shuffleItems: false,
                        },
                    };
                    break;
                default:
                    contentData = {
                        title: "New H5P Content",
                        mainLibrary: "H5P.Text 1.1",
                        parameters: {
                            text: "<p>Enter your content here...</p>"
                        },
                    };
            }

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

    // Delete content
    const deleteContent = async (contentId: string) => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.delete(
                `${API_BASE_URL}/h5p/content/${contentId}`
            );

            if (response.status === 200) {
                // Refresh content list
                await loadContentList();

                // Clear selection if the deleted content was selected
                if (selectedContent === contentId) {
                    setSelectedContent("");
                }
            } else {
                setError("Failed to delete content");
            }
        } catch (err) {
            setError("Failed to delete content");
            console.error("Error deleting content:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load existing content on component mount
    useEffect(() => {
        loadContentList();
    }, []);

    return {
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
    };
};
