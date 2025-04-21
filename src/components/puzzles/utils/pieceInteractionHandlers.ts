import { BasePuzzlePiece } from '../types/puzzle-types';

export const createPieceHandlers = (
  pieces: BasePuzzlePiece[],
  setPieces: React.Dispatch<React.SetStateAction<BasePuzzlePiece[]>>,
  draggedPiece: BasePuzzlePiece | null,
  setDraggedPiece: React.Dispatch<React.SetStateAction<BasePuzzlePiece | null>>,
  onMoveCountUpdate: (count: number) => void,
  isSolved: boolean,
  playSound: (sound: 'pickup' | 'place' | 'correct' | 'complete') => void
) => {
  let moveCount = 0;

  const handleDragStart = (piece: BasePuzzlePiece) => {
    if (isSolved) return;
    
    playSound('pickup');
    setDraggedPiece(piece);
    
    // Update piece state
    setPieces(prevPieces => {
      return prevPieces.map(p => {
        if (p.id === piece.id) {
          return { ...p, isDragging: true };
        }
        return p;
      });
    });
  };

  const handleMove = (piece: BasePuzzlePiece, targetIndex: number) => {
    if (isSolved || !draggedPiece) return;
    
    // Optional: Add hover effect or preview
  };

  const handleDrop = (piece: BasePuzzlePiece) => {
    if (isSolved || !draggedPiece) return;
    
    // Find the current positions of both pieces
    const draggedIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    const targetIndex = pieces.findIndex(p => p.id === piece.id);
    
    // Don't swap if dropping on itself
    if (draggedIndex === targetIndex) {
      // Just reset dragging state
      setPieces(prevPieces => {
        return prevPieces.map(p => {
          if (p.id === draggedPiece.id) {
            return { ...p, isDragging: false };
          }
          return p;
        });
      });
      setDraggedPiece(null);
      return;
    }
    
    // Swap positions
    setPieces(prevPieces => {
      const updatedPieces = [...prevPieces];
      
      // Get the positions
      const draggedPosition = updatedPieces[draggedIndex].position;
      const targetPosition = updatedPieces[targetIndex].position;
      
      // Swap them
      updatedPieces[draggedIndex] = {
        ...updatedPieces[draggedIndex],
        position: targetPosition,
        isDragging: false
      };
      
      updatedPieces[targetIndex] = {
        ...updatedPieces[targetIndex],
        position: draggedPosition
      };
      
      return updatedPieces;
    });
    
    // Update move count
    moveCount++;
    onMoveCountUpdate(moveCount);
    
    // Play sound
    playSound('place');
    
    // Reset dragged piece
    setDraggedPiece(null);
  };

  const handlePieceClick = (piece: BasePuzzlePiece) => {
    if (isSolved) return;
    
    // If a piece is already being dragged, treat this as a drop
    if (draggedPiece && draggedPiece.id !== piece.id) {
      handleDrop(piece);
    } else if (!draggedPiece) {
      // Otherwise, start dragging this piece
      handleDragStart(piece);
    } else {
      // Clicking the same piece again cancels the drag
      setPieces(prevPieces => {
        return prevPieces.map(p => {
          if (p.id === draggedPiece.id) {
            return { ...p, isDragging: false };
          }
          return p;
        });
      });
      setDraggedPiece(null);
    }
  };

  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (isSolved || !draggedPiece) return;
    
    const gridSize = Math.sqrt(pieces.length);
    const draggedIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    let targetIndex = draggedIndex;
    
    // Calculate target index based on direction
    switch (direction) {
      case 'up':
        targetIndex = draggedIndex - gridSize;
        break;
      case 'down':
        targetIndex = draggedIndex + gridSize;
        break;
      case 'left':
        if (draggedIndex % gridSize > 0) {
          targetIndex = draggedIndex - 1;
        }
        break;
      case 'right':
        if (draggedIndex % gridSize < gridSize - 1) {
          targetIndex = draggedIndex + 1;
        }
        break;
    }
    
    // Check if target index is valid
    if (targetIndex >= 0 && targetIndex < pieces.length && targetIndex !== draggedIndex) {
      const targetPiece = pieces[targetIndex];
      handleDrop(targetPiece);
    }
  };

  const checkForHints = () => {
    if (isSolved) return;
    
    // Clear all hints first
    setPieces(prevPieces => {
      return prevPieces.map(p => ({
        ...p,
        showHint: false
      }));
    });
    
    // Randomly select 1-2 pieces that are in the wrong position to hint
    const incorrectPieces = pieces.filter(piece => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      return pieces.indexOf(piece) !== pieceNumber;
    });
    
    if (incorrectPieces.length > 0) {
      const numHints = Math.min(incorrectPieces.length, Math.random() > 0.5 ? 2 : 1);
      const hintPieces = Array.from({ length: numHints }, () => {
        const randomIndex = Math.floor(Math.random() * incorrectPieces.length);
        const piece = incorrectPieces.splice(randomIndex, 1)[0];
        return piece.id;
      });
      
      // Apply hints
      setPieces(prevPieces => {
        return prevPieces.map(p => ({
          ...p,
          showHint: hintPieces.includes(p.id)
        }));
      });
    }
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
