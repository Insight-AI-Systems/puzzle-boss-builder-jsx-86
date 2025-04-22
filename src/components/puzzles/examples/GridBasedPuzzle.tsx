import React from 'react';
import { usePuzzlePieces } from '../hooks/usePuzzlePieces';

const GridBasedPuzzle: React.FC = () => {
  const { pieces, setPieces, draggedPiece, setDraggedPiece, moveCount, setMoveCount, isSolved, setIsSolved, gridSize, handleShuffleClick } = usePuzzlePieces('3x3', '', false, () => {});

  return (
    <div>
      <h1>Grid-Based Puzzle Example</h1>
      <p>Move Count: {moveCount}</p>
      <button onClick={handleShuffleClick}>Shuffle</button>
    </div>
  );
};

export default GridBasedPuzzle;
