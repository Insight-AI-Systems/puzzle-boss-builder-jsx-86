
import React from "react";

type StagingAreaProps = {
  stagedPieces: number[];
  imageUrl: string;
  rows: number;
  columns: number;
  onPieceDragStart: (pieceId: number) => (e: React.DragEvent<HTMLDivElement>) => void;
  onPieceDoubleClick: (pieceId: number) => void;
};

// Util: create correct cropped puzzle piece style for a staged piece
function getPieceStyle(
  id: number,
  imageUrl: string,
  rows: number,
  columns: number
): React.CSSProperties {
  const row = Math.floor(id / columns);
  const col = id % columns;
  return {
    width: 64,
    height: 64,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${(col * 100) / (columns - 1)}% ${(row * 100) / (rows - 1)}%`,
    backgroundRepeat: "no-repeat",
    borderRadius: "0.4rem",
    border: "1px solid rgba(0,0,0,0.09)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.16s",
    cursor: "grab",
    userSelect: "none",
    backgroundColor: "#fff"
  };
}

const StagingArea: React.FC<StagingAreaProps> = ({
  stagedPieces,
  imageUrl,
  rows,
  columns,
  onPieceDragStart,
  onPieceDoubleClick,
}) => {
  if (stagedPieces.length === 0) return null;
  return (
    <div className="w-full max-w-xl mt-6 p-4 border rounded bg-muted/30 flex flex-wrap gap-2 justify-center">
      <div className="w-full text-xs mb-2 font-medium text-muted-foreground text-center uppercase tracking-widest">
        Staging Area ({stagedPieces.length} pieces)
      </div>
      {stagedPieces.map(pieceId => (
        <div
          key={pieceId}
          className="puzzle-staged-piece"
          style={getPieceStyle(pieceId, imageUrl, rows, columns)}
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
