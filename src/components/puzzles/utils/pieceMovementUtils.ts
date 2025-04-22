
import { BasePuzzlePiece } from '../types/puzzle-types';

export const handlePieceSwap = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetPosition: number
): T[] => {
  return pieces.map(piece => {
    if (piece.id === draggedPiece.id) {
      // Update dragged piece position
      return { ...piece, position: targetPosition } as T;
    }
    return piece;
  });
};

export const validateMove = <T extends BasePuzzlePiece>(
  pieces: T[],
  targetPosition: number,
  draggedPiece: T | null
): boolean => {
  if (!draggedPiece) return false;
  
  // Only prevent moves to the same position
  return draggedPiece.position !== targetPosition;
};

export const isPositionOccupied = <T extends BasePuzzlePiece>(
  grid: (number | null)[],
  position: number
): boolean => {
  return grid[position] !== null;
};
