
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Eye, EyeOff } from 'lucide-react';

interface PuzzleControlsProps {
  onReset: () => void;
  onToggleGuide: () => void;
  showGuideImage: boolean;
}

export const PuzzleControls: React.FC<PuzzleControlsProps> = React.memo(({
  onReset,
  onToggleGuide,
  showGuideImage
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className="flex items-center gap-1"
      >
        <RefreshCcw className="h-4 w-4" />
        <span>Reset</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleGuide}
        className="flex items-center gap-1"
      >
        {showGuideImage ? (
          <>
            <EyeOff className="h-4 w-4" />
            <span>Hide Guide</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            <span>Show Guide</span>
          </>
        )}
      </Button>
    </div>
  );
});

PuzzleControls.displayName = 'PuzzleControls';
