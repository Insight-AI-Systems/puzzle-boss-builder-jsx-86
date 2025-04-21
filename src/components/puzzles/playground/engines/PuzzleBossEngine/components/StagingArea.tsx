
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
  if (stagedPieceIds.length === 0) return null;
  return (
    <div className="w-full mt-4 p-4 rounded-lg bg-muted/40 flex flex-wrap gap-2 justify-center">
      <div className="w-full text-xs mb-2 font-medium text-muted-foreground text-center uppercase tracking-widest">
        Staging Area ({stagedPieceIds.length} pieces)
      </div>
      {stagedPieceIds.map(id => {
        const piece = pieces[id];
        // Calculate SVG bg position, mimic main board (could extract as util)
        const row = Math.floor(piece.originalPosition / columns);
        const col = piece.originalPosition % columns;
        const bgStyle: React.CSSProperties = {
          width: pieceSize,
          height: pieceSize,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${columns * 100}% ${rows * 100}%`,
          backgroundPosition: `${col * 100 / (columns - 1)}% ${row * 100 / (rows - 1)}%`,
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
            onDragStart={() => onPieceDragStart(id)}
            title={`Piece #${id + 1}`}
          />
        );
      })}
    </div>
  );
};

export default StagingArea;
