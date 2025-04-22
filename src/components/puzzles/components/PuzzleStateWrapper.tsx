
import React from 'react';
import { DifficultyLevel, GameMode } from '../types/puzzle-types';
import PuzzleStateDisplay from './PuzzleStateDisplay';
import TimedModeBanner from './TimedModeBanner';

interface PuzzleStateWrapperProps {
  puzzleState: any;
  gameMode: GameMode;
  timeLimit: number;
  isMobile: boolean;
  totalPieces: number;
  onNewGame: () => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  handleTimeUp: () => void;
}

const PuzzleStateWrapper: React.FC<PuzzleStateWrapperProps> = ({
  puzzleState,
  gameMode,
  timeLimit,
  isMobile,
  totalPieces,
  onNewGame,
  onDifficultyChange,
  handleTimeUp,
}) => {
  return (
    <>
      <div className={`w-full ${isMobile ? 'mb-2' : 'mb-4'}`}>
        <PuzzleStateDisplay 
          state={{
            ...puzzleState,
            isComplete: puzzleState.isComplete
          }}
          totalPieces={totalPieces}
          onNewGame={onNewGame}
          onDifficultyChange={onDifficultyChange}
          onTogglePause={puzzleState.togglePause}
          isMobile={isMobile}
        />
      </div>
      
      {gameMode === 'timed' && (
        <div className="w-full mb-4">
          <TimedModeBanner
            timeLimit={timeLimit}
            timeSpent={puzzleState.timeSpent}
            isActive={puzzleState.isActive}
            onTimeUp={handleTimeUp}
            isMobile={isMobile}
          />
        </div>
      )}
    </>
  );
};

export default PuzzleStateWrapper;

