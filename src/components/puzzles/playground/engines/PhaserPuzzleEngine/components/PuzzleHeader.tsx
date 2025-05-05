
import React from 'react';

const PuzzleHeader: React.FC = () => {
  return (
    <div className="phaser-puzzle-header">
      <h2 className="text-xl font-bold mb-1">Play Puzzle</h2>
      <p className="text-muted-foreground mb-4">
        Race against the clock to solve puzzles and climb the leaderboard!
      </p>
    </div>
  );
};

export default PuzzleHeader;
