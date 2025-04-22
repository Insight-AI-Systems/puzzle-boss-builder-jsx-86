
import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Creates a debug visualization of the grid state
 */
export const debugGridState = <T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[],
  rows: number,
  columns: number
): void => {
  console.group('Puzzle Grid State Debug');
  
  const grid2D = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < columns; c++) {
      const index = r * columns + c;
      row.push(grid[index]);
    }
    grid2D.push(row);
  }
  
  console.log('Grid state:');
  console.table(grid2D);
  
  const gridPieces = grid.filter(id => id !== null).length;
  const stagingPieces = pieces.filter(p => p.position < 0).length;
  
  console.log(`Grid pieces: ${gridPieces}`);
  console.log(`Staging pieces: ${stagingPieces}`);
  console.log(`Total pieces: ${pieces.length}`);
  
  let mismatchCount = 0;
  for (const piece of pieces) {
    if (piece.position >= 0) {
      const pieceNumericId = typeof piece.id === 'string' 
        ? parseInt(piece.id.toString().split('-')[1]) 
        : piece.id;
      
      if (grid[piece.position] !== pieceNumericId) {
        console.error(`Mismatch: Piece ${piece.id} is at position ${piece.position} but grid shows ${grid[piece.position]}`);
        mismatchCount++;
      }
    }
  }
  
  if (mismatchCount === 0) {
    console.log('✅ Validation passed: All piece positions match grid state');
  } else {
    console.error(`❌ Validation failed: ${mismatchCount} mismatches found`);
  }
  
  console.groupEnd();
};
