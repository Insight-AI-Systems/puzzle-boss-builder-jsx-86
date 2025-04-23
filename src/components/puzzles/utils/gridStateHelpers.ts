import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Utility functions for handling grid state
 */
export function updateGridState<T extends BasePuzzlePiece>(
  pieces: T[],
  updatedPiece: T,
  targetPosition: number
): T[] {
  // Simple implementation for compatibility
  return pieces.map(piece => 
    piece.id === updatedPiece.id 
      ? { ...piece, position: targetPosition } 
      : piece
  );
}

export function checkGridCompletion<T extends BasePuzzlePiece>(pieces: T[]): boolean {
  // Simple implementation for compatibility
  return pieces.every(piece => {
    const pieceNumber = parseInt(piece.id.split('-')[1]);
    return pieceNumber === piece.position;
  });
}

// Add missing exports required by pieceStateManagement.ts
export function ensureGridIntegrity<T extends BasePuzzlePiece>(pieces: T[]): T[] {
  // Simple implementation that just returns the pieces unchanged
  return pieces;
}

export function getStagingPieces<T extends BasePuzzlePiece>(pieces: T[]): T[] {
  // Return pieces that are in the staging area (position < 0)
  return pieces.filter(piece => piece.position < 0);
}
