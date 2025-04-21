
import React from 'react';
import { PuzzlePiece } from '../types/puzzleTypes';

interface StagingAreaProps {
  pieces: PuzzlePiece[];
  stagedPieceIds: number[];
  imageUrl: string;
  rows: number;
  columns: number;
  onPieceDragStart: (pieceId: number) => void;
}

const StagingArea: React.FC<StagingAreaProps> = ({
  pieces,
  stagedPieceIds,
  imageUrl,
  rows,
  columns,
  onPieceDragStart
}) => {
  const pieceSize = 64;
  
  // Function to calculate background position for a piece
  const getBackgroundPosition = (pieceId: number) => {
    // Critical: Use the original pieceId to determine its position in the image
    const row = Math.floor(pieceId / columns);
    const col = pieceId % columns;
    const xPercent = (col * 100) / (columns - 1);
    const yPercent = (row * 100) / (rows - 1);
    return `${xPercent}% ${yPercent}%`;
  };
  
  if (stagedPieceIds.length === 0) return null;
  return (
    <div className="w-full mt-4 p-4 rounded-lg bg-muted/40 flex flex-wrap gap-2 justify-center">
      <div className="w-full text-xs mb-2 font-medium text-muted-foreground text-center uppercase tracking-widest">
        Staging Area ({stagedPieceIds.length} pieces)
      </div>
      {stagedPieceIds.map(id => {
        // Calculate background position based on the piece's original id
        const bgStyle: React.CSSProperties = {
          width: pieceSize,
          height: pieceSize,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${columns * 100}% ${rows * 100}%`,
          backgroundPosition: getBackgroundPosition(id),
          border: '1px solid #CBD5E1',
          borderRadius: 8,
          cursor: 'grab'
        };
        return (
          <div
            key={id}
            className="staging-piece"
            style={bgStyle}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("staging-piece-id", id.toString());
              onPieceDragStart(id);
            }}
            title={`Piece #${id + 1}`}
          />
        );
      })}
    </div>
  );
};

export default StagingArea;
