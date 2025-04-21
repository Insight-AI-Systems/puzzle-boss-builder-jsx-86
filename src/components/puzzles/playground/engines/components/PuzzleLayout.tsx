
import React from 'react';
import { PuzzleSidebarLeaderboard } from './PuzzleSidebarLeaderboard';
import { PuzzleHeaderAndControls } from './PuzzleHeaderAndControls';
import { PuzzleContainer } from './PuzzleContainer';
import { PuzzleFooter } from './PuzzleFooter';
import { PuzzleCongratulationSplash } from './PuzzleCongratulationSplash';

interface PuzzleLayoutProps {
  elapsed: number;
  onReset: () => void;
  onToggleBorder: () => void;
  showBorder: boolean;
  loading: boolean;
  imageUrl: string;
  rows: number;
  columns: number;
  keyProp: number;
  onSolved: () => void;
  solveTime: number | null;
  completed: boolean;
  onPlayAgain: () => void;
  hasStarted: boolean;
  handleStartIfFirstMove: () => void;
}

export const PuzzleLayout: React.FC<PuzzleLayoutProps> = ({
  elapsed,
  onReset,
  onToggleBorder,
  showBorder,
  loading,
  imageUrl,
  rows,
  columns,
  keyProp,
  onSolved,
  solveTime,
  completed,
  onPlayAgain,
  hasStarted,
  handleStartIfFirstMove
}) => {
  return (
    <div className="flex w-full">
      {/* Main content area - shifted to the left */}
      <div className="flex-1 max-w-[calc(100%-630px)] pr-[630px]">
        <div className="flex flex-col items-center justify-center w-full">
          <PuzzleHeaderAndControls
            elapsed={elapsed}
            onReset={onReset}
            onToggleBorder={onToggleBorder}
            showBorder={showBorder}
          />

          <PuzzleContainer
            loading={loading}
            imageUrl={imageUrl}
            rows={rows}
            columns={columns}
            keyProp={keyProp}
            onSolved={onSolved}
            showBorder={showBorder}
            hasStarted={hasStarted}
            handleStartIfFirstMove={handleStartIfFirstMove}
          />

          <PuzzleFooter
            solveTime={solveTime}
            showBorder={showBorder}
            rows={rows}
            columns={columns}
          />

          <PuzzleCongratulationSplash 
            show={completed} 
            solveTime={solveTime} 
            onPlayAgain={onPlayAgain}
          />
        </div>
      </div>

      {/* Fixed sidebar on the right containing preview and leaderboard */}
      <div className="fixed right-0 top-0 w-[630px] h-full p-4 flex flex-col">
        {/* Preview Image */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Puzzle Preview</h3>
          <div className="rounded-lg overflow-hidden border border-border">
            <img 
              src={imageUrl} 
              alt="Puzzle Preview" 
              className="w-full h-[300px] object-cover"
            />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="flex-1 overflow-hidden">
          <PuzzleSidebarLeaderboard solveTime={solveTime} />
        </div>
      </div>
    </div>
  );
};
