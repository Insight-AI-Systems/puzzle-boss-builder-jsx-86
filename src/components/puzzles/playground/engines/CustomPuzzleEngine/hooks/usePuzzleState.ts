
import { useState, useEffect, useCallback } from 'react';

export interface PuzzlePiece {
  id: number;
  position: number;
  originalPosition: number;
  isDragging: boolean;
}

export const usePuzzleState = (rows: number, columns: number, imageUrl: string, initialShowGuideImage: boolean) => {
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showGuideImage, setShowGuideImage] = useState<boolean>(initialShowGuideImage);

  // Initialize puzzle pieces
  const initPuzzle = useCallback(() => {
    console.log('Initializing puzzle with dimensions:', rows, 'x', columns);
    const pieces: PuzzlePiece[] = [];
    const pieceCount = rows * columns;

    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        id: i,
        position: -1, // Start with -1 to indicate not placed yet
        originalPosition: i,
        isDragging: false
      });
    }

    // Create a shuffled array of positions
    const positions = Array.from({ length: pieceCount }, (_, i) => i);
    const shuffledPositions = shuffleArray([...positions]);
    
    // Assign shuffled positions to pieces
    const shuffledPieces = pieces.map((piece, index) => ({
      ...piece,
      position: shuffledPositions[index]
    }));

    console.log('Initialized pieces:', shuffledPieces.length);
    setPuzzlePieces(shuffledPieces);
    setIsComplete(false);
  }, [rows, columns]);

  // Initialize on mount and when dimensions change
  useEffect(() => {
    console.log('Puzzle dimensions or image changed, reinitializing');
    initPuzzle();
  }, [initPuzzle, imageUrl, rows, columns]);

  // Reset puzzle to initial state
  const resetPuzzle = useCallback(() => {
    console.log('Resetting puzzle');
    initPuzzle();
    setIsComplete(false);
  }, [initPuzzle]);

  // Shuffle pieces
  const shufflePieces = useCallback(() => {
    console.log('Shuffling puzzle pieces');
    const pieceCount = rows * columns;
    const shuffledPositions = shuffleArray([...Array(pieceCount).keys()]);
    
    setPuzzlePieces(prev => {
      return prev.map((piece, index) => ({
        ...piece,
        position: shuffledPositions[index],
        isDragging: false
      }));
    });
    
    setIsComplete(false);
  }, [rows, columns]);

  // Toggle guide image
  const toggleGuideImage = useCallback(() => {
    console.log('Toggling guide image, current value:', showGuideImage);
    setShowGuideImage(prev => !prev);
  }, [showGuideImage]);

  // Shuffle array utility function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Check if a piece is in its correct position
  const isPieceCorrect = useCallback((id: number) => {
    const piece = puzzlePieces.find(p => p.id === id);
    return piece ? piece.position === piece.originalPosition : false;
  }, [puzzlePieces]);

  // Place a puzzle piece
  const placePiece = useCallback((id: number, position: number) => {
    console.log(`Placing piece ${id} at position ${position}`);
    setPuzzlePieces(prev => {
      // Find the piece currently at the target position (if any)
      const pieceAtPosition = prev.find(p => p.position === position);
      
      const updatedPieces = prev.map(piece => {
        if (piece.id === id) {
          // Move the dragged piece to the new position
          return { ...piece, position, isDragging: false };
        } 
        else if (pieceAtPosition && piece.id === pieceAtPosition.id) {
          // Swap positions - move the piece that was at the target to the dragged piece's old position
          const draggedPiece = prev.find(p => p.id === id);
          return { ...piece, position: draggedPiece?.position || -1 };
        }
        return piece;
      });
      
      // Check if the puzzle is complete after this move
      const isNowComplete = updatedPieces.every(piece => piece.position === piece.originalPosition);
      if (isNowComplete) {
        console.log('Puzzle completed!');
        setIsComplete(true);
      }
      
      return updatedPieces;
    });
  }, []);

  return {
    puzzlePieces,
    setPuzzlePieces,
    isComplete,
    showGuideImage,
    toggleGuideImage,
    resetPuzzle,
    placePiece,
    isPieceCorrect,
    shufflePieces
  };
};
