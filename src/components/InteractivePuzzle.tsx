
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw } from 'lucide-react';

interface PuzzlePiece {
  id: number;
  position: number;
  isHinted?: boolean;
}

const InteractivePuzzle: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPosition, setEmptyPosition] = useState(8);
  const [isSolved, setIsSolved] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [maxHints] = useState(3);
  
  // Initialize puzzle
  useEffect(() => {
    resetPuzzle();
  }, []);
  
  const resetPuzzle = () => {
    const initialPieces: PuzzlePiece[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      position: i,
      isHinted: false
    }));
    
    const shuffledPieces = shufflePieces([...initialPieces]);
    setPieces(shuffledPieces);
    setEmptyPosition(8);
    setIsSolved(false);
    setSelectedPiece(null);
    setHintsUsed(0);
    
    console.log("Puzzle reset and shuffled");
  };
  
  const shufflePieces = (piecesToShuffle: PuzzlePiece[]): PuzzlePiece[] => {
    for (let i = piecesToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [piecesToShuffle[i], piecesToShuffle[j]] = [piecesToShuffle[j], piecesToShuffle[i]];
    }
    return piecesToShuffle;
  };
  
  const isAdjacent = (position: number): boolean => {
    const row = Math.floor(position / 3);
    const col = position % 3;
    const emptyRow = Math.floor(emptyPosition / 3);
    const emptyCol = emptyPosition % 3;
    
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  const useHint = () => {
    if (hintsUsed >= maxHints || isSolved) return;

    // Clear previous hints
    setPieces(prev => prev.map(piece => ({ ...piece, isHinted: false })));

    // Find pieces that are not in correct position and can be moved
    const incorrectMovablePieces = pieces.filter(piece => {
      const isIncorrect = piece.id !== piece.position + 1;
      const canMove = isAdjacent(piece.position);
      return isIncorrect && canMove;
    });

    if (incorrectMovablePieces.length > 0) {
      // Pick the piece that would make the most progress
      const bestPiece = incorrectMovablePieces[0];
      
      setPieces(prev => 
        prev.map(piece => 
          piece.id === bestPiece.id 
            ? { ...piece, isHinted: true }
            : { ...piece, isHinted: false }
        )
      );
      
      setHintsUsed(prev => prev + 1);
      
      // Clear hint after 3 seconds
      setTimeout(() => {
        setPieces(prev => prev.map(piece => ({ ...piece, isHinted: false })));
      }, 3000);
    }
  };
  
  const handlePieceClick = (position: number) => {
    console.log(`Piece at position ${position} clicked`);
    
    if (isAdjacent(position)) {
      movePiece(position);
    } else if (selectedPiece === null) {
      console.log(`Selected piece at position ${position}`);
      setSelectedPiece(position);
    } else if (position !== selectedPiece) {
      console.log(`Swapping pieces at positions ${selectedPiece} and ${position}`);
      swapPieces(selectedPiece, position);
      setSelectedPiece(null);
    } else {
      console.log(`Deselected piece at position ${position}`);
      setSelectedPiece(null);
    }
  };
  
  const swapPieces = (position1: number, position2: number) => {
    console.log(`Swapping pieces at positions ${position1} and ${position2}`);
    
    const updatedPieces = [...pieces];
    const piece1Index = updatedPieces.findIndex(p => p.position === position1);
    const piece2Index = updatedPieces.findIndex(p => p.position === position2);
    
    if (piece1Index !== -1 && piece2Index !== -1) {
      updatedPieces[piece1Index].position = position2;
      updatedPieces[piece2Index].position = position1;
      
      setPieces(updatedPieces);
      
      if (position1 === emptyPosition) {
        setEmptyPosition(position2);
      } else if (position2 === emptyPosition) {
        setEmptyPosition(position1);
      }
      
      checkIfSolved(updatedPieces);
    }
  };
  
  const movePiece = (position: number) => {
    console.log(`Moving piece from position ${position} to empty position ${emptyPosition}`);
    
    const updatedPieces = pieces.map(piece => 
      piece.position === position ? { ...piece, position: emptyPosition, isHinted: false } : piece
    );
    
    setPieces(updatedPieces);
    setEmptyPosition(position);
    
    checkIfSolved(updatedPieces);
  };
  
  const checkIfSolved = (currentPieces: PuzzlePiece[]) => {
    const isSolved = currentPieces.every(piece => piece.id === piece.position + 1);
    setIsSolved(isSolved);
    
    if (isSolved) {
      console.log("Puzzle solved!");
    }
  };
  
  const renderPuzzleGrid = () => {
    const grid = Array(9).fill(null);
    
    pieces.forEach(piece => {
      grid[piece.position] = (
        <div 
          key={piece.id}
          className={`puzzle-piece flex items-center justify-center text-xl font-bold 
            ${selectedPiece === piece.position 
              ? 'bg-puzzle-aqua/70 border-puzzle-gold' 
              : 'bg-puzzle-black border-puzzle-aqua/40'} 
            ${piece.isHinted ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
            border rounded-md h-16 w-16 transition-all cursor-pointer hover:bg-puzzle-black/80 hover:border-puzzle-aqua`}
          onClick={() => handlePieceClick(piece.position)}
        >
          {piece.id}
        </div>
      );
    });
    
    grid[emptyPosition] = (
      <div 
        key="empty" 
        className="empty h-16 w-16 bg-transparent cursor-pointer border border-dashed border-puzzle-aqua/20 rounded-md"
        onClick={() => handlePieceClick(emptyPosition)}
      ></div>
    );
    
    return grid;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`grid grid-cols-3 gap-2 mb-4 p-2 rounded-lg bg-puzzle-black/50 border border-puzzle-aqua/20 
        ${isSolved ? 'ring-2 ring-puzzle-gold animate-pulse' : ''}`}>
        {renderPuzzleGrid()}
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={resetPuzzle}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Shuffle
        </Button>
        
        <Button 
          onClick={useHint}
          disabled={hintsUsed >= maxHints || isSolved}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Lightbulb className="h-4 w-4" />
          Hint ({maxHints - hintsUsed})
        </Button>
      </div>
      
      {isSolved && (
        <div className="mt-4 text-puzzle-gold font-bold animate-pulse">
          🏆 Puzzle Solved!
          {hintsUsed > 0 && (
            <div className="text-sm text-puzzle-aqua mt-1">
              Hints used: {hintsUsed}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractivePuzzle;
