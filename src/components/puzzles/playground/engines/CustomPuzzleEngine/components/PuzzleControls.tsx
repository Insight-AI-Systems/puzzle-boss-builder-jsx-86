
import React from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PuzzleControlsProps {
  onReset: () => void;
  onToggleGuide: () => void;
  showGuideImage: boolean;
}

export const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  onReset,
  onToggleGuide,
  showGuideImage
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onToggleGuide} 
        title={showGuideImage ? "Hide guide image" : "Show guide image"}
        className="flex items-center gap-1"
      >
        {showGuideImage ? (
          <>
            <EyeOff className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Hide Guide</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Show Guide</span>
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        title="Reset puzzle"
        className="flex items-center gap-1"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="sr-only sm:not-sr-only sm:inline-block">Reset</span>
      </Button>
    </div>
  );
};
