
import { useState, useCallback, useEffect, useRef } from 'react';
import { PuzzlePiece, PieceGroup } from '../types/puzzleTypes';
import { generatePuzzlePieces } from '../utils/pieceGenerator';

// Extends state with staging/assembly areas
export const useGameState = (rows: number, columns: number, imageUrl: string) => {
  const [allPieces, setAllPieces] = useState<PuzzlePiece[]>([]);
  // Indices of pieces that are still in the staging area
  const [stagedPieces, setStagedPieces] = useState<number[]>([]);
  // Assembly: either null or piece id in the slot
  const [assembly, setAssembly] = useState<(number | null)[]>([]);
  const [groups, setGroups] = useState<PieceGroup[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuideImage, setShowGuideImage] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);

  // Track previous configuration to avoid unnecessary regeneration
  const prevConfigRef = useRef({ rows, columns, imageUrl });
  
  // Check if the entire puzzle is complete (all cells have correct piece)
  const checkPuzzleCompletion = useCallback(() => {
    const complete = assembly.every((pieceId, i) => pieceId === i);
    if (complete && !isComplete && hasStarted) {
      console.log('Puzzle completed!');
      setIsComplete(true);
    }
  }, [assembly, isComplete, hasStarted]);

  // Initialize puzzle pieces and groups, all pieces start in staging
  const initializePuzzle = useCallback(() => {
    console.log('Initializing puzzle:', rows, 'x', columns);

    const newPieces = generatePuzzlePieces(rows, columns);
    setAllPieces(newPieces);

    setStagedPieces(Array.from({ length: newPieces.length }, (_, i) => i));
    setAssembly(Array.from({ length: newPieces.length }, () => null));

    // Each piece starts in its own group
    setGroups(newPieces.map(piece => ({
      id: `group-${piece.id}`,
      pieceIds: [piece.id], // Always number[]
      isComplete: false
    })));

    setIsComplete(false);

    prevConfigRef.current = { rows, columns, imageUrl };
  }, [rows, columns, imageUrl]);

  // Reset puzzle to initial state
  const resetPuzzle = useCallback(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  // Move piece from staging to assembly area slot
  const placePiece = useCallback((pieceId: number, slotIdx: number) => {
    // Don't place if the current slot has a correctly placed piece
    if (assembly[slotIdx] === slotIdx) return;

    setAssembly(current => {
      const next = [...current];
      next[slotIdx] = pieceId;
      return next;
    });
    
    // Only remove from staging if it's in the staging area
    setStagedPieces(current => current.filter(id => id !== pieceId));
    
    setTimeout(() => checkPuzzleCompletion(), 0);
  }, [assembly, checkPuzzleCompletion]);

  // Remove from assembly and return to staging
  const removePieceFromAssembly = useCallback((slotIdx: number) => {
    setAssembly(current => {
      const next = [...current];
      const pieceId = next[slotIdx];
      if (pieceId == null) return current;
      
      // Only allow removal if piece is not in its correct position
      if (pieceId === slotIdx) return current;
      
      next[slotIdx] = null;
      setStagedPieces(prev =>
        prev.includes(pieceId) ? prev : [...prev, pieceId]
      );
      return next;
    });
  }, []);

  // Shuffle staging area (optional: implement if requested)
  const shufflePieces = useCallback(() => {
    setStagedPieces(prev => {
      const array = [...prev];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    });
  }, []);

  // Is piece correctly placed in grid?
  const isPieceCorrect = useCallback((slotIdx: number) => {
    const pieceId = assembly[slotIdx];
    if (pieceId == null) return false;
    return pieceId === slotIdx;
  }, [assembly]);

  // Toggle guide image visibility
  const toggleGuideImage = useCallback(() => {
    setShowGuideImage(prev => !prev);
  }, []);

  // Effect to (re)init puzzle when config changes
  useEffect(() => {
    const { rows: prevRows, columns: prevColumns, imageUrl: prevImageUrl } = prevConfigRef.current;
    if (prevRows !== rows || prevColumns !== columns || prevImageUrl !== imageUrl) {
      setIsLoading(true);
      // do not call initialize here directly for clean load-image handling
    }
  }, [rows, columns, imageUrl]);

  // (example automatic initial mount)
  useEffect(() => {
    initializePuzzle();
    setIsLoading(false);
  }, [initializePuzzle]);

  // Effect to check puzzle completion when assembly changes
  useEffect(() => {
    if (hasStarted && !isLoading) {
      checkPuzzleCompletion();
    }
  }, [assembly, hasStarted, isLoading, checkPuzzleCompletion]);

  return {
    allPieces,
    stagedPieces,
    setStagedPieces,
    assembly,
    setAssembly,
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
    placePiece,
    removePieceFromAssembly,
    shufflePieces,
    isPieceCorrect
  };
};
