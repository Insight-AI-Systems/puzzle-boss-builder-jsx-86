
import React from 'react';

const PuzzleHeader: React.FC = () => {
  return (
    <div className="phaser-puzzle-header mb-4">
      <h2 className="text-xl font-semibold">Phaser Jigsaw Puzzle</h2>
      <p className="text-sm text-muted-foreground">
        Traditional jigsaw puzzle with interlocking pieces
      </p>
    </div>
  );
};

export default PuzzleHeader;
