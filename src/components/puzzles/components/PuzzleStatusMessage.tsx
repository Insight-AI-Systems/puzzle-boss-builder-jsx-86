
import React from 'react';

interface PuzzleStatusMessageProps {
  isSolved: boolean;
  isLoading: boolean;
  isMobile: boolean;
  moveCount: number;
}

const PuzzleStatusMessage: React.FC<PuzzleStatusMessageProps> = ({
  isSolved,
  isLoading,
  isMobile,
  moveCount
}) => {
  return (
    <>
      <p className="mt-4 text-sm text-puzzle-aqua">
        {isSolved 
          ? "Puzzle solved! Shuffle to play again."
          : isLoading
            ? "Loading puzzle..."
            : isMobile 
              ? "Tap a piece to select, then tap another to swap"
              : "Click or drag pieces to rearrange the puzzle"
        }
      </p>
      
      {isSolved && (
        <div className="mt-2 text-puzzle-gold font-bold animate-pulse">
          🏆 Puzzle Solved in {moveCount} moves! 🏆
        </div>
      )}
    </>
  );
};

export default PuzzleStatusMessage;
