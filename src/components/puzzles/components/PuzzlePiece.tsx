
import React from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface PuzzlePieceProps {
  piece: SimplePuzzlePiece;
  index: number;
  isCorrectlyPlaced: boolean;
  isTrapped: boolean;
  isSolved: boolean;
  isTouchDevice: boolean;
  pieceSize: number;
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  onMove: (e: React.MouseEvent | React.TouchEvent) => void;
  onDrop: (e: React.MouseEvent | React.TouchEvent) => void;
  onClick: () => void;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  piece,
  index,
  isCorrectlyPlaced,
  isTrapped,
  isSolved,
  isTouchDevice,
  pieceSize,
  onDragStart,
  onMove,
  onDrop,
  onClick
}) => {
  const pieceNumber = parseInt(piece.id.split('-')[1]);

  const pieceClasses = [
    'puzzle-piece',
    'flex items-center justify-center rounded-lg cursor-pointer shadow-md transition-all',
    piece.isDragging ? 'puzzle-piece-dragging' : '',
    isCorrectlyPlaced ? 'puzzle-piece-correct' : '',
    (piece as any).showHint ? 'puzzle-piece-hint' : '',
    (piece as any).selected ? 'selected' : '',
    isTrapped ? 'trapped' : '',
    isSolved ? 'ring-1 ring-puzzle-gold/50' : '',
    isTouchDevice ? 'active:scale-105' : 'hover:brightness-110'
  ].filter(Boolean).join(' ');

  return (
    <div 
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      onMouseOver={onMove}
      onTouchMove={onMove}
      onMouseUp={onDrop}
      onTouchEnd={onDrop}
      onClick={onClick}
      className={pieceClasses}
      style={{ 
        backgroundColor: piece.color,
        opacity: piece.isDragging ? '0.8' : '1',
        width: pieceSize,
        height: pieceSize,
        position: 'relative',
        // Extreme z-index for trapped pieces to ensure they're always visible
        zIndex: isTrapped ? 50 : (piece.isDragging ? 30 : (isCorrectlyPlaced ? 1 : 10)),
        // Make trapped pieces visually distinct and impossible to miss
        transform: isTrapped ? 'scale(0.92) translateY(-12px)' : 'scale(1)',
        // Very noticeable visual treatment for trapped pieces
        boxShadow: isTrapped ? '0 0 0 3px #ff3333, 0 6px 10px rgba(0,0,0,0.4)' : ''
      }}
      data-correct={isCorrectlyPlaced ? 'true' : 'false'}
      data-piece-number={pieceNumber}
      data-piece-id={piece.id}
      data-position={piece.position}
      data-trapped={isTrapped ? 'true' : 'false'}
      aria-label={`Puzzle piece ${pieceNumber + 1}${isTrapped ? ', trapped under another piece' : ''}${isCorrectlyPlaced ? ', correctly placed' : ''}`}
    >
      <span className={`text-base sm:text-lg font-bold text-white drop-shadow-md 
        ${piece.isDragging ? 'scale-110' : ''}`}
      >
        {pieceNumber + 1}
      </span>
      {isTrapped && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-white bg-red-600 px-1 rounded animate-pulse">
            Trapped
          </span>
        </div>
      )}
    </div>
  );
};

export default React.memo(PuzzlePiece);
