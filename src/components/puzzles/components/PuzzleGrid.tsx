
import React from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface PuzzleGridProps {
  grid: (number | null)[];
  pieces: SimplePuzzlePiece[];
  columns: number;
  isSolved: boolean;
  onDragStart: (e: React.DragEvent, pieceId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, cellIndex: number) => void;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  grid,
  pieces,
  columns,
  isSolved,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  return (
    <div 
      className={`grid-container p-2 bg-gray-800 rounded-lg border-2 ${
        isSolved ? 'border-yellow-500' : 'border-blue-500'
      }`}
      style={{ width: columns * 70 + (columns * 4) }}
    >
      <div 
        className="puzzle-grid grid gap-1"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {grid.map((pieceId, cellIndex) => {
          const piece = pieceId !== null 
            ? pieces.find(p => parseInt(p.id.split('-')[1]) === pieceId) 
            : null;
          
          const isCorrect = piece 
            ? parseInt(piece.id.split('-')[1]) === cellIndex 
            : false;
          
          return (
            <div 
              key={`cell-${cellIndex}`}
              className={`puzzle-cell flex items-center justify-center ${
                piece ? 'occupied' : 'empty'
              } ${isCorrect ? 'correct' : ''}`}
              style={{ 
                width: 70,
                height: 70,
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
              onDrop={(e) => onDrop(e, cellIndex)}
              onDragOver={onDragOver}
            >
              {piece && (
                <div 
                  className={`puzzle-piece flex items-center justify-center rounded-md ${
                    isCorrect ? 'puzzle-piece-correct' : ''
                  } ${piece.isDragging ? 'puzzle-piece-dragging' : ''}`}
                  style={{ 
                    width: 60, 
                    height: 60, 
                    backgroundColor: piece.color,
                    cursor: isCorrect ? 'default' : 'grab'
                  }}
                  draggable={!isCorrect}
                  onDragStart={(e) => onDragStart(e, piece.id)}
                  onDragEnd={onDragEnd}
                >
                  {parseInt(piece.id.split('-')[1]) + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PuzzleGrid;
