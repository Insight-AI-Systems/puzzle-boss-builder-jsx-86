
import React from 'react';

const PuzzleDemoInfo: React.FC = () => {
  return (
    <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 p-6 rounded-lg">
      <h2 className="text-puzzle-white text-xl font-bold mb-2">About This Demo</h2>
      <p className="text-muted-foreground">
        This is a demonstration of our jigsaw puzzle technology. The full version will include more 
        customizable images, additional difficulty levels, and competitive gameplay with leaderboards and timed challenges.
      </p>
      
      <h3 className="text-puzzle-white text-lg font-bold mt-4 mb-2">How to Play</h3>
      <ul className="text-muted-foreground list-disc list-inside">
        <li>Click or tap on a piece to select it</li>
        <li>Click or tap on another piece to swap them</li>
        <li>Use the directional controls on mobile for easier movement</li>
        <li>Try different difficulty levels in the image puzzle</li>
        <li>Solve the puzzle by arranging all pieces in the correct order</li>
      </ul>
      
      <p className="text-muted-foreground mt-4">
        In the full game, prizes will be awarded based on completion time and the number of moves used to solve puzzles.
      </p>
    </div>
  );
};

export default PuzzleDemoInfo;
