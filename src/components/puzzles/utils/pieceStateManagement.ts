
import { BasePuzzlePiece } from '../types/puzzle-types';

/**
 * Ensures grid integrity by maintaining a one-piece-per-cell rule.
 * Returns an updated grid state and updated pieces array.
 */
export const ensureGridIntegrity = <T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[],
  validate: boolean = false
): { 
  updatedGrid: (number | null)[],
  updatedPieces: T[] 
} => {
  // Create a fresh grid
  const updatedGrid = Array(grid.length).fill(null);
  
  // Track which pieces we've placed
  const placedPieces = new Set<string | number>();
  
  // First pass: place pieces in grid based on their positions
  for (const piece of pieces) {
    const position = piece.position;
    
    // Skip invalid positions
    if (position < 0 || position >= grid.length) continue;
    
    // If the position is already occupied, we'll handle conflicts later
    if (updatedGrid[position] === null) {
      updatedGrid[position] = typeof piece.id === 'string' 
        ? parseInt(piece.id.toString().split('-')[1]) 
        : piece.id;
      placedPieces.add(piece.id);
    }
  }
  
  // Second pass: resolve conflicts by moving duplicates to staging
  const updatedPieces = pieces.map(piece => {
    // If piece wasn't placed in grid, set to staging position
    if (!placedPieces.has(piece.id)) {
      return {
        ...piece,
        position: -1, // Use negative position to indicate staging
      } as T;
    }
    return piece;
  });
  
  if (validate) {
    validatePuzzleState(updatedPieces, updatedGrid);
  }
  
  return { updatedGrid, updatedPieces };
};

/**
 * Validates the puzzle state to ensure no piece is in two places at once
 * and all cells contain at most one piece.
 */
export const validatePuzzleState = <T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[]
): boolean => {
  // Create a set to track which pieces we've seen in grid
  const seenPieces = new Set<string | number>();
  let valid = true;
  
  // Check grid state for duplicates
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
  
  // Check for consistency between pieces and grid
  for (const piece of pieces) {
    const position = piece.position;
    
    // Skip pieces in staging
    if (position < 0) continue;
    
    // Position should be within grid bounds
    if (position >= grid.length) {
      console.error(`Validation error: Piece ${piece.id} has invalid position ${position}!`);
      valid = false;
      continue;
    }
    
    // The piece at this position in the grid should match this piece
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

/**
 * Identifies pieces that are currently in the staging area (not on the grid)
 */
export const getStagingPieces = <T extends BasePuzzlePiece>(
  pieces: T[]
): T[] => {
  return pieces.filter(piece => piece.position < 0);
};

/**
 * Moves a piece from staging to the grid at the specified position.
 * If there is already a piece at that position, it is moved to staging.
 */
export const movePieceFromStagingToGrid = <T extends BasePuzzlePiece>(
  pieces: T[],
  grid: (number | null)[],
  pieceId: string | number,
  targetPosition: number
): { 
  updatedPieces: T[],
  updatedGrid: (number | null)[] 
} => {
  // Convert string ID to number if needed
  const numericId = typeof pieceId === 'string' 
    ? parseInt(pieceId.toString().split('-')[1]) 
    : pieceId;
  
  // Find the piece by ID
  const pieceIndex = pieces.findIndex(p => {
    const pId = typeof p.id === 'string' 
      ? parseInt(p.id.toString().split('-')[1]) 
      : p.id;
    return pId === numericId;
  });
  
  if (pieceIndex === -1) {
    return { updatedPieces: pieces, updatedGrid: grid };
  }
  
  // Create copies of data
  const updatedPieces = [...pieces];
  const updatedGrid = [...grid];
  
  // Check if there's already a piece at the target position
  if (updatedGrid[targetPosition] !== null) {
    // Find the existing piece and move it to staging
    const existingPieceId = updatedGrid[targetPosition];
    const existingPieceIndex = updatedPieces.findIndex(p => {
      const pId = typeof p.id === 'string' 
        ? parseInt(p.id.toString().split('-')[1]) 
        : p.id;
      return pId === existingPieceId;
    });
    
    if (existingPieceIndex !== -1) {
      updatedPieces[existingPieceIndex] = {
        ...updatedPieces[existingPieceIndex],
        position: -1, // Move to staging
        isDragging: false
      } as T;
    }
  }
  
  // Update the grid
  updatedGrid[targetPosition] = numericId;
  
  // Update the piece position
  updatedPieces[pieceIndex] = {
    ...updatedPieces[pieceIndex],
    position: targetPosition,
    isDragging: false
  } as T;
  
  return { updatedPieces, updatedGrid };
};

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
  
  // Create a 2D representation for easier visualization
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
  
  // Count pieces in different locations
  const gridPieces = grid.filter(id => id !== null).length;
  const stagingPieces = pieces.filter(p => p.position < 0).length;
  
  console.log(`Grid pieces: ${gridPieces}`);
  console.log(`Staging pieces: ${stagingPieces}`);
  console.log(`Total pieces: ${pieces.length}`);
  
  // Validate piece positions match grid
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
