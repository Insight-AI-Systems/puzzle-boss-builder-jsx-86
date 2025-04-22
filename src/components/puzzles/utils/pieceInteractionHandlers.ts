
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
    
    // When starting to drag, check for trapped pieces and force them to top
    setPieces(prev => {
      // Update the dragging state for the current piece
      const updated = prev.map(p => 
        p.id === piece.id ? { ...p, isDragging: true } : p
      );
      
      // Force re-evaluation of all trapped pieces
      return checkTrappedPieces(updated);
    });
  };

  const handleMove = (piece: T, index: number) => {
    if (draggedPiece && draggedPiece.id === piece.id) {
      const newPieces = [...pieces];
      const draggedIndex = newPieces.findIndex(p => p.id === piece.id);
      
      // Swap positions
      [newPieces[draggedIndex].position, newPieces[index].position] = 
      [newPieces[index].position, newPieces[draggedIndex].position];
      
      // Apply the pieces update
      setPieces(newPieces);
      
      // Immediately recalculate trapped state and enforce proper z-index layering
      setTimeout(() => {
        setPieces(prev => {
          // Evaluate trapped state and update all pieces
          const updated = checkTrappedPieces(prev);
          
          // Mark current piece as selected
          return updated.map(p => 
            p.id === draggedPiece.id ? { ...p, selected: true } as any : p
          );
        });
      }, 0);
      
      incrementMoves();
      playSound('place');
    }
  };

  const handleDrop = () => {
    if (draggedPiece) {
      setPieces(prev => {
        // First, remove the dragging state from the dragged piece
        const updated = prev.map(p => 
          p.id === draggedPiece.id ? { ...p, isDragging: false } as any : p
        );
        
        // Then check for trapped pieces and update their states
        return checkTrappedPieces(updated);
      });
      
      setDraggedPiece(null);
    }
  };

  // Helper function to identify and mark trapped pieces
  const checkTrappedPieces = (piecesToCheck: T[]): T[] => {
    // First identify trapped pieces
    const updated = piecesToCheck.map(p => {
      const pieceNumber = parseInt(p.id.split('-')[1]);
      const isCorrect = pieceNumber === p.position;
      
      // Check if this piece is potentially trapped
      // (an unplaced piece is in the same position as a correctly placed piece)
      const isTrapped = !isCorrect && piecesToCheck.some(other => {
        const otherNumber = parseInt(other.id.split('-')[1]);
        return other.position === p.position && otherNumber === other.position;
      });
      
      return { 
        ...p, 
        trapped: isTrapped 
      } as any;
    });
    
    // Then sort for proper z-index layering
    return sortPiecesByCorrectness(updated);
  };

  // Helper function to sort pieces based on correctness for proper layering
  const sortPiecesByCorrectness = (piecesToSort: T[]): T[] => {
    return [...piecesToSort].sort((a, b) => {
      const aNumber = parseInt(a.id.split('-')[1]);
      const bNumber = parseInt(b.id.split('-')[1]);
      
      const aCorrect = aNumber === a.position;
      const bCorrect = bNumber === b.position;
      
      // Critical prioritization order (highest to lowest):
      // 1. Currently being dragged
      // 2. Currently selected
      // 3. Trapped pieces (need to be highly visible)
      // 4. Pieces showing hints
      // 5. Unplaced pieces
      // 6. Correctly placed pieces (bottom)
      
      if (a.isDragging) return 1; // Dragging pieces always on top
      if (b.isDragging) return -1;
      
      if ((a as any).selected) return 1; // Selected pieces next
      if ((b as any).selected) return -1;
      
      if ((a as any).trapped) return 1; // Trapped pieces high priority
      if ((b as any).trapped) return -1;
      
      if ((a as any).showHint) return 1; // Hinted pieces above regular
      if ((b as any).showHint) return -1;
      
      // Correct pieces go to bottom, incorrect to top
      if (aCorrect && !bCorrect) return -1;
      if (!aCorrect && bCorrect) return 1;
      
      // Both correct or both incorrect maintain current order
      return 0;
    });
  };

  const handlePieceClick = (piece: T) => {
    playSound('pickup');
    
    // When a piece is clicked, make sure it appears on top
    // Also check for trapped pieces and update their state
    setPieces(prev => {
      // First, mark the clicked piece as selected and all others as not selected
      const updated = prev.map(p => ({
        ...p,
        selected: p.id === piece.id
      } as any));
      
      // Then check for trapped pieces and update their state
      return checkTrappedPieces(updated);
    });
  };

  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!draggedPiece) return;
    
    // Implementation depends on grid layout
    console.log(`Move ${draggedPiece.id} to ${direction}`);
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
    
    // Update pieces with hints and check for trapped pieces
    setPieces(prev => {
      // First update hint status
      const updated = prev.map(piece => ({
        ...piece,
        showHint: hintablePieceIds.includes(piece.id)
      } as any));
      
      // Then check for trapped pieces and update their state
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
