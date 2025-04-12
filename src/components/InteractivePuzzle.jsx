
import React, { useState, useEffect } from 'react';

const InteractivePuzzle = () => {
  const [pieces, setPieces] = useState([0, 1, 2, 3, 4, 5, 6, 7, null]);
  const [solved, setSolved] = useState(false);
  
  // Check if puzzle is solved
  useEffect(() => {
    const solution = [0, 1, 2, 3, 4, 5, 6, 7, null];
    const isSolved = pieces.every((piece, index) => piece === solution[index]);
    setSolved(isSolved);
  }, [pieces]);
  
  // Handle moving pieces
  const movePiece = (index) => {
    const emptyIndex = pieces.findIndex(piece => piece === null);
    
    // Check if selected piece is adjacent to empty space
    const isAdjacent = (
      // Left or right
      (Math.abs(index - emptyIndex) === 1 && Math.floor(index / 3) === Math.floor(emptyIndex / 3)) ||
      // Up or down
      (Math.abs(index - emptyIndex) === 3)
    );
    
    if (isAdjacent) {
      const newPieces = [...pieces];
      [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
      setPieces(newPieces);
    }
  };
  
  return (
    <div className={`puzzle-container ${solved ? 'puzzle-solved' : ''}`}>
      {pieces.map((piece, index) => (
        <div 
          key={index}
          className={`puzzle-piece ${piece === null ? 'empty' : ''}`}
          onClick={() => piece !== null && movePiece(index)}
        >
          {piece !== null && (piece + 1)}
        </div>
      ))}
    </div>
  );
};

export default InteractivePuzzle;
