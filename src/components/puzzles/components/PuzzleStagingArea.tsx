
import React from 'react';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';

interface PuzzleStagingAreaProps {
  stagingPieces: SimplePuzzlePiece[];
  onDragStart: (e: React.DragEvent | React.MouseEvent | React.TouchEvent, pieceId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isTouchDevice: boolean;
  pieceSize?: number;
}

const PuzzleStagingArea: React.FC<PuzzleStagingAreaProps> = ({
  stagingPieces,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isTouchDevice,
  pieceSize = 60
}) => {
  if (stagingPieces.length === 0) {
    return (
      <div className="staging-area mt-4 p-2 bg-gray-700 rounded-lg min-h-[80px] flex items-center justify-center">
        <div className="text-gray-300 text-center py-2 w-full">
          All pieces are placed on the grid
        </div>
      </div>
    );
  }

  return (
    <div 
      className="staging-area mt-4 p-2 bg-gray-700 rounded-lg min-h-[80px] flex flex-wrap gap-2"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {stagingPieces.map(piece => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        
        return (
          <div 
            key={`staging-${piece.id}`}
            className={`puzzle-piece flex items-center justify-center rounded-md cursor-pointer
              ${piece.isDragging ? 'puzzle-piece-dragging opacity-50' : ''}
              ${isTouchDevice ? 'active:scale-105' : 'hover:brightness-110'}`
            }
            style={{ 
              width: pieceSize, 
              height: pieceSize, 
              backgroundColor: piece.color,
              cursor: 'grab'
            }}
            draggable={!isTouchDevice}
            onMouseDown={(e) => isTouchDevice && onDragStart(e, piece.id)}
            onTouchStart={(e) => isTouchDevice && onDragStart(e, piece.id)}
            onDragStart={(e) => !isTouchDevice && onDragStart(e, piece.id)}
            onDragEnd={onDragEnd}
          >
            <span className="text-base font-bold text-white drop-shadow-md">
              {pieceNumber + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PuzzleStagingArea;
