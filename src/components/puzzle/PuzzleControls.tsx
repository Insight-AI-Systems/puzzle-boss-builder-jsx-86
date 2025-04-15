
import React, { memo } from 'react';
import { Shuffle, Volume2, VolumeX, PlayCircle, PauseCircle, TimerReset, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props interface for the PuzzleControls component
 */
interface PuzzleControlsProps {
  shufflePuzzle: () => void;
  resetPuzzle: () => void;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  timerActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  hintsRemaining: number;
  activateHint: () => void;
}

/**
 * PuzzleControls component for rendering puzzle control buttons
 * Memoized to prevent re-renders when the puzzle pieces change
 */
const PuzzleControls: React.FC<PuzzleControlsProps> = memo(({
  shufflePuzzle,
  resetPuzzle,
  muted,
  setMuted,
  timerActive,
  toggleTimer,
  resetTimer,
  hintsRemaining,
  activateHint
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 w-full max-w-xs">
      <Button 
        variant="outline" 
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 transition-all duration-300 relative overflow-hidden group"
        onClick={shufflePuzzle}
      >
        <span className="absolute inset-0 w-full h-full bg-puzzle-aqua/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        <Shuffle className="mr-1 w-4 h-4" />
        <span className="relative z-10">Shuffle</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 transition-all duration-300 relative overflow-hidden group"
        onClick={resetPuzzle}
      >
        <span className="absolute inset-0 w-full h-full bg-puzzle-aqua/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        <span className="relative z-10">Reset</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 transition-all duration-300 relative overflow-hidden group"
        onClick={toggleTimer}
      >
        <span className="absolute inset-0 w-full h-full bg-puzzle-aqua/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        {timerActive ? (
          <PauseCircle className="w-4 h-4" />
        ) : (
          <PlayCircle className="w-4 h-4" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 transition-all duration-300 relative overflow-hidden group"
        onClick={resetTimer}
      >
        <span className="absolute inset-0 w-full h-full bg-puzzle-aqua/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        <TimerReset className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={`
          relative overflow-hidden group transition-all duration-300
          ${hintsRemaining > 0 
            ? 'border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10' 
            : 'border-gray-500 text-gray-500 opacity-50 cursor-not-allowed'}
        `}
        onClick={activateHint}
        disabled={hintsRemaining <= 0}
      >
        <span className="absolute inset-0 w-full h-full bg-puzzle-gold/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        <Lightbulb className="mr-1 w-4 h-4" />
        <span className="relative z-10">Hint ({hintsRemaining})</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 transition-all duration-300 relative overflow-hidden group ml-auto"
        onClick={() => setMuted(!muted)}
      >
        <span className="absolute inset-0 w-full h-full bg-puzzle-aqua/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        <span className="relative z-10">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </span>
      </Button>
    </div>
  );
});

// Display name for debugging
PuzzleControls.displayName = 'PuzzleControls';

export default PuzzleControls;
