
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

interface SimplePuzzleControlsProps {
  moveCount: number;
  onShuffle: () => void;
  isMobile?: boolean;
}

const SimplePuzzleControls: React.FC<SimplePuzzleControlsProps> = ({
  moveCount,
  onShuffle,
  isMobile = false
}) => {
  return (
    <div className={`mb-4 flex justify-between w-full ${isMobile ? 'max-w-[300px]' : 'max-w-[360px]'}`}>
      <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-puzzle-aqua`}>
        Moves: {moveCount}
      </div>
      <Button 
        onClick={onShuffle}
        className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-black"
        size={isMobile ? "sm" : "default"}
      >
        <Shuffle className={`${isMobile ? 'w-3 h-3 mr-1' : 'w-4 h-4 mr-2'}`} />
        Shuffle
      </Button>
    </div>
  );
};

export default SimplePuzzleControls;
