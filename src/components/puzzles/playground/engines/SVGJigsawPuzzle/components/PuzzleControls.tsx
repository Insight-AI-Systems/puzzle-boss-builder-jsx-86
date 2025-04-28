
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

interface PuzzleControlsProps {
  elapsed: number;
  isComplete: boolean;
  onReset: () => void;
  showGhost: boolean;
  toggleGhost: () => void;
  percentComplete: number;
}

export const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  elapsed,
  isComplete,
  onReset,
  showGhost,
  toggleGhost,
  percentComplete
}) => {
  // Format time as MM:SS
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap justify-between items-center gap-2 px-4 py-2 bg-muted/20 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleGhost}
            className="flex items-center gap-1"
          >
            {showGhost ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Ghost
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Ghost
              </>
            )}
          </Button>
        </div>
        
        <div className="px-3 py-1 bg-background rounded border border-border font-mono">
          {formattedTime}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-muted/10 rounded-lg">
        <Progress value={percentComplete} className="flex-1" />
        <span className="text-sm font-medium">{Math.round(percentComplete)}%</span>
      </div>
    </div>
  );
};
