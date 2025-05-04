
import React from 'react';

interface FirstMoveOverlayProps {
  onFirstMove: () => void;
}

const FirstMoveOverlay: React.FC<FirstMoveOverlayProps> = ({ onFirstMove }) => {
  return (
    <div 
      className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-20 cursor-pointer"
      onClick={onFirstMove}
    >
      <div className="bg-background p-6 rounded-xl shadow-lg text-center max-w-xs">
        <h3 className="text-xl font-bold mb-2">Ready to Play?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click or drag any piece to start the puzzle. The timer will begin on your first move.
        </p>
        <button 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
          onClick={onFirstMove}
        >
          Start Puzzle
        </button>
      </div>
    </div>
  );
};

export default FirstMoveOverlay;
