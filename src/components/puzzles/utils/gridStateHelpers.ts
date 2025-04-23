
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

// Updated ensureGridIntegrity to work with grid parameter
export function ensureGridIntegrity<T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[] = []
): { updatedGrid: (number | null)[], updatedPieces: T[] } {
  // Create a new grid if none provided
  const updatedGrid = [...(grid.length > 0 ? grid : Array(pieces.length).fill(null))];
  const updatedPieces = [...pieces];
  
  // Place pieces in correct grid positions based on their current positions
  updatedPieces.forEach(piece => {
    if (piece.position >= 0 && piece.position < updatedGrid.length) {
      const pieceNumber = typeof piece.id === 'string' 
        ? parseInt(piece.id.split('-')[1]) 
        : piece.id;
      updatedGrid[piece.position] = pieceNumber;
    }
  });
  
  return { updatedGrid, updatedPieces };
}

export function getStagingPieces<T extends BasePuzzlePiece>(pieces: T[]): T[] {
  // Return pieces that are in the staging area (position < 0)
  return pieces.filter(piece => piece.position < 0);
}
