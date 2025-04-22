
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
      
      // Apply the pieces update
      setPieces(newPieces);
      
      // Immediately after updating positions, perform a sort to ensure correct z-index layering
      setTimeout(() => {
        setPieces(prev => {
          const updated = [...prev];
          return sortPiecesByCorrectness(updated);
        });
      }, 0);
      
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
        
        // Then sort for proper z-index layering
        return sortPiecesByCorrectness(updated);
      });
      
      setDraggedPiece(null);
    }
  };

  // Helper function to sort pieces based on correctness for proper layering
  const sortPiecesByCorrectness = (piecesToSort: T[]): T[] => {
    return [...piecesToSort].sort((a, b) => {
      const aNumber = parseInt(a.id.split('-')[1]);
      const bNumber = parseInt(b.id.split('-')[1]);
      
      const aCorrect = aNumber === a.position;
      const bCorrect = bNumber === b.position;
      
      // Critical: Prioritize special states above correctness
      if (a.isDragging) return 1; // Dragging pieces on top
      if (b.isDragging) return -1;
      
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
    setPieces(prev => {
      const updated = prev.map(p => {
        // Add a 'selected' property to handle in CSS
        if (p.id === piece.id) {
          return { ...p, selected: true } as any;
        }
        return { ...p, selected: false } as any;
      });
      
      // Then sort the pieces to ensure proper layering
      return sortPiecesByCorrectness(updated);
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
    
    // Update pieces with hints
    setPieces((prev) => {
      const updated = prev.map(piece => {
        if (hintablePieceIds.includes(piece.id)) {
          return { ...piece, showHint: true };
        }
        return { ...piece, showHint: false };
      });
      
      return sortPiecesByCorrectness(updated);
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
