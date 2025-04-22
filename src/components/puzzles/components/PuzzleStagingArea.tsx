
import React from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface PuzzleStagingAreaProps {
  stagingPieces: SimplePuzzlePiece[];
  onDragStart: (e: React.DragEvent, pieceId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const PuzzleStagingArea: React.FC<PuzzleStagingAreaProps> = ({
  stagingPieces,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  return (
    <div 
      className="staging-area mt-4 p-2 bg-gray-700 rounded-lg min-h-16 flex flex-wrap gap-2"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {stagingPieces.map(piece => (
        <div 
          key={`staging-${piece.id}`}
          className={`puzzle-piece flex items-center justify-center rounded-md ${
            piece.isDragging ? 'puzzle-piece-dragging opacity-50' : ''
          }`}
          style={{ 
            width: 60, 
            height: 60, 
            backgroundColor: piece.color,
            cursor: 'grab'
          }}
          draggable
          onDragStart={(e) => onDragStart(e, piece.id)}
          onDragEnd={onDragEnd}
        >
          {parseInt(piece.id.split('-')[1]) + 1}
        </div>
      ))}
      {stagingPieces.length === 0 && (
        <div className="text-gray-300 text-center py-2 w-full">
          All pieces are placed on the grid
        </div>
      )}
    </div>
  );
};

export default PuzzleStagingArea;
