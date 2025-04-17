
import React, { useState, useEffect } from 'react';

interface PuzzlePiece {
  id: number;
  position: number;
}

const InteractivePuzzle: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPosition, setEmptyPosition] = useState(8); // Bottom right is empty initially
  const [isSolved, setIsSolved] = useState(false);
  
  // Initialize puzzle
  useEffect(() => {
    resetPuzzle();
  }, []);
  
  const resetPuzzle = () => {
    // Create ordered pieces (1-8 in positions 0-7, empty at position 8)
    const initialPieces: PuzzlePiece[] = Array.from({ length: 8 }, (_, i) => ({
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
  const shufflePieces = (piecesToShuffle: PuzzlePiece[]): PuzzlePiece[] => {
    for (let i = piecesToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [piecesToShuffle[i], piecesToShuffle[j]] = [piecesToShuffle[j], piecesToShuffle[i]];
    }
    return piecesToShuffle;
  };
  
  const isAdjacent = (position: number): boolean => {
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
  
  const movePiece = (position: number) => {
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
          className={`puzzle-piece flex items-center justify-center text-xl font-bold bg-puzzle-black border border-puzzle-aqua/40 rounded-md h-16 w-16 transition-all 
            ${isAdjacent(piece.position) ? 'cursor-pointer hover:bg-puzzle-black/80 hover:border-puzzle-aqua' : ''}`}
          onClick={() => movePiece(piece.position)}
        >
          {piece.id}
        </div>
      );
    });
    
    // Add empty piece
    grid[emptyPosition] = (
      <div key="empty" className="empty h-16 w-16 bg-transparent"></div>
    );
    
    return grid;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`grid grid-cols-3 gap-2 mb-4 p-2 rounded-lg bg-puzzle-black/50 border border-puzzle-aqua/20 
        ${isSolved ? 'ring-2 ring-puzzle-gold animate-pulse' : ''}`}>
        {renderPuzzleGrid()}
      </div>
      <button 
        onClick={resetPuzzle}
        className="px-4 py-2 bg-puzzle-black border border-puzzle-aqua/40 text-puzzle-aqua rounded-md hover:bg-puzzle-black/80 hover:border-puzzle-aqua transition-colors duration-300"
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
