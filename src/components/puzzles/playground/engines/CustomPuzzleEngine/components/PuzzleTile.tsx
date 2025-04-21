
import React from 'react';
import { PuzzlePiece } from '../hooks/usePuzzleState';

interface PuzzleTileProps {
  piece: PuzzlePiece;
  imageUrl: string;
  rows: number;
  columns: number;
  isCorrect: boolean;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export const PuzzleTile: React.FC<PuzzleTileProps> = React.memo(({
  piece,
  imageUrl,
  rows,
  columns,
  isCorrect,
  isDragging,
  onDragStart,
  onDragEnd
}) => {
  // Calculate background position based on original position
  const calculateBackgroundPosition = () => {
    const row = Math.floor(piece.originalPosition / columns);
    const col = piece.originalPosition % columns;
    
    const xPercent = (col / (columns - 1)) * 100;
    const yPercent = (row / (rows - 1)) * 100;
    
    return `${xPercent}% ${yPercent}%`;
  };
  
  // Set up tile style
  const tileStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: calculateBackgroundPosition(),
    cursor: 'grab',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: isDragging 
      ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
      : '0 2px 5px rgba(0, 0, 0, 0.2)',
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    border: isCorrect ? '1px solid rgba(0, 255, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
  };
  
  return (
    <div
      className={`puzzle-tile ${isCorrect ? 'correct' : ''} ${isDragging ? 'dragging' : ''}`}
      style={tileStyle}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-piece-id={piece.id}
    />
  );
});

PuzzleTile.displayName = 'PuzzleTile';
