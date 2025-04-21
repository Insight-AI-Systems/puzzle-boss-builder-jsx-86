
import React from 'react';
import { AssemblyPiece } from '../utils/puzzleStateUtils';
import { getPieceStyle } from '../utils/pieceStyles';

interface AssemblyAreaProps {
  placedPieces: (AssemblyPiece | null)[];
  rows: number;
  columns: number;
  imageUrl: string;
  onPieceDrop: (pieceId: number, targetIdx: number) => void;
  onPieceRemove: (pieceIdx: number) => void;
  pieceSize: number;
}

const AssemblyArea: React.FC<AssemblyAreaProps> = ({
  placedPieces,
  rows,
  columns,
  imageUrl,
  onPieceDrop,
  onPieceRemove,
  pieceSize = 64
}) => {
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
      {placedPieces.map((entry, idx) => (
        <div
          key={idx}
          className={`relative w-16 h-16 rounded transition-all duration-150 flex items-center justify-center
            ${
              !entry
                ? "border border-dashed border-black/20 bg-transparent opacity-80"
                : entry.isLocked
                  ? "border border-solid border-green-400 ring-2 ring-green-200"
                  : "border border-solid border-black/30 bg-white"
            }`}
          onDragOver={e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={e => {
            const dropId = Number(e.dataTransfer.getData("piece-id"));
            if (!placedPieces[idx]) {
              onPieceDrop(dropId, idx);
            }
          }}
        >
          {entry && (
            <div
              draggable={!entry.isLocked}
              onDragStart={e => {
                if (entry.isLocked) return;
                e.dataTransfer.setData("from-assembly", "true");
                e.dataTransfer.setData("piece-id", entry.id.toString());
              }}
              className="absolute inset-0"
              style={{
                ...getPieceStyle(entry.id, imageUrl, rows, columns, pieceSize),
                opacity: entry.isLocked ? 1 : 0.93,
                cursor: entry.isLocked ? "default" : "grab",
                pointerEvents: entry.isLocked ? "none" : "auto"
              }}
              onDoubleClick={() => onPieceRemove(idx)}
              title={
                entry.isLocked
                  ? "Piece locked in correct position"
                  : "Double click to return to staging area"
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AssemblyArea;
