
import React from 'react';
import { PuzzleTimerDisplay } from './PuzzleTimerDisplay';
import { PuzzleControlsBar } from './PuzzleControlsBar';

interface PuzzleHeaderAndControlsProps {
  elapsed: number;
  onReset: () => void;
  onToggleBorder: () => void;
  showBorder: boolean;
}

export const PuzzleHeaderAndControls: React.FC<PuzzleHeaderAndControlsProps> = ({
  elapsed, onReset, onToggleBorder, showBorder
}) => {
  return (
    <div className="flex items-center gap-3 mb-3 w-full justify-between max-w-xl">
      <PuzzleTimerDisplay seconds={elapsed} />
      <div className="flex gap-2">
        <PuzzleControlsBar onReset={onReset} />
        <button
          onClick={onToggleBorder}
          className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          type="button"
          aria-label="Toggle Border"
          tabIndex={0}
        >
          {showBorder ? 'Hide Border' : 'Show Border'}
        </button>
      </div>
    </div>
  );
};
