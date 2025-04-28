
import React from 'react';
import { PuzzlePiece } from './PuzzlePiece';
import { type PuzzlePiece as PuzzlePieceType } from '../hooks/usePuzzleState';

interface StagingAreaProps {
  stagingPieces: PuzzlePieceType[];
  imageUrl: string;
  rows: number;
  columns: number;
  onPieceDragStart: (id: number) => void;
  onPieceDragEnd: () => void;
  onPieceDoubleClick: (id: number, position: number) => void;
  showNumbers: boolean;
  cellWidth: number;
  cellHeight: number;
}

export const StagingArea: React.FC<StagingAreaProps> = ({
  stagingPieces,
  imageUrl,
  rows,
  columns,
  onPieceDragStart,
  onPieceDragEnd,
  onPieceDoubleClick,
  showNumbers,
  cellWidth,
  cellHeight
}) => {
  // If no pieces in staging area, don't render
  if (stagingPieces.length === 0) {
    return null;
  }

  // Calculate grid layout for staging area
  const gridColumns = Math.min(6, stagingPieces.length); // Max 6 pieces per row
  const pieceWidth = Math.min(cellWidth, 80); // Limit max size for better appearance
  const pieceHeight = (pieceWidth / cellWidth) * cellHeight; // Keep aspect ratio

  return (
    <div className="staging-area mt-6 p-4 border border-border rounded-lg bg-muted/10">
      <h3 className="text-sm font-medium mb-3">Available Pieces</h3>
      <div 
        className="staging-grid flex flex-wrap gap-2 justify-center"
        style={{ maxWidth: `${gridColumns * (pieceWidth + 8)}px` }}
      >
        {stagingPieces.map(piece => (
          <div key={`staging-${piece.id}`} className="staging-cell p-1">
            <PuzzlePiece
              piece={piece}
              imageUrl={imageUrl}
              rows={rows}
              columns={columns}
              isCorrect={false}
              isDragging={false}
              onDragStart={() => onPieceDragStart(piece.id)}
              onTouchStart={() => onPieceDragStart(piece.id)}
              onDragEnd={onPieceDragEnd}
              onDoubleClick={() => {
                // Find the first available board position
                const firstEmptyPosition = 0; // This would typically come from a function to find the first empty slot
                onPieceDoubleClick(piece.id, firstEmptyPosition);
              }}
              showNumber={showNumbers}
              width={pieceWidth}
              height={pieceHeight}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
