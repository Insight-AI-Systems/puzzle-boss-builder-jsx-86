
import React from 'react';
import GameSettings from '../GameSettings';
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from '../../types/puzzle-types';

interface GameSettingsGroupProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  pieceShape: PieceShape;
  setPieceShape: (shape: PieceShape) => void;
  visualTheme: VisualTheme;
  setVisualTheme: (theme: VisualTheme) => void;
  rotationEnabled: boolean;
  setRotationEnabled: (enabled: boolean) => void;
  timeLimit: number;
  setTimeLimit: (limit: number) => void;
  isMobile: boolean;
}

export const GameSettingsGroup: React.FC<GameSettingsGroupProps> = (props) => {
  return <GameSettings {...props} />;
};

