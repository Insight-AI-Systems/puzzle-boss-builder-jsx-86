import { useState, useCallback, useEffect, useRef } from 'react';
import { PuzzlePiece, PieceGroup } from '../types/puzzleTypes';
import { generatePuzzlePieces } from '../utils/pieceGenerator';

export const useGameState = (rows: number, columns: number, imageUrl: string) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [groups, setGroups] = useState<PieceGroup[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuideImage, setShowGuideImage] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  
  // Track previous configuration to avoid unnecessary regeneration
  const prevConfigRef = useRef({ rows, columns, imageUrl });
  
  // Initialize puzzle pieces and groups
  const initializePuzzle = useCallback(() => {
    console.log('Initializing puzzle:', rows, 'x', columns);
    
    // Generate new pieces based on rows and columns
    const newPieces = generatePuzzlePieces(rows, columns);
    
    // Each piece starts in its own group
    const newGroups = newPieces.map(piece => ({
      id: `group-${piece.id}`,
      pieceIds: [piece.id],
      isComplete: false
    }));
    
    setPieces(newPieces);
    setGroups(newGroups);
    setIsComplete(false);
    
    // Update our ref to track the current configuration
    prevConfigRef.current = { rows, columns, imageUrl };
  }, [rows, columns, imageUrl]);
  
  // Reset puzzle to initial state
  const resetPuzzle = useCallback(() => {
    initializePuzzle();
    shufflePieces();
  }, [initializePuzzle]);
  
  // Shuffle pieces randomly
  const shufflePieces = useCallback(() => {
    setPieces(currentPieces => {
      const shuffled = [...currentPieces];
      
      // Create an array of available positions
      const positions = Array.from({ length: rows * columns }, (_, i) => i);
      
      // Shuffle the positions array using Fisher-Yates algorithm
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      
      // Assign shuffled positions to pieces
      shuffled.forEach((piece, index) => {
        piece.position = positions[index];
      });
      
      return shuffled;
    });
    
    // Reset groups - each piece is in its own group again
    setGroups(currentPieces => {
      return currentPieces.map(piece => ({
        id: `group-${piece.id}`,
        pieceIds: [piece.id],
        isComplete: false
      }));
    });
    
    setIsComplete(false);
  }, [rows, columns]);
  
  // Pick up a piece/group
  const pickUpPiece = useCallback((pieceId: number) => {
    console.log('Picking up piece:', pieceId);
    // In a full implementation, we'd handle group selection logic here
  }, []);
  
  // Drop a piece/group at position
  const dropPiece = useCallback((pieceId: number, position: number) => {
    console.log('Dropping piece:', pieceId, 'at position:', position);
    
    setPieces(currentPieces => {
      const updatedPieces = [...currentPieces];
      
      // Find the piece being moved and the piece at the target position (if any)
      const movingPieceIndex = updatedPieces.findIndex(p => p.id === pieceId);
      const targetPieceIndex = updatedPieces.findIndex(p => p.position === position);
      
      if (movingPieceIndex === -1) return updatedPieces;
      
      // If there's already a piece at the target position, swap positions
      if (targetPieceIndex !== -1) {
        const oldPosition = updatedPieces[movingPieceIndex].position;
        updatedPieces[movingPieceIndex].position = position;
        updatedPieces[targetPieceIndex].position = oldPosition;
      } else {
        // Otherwise, just move the piece to the empty position
        updatedPieces[movingPieceIndex].position = position;
      }
      
      return updatedPieces;
    });
    
    // Check if the puzzle is complete after the move
    checkPuzzleCompletion();
  }, []);
  
  // Move a piece to a new position
  const movePiece = useCallback((pieceId: number, position: number) => {
    dropPiece(pieceId, position);
  }, [dropPiece]);
  
  // Snap connecting pieces together into a group
  const snapPieces = useCallback((pieceId1: number, pieceId2: number) => {
    console.log('Snapping pieces:', pieceId1, pieceId2);
    
    // This would handle the logic of merging two groups together
    // Not fully implemented in this skeleton version
  }, []);
  
  // Check if a piece is in the correct position
  const isPieceCorrect = useCallback((pieceId: number) => {
    const piece = pieces.find(p => p.id === pieceId);
    return piece ? piece.position === piece.originalPosition : false;
  }, [pieces]);
  
  // Toggle guide image visibility
  const toggleGuideImage = useCallback(() => {
    setShowGuideImage(prev => !prev);
  }, []);
  
  // Check if the entire puzzle is complete
  const checkPuzzleCompletion = useCallback(() => {
    const allPiecesCorrect = pieces.every(piece => piece.position === piece.originalPosition);
    
    if (allPiecesCorrect && !isComplete && hasStarted) {
      console.log('Puzzle completed!');
      setIsComplete(true);
    }
  }, [pieces, isComplete, hasStarted]);
  
  // Initialize or update puzzle when configuration changes
  useEffect(() => {
    const { rows: prevRows, columns: prevColumns, imageUrl: prevImageUrl } = prevConfigRef.current;
    
    if (prevRows !== rows || prevColumns !== columns || prevImageUrl !== imageUrl) {
      console.log('Puzzle configuration changed, reinitializing');
      setIsLoading(true);
      // Actual initialization is handled when the image is loaded
    }
  }, [rows, columns, imageUrl]);
  
  // Effect to check puzzle completion when pieces change
  useEffect(() => {
    if (pieces.length > 0 && hasStarted) {
      checkPuzzleCompletion();
    }
  }, [pieces, hasStarted, checkPuzzleCompletion]);
  
  return {
    pieces,
    groups,
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
    movePiece,
    snapPieces,
    isPieceCorrect,
    pickUpPiece,
    dropPiece
  };
};
