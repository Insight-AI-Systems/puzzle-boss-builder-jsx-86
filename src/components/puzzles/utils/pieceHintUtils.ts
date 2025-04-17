
import { BasePuzzlePiece } from '../types/puzzle-types';

export const checkForHints = <T extends BasePuzzlePiece>(
  pieces: T[],
  setPieces: React.Dispatch<React.SetStateAction<T[]>>,
  isSolved: boolean
) => {
  // Only provide hints if the puzzle is not solved
  if (isSolved) return;
  
  // Find pieces that are close to their correct position
  const hintablePieceIds: string[] = [];
  
  pieces.forEach(piece => {
    const pieceId = piece.id;
    const pieceNumber = parseInt(pieceId.split('-')[1]);
    const correctPosition = pieceNumber;
    
    // If piece is within 1-2 positions of its correct spot
    if (piece.position !== correctPosition) {
      const currentRow = Math.floor(piece.position / 3);
      const currentCol = piece.position % 3;
      const correctRow = Math.floor(correctPosition / 3);
      const correctCol = correctPosition % 3;
      
      // Calculate Manhattan distance
      const distance = Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);
      
      // If piece is close to its correct position, add it to hintable pieces
      if (distance === 1) {
        hintablePieceIds.push(pieceId);
      }
    }
  });
  
  // Randomly select up to 2 pieces to hint
  if (hintablePieceIds.length > 2) {
    hintablePieceIds.sort(() => Math.random() - 0.5);
    hintablePieceIds.splice(2);
  }
  
  // Update pieces with hints
  setPieces(prev => {
    return prev.map(piece => {
      if (hintablePieceIds.includes(piece.id)) {
        return { ...piece, showHint: true };
      }
      return { ...piece, showHint: false };
    });
  });
};
