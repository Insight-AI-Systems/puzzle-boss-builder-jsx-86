
import { useCallback, useRef } from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface UseSimplePuzzleHandlersProps {
  pieces: SimplePuzzlePiece[];
  setPieces: React.Dispatch<React.SetStateAction<SimplePuzzlePiece[]>>;
  draggedPiece: SimplePuzzlePiece | null;
  setDraggedPiece: React.Dispatch<React.SetStateAction<SimplePuzzlePiece | null>>;
  setMoveCount: (count: number) => void;
  isSolved: boolean;
  playSound: (sound: string) => void;
  handleShuffleClick: () => void;
  handleMoveCount: (count: number) => void;
  handlePieceClickImpl: (piece: SimplePuzzlePiece) => void;
  checkForHints: () => void;
}

export function useSimplePuzzleHandlers({
  pieces,
  setPieces,
  draggedPiece,
  setDraggedPiece,
  setMoveCount,
  isSolved,
  playSound,
  handleShuffleClick,
  handleMoveCount,
  handlePieceClickImpl,
  checkForHints,
}: UseSimplePuzzleHandlersProps) {
  // Using a ref to track the last handler call time to prevent too frequent updates
  const lastCallTimeRef = useRef(0);
  
  const handleDragStart = useCallback((piece: SimplePuzzlePiece) => {
    if (isSolved) return;
    setDraggedPiece(piece);
  }, [setDraggedPiece, isSolved]);

  const handleMove = useCallback((dragged: SimplePuzzlePiece, index: number) => {
    // Throttle move updates to prevent excessive re-renders
    const now = Date.now();
    if (now - lastCallTimeRef.current < 50) return; // 50ms throttle
    lastCallTimeRef.current = now;
    
    // Intentionally left minimal, preserves wiring.
  }, []);

  const handleDrop = useCallback((dragged: SimplePuzzlePiece) => {
    setDraggedPiece(null);
  }, [setDraggedPiece]);

  const handlePieceClick = useCallback((piece: SimplePuzzlePiece) => {
    if (isSolved) return;
    handlePieceClickImpl(piece);
  }, [handlePieceClickImpl, isSolved]);

  const handleDirectionalMove = useCallback((direction: 'up' | 'down' | 'left' | 'right', gridSize: number) => {
    // Directly pass through for simplicity.
    // Implement with throttling if needed
  }, []);

  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove,
  };
}
