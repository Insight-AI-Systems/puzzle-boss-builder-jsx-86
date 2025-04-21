
import { BasePuzzlePiece } from '../types/puzzle-types';

interface UsePuzzleGridEventsProps<T extends BasePuzzlePiece> {
  draggedPiece: T | null;
  handleDragStart: (piece: T) => void;
  handleMove: (piece: T, index: number) => void;
  handleDrop: (piece: T) => void;
  handlePieceClick: (piece: T) => void;
  handleDirectionalMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const usePuzzleGridEvents = <T extends BasePuzzlePiece>({
  draggedPiece,
  handleDragStart,
  handleMove,
  handleDrop,
  handlePieceClick,
  handleDirectionalMove
}: UsePuzzleGridEventsProps<T>) => {
  const handleGridDragStart = (e: React.MouseEvent | React.TouchEvent, piece: T) => {
    e.preventDefault();
    handleDragStart(piece);
  };

  const handleGridMove = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
      e.preventDefault();
      handleMove(draggedPiece, index);
    }
  };

  const handleGridDrop = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (draggedPiece) {
      e.preventDefault();
      handleDrop(draggedPiece);
    }
  };

  const handleGridPieceClick = (piece: T) => {
    handlePieceClick(piece);
  };

  return {
    handleGridDragStart,
    handleGridMove,
    handleGridDrop,
    handleGridPieceClick,
    handleDirectionalMove
  };
};
