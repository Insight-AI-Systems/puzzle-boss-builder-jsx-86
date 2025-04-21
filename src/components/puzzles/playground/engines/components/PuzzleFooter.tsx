
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { PuzzleCompleteBanner } from './PuzzleCompleteBanner';

interface PuzzleFooterProps {
  solveTime: number | null;
  showBorder: boolean;
  rows: number;
  columns: number;
}

export const PuzzleFooter: React.FC<PuzzleFooterProps> = ({
  solveTime, showBorder, rows, columns
}) => (
  <>
    <PuzzleCompleteBanner solveTime={solveTime} />
    <div className="mt-4 text-sm text-muted-foreground">
      <p className="font-medium flex items-center gap-1">
        <ImageIcon className="h-4 w-4" />
        {showBorder ? 'Border enabled' : 'Border disabled'}
      </p>
      <p className="font-medium">Engine: React Jigsaw Puzzle (External)</p>
      <p className="text-xs">Difficulty: {rows}x{columns}</p>
    </div>
  </>
);
