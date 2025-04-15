
import React, { memo, useCallback } from 'react';

/**
 * Interface for puzzle piece position coordinates
 */
interface Position {
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
  setDraggedPiece, 
  playSound, 
  onDrop 
}) => {
  // Calculate positioning for puzzle pieces
  const pieceStyle: React.CSSProperties = {
    width: `${100 / gridSize}%`,
    height: `${100 / gridSize}%`,
    top: `${piece.currentPosition.row * (100 / gridSize)}%`,
    left: `${piece.currentPosition.col * (100 / gridSize)}%`,
    backgroundImage: `url(${puzzleImage})`,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${-(piece.correctPosition.col * 100) / gridSize}% ${-(piece.correctPosition.row * 100) / gridSize}%`
  };

  /**
   * Handles the start of a drag operation
   */
  const handleDragStart = useCallback((e: React.DragEvent) => {
    setDraggedPiece(piece);
    playSound('pick');
    
    // Set ghost drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  }, [piece, playSound, setDraggedPiece]);

  return (
    <div
      className="absolute transition-all duration-200 cursor-move hover:brightness-110 hover:scale-[1.02] active:scale-105 active:z-10"
      style={pieceStyle}
      draggable
      onDragStart={handleDragStart}
      onDrop={onDrop}
    />
  );
});

// Display name for debugging
PuzzlePiece.displayName = 'PuzzlePiece';

export default PuzzlePiece;
