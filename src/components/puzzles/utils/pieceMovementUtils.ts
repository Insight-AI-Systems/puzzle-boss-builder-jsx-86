
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
      // Return existing piece to staging by setting its position to -1
      return {
        ...piece,
        position: -1, // -1 indicates piece is in staging
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
  
  // Only prevent moves to the same position
  if (draggedPiece.position === targetIndex) {
    return false;
  }

  return true;
};

// Helper to check if a position is occupied
export const isPositionOccupied = <T extends BasePuzzlePiece>(
  pieces: T[],
  position: number
): boolean => {
  return pieces.some(p => p.position === position && !p.isDragging);
};
