import { useState } from 'react';
import type { DragDropState } from '../types';

export const useDragAndDrop = () => {
    const [dragDropState, setDragDropState] = useState<DragDropState>({
        droppedItems: {},
        isCompleted: false,
        correctAnswers: 0,
    });

    const handleDrop = (itemIndex: number, zoneIndex: number) => {
        setDragDropState(prev => ({
            ...prev,
            droppedItems: {
                ...prev.droppedItems,
                [itemIndex]: { itemIndex, zoneIndex }
            }
        }));
    };

    const handleRemoveItem = (itemIndex: number) => {
        setDragDropState(prev => {
            const newDroppedItems = { ...prev.droppedItems };
            delete newDroppedItems[itemIndex];
            return {
                ...prev,
                droppedItems: newDroppedItems
            };
        });
    };

    const checkAnswers = (draggableItems: Array<{ correctDropZone: number }>) => {
        let correct = 0;

        Object.entries(dragDropState.droppedItems).forEach(([itemIndexStr, data]) => {
            const itemIndex = parseInt(itemIndexStr);
            const item = draggableItems[itemIndex];
            if (item.correctDropZone === data.zoneIndex) {
                correct++;
            }
        });

        setDragDropState(prev => ({
            ...prev,
            isCompleted: true,
            correctAnswers: correct
        }));
    };

    const resetActivity = () => {
        setDragDropState({
            droppedItems: {},
            isCompleted: false,
            correctAnswers: 0
        });
    };

    const isItemDropped = (itemIndex: number) => {
        return Object.prototype.hasOwnProperty.call(dragDropState.droppedItems, itemIndex);
    };

    const isItemCorrect = (itemIndex: number, draggableItems: Array<{ correctDropZone: number }>) => {
        if (!dragDropState.isCompleted) return null;
        const droppedData = dragDropState.droppedItems[itemIndex];
        if (!droppedData) return false;
        return draggableItems[itemIndex].correctDropZone === droppedData.zoneIndex;
    };

    const getFeedbackMessage = (draggableItems: Array<{ correctDropZone: number }>) => {
        const percentage = Math.round((dragDropState.correctAnswers / draggableItems.length) * 100);

        if (dragDropState.correctAnswers === draggableItems.length) {
            return { text: `Perfect! All ${draggableItems.length} items are in their correct positions.`, class: 'text-green-600 bg-green-50' };
        } else if (percentage >= 80) {
            return { text: `Good job! ${dragDropState.correctAnswers} out of ${draggableItems.length} items are correct (${percentage}%).`, class: 'text-yellow-600 bg-yellow-50' };
        } else if (percentage >= 60) {
            return { text: `Not bad! ${dragDropState.correctAnswers} out of ${draggableItems.length} items are correct (${percentage}%). Keep trying!`, class: 'text-orange-600 bg-orange-50' };
        } else {
            return { text: `Try again! Only ${dragDropState.correctAnswers} out of ${draggableItems.length} items are correct (${percentage}%).`, class: 'text-red-600 bg-red-50' };
        }
    };

    return {
        dragDropState,
        handleDrop,
        handleRemoveItem,
        checkAnswers,
        resetActivity,
        isItemDropped,
        isItemCorrect,
        getFeedbackMessage,
    };
};
