
import { BasePuzzlePiece } from '../types/puzzle-types';

export const sortPiecesByCorrectness = <T extends BasePuzzlePiece>(pieces: T[]): T[] => {
  return [...pieces].sort((a, b) => {
    const aNumber = parseInt(a.id.split('-')[1]);
    const bNumber = parseInt(b.id.split('-')[1]);
    
    const aCorrect = aNumber === a.position;
    const bCorrect = bNumber === b.position;
    
    if (a.isDragging) return 1;
    if (b.isDragging) return -1;
    
    if ((a as any).selected) return 1;
    if ((b as any).selected) return -1;
    
    if ((a as any).trapped) return 1;
    if ((b as any).trapped) return -1;
    
    if ((a as any).showHint) return 1;
    if ((b as any).showHint) return -1;
    
    if (aCorrect && !bCorrect) return -1;
    if (!aCorrect && bCorrect) return 1;
    
    return 0;
  });
};

export const checkTrappedPieces = <T extends BasePuzzlePiece>(pieces: T[]): T[] => {
  // First identify trapped pieces
  const updated = pieces.map(p => {
    const pieceNumber = parseInt(p.id.split('-')[1]);
    const isCorrect = pieceNumber === p.position;
    
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
