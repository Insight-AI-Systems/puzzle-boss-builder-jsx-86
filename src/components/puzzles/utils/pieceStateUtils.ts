
import { BasePuzzlePiece } from '../types/puzzle-types';
import { checkTrappedPieces } from './pieceSortingUtils';

export const updatePieceState = <T extends BasePuzzlePiece>(
  pieces: T[],
  pieceId: string,
  updates: Partial<T>
): T[] => {
  const updated = pieces.map(p => 
    p.id === pieceId ? { ...p, ...updates } : p
  );
  // Pass the required grid size parameter (default to 3 for compatibility)
  return checkTrappedPieces(updated, 3);
};

export const findHintablePieces = <T extends BasePuzzlePiece>(pieces: T[]): string[] => {
  const hintablePieceIds: string[] = [];
  
  pieces.forEach(piece => {
    const pieceNumber = parseInt(piece.id.split('-')[1]);
    const correctPosition = pieceNumber;
    
    if (piece.position !== correctPosition) {
      const currentRow = Math.floor(piece.position / 3);
      const currentCol = piece.position % 3;
      const correctRow = Math.floor(correctPosition / 3);
      const correctCol = correctPosition % 3;
      
      const distance = Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);
      
      if (distance === 1) {
        hintablePieceIds.push(piece.id);
      }
    }
  });
  
  return hintablePieceIds.slice(0, 2);
};
