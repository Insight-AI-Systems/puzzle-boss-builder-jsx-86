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
      p.id === piece.id ? { ...p, isDragging: true } : p
    ));
  };

  const handleMove = (piece: T, index: number) => {
    if (draggedPiece && draggedPiece.id === piece.id) {
      const newPieces = [...pieces];
      const draggedIndex = newPieces.findIndex(p => p.id === piece.id);
      
      // Before swapping, check if we're about to drop onto another piece
      const targetPiece = newPieces.find(p => p.position === index);
      const draggedPieceNumber = parseInt(draggedPiece.id.split('-')[1]);
      const isDraggedPieceCorrect = draggedPieceNumber === draggedPiece.position;
      
      // Swap positions
      [newPieces[draggedIndex].position, newPieces[index].position] = 
      [newPieces[index].position, newPieces[draggedIndex].position];
      
      // If we're dropping onto another piece, ensure it comes to the top
      // by forcing a new pieces array that emphasizes the layer ordering
      if (targetPiece) {
        // This ensures pieces array order reflects desired visual stacking
        // (wrongly placed pieces should appear above correctly placed ones)
        const sortedPieces = [...newPieces].sort((a, b) => {
          const aNumber = parseInt(a.id.split('-')[1]);
          const bNumber = parseInt(b.id.split('-')[1]);
          
          const aCorrect = aNumber === a.position;
          const bCorrect = bNumber === b.position;
          
          // Correct pieces go to the bottom
          if (aCorrect && !bCorrect) return -1;
          if (!aCorrect && bCorrect) return 1;
          
          // Otherwise maintain original order
          return 0;
        });
        
        setPieces(sortedPieces);
      } else {
        setPieces(newPieces);
      }
      
      incrementMoves();
      playSound('place');
    }
  };

  const handleDrop = () => {
    if (draggedPiece) {
      setPieces(prev => {
        // First, remove the dragging state
        const updated = prev.map(p => 
          p.id === draggedPiece.id ? { ...p, isDragging: false } : p
        );
        
        // Then re-sort the pieces to ensure correct z-index layering
        return updated.sort((a, b) => {
          const aNumber = parseInt(a.id.split('-')[1]);
          const bNumber = parseInt(b.id.split('-')[1]);
          
          const aCorrect = aNumber === a.position;
          const bCorrect = bNumber === b.position;
          
          // Correctly placed pieces should be rendered first (bottom layer)
          if (aCorrect && !bCorrect) return -1;
          if (!aCorrect && bCorrect) return 1;
          
          // If both are correct or both are incorrect, maintain original order
          return 0;
        });
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

  // No explicit z-index setting needed anymore
  // We'll rely on the array order and CSS classes to handle z-indices
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
