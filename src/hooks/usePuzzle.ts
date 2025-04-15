
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  getPuzzleConfig, 
  playSound, 
  savePuzzleProgress, 
  loadPuzzleProgress, 
  clearPuzzleProgress,
  type SoundEffectType,
  type PuzzleSaveState
} from '../components/puzzle/PuzzleUtils';
import type { PuzzlePiece } from '../components/puzzle/PuzzlePiece';

/**
 * Options for the usePuzzle hook
 */
interface UsePuzzleOptions {
  initialMuted?: boolean;
  initialDifficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Custom hook for puzzle logic and state management
 * @param {UsePuzzleOptions} options - Optional configuration
 * @returns {Object} Puzzle state and methods
 */
export const usePuzzle = ({ initialMuted = true, initialDifficulty = 'medium' }: UsePuzzleOptions = {}) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [solved, setSolved] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [muted, setMuted] = useState(initialMuted);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [puzzleImage, setPuzzleImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);
  
  // Refs for timer
  const timerRef = useRef<number | null>(null);
  
  // Helper to clear timer interval
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Initialize puzzle with configuration
  useEffect(() => {
    const config = getPuzzleConfig();
    setPuzzleImage(config.image);
    
    // Set grid size based on difficulty if not explicitly loaded from saved state
    const difficultyMapping = { easy: 3, medium: 4, hard: 5 };
    const savedState = loadPuzzleProgress();
    
    if (savedState) {
      setGridSize(savedState.gridSize);
      setMoveCount(savedState.moveCount);
      setElapsedTime(savedState.elapsedTime);
    } else {
      setGridSize(difficultyMapping[initialDifficulty]);
    }
    
    setIsLoading(false);
  }, [initialDifficulty]);
  
  // Handle timer logic
  useEffect(() => {
    if (timerActive && !solved) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearTimer();
    }
    
    return clearTimer;
  }, [timerActive, solved, clearTimer]);
  
  // Save progress when changes occur
  useEffect(() => {
    if (pieces.length > 0 && !solved) {
      savePuzzleProgress({
        pieces,
        gridSize,
        moveCount,
        elapsedTime
      });
    } else if (solved) {
      clearPuzzleProgress();
    }
  }, [pieces, gridSize, moveCount, elapsedTime, solved]);
  
  // Memoized piece initialization to prevent unnecessary recalculations
  const initializePieces = useCallback(() => {
    if (!puzzleImage) return [];
    
    const savedState = loadPuzzleProgress();
    if (savedState && savedState.gridSize === gridSize) {
      return savedState.pieces;
    }
    
    const newPieces: PuzzlePiece[] = [];
    const totalPieces = gridSize * gridSize;
    
    for (let i = 0; i < totalPieces; i++) {
      // Calculate the correct position for this piece
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      newPieces.push({
        id: i,
        correctPosition: {
          row,
          col
        },
        currentPosition: {
          row,
          col
        }
      });
    }
    
    return newPieces;
  }, [gridSize, puzzleImage]);
  
  // Initialize pieces only when necessary
  useEffect(() => {
    const newPieces = initializePieces();
    if (newPieces.length > 0) {
      setPieces(newPieces);
      setSolved(checkIfPiecesAreSolved(newPieces));
    }
  }, [initializePieces]);
  
  // Helper to check if puzzle is solved
  const checkIfPiecesAreSolved = useCallback((piecesToCheck: PuzzlePiece[]): boolean => {
    if (piecesToCheck.length === 0) return false;
    
    return piecesToCheck.every(piece => 
      piece.currentPosition.row === piece.correctPosition.row && 
      piece.currentPosition.col === piece.correctPosition.col
    );
  }, []);
  
  // Memoized puzzle solved check to prevent recalculation on every render
  const checkIfSolved = useCallback(() => {
    return checkIfPiecesAreSolved(pieces);
  }, [pieces, checkIfPiecesAreSolved]);
  
  // Determine if puzzle is solved, with debouncing to reduce checks
  useEffect(() => {
    const isSolved = checkIfSolved();
    
    // Only play sound and update state if the solved status changes
    if (isSolved !== solved) {
      if (isSolved && !muted) {
        playSound('success', muted, 0.5);
        // Stop timer when solved
        setTimerActive(false);
      }
      setSolved(isSolved);
    }
  }, [checkIfSolved, muted, solved]);
  
  // Toggle timer pause/resume
  const toggleTimer = useCallback(() => {
    if (solved) return;
    setTimerActive(prev => !prev);
  }, [solved]);
  
  // Reset timer to zero
  const resetTimer = useCallback(() => {
    setElapsedTime(0);
    setTimerActive(true);
  }, []);
  
  // Activate hint feature
  const activateHint = useCallback(() => {
    if (hintsRemaining <= 0 || solved) return;
    
    setHintsRemaining(prev => prev - 1);
    setShowHint(true);
    
    // Hide hint after 1.5 seconds
    setTimeout(() => {
      setShowHint(false);
    }, 1500);
  }, [hintsRemaining, solved]);
  
  // Change puzzle difficulty/grid size
  const changeDifficulty = useCallback((newGridSize: number) => {
    if (newGridSize === gridSize) return;
    
    setIsLoading(true);
    setGridSize(newGridSize);
    clearPuzzleProgress();
    setMoveCount(0);
    setElapsedTime(0);
    setHintsRemaining(3);
    setTimerActive(false);
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [gridSize]);
  
  // Optimized shuffle with memoization
  const shufflePuzzle = useCallback(() => {
    // Skip if no pieces are loaded
    if (pieces.length === 0) return;
    
    const shuffled = [...pieces];
    
    // Fisher-Yates shuffle algorithm for positions
    let positions = pieces.map(piece => ({
      row: piece.currentPosition.row,
      col: piece.currentPosition.col
    }));
    
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Assign new positions to pieces
    for (let i = 0; i < shuffled.length; i++) {
      shuffled[i] = {
        ...shuffled[i],
        currentPosition: positions[i]
      };
    }
    
    setPieces(shuffled);
    setSolved(false);
    setMoveCount(0);
    setElapsedTime(0);
    setTimerActive(true);
    setHintsRemaining(3);
  }, [pieces]);
  
  // Optimized reset function
  const resetPuzzle = useCallback(() => {
    // Skip if no pieces are loaded
    if (pieces.length === 0) return;
    
    const reset = pieces.map(piece => ({
      ...piece,
      currentPosition: { ...piece.correctPosition }
    }));
    
    setPieces(reset);
    setSolved(true);
    setTimerActive(false);
    clearPuzzleProgress();
  }, [pieces]);
  
  // Optimized drop handler with memoization
  const handleDrop = useCallback((e: React.DragEvent, targetRow: number, targetCol: number) => {
    e.preventDefault();
    
    if (!draggedPiece || solved) return;
    
    // Find target piece at drop location
    const targetPiece = pieces.find(
      p => p.currentPosition.row === targetRow && p.currentPosition.col === targetCol
    );
    
    if (!targetPiece) return;
    
    // Start timer on first move if not started
    if (!timerActive && moveCount === 0) {
      setTimerActive(true);
    }
    
    // Skip if dropping onto self
    if (targetPiece.id === draggedPiece.id) {
      setDraggedPiece(null);
      return;
    }
    
    // Swap positions
    const updatedPieces = pieces.map(piece => {
      if (piece.id === draggedPiece.id) {
        const isCorrectPosition = targetPiece.currentPosition.row === draggedPiece.correctPosition.row && 
                                  targetPiece.currentPosition.col === draggedPiece.correctPosition.col;
                                  
        return { 
          ...piece, 
          currentPosition: { ...targetPiece.currentPosition }
        };
      }
      if (piece.id === targetPiece.id) {
        const isCorrectPosition = draggedPiece.currentPosition.row === targetPiece.correctPosition.row && 
                                  draggedPiece.currentPosition.col === targetPiece.correctPosition.col;
                                  
        return { 
          ...piece, 
          currentPosition: { ...draggedPiece.currentPosition }
        };
      }
      return piece;
    });
    
    setPieces(updatedPieces);
    setMoveCount(prev => prev + 1);
    
    // Play appropriate sound effect
    const draggedToCorrectPosition = 
      targetPiece.currentPosition.row === draggedPiece.correctPosition.row && 
      targetPiece.currentPosition.col === draggedPiece.correctPosition.col;
      
    if (draggedToCorrectPosition) {
      playSound('place', muted, 0.4);
    } else {
      playSound('pick', muted, 0.3);
    }
    
    setDraggedPiece(null);
  }, [draggedPiece, muted, pieces, timerActive, moveCount, solved]);
  
  // Optimized sound effect player
  const playSoundEffect = useCallback((type: SoundEffectType) => {
    playSound(type, muted, 0.3);
  }, [muted]);
  
  // Prevent default for drag over - memoized to avoid recreating on each render
  const allowDrop = useCallback((e: React.DragEvent) => e.preventDefault(), []);
  
  // Expose only what's needed by components
  return {
    // State
    pieces,
    solved,
    gridSize,
    muted,
    draggedPiece,
    puzzleImage,
    elapsedTime,
    moveCount,
    timerActive,
    isLoading,
    hintsRemaining,
    showHint,
    
    // Actions
    setDraggedPiece,
    setMuted,
    shufflePuzzle,
    resetPuzzle,
    handleDrop,
    playSoundEffect,
    toggleTimer,
    resetTimer,
    activateHint,
    changeDifficulty,
    
    // Helpers
    allowDrop,
  };
};
