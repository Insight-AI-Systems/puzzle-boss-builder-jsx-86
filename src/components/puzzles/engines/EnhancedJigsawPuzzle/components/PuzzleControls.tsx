
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';

interface PuzzleControlsProps {
  moves: number;
  elapsed: number;
  isComplete: boolean;
  showGuide: boolean;
  toggleGuide: () => void;
  onResetGame: () => void;
  isPremium: boolean;
}

const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  moves,
  elapsed,
  isComplete,
  showGuide,
  toggleGuide,
  onResetGame,
  isPremium
}) => {
  return (
    <div className="puzzle-controls flex flex-col gap-2 mb-4">
      <div className="flex flex-wrap justify-between items-center gap-2 p-4 bg-muted/20 rounded-lg border border-border">
        {/* Left side: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetGame}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleGuide}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            {showGuide ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Guide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Guide
              </>
            )}
          </Button>
        </div>
        
        {/* Right side: Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Moves:</span>
            <span className="px-2 py-1 bg-background rounded border border-border font-mono text-sm">
              {moves}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Time:</span>
            <span className="px-2 py-1 bg-background rounded border border-border font-mono text-sm">
              {formatTime(elapsed)}
            </span>
          </div>
          
          {isPremium && (
            <div className="flex items-center">
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-300">
                PREMIUM
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleControls;
