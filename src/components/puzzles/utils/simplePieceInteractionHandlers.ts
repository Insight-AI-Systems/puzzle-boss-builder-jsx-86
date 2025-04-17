
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';
import React from 'react';

export const createSimplePieceHandlers = (
  pieces: SimplePuzzlePiece[],
  setPieces: React.Dispatch<React.SetStateAction<SimplePuzzlePiece[]>>,
  draggedPiece: SimplePuzzlePiece | null,
  setDraggedPiece: React.Dispatch<React.SetStateAction<SimplePuzzlePiece | null>>,
  setMoveCount: React.Dispatch<React.SetStateAction<number>>,
  isSolved: boolean
) => {
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, piece: SimplePuzzlePiece) => {
    if (isSolved) return;
    
    // Prevent default to avoid issues in dev panel
    if (e.preventDefault) e.preventDefault();
    console.log('Drag start:', piece.id);
    setDraggedPiece(piece);
    
    // Update piece state
    setPieces(prev => prev.map(p => 
      p.id === piece.id 
        ? { ...p, isDragging: true } 
        : p
    ));
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent, targetIndex: number) => {
    // Prevent default to avoid issues in dev panel
    if (e.preventDefault) e.preventDefault();
    // Provide visual feedback on hover
    if (draggedPiece && !isSolved) {
      // Optional: Add more hover effects or visual feedback here
    }
  };

  const handleDrop = (e: React.MouseEvent | React.TouchEvent, targetIndex: number) => {
    // Prevent default to avoid issues in dev panel
    if (e.preventDefault) e.preventDefault();
    
    if (!draggedPiece || isSolved) {
      return;
    }
    
    console.log('Drop attempt on index:', targetIndex);
    
    // Find the source piece position
    const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    
    if (sourceIndex === -1) {
      console.log('Source piece not found');
      return;
    }
    
    if (sourceIndex !== targetIndex) {
      console.log(`Swapping piece from position ${sourceIndex} to ${targetIndex}`);
      
      // Create a new array with swapped positions
      const newPieces = [...pieces];
      const temp = newPieces[sourceIndex];
      newPieces[sourceIndex] = newPieces[targetIndex];
      newPieces[targetIndex] = temp;
      
      // Update position property
      newPieces[sourceIndex].position = sourceIndex;
      newPieces[targetIndex].position = targetIndex;
      
      // Reset dragging state
      setPieces(newPieces.map(p => ({ ...p, isDragging: false })));
      setDraggedPiece(null);
      
      // Increment move count
      setMoveCount(prev => prev + 1);
    } else {
      // Reset dragging state without counting as a move
      setPieces(prev => prev.map(p => ({ ...p, isDragging: false })));
      setDraggedPiece(null);
    }
  };
  
  const handlePieceClick = (piece: SimplePuzzlePiece) => {
    if (isSolved) return;
    
    console.log('Piece clicked:', piece.id);
    
    // For touch screens and dev panel - implement click to select and then click to place
    if (draggedPiece && draggedPiece.id !== piece.id) {
      console.log(`Swapping pieces via click: ${draggedPiece.id} with ${piece.id}`);
      
      // Find the source and target indices
      const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
      const targetIndex = pieces.findIndex(p => p.id === piece.id);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        // Create a new array with swapped positions
        const newPieces = [...pieces];
        const temp = newPieces[sourceIndex];
        newPieces[sourceIndex] = newPieces[targetIndex];
        newPieces[targetIndex] = temp;
        
        // Update position property
        newPieces[sourceIndex].position = sourceIndex;
        newPieces[targetIndex].position = targetIndex;
        
        // Reset dragging state
        setPieces(newPieces.map(p => ({ ...p, isDragging: false })));
        setDraggedPiece(null);
        
        // Increment move count
        setMoveCount(prev => prev + 1);
      }
    } else {
      // Select or deselect the piece
      if (draggedPiece?.id === piece.id) {
        // Deselect if clicking the same piece
        setPieces(pieces.map(p => ({ ...p, isDragging: false })));
        setDraggedPiece(null);
      } else {
        // Select a new piece
        setDraggedPiece(piece);
        setPieces(pieces.map(p => 
          p.id === piece.id 
            ? { ...p, isDragging: true } 
            : { ...p, isDragging: false }
        ));
      }
    }
  };

  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right', gridSize: number = 3) => {
    if (!draggedPiece || isSolved) return;
    
    const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    if (sourceIndex === -1) return;
    
    const row = Math.floor(sourceIndex / gridSize);
    const col = sourceIndex % gridSize;
    
    let targetRow = row;
    let targetCol = col;
    
    switch (direction) {
      case 'up':
        targetRow = Math.max(0, row - 1);
        break;
      case 'down':
        targetRow = Math.min(gridSize - 1, row + 1);
        break;
      case 'left':
        targetCol = Math.max(0, col - 1);
        break;
      case 'right':
        targetCol = Math.min(gridSize - 1, col + 1);
        break;
    }
    
    const targetIndex = targetRow * gridSize + targetCol;
    
    // Only process if we're actually moving to a different position
    if (targetIndex !== sourceIndex) {
      handleDrop({ preventDefault: () => {} } as React.MouseEvent, targetIndex);
    }
  };

  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove
  };
};
