
import React from "react";
import { getPieceStyle } from "./utils/pieceStyles";

type StagingAreaProps = {
  stagedPieces: number[];
  imageUrl: string;
  rows: number;
  columns: number;
  onPieceDragStart: (pieceId: number) => (e: React.DragEvent<HTMLDivElement>) => void;
  onPieceDoubleClick: (pieceId: number) => void;
};

const StagingArea: React.FC<StagingAreaProps> = ({
  stagedPieces,
  imageUrl,
  rows,
  columns,
  onPieceDragStart,
  onPieceDoubleClick,
}) => {
  if (stagedPieces.length === 0) return null;
  
  const pieceSize = 64; // Standard size for staging area
  
  return (
    <div className="w-full max-w-xl mt-6 p-4 border rounded bg-muted/30 flex flex-wrap gap-2 justify-center">
      <div className="w-full text-xs mb-2 font-medium text-muted-foreground text-center uppercase tracking-widest">
        Staging Area ({stagedPieces.length} pieces)
      </div>
      {stagedPieces.map(pieceId => (
        <div
          key={pieceId}
          className="puzzle-staged-piece"
          style={getPieceStyle(pieceId, imageUrl, rows, columns, pieceSize)}
          draggable
          onDragStart={onPieceDragStart(pieceId)}
          onDoubleClick={() => onPieceDoubleClick(pieceId)}
          title="Drag into puzzle grid, or double click to auto-place"
          tabIndex={0}
        />
      ))}
    </div>
  );
};

export default StagingArea;
