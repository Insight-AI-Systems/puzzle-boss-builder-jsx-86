
import { SimplePuzzlePiece } from '../../types/simple-puzzle-types';

export const sortPiecesForGrid = (pieces: SimplePuzzlePiece[]): SimplePuzzlePiece[] => {
  return [...pieces].sort((a, b) => {
    const aNumber = parseInt(a.id.split('-')[1]);
    const bNumber = parseInt(b.id.split('-')[1]);
    
    const aCorrect = aNumber === a.position;
    const bCorrect = bNumber === b.position;
    
    const aTrapped = (a as any).trapped;
    const bTrapped = (b as any).trapped;
    
    if (aTrapped && !bTrapped) return 1;
    if (!aTrapped && bTrapped) return -1;
    
    if (a.isDragging) return 1;
    if (b.isDragging) return -1;
    
    if ((a as any).selected) return 1;
    if ((b as any).selected) return -1;
    
    if (aCorrect && !bCorrect) return -1;
    if (!aCorrect && bCorrect) return 1;
    
    return 0;
  });
};

export const isTrappedPiece = (
  piece: SimplePuzzlePiece,
  pieces: SimplePuzzlePiece[]
): boolean => {
  const pieceNumber = parseInt(piece.id.split('-')[1]);
  const isCorrectlyPlaced = pieceNumber === piece.position;

  if (isCorrectlyPlaced) return false;

  return pieces.some(other => {
    const otherNumber = parseInt(other.id.split('-')[1]);
    return other.position === piece.position && otherNumber === other.position;
  });
};
