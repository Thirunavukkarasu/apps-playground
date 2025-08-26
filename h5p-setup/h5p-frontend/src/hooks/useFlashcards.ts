import { useState } from 'react';

export const useFlashcards = () => {
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlashcardFlipped(!isFlashcardFlipped);
    };

    const handleNext = (totalCards: number) => {
        if (currentFlashcardIndex < totalCards - 1) {
            setCurrentFlashcardIndex(currentFlashcardIndex + 1);
            setIsFlashcardFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentFlashcardIndex > 0) {
            setCurrentFlashcardIndex(currentFlashcardIndex - 1);
            setIsFlashcardFlipped(false);
        }
    };

    const resetFlashcards = () => {
        setCurrentFlashcardIndex(0);
        setIsFlashcardFlipped(false);
    };

    return {
        currentFlashcardIndex,
        isFlashcardFlipped,
        handleFlip,
        handleNext,
        handlePrevious,
        resetFlashcards,
    };
};
