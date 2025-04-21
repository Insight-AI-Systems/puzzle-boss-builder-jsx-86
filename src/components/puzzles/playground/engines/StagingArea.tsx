
import React from "react";

type StagingAreaProps = {
  stagedPieces: { id: number }[];
  imageUrl: string;
  rows: number;
  columns: number;
};

function getPieceStyle(
  id: number,
  imageUrl: string,
  rows: number,
  columns: number
): React.CSSProperties {
  // Calculate the grid position
  const row = Math.floor(id / columns);
  const col = id % columns;
  // Size percentage for each piece
  const widthPercent = 100 / columns;
  const heightPercent = 100 / rows;
  return {
    width: 64, // px, can be customized
    height: 64,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${(col * widthPercent)}% ${(row * heightPercent)}%`,
    backgroundRepeat: "no-repeat",
    borderRadius: "0.4rem",
    border: "1px solid rgba(0,0,0,0.09)", 
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.16s",
    cursor: "grab",
  };
}

const StagingArea: React.FC<StagingAreaProps> = ({
  stagedPieces,
  imageUrl,
  rows,
  columns
}) => {
  if (stagedPieces.length === 0) return null;
  return (
    <div className="w-full max-w-xl mt-6 p-4 border rounded bg-muted/30 flex flex-wrap gap-2 justify-center">
      <div className="w-full text-xs mb-2 font-medium text-muted-foreground text-center uppercase tracking-widest">
        Staging Area ({stagedPieces.length} pieces)
      </div>
      {stagedPieces.map((piece) => (
        <div
          key={piece.id}
          className="puzzle-staged-piece"
          style={getPieceStyle(piece.id, imageUrl, rows, columns)}
          draggable
        />
      ))}
    </div>
  );
};

export default StagingArea;

