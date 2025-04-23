
import { useState, useEffect, useCallback } from 'react';

// Define the PuzzlePiece type directly here
export interface PuzzlePiece {
  id: number;
  position: number;
  originalPosition: number;
  isDragging: boolean;
}

export const usePuzzleState = (rows: number, columns: number, imageUrl: string, initialShowGuideImage: boolean) => {
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuideImage, setShowGuideImage] = useState<boolean>(initialShowGuideImage);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);

  // Initialize puzzle pieces
  const initPuzzle = useCallback(() => {
    const pieces: PuzzlePiece[] = [];
    const pieceCount = rows * columns;

    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        id: i,
        position: -1, // Initially off the board
        originalPosition: i,
        isDragging: false
      });
    }

    // Shuffle pieces onto the board
    const shuffledPositions = shuffleArray([...Array(pieceCount).keys()]);
    const shuffledPieces = pieces.map((piece, index) => ({
      ...piece,
      position: shuffledPositions[index]
    }));

    setPuzzlePieces(shuffledPieces);
    setIsComplete(false);
  }, [rows, columns]);

  // Effect to initialize puzzle when component loads or image changes
  useEffect(() => {
    initPuzzle();
  }, [initPuzzle, imageUrl, rows, columns]);

  // Reset puzzle with a new shuffle
  const resetPuzzle = useCallback(() => {
    initPuzzle();
    setIsComplete(false);
    setHasStarted(false);
    setSolveTime(null);
  }, [initPuzzle]);

  // Add the missing shufflePieces function that was referenced in the index.tsx file
  const shufflePieces = useCallback(() => {
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

  // Handle toggling guide image visibility
  const toggleGuideImage = useCallback(() => {
    console.log('Toggling guide image, current value:', showGuideImage);
    setShowGuideImage(prev => {
      const newValue = !prev;
      console.log('New guide image value:', newValue);
      return newValue;
    });
  }, [showGuideImage]);

  // Helper function to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Check if a piece is in the correct position
  const isPieceCorrect = useCallback((id: number) => {
    const piece = puzzlePieces.find(p => p.id === id);
    return piece ? piece.position === piece.originalPosition : false;
  }, [puzzlePieces]);

  // Place a piece on the board
  const placePiece = useCallback((id: number, position: number) => {
    setPuzzlePieces(prev => {
      // Find the piece that's currently at this position (if any)
      const pieceAtPosition = prev.find(p => p.position === position);
      
      // Update pieces
      const updatedPieces = prev.map(piece => {
        if (piece.id === id) {
          return { ...piece, position, isDragging: false };
        } else if (pieceAtPosition && piece.id === pieceAtPosition.id) {
          // Swap with the piece that was at this position
          return { ...piece, position: prev.find(p => p.id === id)?.position || -1 };
        }
        return piece;
      });
      
      // Check if puzzle is complete
      const isNowComplete = updatedPieces.every(piece => piece.position === piece.originalPosition);
      if (isNowComplete) {
        setIsComplete(true);
      }
      
      return updatedPieces;
    });
  }, []);

  // Return all the state and functions needed by the puzzle
  return {
    puzzlePieces,
    setPuzzlePieces,
    isComplete,
    isLoading,
    setIsLoading,
    hasStarted, 
    setHasStarted,
    showGuideImage,
    toggleGuideImage,
    solveTime,
    setSolveTime,
    resetPuzzle,
    placePiece,
    isPieceCorrect,
    draggedPiece,
    setDraggedPiece,
    shufflePieces // Add the shufflePieces function to the return object
  };
};

// Remove the duplicate export type declaration here
// This is what was causing the error
