
import { useState } from 'react';
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from '../types/puzzle-types';

export const usePuzzleSettings = (initialDifficulty: DifficultyLevel) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [pieceShape, setPieceShape] = useState<PieceShape>('standard');
  const [visualTheme, setVisualTheme] = useState<VisualTheme>('light');
  const [rotationEnabled, setRotationEnabled] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(300);

  return {
    difficulty,
    setDifficulty,
    gameMode,
    setGameMode,
    pieceShape,
    setPieceShape,
    visualTheme,
    setVisualTheme,
    rotationEnabled,
    setRotationEnabled,
    timeLimit,
    setTimeLimit
  };
};
