
import { SimplePuzzlePiece } from '../../types/simple-puzzle-types';
import { BasePuzzlePiece } from '../../types/puzzle-types';

// Sort pieces for the grid display with proper stacking order
export const sortPiecesForGrid = <T extends BasePuzzlePiece>(pieces: T[]): T[] => {
  return [...pieces].sort((a, b) => {
    const aNumber = parseInt(a.id.split('-')[1]);
    const bNumber = parseInt(b.id.split('-')[1]);
    
    const aCorrect = aNumber === a.position;
    const bCorrect = bNumber === b.position;
    
    // Set priority order for visual stacking:
    
    // 1. Trapped pieces MUST be on top of everything else
    if ((a as any).trapped && !(b as any).trapped) return 1;
    if (!(a as any).trapped && (b as any).trapped) return -1;
    
    // 2. Dragging pieces come next
    if (a.isDragging && !b.isDragging) return 1;
    if (!a.isDragging && b.isDragging) return -1;
    
    // 3. Selected pieces are next
    if ((a as any).selected && !(b as any).selected) return 1;
    if (!(a as any).selected && (b as any).selected) return -1;
    
    // 4. Correctly placed pieces always go to the bottom
    if (aCorrect && !bCorrect) return -1;
    if (!aCorrect && bCorrect) return 1;
    
    return 0;
  });
};

// Check if a piece is trapped by another piece
export const isTrappedPiece = <T extends BasePuzzlePiece>(piece: T, allPieces: T[]): boolean => {
  if (piece.position < 0) return false; // Pieces in staging area can't be trapped
  
  const pieceNumber = parseInt(piece.id.split('-')[1]);
  const isCorrect = pieceNumber === piece.position;
  
  // A piece is trapped if:
  // 1. It's not in its correct position
  // 2. There's another piece in the same position that IS in its correct position
  if (!isCorrect) {
    return allPieces.some(otherPiece => {
      if (otherPiece.id === piece.id) return false;
      
      const otherNumber = parseInt(otherPiece.id.split('-')[1]);
      const otherPosition = otherPiece.position;
      
      return piece.position === otherPosition && otherNumber === otherPosition;
    });
  }
  
  return false;
};

// Get all staging area pieces
export const getStagingPieces = <T extends BasePuzzlePiece>(pieces: T[]): T[] => {
  return pieces.filter(piece => piece.position < 0);
};

// Get all grid pieces (not in staging)
export const getGridPieces = <T extends BasePuzzlePiece>(pieces: T[]): T[] => {
  return pieces.filter(piece => piece.position >= 0);
};
