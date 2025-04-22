
import { BasePuzzlePiece } from '../types/puzzle-types';

export const sortPiecesByCorrectness = <T extends BasePuzzlePiece>(pieces: T[]): T[] => {
  return [...pieces].sort((a, b) => {
    const aNumber = parseInt(a.id.split('-')[1]);
    const bNumber = parseInt(b.id.split('-')[1]);
    
    const aCorrect = aNumber === a.position;
    const bCorrect = bNumber === b.position;
    
    // Dragging pieces are always on top
    if (a.isDragging) return 1;
    if (b.isDragging) return -1;
    
    // Selected pieces are next highest priority
    if ((a as any).selected) return 1;
    if ((b as any).selected) return -1;
    
    // Correctly placed pieces go to the bottom
    if (aCorrect && !bCorrect) return -1;
    if (!aCorrect && bCorrect) return 1;
    
    return 0;
  });
};

export const checkTrappedPieces = <T extends BasePuzzlePiece>(pieces: T[]): T[] => {
  // First identify trapped pieces - pieces that are in a spot where another piece
  // is correctly placed (and thus would be hidden underneath)
  const updated = pieces.map(p => {
    const pieceNumber = parseInt(p.id.split('-')[1]);
    const isCorrect = pieceNumber === p.position;
    
    // A piece is trapped if:
    // 1. It's not in its correct position
    // 2. There's another piece in the same position that IS in its correct position
    const isTrapped = !isCorrect && pieces.some(other => {
      const otherNumber = parseInt(other.id.split('-')[1]);
      return other.position === p.position && otherNumber === other.position;
    });
    
    return { 
      ...p, 
      trapped: isTrapped
    } as any;
  });
  
  return sortPiecesByCorrectness(updated);
};
