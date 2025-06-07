
import React from 'react';
import BaseGameWrapper from '../BaseGameWrapper';
import ResponsiveGameContainer from '../ResponsiveGameContainer';
import { SudokuGame } from './SudokuGame';
import { GameConfig, GameHooks } from '../types/GameTypes';
import { SudokuDifficulty, SudokuSize } from './types/sudokuTypes';

interface SudokuGameWrapperProps {
  difficulty?: SudokuDifficulty;
  size?: SudokuSize;
  requiresPayment?: boolean;
  entryFee?: number;
}

export function SudokuGameWrapper({
  difficulty = 'medium',
  size = 6,
  requiresPayment = false,
  entryFee = 0
}: SudokuGameWrapperProps) {
  const gameConfig: GameConfig = {
    gameType: `sudoku-${size}x${size}-${difficulty}`,
    requiresPayment,
    hasTimer: true,
    hasScore: true,
    hasMoves: true,
    timeLimit: undefined, // No time limit for Sudoku
    entryFee,
    difficulty
  };

  const gameHooks: GameHooks = {
    onGameStart: () => console.log(`Sudoku ${size}x${size} ${difficulty} started!`),
    onGameComplete: (result) => console.log('Sudoku completed:', result),
    onScoreUpdate: (score) => console.log('Score updated:', score),
    onMoveUpdate: (moves) => console.log('Moves updated:', moves),
    onError: (error) => console.error('Sudoku error:', error)
  };

  return (
    <ResponsiveGameContainer maxWidth="xl" aspectRatio="auto">
      <BaseGameWrapper config={gameConfig} hooks={gameHooks}>
        {(gameProps) => (
          <SudokuGame
            difficulty={difficulty}
            size={size}
            gameState={gameProps.gameState}
            isActive={gameProps.isActive}
            onComplete={(stats) => {
              gameProps.onComplete();
              gameProps.onScoreUpdate(stats.moves * 10 + (100 - stats.hintsUsed * 10));
            }}
            onScoreUpdate={gameProps.onScoreUpdate}
            onMoveUpdate={gameProps.onMoveUpdate}
          />
        )}
      </BaseGameWrapper>
    </ResponsiveGameContainer>
  );
}

export default SudokuGameWrapper;
