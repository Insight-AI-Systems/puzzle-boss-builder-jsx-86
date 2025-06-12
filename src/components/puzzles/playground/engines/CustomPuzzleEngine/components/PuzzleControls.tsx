
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Eye, EyeOff, Shuffle, Lightbulb } from 'lucide-react';

interface PuzzleControlsProps {
  elapsed: number;
  isComplete: boolean;
  onReset: () => void;
  showGuideImage: boolean;
  onToggleGuideImage: () => void;
  onShuffle: () => void;
  onHint: () => void;
  hintsRemaining: number;
}

export const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  elapsed,
  isComplete,
  onReset,
  showGuideImage,
  onToggleGuideImage,
  onShuffle,
  onHint,
  hintsRemaining
}) => {
  // Format time as MM:SS
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
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
          onClick={onToggleGuideImage}
          className="flex items-center gap-1"
        >
          {showGuideImage ? (
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
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShuffle}
          className="flex items-center gap-1"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onHint}
          disabled={hintsRemaining <= 0 || isComplete}
          className="flex items-center gap-1"
        >
          <Lightbulb className="h-4 w-4" />
          Hint ({hintsRemaining})
        </Button>
      </div>
      
      <div className="px-3 py-1 bg-background rounded border border-border font-mono">
        {formattedTime}
      </div>
    </div>
  );
};

PuzzleControls.displayName = 'PuzzleControls';
