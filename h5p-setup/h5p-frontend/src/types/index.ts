// H5P Content interface
export interface H5PContent {
    id: string;
    title: string;
    mainLibrary?: string;
    createdAt?: string;
    updatedAt?: string;
    parameters?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

// H5P Answer interface for multiple choice questions
export interface H5PAnswer {
    text: string;
    correct: boolean;
    tipAndFeedback?: {
        tip: string;
        chosenFeedback: string;
        notChosenFeedback: string;
    };
}

// H5P Flashcard interface
export interface H5PFlashcard {
    front: string;
    back: string;
}

// H5P Drag and Drop interfaces
export interface H5PDraggableItem {
    text: string;
    correctDropZone: number;
}

export interface H5PDropZone {
    label: string;
    description: string;
}

// H5P Player Data interface
export interface H5PPlayerData {
    data?: {
        title?: string;
        mainLibrary?: string;
        createdAt?: string;
        parameters?: {
            title?: string;
            description?: string;
            text?: string;
            question?: string;
            answers?: H5PAnswer[];
            cards?: H5PFlashcard[];
            showProgress?: boolean;
            autoFlip?: boolean;
            autoFlipDelay?: number;
            instructions?: string;
            draggableItems?: H5PDraggableItem[];
            dropZones?: H5PDropZone[];
            showFeedback?: boolean;
            allowRetry?: boolean;
            shuffleItems?: boolean;
        };
    };
}

// Drag and Drop State interface
export interface DragDropState {
    droppedItems: Record<number, { itemIndex: number; zoneIndex: number }>;
    isCompleted: boolean;
    correctAnswers: number;
}
