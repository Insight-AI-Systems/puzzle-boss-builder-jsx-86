
import { SimplePuzzlePiece } from '../../types/simple-puzzle-types';

export const sortPiecesForGrid = (pieces: SimplePuzzlePiece[]): SimplePuzzlePiece[] => {
  return [...pieces].sort((a, b) => {
    const aNumber = parseInt(a.id.split('-')[1]);
    const bNumber = parseInt(b.id.split('-')[1]);
    
    const aCorrect = aNumber === a.position;
    const bCorrect = bNumber === b.position;
    
    // Check for trapped status - ensure trapped pieces are always on top
    const aTrapped = a.trapped === true;
    const bTrapped = b.trapped === true;
    
    // 1. Trapped pieces need to be at the top
    if (aTrapped && !bTrapped) return 1;
    if (!aTrapped && bTrapped) return -1;
    
    // 2. Dragging pieces are next highest priority
    if (a.isDragging) return 1;
    if (b.isDragging) return -1;
    
    // 3. Then selected pieces
    if (a.selected) return 1;
    if (b.selected) return -1;
    
    // 4. Correctly placed pieces should be at the bottom
    if (aCorrect && !bCorrect) return -1;
    if (!aCorrect && bCorrect) return 1;
    
    // 5. Consider z-index if provided
    if (a.zIndex !== undefined && b.zIndex !== undefined) {
      return a.zIndex - b.zIndex;
    }
    
    return 0;
  });
};

export const isTrappedPiece = (
  piece: SimplePuzzlePiece,
  pieces: SimplePuzzlePiece[]
): boolean => {
  const pieceNumber = parseInt(piece.id.split('-')[1]);
  const isCorrectlyPlaced = pieceNumber === piece.position;

  // A correctly placed piece can't be trapped
  if (isCorrectlyPlaced) return false;

  // A piece is trapped if there's another piece in its position
  // that IS in its correct position
  return pieces.some(other => {
    if (other.id === piece.id) return false;
    const otherNumber = parseInt(other.id.split('-')[1]);
    return other.position === piece.position && otherNumber === other.position;
  });
};
