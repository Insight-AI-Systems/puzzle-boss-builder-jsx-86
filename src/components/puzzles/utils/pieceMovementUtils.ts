
import { BasePuzzlePiece } from '../types/puzzle-types';

export const handlePieceSwap = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetIndex: number
): T[] => {
  // Find if there's a piece already at target position
  const existingPiece = pieces.find(p => p.position === targetIndex);
  
  return pieces.map(piece => {
    if (piece.id === draggedPiece.id) {
      // Update dragged piece position
      return {
        ...piece,
        position: targetIndex,
        isDragging: false
      } as T;
    } else if (existingPiece && piece.id === existingPiece.id) {
      // Move existing piece to draggedPiece's original position
      return {
        ...piece,
        position: draggedPiece.position,
        isDragging: false
      } as T;
    }
    return piece;
  });
};

export const validateMove = <T extends BasePuzzlePiece>(
  pieces: T[],
  targetIndex: number,
  draggedPiece: T | null
): boolean => {
  if (!draggedPiece) return false;
  
  // Check if target position is the same as current position
  if (draggedPiece.position === targetIndex) {
    return false;
  }

  return true;
};
