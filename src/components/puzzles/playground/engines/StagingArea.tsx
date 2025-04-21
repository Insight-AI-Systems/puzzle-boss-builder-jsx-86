
import React from "react";

type StagingAreaProps = {
  stagedPieces: { id: number }[];
};

const StagingArea: React.FC<StagingAreaProps> = ({ stagedPieces }) => {
  if (stagedPieces.length === 0) return null;
  return (
    <div className="w-full max-w-xl mt-6 p-4 border rounded bg-muted/30 flex flex-wrap gap-2 justify-center">
      <div className="w-full text-xs mb-2 font-medium text-muted-foreground text-center uppercase tracking-widest">
        Staging Area ({stagedPieces.length} pieces)
      </div>
      {stagedPieces.map((piece) => (
        <div
          key={piece.id}
          className="w-8 h-8 bg-background/60 rounded shadow border flex items-center justify-center font-bold text-lg"
        >
          {piece.id + 1}
        </div>
      ))}
    </div>
  );
};

export default StagingArea;
