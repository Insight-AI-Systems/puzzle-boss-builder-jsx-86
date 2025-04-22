
import { BasePuzzlePiece } from '../types/puzzle-types';
import { handlePieceMove, handlePieceDrop, handleDirectionalMove } from './pieceMovementHandlers';
import { updatePieceState } from './pieceStateUtils';
import { findHintablePieces } from './pieceStateUtils';
import { checkTrappedPieces } from './pieceSortingUtils';

export const createPieceHandlers = <T extends BasePuzzlePiece>(
  pieces: T[], 
  setPieces: (pieces: T[] | ((prev: T[]) => T[])) => void,
  draggedPiece: T | null, 
  setDraggedPiece: (piece: T | null) => void,
  incrementMoves: (count?: number) => void,
  isSolved: boolean,
  playSound: (sound: string) => void
) => {
  const handleDragStart = (piece: T) => {
    setDraggedPiece(piece);
    playSound('pickup');
    
    setPieces(prev => {
      return updatePieceState(prev, piece.id, { isDragging: true });
    });
  };

  const handleMove = (piece: T, index: number) => {
    if (draggedPiece && draggedPiece.id === piece.id) {
      setPieces(prev => handlePieceMove(prev, draggedPiece, index));
      incrementMoves();
      playSound('place');
      
      setTimeout(() => {
        setPieces(prev => {
          const updated = checkTrappedPieces(prev);
          return updatePieceState(updated, draggedPiece.id, { selected: true });
        });
      }, 0);
    }
  };

  const handleDrop = () => {
    if (draggedPiece) {
      setPieces(prev => handlePieceDrop(prev, draggedPiece));
      setDraggedPiece(null);
    }
  };

  const handlePieceClick = (piece: T) => {
    playSound('pickup');
    setPieces(prev => updatePieceState(prev, piece.id, { selected: true }));
  };

  const checkForHints = () => {
    if (isSolved) return;
    
    setPieces(prev => {
      const hintablePieceIds = findHintablePieces(prev);
      const updated = prev.map(piece => ({
        ...piece,
        showHint: hintablePieceIds.includes(piece.id)
      } as any));
      
      return checkTrappedPieces(updated);
    });
  };

  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove,
    checkForHints
  };
};
