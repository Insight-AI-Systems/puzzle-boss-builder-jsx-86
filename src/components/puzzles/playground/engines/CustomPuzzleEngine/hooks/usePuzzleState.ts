
import { useState, useCallback, useEffect, useRef } from 'react';

export interface PuzzlePiece {
  id: number;
  position: number; // Current position in the grid
  originalPosition: number; // Original position for checking correctness
  placed: boolean; // Whether the piece is correctly placed
}

export const usePuzzleState = (rows: number, columns: number, imageUrl: string, initialShowGuideImage: boolean = true) => {
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuideImage, setShowGuideImage] = useState(initialShowGuideImage);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  
  // Tracking previous values to prevent unnecessary re-initializations
  const prevImageUrlRef = useRef(imageUrl);
  const prevDimensionsRef = useRef({ rows, columns });
  const didInitializeRef = useRef(false);

  // Initialize puzzle pieces
  const initializePuzzle = useCallback(() => {
    console.log('Initializing puzzle:', rows, 'x', columns);
    const totalPieces = rows * columns;
    const newPieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({
        id: i,
        position: i, // Initially in correct position
        originalPosition: i,
        placed: false
      });
    }
    
    setPuzzlePieces(newPieces);
    setIsComplete(false);
    didInitializeRef.current = true;
  }, [rows, columns]);

  // Shuffle puzzle pieces
  const shufflePieces = useCallback(() => {
    if (puzzlePieces.length === 0) {
      console.log('No pieces to shuffle');
      return;
    }
    
    console.log('Shuffling puzzle pieces');
    setPuzzlePieces(current => {
      // Create a copy of the current pieces
      const shuffled = [...current];
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap positions
        const temp = shuffled[i].position;
        shuffled[i].position = shuffled[j].position;
        shuffled[j].position = temp;
        
        // Reset placed status
        shuffled[i].placed = false;
        shuffled[j].placed = false;
      }
      
      return shuffled;
    });
    
    setIsComplete(false);
  }, [puzzlePieces]);

  // Place a piece in a specific position
  const placePiece = useCallback((id: number, newPosition: number) => {
    setPuzzlePieces(current => {
      // Find the piece by ID
      const pieceIndex = current.findIndex(p => p.id === id);
      if (pieceIndex === -1) return current;
      
      // Find if there's a piece already at the target position
      const targetPieceIndex = current.findIndex(p => p.position === newPosition);
      
      // Create a copy of the current pieces
      const updatedPieces = [...current];
      
      // If there's a piece at the target position, swap them
      if (targetPieceIndex !== -1) {
        const targetPosition = updatedPieces[targetPieceIndex].position;
        updatedPieces[targetPieceIndex].position = updatedPieces[pieceIndex].position;
        updatedPieces[pieceIndex].position = targetPosition;
        
        // Update "placed" status for both pieces
        updatedPieces[targetPieceIndex].placed = 
          updatedPieces[targetPieceIndex].position === updatedPieces[targetPieceIndex].originalPosition;
        updatedPieces[pieceIndex].placed = 
          updatedPieces[pieceIndex].position === updatedPieces[pieceIndex].originalPosition;
      } else {
        // Simply move the piece to the new position
        updatedPieces[pieceIndex].position = newPosition;
        updatedPieces[pieceIndex].placed = 
          updatedPieces[pieceIndex].position === updatedPieces[pieceIndex].originalPosition;
      }
      
      return updatedPieces;
    });
  }, []);

  // Check if a piece is in the correct position
  const isPieceCorrect = useCallback((id: number) => {
    const piece = puzzlePieces.find(p => p.id === id);
    return piece ? piece.position === piece.originalPosition : false;
  }, [puzzlePieces]);

  // Reset the puzzle
  const resetPuzzle = useCallback(() => {
    initializePuzzle();
    setTimeout(() => {
      shufflePieces();
    }, 100);
  }, [initializePuzzle, shufflePieces]);

  // Toggle guide image
  const toggleGuideImage = useCallback(() => {
    setShowGuideImage(prev => !prev);
  }, []);

  // Check if the puzzle is complete
  useEffect(() => {
    if (puzzlePieces.length === 0) return;
    
    const allCorrect = puzzlePieces.every(piece => 
      piece.position === piece.originalPosition
    );
    
    if (allCorrect && hasStarted && !isComplete) {
      console.log('Puzzle completed!');
      setIsComplete(true);
    }
  }, [puzzlePieces, hasStarted, isComplete]);

  // Initialize the puzzle when rows, columns, or imageUrl changes
  useEffect(() => {
    const dimensionsChanged = prevDimensionsRef.current.rows !== rows || 
                             prevDimensionsRef.current.columns !== columns;
    const imageChanged = prevImageUrlRef.current !== imageUrl;
    
    if (dimensionsChanged || imageChanged || !didInitializeRef.current) {
      console.log('Dimensions or image changed, reinitializing puzzle');
      setIsLoading(true);
      prevImageUrlRef.current = imageUrl;
      prevDimensionsRef.current = { rows, columns };
    }
  }, [rows, columns, imageUrl]);

  return {
    puzzlePieces,
    shufflePieces,
    placePiece,
    isComplete,
    isPieceCorrect,
    resetPuzzle,
    isLoading,
    setIsLoading,
    hasStarted,
    setHasStarted,
    toggleGuideImage,
    showGuideImage,
    solveTime,
    setSolveTime,
    draggedPiece,
    setDraggedPiece
  };
};
