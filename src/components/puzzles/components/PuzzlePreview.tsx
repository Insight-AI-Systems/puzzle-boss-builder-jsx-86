
import React from 'react';
import PuzzleGame from '@/components/puzzles/PuzzleGame';

interface PuzzlePreviewProps {
  imageUrl: string;
  difficulty: string;
}

export const PuzzlePreview: React.FC<PuzzlePreviewProps> = ({ imageUrl, difficulty }) => {
  const rows = { easy: 3, medium: 4, hard: 5 }[difficulty] || 4;
  const columns = rows;

  return (
    <div className="relative border rounded-lg p-2 bg-background aspect-square w-[256px] h-[256px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <PuzzleGame
          imageUrl={imageUrl}
          rows={rows}
          columns={columns}
          puzzleId={`preview-${imageUrl}`}
        />
      </div>
      <span className="absolute left-1 top-1 text-xs rounded px-2 py-0.5 bg-black/60 text-puzzle-aqua z-10">Preview</span>
    </div>
  );
};

export default PuzzlePreview;
