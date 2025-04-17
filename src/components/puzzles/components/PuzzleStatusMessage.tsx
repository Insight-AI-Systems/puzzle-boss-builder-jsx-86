
import React from 'react';

interface PuzzleStatusMessageProps {
  isSolved: boolean;
  isLoading: boolean;
  isMobile: boolean;
  moveCount: number;
  isTouchDevice?: boolean;
}

const PuzzleStatusMessage: React.FC<PuzzleStatusMessageProps> = ({
  isSolved,
  isLoading,
  isMobile,
  moveCount,
  isTouchDevice = false
}) => {
  let message = "";
  
  if (isSolved) {
    message = "Puzzle solved! Shuffle to play again.";
  } else if (isLoading) {
    message = "Loading puzzle...";
  } else if (isTouchDevice) {
    message = "Tap a piece to select, then tap another to swap, or use arrows";
  } else if (isMobile) {
    message = "Tap pieces to swap them, or use the arrow controls";
  } else {
    message = "Click or drag pieces to rearrange the puzzle";
  }
  
  return (
    <>
      <p className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'} text-puzzle-aqua text-center`}>
        {message}
      </p>
      
      {isSolved && (
        <div className={`mt-2 ${isMobile ? 'text-sm' : 'text-base'} text-puzzle-gold font-bold animate-pulse text-center`}>
          🏆 Puzzle Solved in {moveCount} moves! 🏆
        </div>
      )}
    </>
  );
};

export default PuzzleStatusMessage;
