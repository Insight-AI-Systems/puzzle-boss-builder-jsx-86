
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
      <div className="flex-1 max-w-[calc(100%-330px)] pr-[330px]">
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

      {/* Fixed leaderboard on the right */}
      <div className="fixed right-0 top-0 w-[330px] h-full">
        <PuzzleSidebarLeaderboard solveTime={solveTime} />
      </div>
    </div>
  );
};

