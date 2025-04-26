
import React from 'react';
import { PuzzleCard } from './PuzzleCard';
import type { Puzzle } from '@/hooks/puzzles/puzzleTypes';

interface PuzzleGridProps {
  puzzles: Puzzle[];
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({ puzzles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {puzzles.map((puzzle) => (
        <PuzzleCard key={puzzle.id} puzzle={puzzle} />
      ))}
    </div>
  );
};
