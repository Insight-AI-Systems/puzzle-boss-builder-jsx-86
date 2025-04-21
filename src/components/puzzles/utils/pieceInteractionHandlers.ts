
import { BasePuzzlePiece } from '../types/puzzle-types';

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
    
    setPieces(pieces.map(p => 
      p.id === piece.id ? { ...p, isDragging: true, zIndex: 100 } : p
    ));
  };

  const handleMove = (piece: T, index: number) => {
    if (draggedPiece && draggedPiece.id === piece.id) {
      const newPieces = [...pieces];
      const draggedIndex = newPieces.findIndex(p => p.id === piece.id);
      
      // Swap positions
      [newPieces[draggedIndex].position, newPieces[index].position] = 
      [newPieces[index].position, newPieces[draggedIndex].position];
      
      // Update z-indices to ensure visibility
      updatePieceZIndices(newPieces);
      
      setPieces(newPieces);
      incrementMoves();
      playSound('place');
    }
  };

  const handleDrop = () => {
    if (draggedPiece) {
      setPieces(prev => {
        const updated = prev.map(p => 
          p.id === draggedPiece.id ? { ...p, isDragging: false } : p
        );
        updatePieceZIndices(updated);
        return updated;
      });
      setDraggedPiece(null);
    }
  };

  const handlePieceClick = (piece: T) => {
    playSound('pickup');
  };

  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!draggedPiece) return;
    
    // Implementation depends on grid layout
    console.log(`Move ${draggedPiece.id} to ${direction}`);
  };

  // New helper function to update z-indices for all pieces
  const updatePieceZIndices = (piecesToUpdate: T[]) => {
    // For each piece, determine if it's in its correct position
    piecesToUpdate.forEach(piece => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      const isInCorrectPosition = piece.position === pieceNumber;
      
      // Placed pieces get lower z-index (10)
      // Unplaced pieces get higher z-index (20)
      // Currently dragged pieces get highest z-index (100)
      if ('zIndex' in piece) {
        if (piece.isDragging) {
          (piece as any).zIndex = 100;
        } else if (isInCorrectPosition) {
          (piece as any).zIndex = 10; // Lower z-index for correctly placed pieces
        } else {
          (piece as any).zIndex = 20; // Higher z-index for unplaced pieces
        }
      }
    });
  };

  const checkForHints = () => {
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
    setPieces((prev) => {
      return prev.map(piece => {
        if (hintablePieceIds.includes(piece.id)) {
          return { ...piece, showHint: true };
        }
        return { ...piece, showHint: false };
      });
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
