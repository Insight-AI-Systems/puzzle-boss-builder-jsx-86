
import React, { useState, useEffect } from 'react';

const InteractivePuzzle = () => {
  const [pieces, setPieces] = useState([]);
  const [emptyPosition, setEmptyPosition] = useState(8); // Bottom right is empty initially
  const [isSolved, setIsSolved] = useState(false);
  
  // Initialize puzzle
  useEffect(() => {
    resetPuzzle();
  }, []);
  
  const resetPuzzle = () => {
    // Create ordered pieces (1-8 in positions 0-7, empty at position 8)
    const initialPieces = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      position: i
    }));
    
    // Shuffle the pieces (make sure it's solvable)
    const shuffledPieces = shufflePieces([...initialPieces]);
    setPieces(shuffledPieces);
    setEmptyPosition(8);
    setIsSolved(false);
  };
  
  // Fisher-Yates shuffle algorithm
  const shufflePieces = (piecesToShuffle) => {
    for (let i = piecesToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [piecesToShuffle[i], piecesToShuffle[j]] = [piecesToShuffle[j], piecesToShuffle[i]];
    }
    return piecesToShuffle;
  };
  
  const isAdjacent = (position) => {
    // Check if the piece is adjacent to the empty position
    const row = Math.floor(position / 3);
    const col = position % 3;
    const emptyRow = Math.floor(emptyPosition / 3);
    const emptyCol = emptyPosition % 3;
    
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };
  
  const movePiece = (position) => {
    if (!isAdjacent(position)) return;
    
    // Move the piece to the empty position
    const updatedPieces = pieces.map(piece => 
      piece.position === position ? { ...piece, position: emptyPosition } : piece
    );
    
    setPieces(updatedPieces);
    setEmptyPosition(position);
    
    // Check if the puzzle is solved
    const isSolved = updatedPieces.every(piece => piece.id === piece.position + 1);
    setIsSolved(isSolved);
  };
  
  // Render the puzzle grid
  const renderPuzzleGrid = () => {
    const grid = Array(9).fill(null);
    
    // Place pieces in the grid
    pieces.forEach(piece => {
      grid[piece.position] = (
        <div 
          key={piece.id}
          className={`puzzle-piece flex items-center justify-center text-xl font-bold ${isAdjacent(piece.position) ? 'cursor-pointer hover:scale-105' : ''}`}
          onClick={() => movePiece(piece.position)}
        >
          {piece.id}
        </div>
      );
    });
    
    // Add empty piece
    grid[emptyPosition] = (
      <div key="empty" className="puzzle-piece empty"></div>
    );
    
    return grid;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`puzzle-container mb-4 ${isSolved ? 'puzzle-solved' : ''}`}>
        {renderPuzzleGrid()}
      </div>
      <button 
        onClick={resetPuzzle}
        className="text-puzzle-aqua hover:text-puzzle-gold transition-colors duration-300"
      >
        Shuffle
      </button>
      {isSolved && (
        <div className="mt-4 text-puzzle-gold font-bold animate-pulse">
          Puzzle Solved! 🏆
        </div>
      )}
    </div>
  );
};

export default InteractivePuzzle;
