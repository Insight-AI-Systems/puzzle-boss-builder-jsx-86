
import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Ensures grid integrity by maintaining a one-piece-per-cell rule.
 */
export const ensureGridIntegrity = <T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[],
  validate: boolean = false
): { 
  updatedGrid: (number | null)[],
  updatedPieces: T[] 
} => {
  const updatedGrid = Array(grid.length).fill(null);
  const placedPieces = new Set<string | number>();
  
  // First pass: place pieces in grid based on their positions
  for (const piece of pieces) {
    const position = piece.position;
    if (position < 0 || position >= grid.length) continue;
    
    if (updatedGrid[position] === null) {
      updatedGrid[position] = typeof piece.id === 'string' 
        ? parseInt(piece.id.toString().split('-')[1]) 
        : piece.id;
      placedPieces.add(piece.id);
    }
  }
  
  // Second pass: resolve conflicts by moving duplicates to staging
  const updatedPieces = pieces.map(piece => {
    if (!placedPieces.has(piece.id)) {
      return {
        ...piece,
        position: -1,
      } as T;
    }
    return piece;
  });
  
  return { updatedGrid, updatedPieces };
};

/**
 * Identifies pieces that are currently in the staging area
 */
export const getStagingPieces = <T extends BasePuzzlePiece>(
  pieces: T[]
): T[] => {
  return pieces.filter(piece => piece.position < 0);
};
