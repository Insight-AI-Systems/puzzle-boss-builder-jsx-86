
import { PuzzlePiece } from '../types/puzzle-types';

export const handlePieceSwap = (
  pieces: PuzzlePiece[],
  draggedPiece: PuzzlePiece,
  targetIndex: number
): PuzzlePiece[] => {
  // Find if there's a piece already at target position
  const existingPiece = pieces.find(p => p.position === targetIndex);
  
  return pieces.map(piece => {
    if (piece.id === draggedPiece.id) {
      // Update dragged piece position
      return {
        ...piece,
        position: targetIndex,
        isDragging: false
      };
    } else if (existingPiece && piece.id === existingPiece.id) {
      // Move existing piece to draggedPiece's original position
      return {
        ...piece,
        position: draggedPiece.position,
        isDragging: false
      };
    }
    return piece;
  });
};

export const validateMove = (
  pieces: PuzzlePiece[],
  targetIndex: number,
  draggedPiece: PuzzlePiece | null
): boolean => {
  if (!draggedPiece) return false;
  
  // Check if target position is the same as current position
  if (draggedPiece.position === targetIndex) {
    return false;
  }

  return true;
};
