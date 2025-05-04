
import { useState, useCallback, useEffect } from 'react';

export interface PuzzlePiece {
  id: number;
  originalPosition: number;  // Original position in the solved puzzle
  position: number | null;   // Current position on the board (null if in staging)
  row: number;               // Original row
  col: number;               // Original column
  rotation: number;          // Current rotation (in degrees)
  isCorrect: boolean;        // Is the piece in the correct position?
  isDragging: boolean;       // Is the piece currently being dragged?
}

export interface SavedPuzzleState {
  pieces: PuzzlePiece[];
  moves: number;
  elapsed: number;
  showGuide?: boolean;
}

export function usePuzzleState(
  rows: number,
  columns: number,
  imageUrl: string,
  puzzleId: string
) {
  // Initialize the puzzle pieces
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  
  // Initialize puzzle pieces
  useEffect(() => {
    initializePieces();
  }, [rows, columns, imageUrl, puzzleId]);
  
  // Create pieces with proper positioning data
  const initializePieces = useCallback(() => {
    const totalPieces = rows * columns;
    const newPieces: PuzzlePiece[] = [];
    
    // Create pieces in original positions
    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      
      newPieces.push({
        id: i,
        originalPosition: i,
        position: null, // Start all pieces in the staging area
        row,
        col,
        rotation: 0,
        isCorrect: false,
        isDragging: false
      });
    }
    
    // Shuffle the pieces for the staging area
    setPieces(shufflePieces(newPieces));
    setIsComplete(false);
    setMoves(0);
  }, [rows, columns, imageUrl, puzzleId]);
  
  // Shuffle pieces (Fisher-Yates algorithm)
  const shufflePieces = useCallback((piecesToShuffle: PuzzlePiece[]): PuzzlePiece[] => {
    const shuffled = [...piecesToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.map(piece => ({ ...piece, position: null }));
  }, []);
  
  // Reset the puzzle
  const resetPuzzle = useCallback(() => {
    initializePieces();
  }, [initializePieces]);
  
  // Place a piece on the board
  const placePiece = useCallback((pieceId: number, position: number) => {
    setPieces(prevPieces => {
      // First, check if there's already a piece at this position
      const existingPiece = prevPieces.find(p => p.position === position);
      
      const updatedPieces = prevPieces.map(piece => {
        if (piece.id === pieceId) {
          const isCorrectPosition = piece.originalPosition === position;
          return {
            ...piece,
            position,
            isCorrect: isCorrectPosition,
            isDragging: false
          };
        } else if (existingPiece && piece.id === existingPiece.id) {
          // If there was a piece at this position, move it to the staging area
          return {
            ...piece,
            position: null,
            isCorrect: false
          };
        }
        return piece;
      });
      
      setMoves(prev => prev + 1);
      return updatedPieces;
    });
  }, []);
  
  // Remove a piece from the board back to staging
  const removePiece = useCallback((pieceId: number) => {
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id === pieceId) {
          return {
            ...piece,
            position: null,
            isCorrect: false,
            isDragging: false
          };
        }
        return piece;
      });
    });
    
    setMoves(prev => prev + 1);
  }, []);
  
  // Check if the puzzle is complete
  const checkCompletion = useCallback(() => {
    const allCorrect = pieces.every(piece => 
      piece.position !== null && piece.isCorrect
    );
    
    if (allCorrect) {
      setIsComplete(true);
    }
    
    return allCorrect;
  }, [pieces]);
  
  // Set a piece as being dragged
  const startDragging = useCallback((pieceId: number) => {
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        return {
          ...piece,
          isDragging: piece.id === pieceId
        };
      });
    });
  }, []);
  
  // Stop dragging a piece
  const stopDragging = useCallback((pieceId: number) => {
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id === pieceId) {
          return {
            ...piece,
            isDragging: false
          };
        }
        return piece;
      });
    });
  }, []);
  
  // Rotate a piece (for added difficulty)
  const rotatePiece = useCallback((pieceId: number, degrees: number = 90) => {
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id === pieceId) {
          const newRotation = (piece.rotation + degrees) % 360;
          return {
            ...piece,
            rotation: newRotation,
            isCorrect: piece.position === piece.originalPosition && newRotation === 0
          };
        }
        return piece;
      });
    });
    
    setMoves(prev => prev + 1);
  }, []);
  
  // Load a saved puzzle state
  const loadSavedState = useCallback((savedState: SavedPuzzleState) => {
    setPieces(savedState.pieces);
    setMoves(savedState.moves);
    
    // Check if the puzzle is already complete
    const allCorrect = savedState.pieces.every(piece => 
      piece.position !== null && piece.isCorrect
    );
    setIsComplete(allCorrect);
  }, []);
  
  // Separate board and staging pieces
  const boardPieces = pieces.filter(piece => piece.position !== null);
  const stagingPieces = pieces.filter(piece => piece.position === null);
  
  return {
    pieces,
    boardPieces,
    stagingPieces,
    isComplete,
    moves,
    resetPuzzle,
    placePiece,
    removePiece,
    startDragging,
    stopDragging,
    rotatePiece,
    checkCompletion,
    loadSavedState
  };
}
