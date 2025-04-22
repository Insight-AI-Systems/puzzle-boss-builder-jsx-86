
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

// Fixed function to handle cell swapping logic
export const handleCellSwap = <T extends BasePuzzlePiece>(
  pieces: T[],
  draggedPiece: T,
  targetPosition: number,
  grid: (number | null)[]
): T[] => {
  // Get the piece ID at the target position (if any)
  const targetPieceIndex = grid[targetPosition];
  
  if (targetPieceIndex === null) {
    // Simple move - no swap needed, cell is empty
    return handlePieceSwap(pieces, draggedPiece, targetPosition);
  }
  
  // Find the piece at the target position by its index
  const existingPiece = pieces.find(p => p.position === targetPosition);
  
  if (!existingPiece || existingPiece.id === draggedPiece.id) {
    // No piece found or it's the same piece, just move
    return handlePieceSwap(pieces, draggedPiece, targetPosition);
  }
  
  // Perform the swap: move dragged piece to target and return the existing piece to staging
  return pieces.map(piece => {
    if (piece.id === draggedPiece.id) {
      // Move draggedPiece to target position
      return { ...piece, position: targetPosition } as T;
    } else if (piece.id === existingPiece.id) {
      // Move existing piece to staging (use a negative position to indicate staging)
      return { ...piece, position: -1 } as T;
    }
    return piece;
  });
};
