
import { useState, useCallback, useEffect } from 'react';

export interface PuzzlePiece {
  id: number;
  position: number;
  originalPosition: number;
}

export const usePuzzleState = (rows: number, columns: number, imageUrl: string, initialShowGuideImage = true) => {
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuideImage, setShowGuideImage] = useState(initialShowGuideImage);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);

  // Initialize pieces
  const initPuzzle = useCallback(() => {
    const totalPieces = rows * columns;
    const pieces: PuzzlePiece[] = [];

    for (let i = 0; i < totalPieces; i++) {
      pieces.push({
        id: i,
        position: i,
        originalPosition: i,
      });
    }
    setPuzzlePieces(pieces);
    setIsComplete(false);
  }, [rows, columns]);

  // Shuffle pieces
  const shufflePieces = useCallback(() => {
    setPuzzlePieces(prev => {
      // Create a new array to avoid mutating state
      const shuffled = [...prev];
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap positions
        const temp = shuffled[i].position;
        shuffled[i].position = shuffled[j].position;
        shuffled[j].position = temp;
      }
      
      return shuffled;
    });
    setIsComplete(false);
  }, []);
  
  // Check if all pieces are in their correct positions
  const checkCompletion = useCallback(() => {
    const allCorrect = puzzlePieces.every(piece => piece.position === piece.originalPosition);
    if (allCorrect && !isComplete && hasStarted) {
      setIsComplete(true);
    }
    return allCorrect;
  }, [puzzlePieces, isComplete, hasStarted]);
  
  // Place a piece
  const placePiece = useCallback((id: number, newPosition: number) => {
    setPuzzlePieces(prev => {
      const currentPositionPiece = prev.find(p => p.position === newPosition);
      const draggedPiece = prev.find(p => p.id === id);
      
      if (!draggedPiece) return prev;
      
      const draggedPosition = draggedPiece.position;
      
      // Create a new array with updated positions
      const updated = prev.map(piece => {
        if (piece.id === id) {
          return { ...piece, position: newPosition };
        }
        if (currentPositionPiece && piece.id === currentPositionPiece.id) {
          return { ...piece, position: draggedPosition };
        }
        return piece;
      });
      
      return updated;
    });
    
    // Check for completion after the state update
    setTimeout(checkCompletion, 100);
  }, [checkCompletion]);
  
  // Reset puzzle
  const resetPuzzle = useCallback(() => {
    initPuzzle();
    shufflePieces();
    setIsComplete(false);
    setSolveTime(null);
  }, [initPuzzle, shufflePieces]);
  
  // Check if a piece is in the correct position
  const isPieceCorrect = useCallback((id: number) => {
    const piece = puzzlePieces.find(p => p.id === id);
    return piece ? piece.position === piece.originalPosition : false;
  }, [puzzlePieces]);
  
  // Toggle guide image
  const toggleGuideImage = useCallback(() => {
    console.log('Toggling guide image, current value:', showGuideImage);
    setShowGuideImage(prevShow => {
      const newValue = !prevShow;
      console.log('New guide image value:', newValue);
      return newValue;
    });
  }, [showGuideImage]);
  
  // Initialize puzzle when it first loads
  useEffect(() => {
    console.log('Initializing puzzle with imageUrl:', imageUrl);
    initPuzzle();
    shufflePieces();
    // Reset guide image to initial value when image changes
    setShowGuideImage(initialShowGuideImage);
    
    // Cleanup function
    return () => {
      setDraggedPiece(null);
    };
  }, [initPuzzle, shufflePieces, imageUrl, rows, columns, initialShowGuideImage]);
  
  // Log guide image state changes for debugging
  useEffect(() => {
    console.log('Guide image state changed:', showGuideImage);
  }, [showGuideImage]);
  
  return {
    puzzlePieces,
    isComplete,
    isPieceCorrect,
    placePiece,
    resetPuzzle,
    shufflePieces,
    isLoading,
    setIsLoading,
    hasStarted,
    setHasStarted,
    showGuideImage,
    toggleGuideImage,
    solveTime, 
    setSolveTime,
    draggedPiece,
    setDraggedPiece
  };
};
