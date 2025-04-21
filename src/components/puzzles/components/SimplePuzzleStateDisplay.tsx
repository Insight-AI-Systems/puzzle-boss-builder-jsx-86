
import React, { memo } from 'react';
import PuzzleStateDisplay from './PuzzleStateDisplay';
import { DifficultyLevel } from '../types/puzzle-types';

interface SimplePuzzleStateDisplayProps {
  state: any;
  totalPieces: number;
  onNewGame: () => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onTogglePause: () => void;
  isMobile: boolean;
}

// Using memo to prevent unnecessary re-renders
const SimplePuzzleStateDisplay: React.FC<SimplePuzzleStateDisplayProps> = memo(({
  state,
  totalPieces,
  onNewGame,
  onDifficultyChange,
  onTogglePause,
  isMobile,
}) => (
  <PuzzleStateDisplay 
    state={state}
    totalPieces={totalPieces}
    onNewGame={onNewGame}
    onDifficultyChange={onDifficultyChange}
    onTogglePause={onTogglePause}
    isMobile={isMobile}
  />
));

SimplePuzzleStateDisplay.displayName = 'SimplePuzzleStateDisplay';

export default SimplePuzzleStateDisplay;
