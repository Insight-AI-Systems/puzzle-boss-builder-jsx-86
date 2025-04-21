
import { useCallback } from 'react';
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
  const handleDragStart = useCallback((piece: SimplePuzzlePiece) => {
    setDraggedPiece(piece);
  }, [setDraggedPiece]);

  const handleMove = useCallback((dragged: SimplePuzzlePiece, index: number) => {
    // Intentionally left minimal, preserves wiring.
  }, []);

  const handleDrop = useCallback((dragged: SimplePuzzlePiece) => {
    setDraggedPiece(null);
  }, [setDraggedPiece]);

  const handlePieceClick = useCallback((piece: SimplePuzzlePiece) => {
    handlePieceClickImpl(piece);
  }, [handlePieceClickImpl]);

  const handleDirectionalMove = useCallback((direction: 'up' | 'down' | 'left' | 'right', gridSize: number) => {
    // Directly pass through for simplicity.
  }, []);

  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove,
  };
}
