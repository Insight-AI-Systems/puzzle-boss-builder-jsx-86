
import React from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface SimplePuzzleGridProps {
  pieces: SimplePuzzlePiece[];
  isSolved: boolean;
  isMobile: boolean;
  onDragStart: (e: React.MouseEvent | React.TouchEvent, piece: SimplePuzzlePiece) => void;
  onMove: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
  onDrop: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
  onPieceClick: (piece: SimplePuzzlePiece) => void;
}

const SimplePuzzleGrid: React.FC<SimplePuzzleGridProps> = ({
  pieces,
  isSolved,
  isMobile,
  onDragStart,
  onMove,
  onDrop,
  onPieceClick
}) => {
  return (
    <div 
      className={`grid grid-cols-3 gap-2 bg-puzzle-black/60 p-4 rounded-lg border-2 
        ${isSolved ? 'border-puzzle-gold animate-pulse' : 'border-puzzle-aqua'}
        ${isMobile ? 'w-[300px] h-[300px]' : 'w-[360px] h-[360px]'}`}
    >
      {pieces.map((piece, index) => (
        <div 
          key={piece.id}
          onMouseDown={(e) => onDragStart(e, piece)}
          onTouchStart={(e) => onDragStart(e, piece)}
          onMouseOver={(e) => onMove(e, index)}
          onMouseUp={(e) => onDrop(e, index)}
          onTouchEnd={(e) => onDrop(e, index)}
          onClick={() => onPieceClick(piece)}
          className={`flex items-center justify-center rounded-lg cursor-pointer shadow-md transition-all
            ${piece.isDragging ? 'ring-2 ring-white scale-95' : 'scale-100'}
            ${isSolved ? 'ring-1 ring-puzzle-gold/50' : ''}`}
          style={{ 
            backgroundColor: piece.color,
            opacity: piece.isDragging ? '0.8' : '1',
            width: '100%',
            height: '100%',
            transform: `${piece.isDragging ? 'scale(0.95)' : 'scale(1)'}`,
          }}
        >
          <span className={`text-lg font-bold text-white drop-shadow-md ${piece.isDragging ? 'scale-110' : ''}`}>
            {parseInt(piece.id.split('-')[1]) + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SimplePuzzleGrid;
