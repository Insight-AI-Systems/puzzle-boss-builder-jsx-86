
import React from 'react';

interface PuzzleHeaderProps {
  timer: string;
  moveCount: number;
  isActive: boolean;
}

const PuzzleHeader: React.FC<PuzzleHeaderProps> = ({ timer, moveCount, isActive }) => {
  return (
    <div className="phaser-puzzle-header p-4 bg-card rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-lg font-semibold">Phaser Jigsaw Puzzle</div>
        <div className="text-sm text-muted-foreground">
          {isActive ? 'Game in progress' : 'Ready to play'}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-md">
          <span className="font-mono">{timer}</span>
        </div>
        
        <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-md">
          Moves: {moveCount}
        </div>
      </div>
    </div>
  );
};

export default PuzzleHeader;
