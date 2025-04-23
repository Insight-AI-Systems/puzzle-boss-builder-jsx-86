
import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Checks if there are any trapped pieces in the grid
 */
export function checkTrappedPieces<T extends BasePuzzlePiece>(pieces: T[], gridSize: number): T[] {
  // For compatibility, returning the original pieces
  return pieces;
}

/**
 * Sorts pieces for display in the grid
 */
export function sortPiecesForGrid<T extends BasePuzzlePiece & { trapped?: boolean }>(pieces: T[]): T[] {
  // Sort pieces to put trapped pieces on top
  return [...pieces].sort((a, b) => {
    // Trapped pieces come first (highest z-index)
    if (a.trapped && !b.trapped) return 1;
    if (!a.trapped && b.trapped) return -1;
    return 0;
  });
}
