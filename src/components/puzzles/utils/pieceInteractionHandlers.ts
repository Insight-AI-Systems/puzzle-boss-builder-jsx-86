
import { BasePuzzlePiece } from '../types/puzzle-types';
import React from 'react';

export const createPieceHandlers = <T extends BasePuzzlePiece>(
  pieces: T[],
  setPieces: React.Dispatch<React.SetStateAction<T[]>>,
  draggedPiece: T | null,
  setDraggedPiece: React.Dispatch<React.SetStateAction<T | null>>,
  setMoveCount: React.Dispatch<React.SetStateAction<number>>,
  isSolved: boolean
) => {
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, piece: T) => {
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
    ) as T[]);
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
      setPieces(newPieces.map(p => ({ ...p, isDragging: false })) as T[]);
      setDraggedPiece(null);
      
      // Increment move count
      setMoveCount(prev => prev + 1);
    } else {
      // Reset dragging state without counting as a move
      setPieces(prev => prev.map(p => ({ ...p, isDragging: false })) as T[]);
      setDraggedPiece(null);
    }
  };
  
  const handlePieceClick = (piece: T) => {
    if (isSolved) return;
    
    console.log('Piece clicked:', piece.id);
    
    // For touch screens - implement click to select and then click to place
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
        setPieces(newPieces.map(p => ({ ...p, isDragging: false })) as T[]);
        setDraggedPiece(null);
        
        // Increment move count
        setMoveCount(prev => prev + 1);
      }
    } else {
      // Select or deselect the piece
      if (draggedPiece?.id === piece.id) {
        // Deselect if clicking the same piece
        setPieces(pieces.map(p => ({ ...p, isDragging: false })) as T[]);
        setDraggedPiece(null);
      } else {
        // Select a new piece
        setDraggedPiece(piece);
        setPieces(pieces.map(p => 
          p.id === piece.id 
            ? { ...p, isDragging: true } 
            : { ...p, isDragging: false }
        ) as T[]);
      }
    }
  };
  
  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right', gridSize: number) => {
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

  const handleMove = (e: React.MouseEvent | React.TouchEvent, targetIndex: number) => {
    // Prevent default to avoid issues in dev panel
    if (e.preventDefault) e.preventDefault();
    // Provide visual feedback on hover
    if (draggedPiece && !isSolved) {
      // Optional: Add more hover effects or visual feedback here
    }
  };
  
  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove,
  };
};

// Helper for image piece style based on position
export const getImagePieceStyle = (piece: BasePuzzlePiece, selectedImage: string, gridSize: number): React.CSSProperties => {
  const pieceNumber = parseInt(piece.id.split('-')[1]);
  const row = Math.floor(pieceNumber / gridSize);
  const col = pieceNumber % gridSize;
  
  return {
    backgroundImage: `url(${selectedImage}?w=600&h=600&fit=crop&auto=format)`,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${col * 100 / (gridSize - 1)}% ${row * 100 / (gridSize - 1)}%`,
    opacity: piece.isDragging ? 0.8 : 1,
    transform: piece.isDragging ? 'scale(0.95)' : 'scale(1)',
  };
};

