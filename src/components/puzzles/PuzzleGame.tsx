
import React from 'react';
import { PuzzleProvider } from './PuzzleProvider';
import CustomPuzzleEngine from './playground/engines/CustomPuzzleEngine';

interface PuzzleGameProps {
  imageUrl: string;
  puzzleId?: string;
  rows?: number;
  columns?: number;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  imageUrl,
  puzzleId,
  rows = 3,
  columns = 4
}) => {
  return (
    <PuzzleProvider puzzleId={puzzleId}>
      <CustomPuzzleEngine
        imageUrl={imageUrl}
        rows={rows}
        columns={columns}
      />
    </PuzzleProvider>
  );
};

export default PuzzleGame;
