
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle, RefreshCw } from 'lucide-react';

interface SimplePuzzleControlsProps {
  moveCount: number;
  onShuffle: () => void;
}

const SimplePuzzleControls: React.FC<SimplePuzzleControlsProps> = ({
  moveCount,
  onShuffle
}) => {
  return (
    <div className="mb-4 flex justify-between w-full max-w-[360px]">
      <div className="text-sm text-puzzle-aqua">
        Moves: {moveCount}
      </div>
      <Button 
        onClick={onShuffle}
        className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-black"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        New Game
      </Button>
    </div>
  );
};

export default SimplePuzzleControls;
