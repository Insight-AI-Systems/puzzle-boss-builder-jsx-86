
import { BasePuzzlePiece } from '../types/puzzle-types';
import { handlePieceMove, handleDirectionalMove } from './pieceMovementHandlers';
import { handlePieceDrop } from './handlers/dragDropHandlers';
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
  playSound: (sound: string) => void,
  grid: (number | null)[] = []
) => {
  const handleDragStart = (piece: T) => {
    setDraggedPiece(piece);
    playSound('pickup');
    
    setPieces(prev => {
      return updatePieceState(prev, piece.id, { isDragging: true } as Partial<T>);
    });
  };

  const handleMove = (piece: T, index: number) => {
    if (draggedPiece && draggedPiece.id === piece.id) {
      // Handle moving to staging area
      if (index === -1) {
        setPieces(prev => {
          const updated = prev.map(p => 
            p.id === piece.id ? { ...p, position: -1, isDragging: false } : p
          );
          incrementMoves();
          playSound('place');
          return updated;
        });
        return;
      }
      
      // Normal grid move
      setPieces(prev => {
        const moved = handlePieceMove(prev, piece, index, grid);
        incrementMoves();
        playSound('place');
        return moved;
      });
      
      setTimeout(() => {
        setPieces(prev => {
          const updatedWithTrapped = checkTrappedPieces(prev) as T[];
          return updatePieceState(updatedWithTrapped, piece.id, { selected: true } as Partial<T>);
        });
      }, 0);
    }
  };

  const handleDrop = () => {
    if (draggedPiece) {
      handlePieceDrop(pieces, draggedPiece.id, draggedPiece.position, grid, setPieces);
      setDraggedPiece(null);
      
      setTimeout(() => {
        setPieces(prev => checkTrappedPieces(prev) as T[]);
      }, 0);
    }
  };

  const handlePieceClick = (piece: T) => {
    playSound('pickup');
    setPieces(prev => {
      const withSelected = updatePieceState(prev, piece.id, { 
        selected: true,
        // If the piece is trapped, move it to staging area on click
        position: (piece as any).trapped ? -1 : piece.position 
      } as Partial<T>);
      return checkTrappedPieces(withSelected) as T[];
    });
  };

  const checkForHints = () => {
    if (isSolved) return;
    
    setPieces(prev => {
      const hintablePieceIds = findHintablePieces(prev);
      const updated = prev.map(piece => ({
        ...piece,
        showHint: hintablePieceIds.includes(piece.id)
      } as T));
      
      return checkTrappedPieces(updated) as T[];
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
