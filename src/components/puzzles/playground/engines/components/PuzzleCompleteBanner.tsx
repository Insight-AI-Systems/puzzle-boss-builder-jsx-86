
import React from "react";

interface PuzzleCompleteBannerProps {
  solveTime: number | null;
}

export const PuzzleCompleteBanner: React.FC<PuzzleCompleteBannerProps> = ({ solveTime }) =>
  solveTime !== null ? (
    <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-center">
      🎉 Puzzle completed in {solveTime.toFixed(2)} seconds!
    </div>
  ) : null;
