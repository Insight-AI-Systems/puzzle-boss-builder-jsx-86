
import React from 'react';
import { PuzzlePiece } from '../types/puzzleTypes';

interface AssemblyAreaProps {
  pieces: PuzzlePiece[];
  assembly: (number | null)[];
  imageUrl: string;
  rows: number;
  columns: number;
  onPieceDrop: (pieceId: number, targetIdx: number) => void;
  onPieceRemove: (pieceIdx: number) => void;
}

const AssemblyArea: React.FC<AssemblyAreaProps> = ({
  pieces,
  assembly,
  imageUrl,
  rows,
  columns,
  onPieceDrop,
  onPieceRemove
}) => {
  const pieceSize = 64;
  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${pieceSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pieceSize}px)`,
        minHeight: rows * pieceSize,
        minWidth: columns * pieceSize
      }}
    >
      {assembly.map((pieceId, idx) => (
        <div
          key={idx}
          className="relative w-full h-full bg-white/70 rounded
            border border-solid border-black/15 transition-all duration-150 flex items-center justify-center"
          style={{
            width: `${pieceSize}px`,
            height: `${pieceSize}px`
          }}
          onDragOver={e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={e => {
            e.preventDefault();
            const str = e.dataTransfer.getData("staging-piece-id");
            const stagedPieceId = Number(str);
            if (!isNaN(stagedPieceId)) {
              onPieceDrop(stagedPieceId, idx);
            }
          }}
        >
          {pieceId !== null && (
            <div
              className="absolute inset-0"
              style={{
                width: `${pieceSize}px`,
                height: `${pieceSize}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${columns * 100}% ${rows * 100}%`,
                backgroundPosition: (() => {
                  // This is the key fix - we need to use the actual pieceId to determine the position
                  // not the original position of the same piece from its array index
                  const row = Math.floor(pieceId / columns);
                  const col = pieceId % columns;
                  return `${col * 100 / (columns - 1)}% ${row * 100 / (rows - 1)}%`;
                })(),
                opacity: 1,
                cursor: 'pointer'
              }}
              draggable={false}
              onDoubleClick={() => onPieceRemove(idx)}
              title="Double click to return to staging"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AssemblyArea;
