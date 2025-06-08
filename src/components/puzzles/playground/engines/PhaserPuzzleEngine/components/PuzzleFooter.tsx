
import React from 'react';
import { AuthSection } from './AuthSection';
import LeaderboardSection from './LeaderboardSection';

interface PuzzleFooterProps {
  puzzleId: string;
}

const PuzzleFooter: React.FC<PuzzleFooterProps> = ({ puzzleId }) => {
  return (
    <div className="phaser-puzzle-footer mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AuthSection />
        </div>
        <div className="md:col-span-1">
          <LeaderboardSection puzzleId={puzzleId} />
        </div>
      </div>
    </div>
  );
};

export default PuzzleFooter;
