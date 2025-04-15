
import React, { memo, useCallback, useState, useEffect } from 'react';

/**
 * Interface for puzzle piece position coordinates
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Interface for puzzle piece data
 */
export interface PuzzlePiece {
  id: number;
  correctPosition: Position;
  currentPosition: Position;
}

/**
 * Props interface for the PuzzlePiece component
 */
interface PuzzlePieceProps {
  piece: PuzzlePiece;
  puzzleImage: string;
  gridSize: number;
  draggedPiece: PuzzlePiece | null;
  setDraggedPiece: (piece: PuzzlePiece | null) => void;
  playSound: (type: 'pick' | 'place' | 'success') => void;
  onDrop: (e: React.DragEvent) => void;
}

/**
 * PuzzlePiece component for rendering individual puzzle pieces
 * Memoized to prevent unnecessary re-renders when other pieces change
 */
const PuzzlePiece: React.FC<PuzzlePieceProps> = memo(({ 
  piece, 
  puzzleImage, 
  gridSize, 
  draggedPiece, 
  setDraggedPiece, 
  playSound, 
  onDrop 
}) => {
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [isCorrectlyPlaced, setIsCorrectlyPlaced] = useState(false);
  const [wasDropped, setWasDropped] = useState(false);
  
  // Check if piece is in correct position
  useEffect(() => {
    const isCorrect = 
      piece.currentPosition.row === piece.correctPosition.row && 
      piece.currentPosition.col === piece.correctPosition.col;
    
    setIsCorrectlyPlaced(isCorrect);
    
    // Reset dropped animation after it plays
    if (wasDropped) {
      const timer = setTimeout(() => setWasDropped(false), 600);
      return () => clearTimeout(timer);
    }
  }, [piece, wasDropped]);
  
  // Calculate positioning for puzzle pieces
  const pieceStyle: React.CSSProperties = {
    width: `${100 / gridSize}%`,
    height: `${100 / gridSize}%`,
    top: `${piece.currentPosition.row * (100 / gridSize)}%`,
    left: `${piece.currentPosition.col * (100 / gridSize)}%`,
    backgroundImage: `url(${puzzleImage})`,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${-(piece.correctPosition.col * 100) / gridSize}% ${-(piece.correctPosition.row * 100) / gridSize}%`,
    zIndex: isBeingDragged ? 10 : 1,
    boxShadow: isBeingDragged 
      ? '0 0 15px rgba(0, 255, 255, 0.7)' 
      : isCorrectlyPlaced 
        ? '0 0 5px rgba(255, 215, 0, 0.5) inset' 
        : 'none',
    transform: `scale(${isBeingDragged ? 1.05 : wasDropped ? 1.03 : 1})`,
    border: isCorrectlyPlaced ? '1px solid rgba(255, 215, 0, 0.3)' : 'none'
  };

  /**
   * Handles the start of a drag operation
   */
  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsBeingDragged(true);
    setDraggedPiece(piece);
    playSound('pick');
    
    // Set ghost drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    
    // Set drag effect and data
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('application/json', JSON.stringify({
        id: piece.id,
        row: piece.currentPosition.row,
        col: piece.currentPosition.col
      }));
    } catch (err) {
      console.log('Failed to set drag data:', err);
    }
  }, [piece, playSound, setDraggedPiece]);
  
  /**
   * Handles the end of a drag operation
   */
  const handleDragEnd = useCallback(() => {
    setIsBeingDragged(false);
    setWasDropped(true);
    
    // Reset dragged piece after short delay to allow for animations
    setTimeout(() => setDraggedPiece(null), 50);
  }, [setDraggedPiece]);
  
  // Handle the drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    onDrop(e);
    setWasDropped(true);
  }, [onDrop]);
  
  // Don't allow dropping on itself (will be handled by container)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      className={`
        absolute transition-all duration-200 cursor-move 
        hover:brightness-110 
        active:z-10
        ${isBeingDragged ? 'brightness-125 z-10' : ''}
        ${isCorrectlyPlaced ? 'brightness-105' : ''}
        ${wasDropped ? 'animate-scale-in' : ''}
      `}
      style={pieceStyle}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    />
  );
});

// Display name for debugging
PuzzlePiece.displayName = 'PuzzlePiece';

export default PuzzlePiece;
