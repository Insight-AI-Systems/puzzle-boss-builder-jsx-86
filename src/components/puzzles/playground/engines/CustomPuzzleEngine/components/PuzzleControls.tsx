
import React from 'react';
import { RefreshCcw, Eye, EyeOff } from 'lucide-react';

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
    <div className="flex gap-2">
      <button onClick={onReset} className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors" type="button" aria-label="Reset Puzzle" tabIndex={0}>
        <RefreshCcw className="h-4 w-4 mr-1" />
        Reset
      </button>
      
      <button 
        onClick={onToggleGuide} 
        className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors" 
        type="button" 
        aria-label={showGuideImage ? "Hide Guide" : "Show Guide"}
        tabIndex={0}
      >
        {showGuideImage ? (
          <>
            <EyeOff className="h-4 w-4 mr-1" />
            Hide Guide
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1" />
            Show Guide
          </>
        )}
      </button>
    </div>
  );
};
