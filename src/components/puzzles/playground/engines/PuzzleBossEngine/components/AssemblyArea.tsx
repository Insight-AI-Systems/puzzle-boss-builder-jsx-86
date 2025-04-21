
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
      {assembly.map((pieceId, idx) => {
        // Check if this piece is in the correct position 
        const isCorrectPosition = pieceId === idx;
        
        return (
          <div
            key={idx}
            className={`relative w-full h-full bg-white/70 rounded
              border border-solid ${isCorrectPosition ? 'border-green-400' : 'border-black/15'} transition-all duration-150 flex items-center justify-center`}
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
              
              // Also handle drag from another assembly position
              const fromAssemblyStr = e.dataTransfer.getData("assembly-piece-id");
              const fromAssemblyId = Number(fromAssemblyStr);
              if (!isNaN(fromAssemblyId)) {
                // Handle internal assembly movement
                const fromPositionStr = e.dataTransfer.getData("assembly-position");
                const fromPosition = Number(fromPositionStr);
                if (!isNaN(fromPosition)) {
                  // Remove from old position
                  onPieceRemove(fromPosition);
                  // Place in new position
                  onPieceDrop(fromAssemblyId, idx);
                }
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
                  cursor: isCorrectPosition ? 'default' : 'grab'
                }}
                draggable={!isCorrectPosition}
                onDragStart={(e) => {
                  if (isCorrectPosition) return; // Prevent dragging if in correct position
                  e.dataTransfer.setData("assembly-piece-id", pieceId.toString());
                  e.dataTransfer.setData("assembly-position", idx.toString());
                }}
                onDoubleClick={() => !isCorrectPosition && onPieceRemove(idx)}
                title={isCorrectPosition ? "Piece in correct position" : "Double click to return to staging or drag to reposition"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AssemblyArea;
