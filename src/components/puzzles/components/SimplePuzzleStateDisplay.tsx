
import React from 'react';
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

const SimplePuzzleStateDisplay: React.FC<SimplePuzzleStateDisplayProps> = ({
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
);

export default SimplePuzzleStateDisplay;
