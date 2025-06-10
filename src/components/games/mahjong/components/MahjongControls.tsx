
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Lightbulb, Shuffle } from 'lucide-react';

interface MahjongControlsProps {
  onNewGame: () => void;
  onHint: () => void;
  onShuffle: () => void;
  canShuffle: boolean;
  hintsRemaining: number;
  score: number;
  moves: number;
}

export const MahjongControls: React.FC<MahjongControlsProps> = ({
  onNewGame,
  onHint,
  onShuffle,
  canShuffle,
  hintsRemaining,
  score,
  moves
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center p-4 bg-puzzle-black/50 rounded-lg">
      <div className="flex gap-2 text-puzzle-white text-sm">
        <span>Score: {score}</span>
        <span>•</span>
        <span>Moves: {moves}</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onHint}
          disabled={hintsRemaining <= 0}
          variant="outline"
          size="sm"
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          Hint ({hintsRemaining})
        </Button>
        
        <Button
          onClick={onShuffle}
          disabled={!canShuffle}
          variant="outline"
          size="sm"
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
        >
          <Shuffle className="h-4 w-4 mr-1" />
          Shuffle
        </Button>
        
        <Button
          onClick={onNewGame}
          variant="outline"
          size="sm"
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          New Game
        </Button>
      </div>
    </div>
  );
};
