
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PuzzlePiece {
  id: number;
  originalPosition: number;
  position: number | null;
  isDragging: boolean;
}

// Local storage key for saving game state
const SAVE_STATE_KEY_PREFIX = 'svg-jigsaw-puzzle-state-';

export const usePuzzleState = (rows: number, columns: number, imageUrl: string) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showGhost, setShowGhost] = useState(true);
  const { toast } = useToast();
  
  // Calculate the save state key based on puzzle parameters
  const saveStateKey = `${SAVE_STATE_KEY_PREFIX}${imageUrl}-${rows}x${columns}`;
  
  // Initialize puzzle pieces
  const initializePuzzle = useCallback(() => {
    const totalPieces = rows * columns;
    const newPieces: PuzzlePiece[] = [];
    
    // Create pieces in correct positions
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({
        id: i,
        originalPosition: i,
        position: null, // Null means piece is in staging area
        isDragging: false
      });
    }
    
    // Shuffle the pieces (by setting all to staging)
    return newPieces.map(piece => ({ ...piece, position: null }));
  }, [rows, columns]);
  
  // Load saved state or initialize
  useEffect(() => {
    try {
      const savedStateJson = localStorage.getItem(saveStateKey);
      
      if (savedStateJson) {
        const savedState = JSON.parse(savedStateJson);
        if (Array.isArray(savedState) && savedState.length === rows * columns) {
          setPieces(savedState);
          
          // Check if puzzle is already complete
          const complete = savedState.every(piece => 
            piece.position !== null && piece.position === piece.originalPosition
          );
          setIsComplete(complete);
          
          if (complete) {
            toast({
              title: "Resuming completed puzzle",
              description: "This puzzle was already completed. You can reset it to start over."
            });
          } else {
            toast({
              title: "Puzzle progress loaded",
              description: "Your previous progress has been restored."
            });
          }
          return;
        }
      }
      
      // No valid saved state, initialize new puzzle
      setPieces(initializePuzzle());
      setIsComplete(false);
    } catch (error) {
      console.error('Error loading puzzle state:', error);
      // In case of error, initialize new puzzle
      setPieces(initializePuzzle());
      setIsComplete(false);
    }
  }, [initializePuzzle, rows, columns, saveStateKey, toast]);
  
  // Save state whenever pieces change
  useEffect(() => {
    if (pieces.length) {
      localStorage.setItem(saveStateKey, JSON.stringify(pieces));
    }
  }, [pieces, saveStateKey]);
  
  // Reset puzzle to initial state
  const resetPuzzle = useCallback(() => {
    setPieces(initializePuzzle());
    setIsComplete(false);
    toast({
      title: "Puzzle reset",
      description: "All pieces have been shuffled. Good luck!"
    });
  }, [initializePuzzle, toast]);
  
  // Place a piece on the board
  const placePiece = useCallback((id: number, position: number) => {
    setPieces(prevPieces => {
      const newPieces = prevPieces.map(piece => {
        if (piece.id === id) {
          // Place this piece at the specified position
          return { ...piece, position };
        } else if (piece.position === position) {
          // If there was already a piece here, move it to staging
          return { ...piece, position: null };
        }
        return piece;
      });
      
      // Check if piece was placed correctly
      const piece = newPieces.find(p => p.id === id);
      if (piece && piece.originalPosition === position) {
        toast({
          title: "Perfect fit!",
          description: "Piece placed in correct position",
          variant: "default",
        });
      }
      
      // Check if puzzle is complete after this move
      const allCorrect = newPieces.every(p => 
        p.position !== null && p.position === p.originalPosition
      );
      
      if (allCorrect) {
        setIsComplete(true);
      }
      
      return newPieces;
    });
  }, [toast]);
  
  // Move piece from board back to staging area
  const movePieceToStaging = useCallback((id: number) => {
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id === id) {
          // Move this piece to staging area
          return { ...piece, position: null };
        }
        return piece;
      });
    });
  }, []);
  
  // Check if a piece is in its correct position
  const isPieceCorrect = useCallback((id: number) => {
    const piece = pieces.find(p => p.id === id);
    return piece ? piece.position === piece.originalPosition : false;
  }, [pieces]);
  
  // Toggle ghost image visibility
  const toggleGhost = useCallback(() => {
    setShowGhost(prev => !prev);
  }, []);
  
  // Get pieces that are on the board
  const boardPieces = pieces.filter(piece => piece.position !== null);
  
  // Get pieces that are in the staging area
  const stagingPieces = pieces.filter(piece => piece.position === null);
  
  // Calculate completion percentage
  const correctPieceCount = pieces.filter(p => p.position === p.originalPosition).length;
  const percentComplete = (correctPieceCount / pieces.length) * 100;
  
  return {
    pieces,
    isComplete,
    resetPuzzle,
    placePiece,
    isPieceCorrect,
    movePieceToStaging,
    boardPieces,
    stagingPieces,
    showGhost,
    toggleGhost,
    percentComplete
  };
};
