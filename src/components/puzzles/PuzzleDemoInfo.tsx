
import React from 'react';

const PuzzleDemoInfo: React.FC = () => {
  return (
    <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 p-6 rounded-lg">
      <h2 className="text-puzzle-white text-xl font-bold mb-2">About This Demo</h2>
      <p className="text-muted-foreground">
        This is a demonstration of our jigsaw puzzle technology. The full version will include customizable 
        images, difficulty levels, and competitive gameplay with leaderboards and timed challenges.
      </p>
      <p className="text-muted-foreground mt-2">
        Try dragging the pieces to move them around. This simple demo showcases the basic puzzle 
        mechanics that will be used in our full game.
      </p>
    </div>
  );
};

export default PuzzleDemoInfo;
