
import React from 'react';
import { PuzzlePiece as PuzzlePieceType } from '@/types/puzzle-types';
import PuzzlePiece from '@/components/PuzzlePiece';

interface StagingAreaProps {
  pieces: PuzzlePieceType[];
  rows: number;
  columns: number;
  containerWidth: number;
  containerHeight: number;
  imageUrl: string;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, position: number) => void;
}

export const StagingArea: React.FC<StagingAreaProps> = ({
  pieces,
  rows,
  columns,
  containerWidth,
  containerHeight,
  imageUrl,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div 
      className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 w-full overflow-x-auto"
      role="region"
      aria-label="Available puzzle pieces"
    >
      <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Available Pieces</h3>
      <div 
        className="flex flex-wrap gap-1 sm:gap-2 justify-center"
        role="list"
        aria-label="Unused puzzle pieces"
      >
        {pieces.map(piece => (
          <div 
            key={piece.id} 
            className="relative"
            role="listitem"
          >
            <PuzzlePiece
              piece={piece}
              rows={rows}
              columns={columns}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              imageUrl={imageUrl}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
