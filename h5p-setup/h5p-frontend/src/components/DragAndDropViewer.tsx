import React from "react";
import type { H5PPlayerData } from "../types";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

interface DragAndDropViewerProps {
  playerData: H5PPlayerData;
}

export const DragAndDropViewer: React.FC<DragAndDropViewerProps> = ({
  playerData,
}) => {
  const {
    dragDropState,
    handleDrop,
    handleRemoveItem,
    checkAnswers,
    resetActivity,
    isItemDropped,
    isItemCorrect,
    getFeedbackMessage,
  } = useDragAndDrop();

  const draggableItems = playerData.data?.parameters?.draggableItems || [];
  const dropZones = playerData.data?.parameters?.dropZones || [];
  const showFeedback = playerData.data?.parameters?.showFeedback ?? true;
  const allowRetry = playerData.data?.parameters?.allowRetry ?? true;

  const handleDragStart = (e: React.DragEvent, itemIndex: number) => {
    e.dataTransfer.setData("text/plain", itemIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropEvent = (e: React.DragEvent, zoneIndex: number) => {
    e.preventDefault();
    const itemIndex = parseInt(e.dataTransfer.getData("text/plain"));
    handleDrop(itemIndex, zoneIndex);
  };

  if (!draggableItems.length || !dropZones.length) {
    return <div>No drag and drop data available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Draggable Items Area */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
          <h4 className="font-semibold text-gray-700 mb-3">Items to Drag</h4>
          <div className="space-y-2">
            {draggableItems.map((item, index) => (
              <div
                key={index}
                draggable={!isItemDropped(index)}
                onDragStart={(e) => handleDragStart(e, index)}
                className={`p-3 rounded-lg cursor-grab transition-all ${
                  isItemDropped(index)
                    ? "opacity-50 bg-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-md"
                } ${
                  dragDropState.isCompleted && !isItemDropped(index)
                    ? "bg-red-500 opacity-70"
                    : ""
                } ${
                  dragDropState.isCompleted && isItemDropped(index)
                    ? isItemCorrect(index, draggableItems)
                      ? "bg-green-500"
                      : "bg-red-500"
                    : ""
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zones Area */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 mb-3">Drop Zones</h4>
          {dropZones.map((zone, index) => (
            <div
              key={index}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropEvent(e, index + 1)}
              className={`border-2 border-gray-300 rounded-lg p-4 min-h-[80px] transition-all ${
                dragDropState.isCompleted
                  ? "border-gray-400"
                  : "hover:border-blue-400"
              }`}
            >
              <div className="font-semibold text-gray-800 mb-1">
                {zone.label}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {zone.description}
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {Object.entries(dragDropState.droppedItems)
                  .filter(([, data]) => data.zoneIndex === index + 1)
                  .map(([itemIndexStr]) => {
                    const itemIndex = parseInt(itemIndexStr);
                    const item = draggableItems[itemIndex];
                    return (
                      <div
                        key={itemIndex}
                        className={`px-3 py-1 rounded text-sm font-medium cursor-pointer transition-all ${
                          dragDropState.isCompleted
                            ? isItemCorrect(itemIndex, draggableItems)
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        onClick={() =>
                          !dragDropState.isCompleted &&
                          handleRemoveItem(itemIndex)
                        }
                      >
                        {item.text}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => checkAnswers(draggableItems)}
          disabled={
            dragDropState.isCompleted ||
            Object.keys(dragDropState.droppedItems).length === 0
          }
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check Answers
        </button>
        {allowRetry && dragDropState.isCompleted && (
          <button
            onClick={resetActivity}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Feedback */}
      {dragDropState.isCompleted && showFeedback && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            getFeedbackMessage(draggableItems).class
          }`}
        >
          <p className="font-medium">
            {getFeedbackMessage(draggableItems).text}
          </p>
        </div>
      )}
    </div>
  );
};
