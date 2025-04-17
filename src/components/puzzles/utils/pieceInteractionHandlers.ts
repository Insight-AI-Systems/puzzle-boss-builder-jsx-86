
import { BasePuzzlePiece } from '../types/puzzle-types';
import React from 'react';
import { PuzzleSoundType } from './useSoundEffects';

export const createPieceHandlers = <T extends BasePuzzlePiece>(
  pieces: T[],
  setPieces: React.Dispatch<React.SetStateAction<T[]>>,
  draggedPiece: T | null,
  setDraggedPiece: React.Dispatch<React.SetStateAction<T | null>>,
  setMoveCount: React.Dispatch<React.SetStateAction<number>>,
  isSolved: boolean,
  playSound?: (sound: PuzzleSoundType) => void
) => {
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, piece: T) => {
    if (isSolved) return;
    
    // Prevent default to avoid issues in dev panel
    if (e.preventDefault) e.preventDefault();
    console.log('Drag start:', piece.id);
    setDraggedPiece(piece);
    
    // Play pickup sound
    playSound?.('pickup');
    
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
      
      // Check if the piece is in the correct position for sound effect
      const pieceNumber = parseInt(draggedPiece.id.split('-')[1]);
      const isCorrectPlacement = pieceNumber === targetIndex;
      
      // Play appropriate sound
      if (isCorrectPlacement) {
        playSound?.('correct');
      } else {
        playSound?.('place');
      }
      
      // Reset dragging state
      setPieces(newPieces.map(p => ({ 
        ...p, 
        isDragging: false,
        // Add correctlyPlaced for animation
        correctlyPlaced: isCorrectPlacement && p.id === draggedPiece.id 
          ? true 
          : (p as any).correctlyPlaced 
      })) as T[]);
      
      setDraggedPiece(null);
      
      // Increment move count
      setMoveCount(prev => prev + 1);
      
      // Clear the correctlyPlaced flag after animation
      if (isCorrectPlacement) {
        setTimeout(() => {
          setPieces(currentPieces => 
            currentPieces.map(p => ({ ...p, correctlyPlaced: false })) as T[]
          );
        }, 600);
      }
    } else {
      // Reset dragging state without counting as a move
      setPieces(prev => prev.map(p => ({ ...p, isDragging: false })) as T[]);
      setDraggedPiece(null);
      
      // Play placement sound even when dropping in the same spot
      playSound?.('place');
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
        
        // Check if the piece is in the correct position for sound effect
        const pieceNumber = parseInt(draggedPiece.id.split('-')[1]);
        const isCorrectPlacement = pieceNumber === targetIndex;
        
        // Play appropriate sound
        if (isCorrectPlacement) {
          playSound?.('correct');
        } else {
          playSound?.('place');
        }
        
        // Reset dragging state
        setPieces(newPieces.map(p => ({ 
          ...p, 
          isDragging: false,
          // Add correctlyPlaced for animation
          correctlyPlaced: isCorrectPlacement && p.id === draggedPiece.id 
            ? true 
            : (p as any).correctlyPlaced 
        })) as T[]);
        
        setDraggedPiece(null);
        
        // Increment move count
        setMoveCount(prev => prev + 1);
        
        // Clear the correctlyPlaced flag after animation
        if (isCorrectPlacement) {
          setTimeout(() => {
            setPieces(currentPieces => 
              currentPieces.map(p => ({ ...p, correctlyPlaced: false })) as T[]
            );
          }, 600);
        }
      }
    } else {
      // Select or deselect the piece
      if (draggedPiece?.id === piece.id) {
        // Deselect if clicking the same piece
        setPieces(pieces.map(p => ({ ...p, isDragging: false })) as T[]);
        setDraggedPiece(null);
        
        // Play placement sound when deselecting
        playSound?.('place');
      } else {
        // Select a new piece
        setDraggedPiece(piece);
        setPieces(pieces.map(p => 
          p.id === piece.id 
            ? { ...p, isDragging: true } 
            : { ...p, isDragging: false }
        ) as T[]);
        
        // Play pickup sound
        playSound?.('pickup');
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
  
  // New function to check for and highlight hints for nearby correct pieces
  const checkForHints = () => {
    if (isSolved || !pieces.length) return;
    
    // Find pieces that are one position away from their correct position
    const hintsToShow = pieces.filter(piece => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      const currentPosition = piece.position;
      
      // Check if piece is one position away horizontally or vertically
      const pieceRow = Math.floor(pieceNumber / Math.sqrt(pieces.length));
      const pieceCol = pieceNumber % Math.sqrt(pieces.length);
      const currentRow = Math.floor(currentPosition / Math.sqrt(pieces.length));
      const currentCol = currentPosition % Math.sqrt(pieces.length);
      
      const isOneAway = (
        (Math.abs(pieceRow - currentRow) === 1 && pieceCol === currentCol) ||
        (Math.abs(pieceCol - currentCol) === 1 && pieceRow === currentRow)
      );
      
      return isOneAway;
    });
    
    // Apply hints to pieces
    if (hintsToShow.length > 0) {
      setPieces(prev => prev.map(p => {
        const shouldHint = hintsToShow.some(hint => hint.id === p.id);
        return {
          ...p,
          showHint: shouldHint && Math.random() > 0.7 // Only show some hints randomly
        } as T;
      }));
      
      // Clear hints after a short time
      setTimeout(() => {
        setPieces(prev => prev.map(p => ({ ...p, showHint: false })) as T);
      }, 1000);
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

// Helper for image piece style based on position
export const getImagePieceStyle = (piece: BasePuzzlePiece & { correctlyPlaced?: boolean, showHint?: boolean }, selectedImage: string, gridSize: number): React.CSSProperties => {
  const pieceNumber = parseInt(piece.id.split('-')[1]);
  const row = Math.floor(pieceNumber / gridSize);
  const col = pieceNumber % gridSize;
  
  return {
    backgroundImage: `url(${selectedImage}?w=600&h=600&fit=crop&auto=format)`,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${col * 100 / (gridSize - 1)}% ${row * 100 / (gridSize - 1)}%`,
    opacity: piece.isDragging ? 0.8 : 1,
    transform: piece.isDragging ? 'scale(0.95)' : 'scale(1)',
    animation: piece.correctlyPlaced ? 'correctPlacement 0.5s ease-out' : 
               (piece.showHint ? 'hintPulse 1s ease-in-out infinite' : 'none'),
  };
};
