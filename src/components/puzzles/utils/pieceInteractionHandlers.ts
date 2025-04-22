
import { BasePuzzlePiece, PuzzlePiece, GameMode } from '../types/puzzle-types';
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
      setPieces(prev => {
        // Use the grid parameter to ensure one piece per cell
        const moved = handlePieceMove(prev, draggedPiece, index, grid);
        incrementMoves();
        playSound('place');
        return moved;
      });
      
      // Immediately check for and fix trapped pieces on every move
      setTimeout(() => {
        setPieces(prev => {
          // Ensure type safety with explicit casting
          const updatedWithTrapped = checkTrappedPieces(prev) as T[];
          return updatePieceState(updatedWithTrapped, draggedPiece.id, { selected: true } as Partial<T>);
        });
      }, 0);
    }
  };

  const handleDrop = () => {
    if (draggedPiece) {
      setPieces(prev => {
        // Handle type safety with explicit casting
        const dropped = handlePieceDrop(prev, draggedPiece) as T[];
        // Ensure trapped pieces are detected on drop as well
        return checkTrappedPieces(dropped) as T[];
      });
      setDraggedPiece(null);
    }
  };

  const handlePieceClick = (piece: T) => {
    playSound('pickup');
    setPieces(prev => {
      const withSelected = updatePieceState(prev, piece.id, { selected: true } as Partial<T>);
      // Also check for trapped pieces when clicking
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
