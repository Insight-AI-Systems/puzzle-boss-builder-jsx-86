
import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Validates the puzzle state to ensure no piece is in two places at once
 */
export const validatePuzzleState = <T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[]
): boolean => {
  const seenPieces = new Set<string | number>();
  let valid = true;
  
  for (let i = 0; i < grid.length; i++) {
    const pieceId = grid[i];
    if (pieceId !== null) {
      if (seenPieces.has(pieceId)) {
        console.error(`Validation error: Piece ${pieceId} appears multiple times in the grid!`);
        valid = false;
      }
      seenPieces.add(pieceId);
    }
  }
  
  for (const piece of pieces) {
    const position = piece.position;
    if (position < 0) continue;
    
    if (position >= grid.length) {
      console.error(`Validation error: Piece ${piece.id} has invalid position ${position}!`);
      valid = false;
      continue;
    }
    
    const pieceNumericId = typeof piece.id === 'string' 
      ? parseInt(piece.id.toString().split('-')[1]) 
      : piece.id;
      
    if (grid[position] !== pieceNumericId) {
      console.error(`Validation error: Piece ${piece.id} claims position ${position}, but grid has ${grid[position]}!`);
      valid = false;
    }
  }
  
  return valid;
};
