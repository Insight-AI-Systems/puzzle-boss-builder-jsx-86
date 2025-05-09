
import React from 'react';
import { usePuzzleCount } from './usePuzzleCount';

interface PlayablePuzzleCountCellProps {
  categoryId: string;
}

export const PlayablePuzzleCountCell: React.FC<PlayablePuzzleCountCellProps> = ({ categoryId }) => {
  const { data, isLoading, isError } = usePuzzleCount(categoryId);
  
  if (isLoading) return <span>Loading…</span>;
  if (isError) return <span>—</span>;
  
  // Add a class to highlight when there are puzzles
  const hasPuzzles = data > 0;
  
  // For debugging
  console.log(`PlayablePuzzleCountCell for category ${categoryId}: count=${data}`);
  
  return (
    <span className={hasPuzzles ? "font-medium text-amber-600" : ""}>
      {data}
    </span>
  );
};
