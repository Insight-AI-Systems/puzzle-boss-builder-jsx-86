
import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Validates the puzzle state to ensure all pieces are in valid positions
 */
export function validatePuzzleState<T extends BasePuzzlePiece>(
  pieces: T[]
): boolean {
  // Simple validation to verify all pieces have valid positions
  return pieces.every(piece => {
    // Pieces in staging area are valid
    if (piece.position < 0) return true;
    
    // Check if there are any duplicated positions (except in staging)
    const piecesAtSamePosition = pieces.filter(p => 
      p.position === piece.position && p.position >= 0
    );
    
    return piecesAtSamePosition.length <= 1;
  });
}

/**
 * Logs debugging information about the grid state
 */
export function debugGridState<T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[],
  rows: number,
  columns: number
): void {
  console.log('Grid state debugging:');
  console.log('Dimensions:', rows, 'x', columns);
  console.log('Grid:', grid);
  
  // Output grid as a visual matrix
  console.log('Grid visualization:');
  for (let r = 0; r < rows; r++) {
    let rowString = '';
    for (let c = 0; c < columns; c++) {
      const index = r * columns + c;
      const value = grid[index] !== null ? grid[index] : '-';
      rowString += `[${value}] `;
    }
    console.log(rowString);
  }
  
  console.log('Pieces:', pieces);
  
  // Count pieces by position type
  const gridPieces = pieces.filter(p => p.position >= 0);
  const stagingPieces = pieces.filter(p => p.position < 0);
  
  console.log(`Pieces on grid: ${gridPieces.length}`);
  console.log(`Pieces in staging: ${stagingPieces.length}`);
  
  // Detect any issues
  const issueDetected = !validatePuzzleState(pieces);
  if (issueDetected) {
    console.warn('Issues detected in puzzle state!');
  }
}
