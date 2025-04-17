
import React from 'react';
import { PuzzlePiece, difficultyConfig, DifficultyLevel } from '../types/puzzle-types';

interface PuzzleGridProps {
  pieces: PuzzlePiece[];
  difficulty: DifficultyLevel;
  isSolved: boolean;
  isLoading: boolean;
  containerSize: { width: number; height: number; pieceSize: number };
  onDragStart: (e: React.MouseEvent | React.TouchEvent, piece: PuzzlePiece) => void;
  onDrop: (e: React.MouseEvent | React.TouchEvent, index: number) => void;
  onPieceClick: (piece: PuzzlePiece) => void;
  getPieceStyle: (piece: PuzzlePiece) => React.CSSProperties;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  pieces,
  difficulty,
  isSolved,
  isLoading,
  containerSize,
  onDragStart,
  onDrop,
  onPieceClick,
  getPieceStyle
}) => {
  const gridSize = difficultyConfig[difficulty].gridSize;
  
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center bg-puzzle-black/60 rounded-lg border-2 border-puzzle-aqua animate-pulse"
        style={{ width: containerSize.width, height: containerSize.height }}
      >
        <p className="text-puzzle-aqua">Loading puzzle...</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`grid gap-1 bg-puzzle-black/60 p-2 rounded-lg border-2 
        ${isSolved ? 'border-puzzle-gold animate-pulse' : 'border-puzzle-aqua'}
        ${difficultyConfig[difficulty].containerClass}`}
      style={{ 
        width: containerSize.width, 
        height: containerSize.height 
      }}
    >
      {pieces.map((piece, index) => (
        <div 
          key={piece.id}
          onMouseDown={(e) => onDragStart(e, piece)}
          onTouchStart={(e) => onDragStart(e, piece)}
          onMouseUp={(e) => onDrop(e, index)}
          onTouchEnd={(e) => onDrop(e, index)}
          onClick={() => onPieceClick(piece)}
          className={`flex items-center justify-center rounded cursor-pointer shadow-md transition-all
            ${piece.isDragging ? 'ring-2 ring-white scale-95' : 'scale-100'}
            ${isSolved ? 'ring-1 ring-puzzle-gold/50' : ''}`}
          style={{ 
            ...getPieceStyle(piece),
            width: containerSize.pieceSize - 2,
            height: containerSize.pieceSize - 2,
          }}
        >
          {difficulty === '5x5' ? null : (
            <span className={`text-lg font-bold text-white drop-shadow-md bg-black/30 w-6 h-6 flex items-center justify-center rounded-full
              ${piece.isDragging ? 'scale-110' : ''}`}
            >
              {parseInt(piece.id.split('-')[1]) + 1}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PuzzleGrid;
