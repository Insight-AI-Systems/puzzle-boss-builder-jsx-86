
import React from 'react';
import { usePuzzleCount } from './usePuzzleCount';

interface PlayablePuzzleCountCellProps {
  categoryId: string;
}

export const PlayablePuzzleCountCell: React.FC<PlayablePuzzleCountCellProps> = ({ categoryId }) => {
  const { data, isLoading, isError } = usePuzzleCount(categoryId);
  
  if (isLoading) return <span>Loading…</span>;
  if (isError) return <span>—</span>;
  return <span>{data}</span>;
};
