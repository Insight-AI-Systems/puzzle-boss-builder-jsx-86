
import React from 'react';
import BaseGameWrapper from '../BaseGameWrapper';
import ResponsiveGameContainer from '../ResponsiveGameContainer';
import { MemoryGame } from './MemoryGame';
import { GameConfig, GameHooks } from '../types/GameTypes';
import { MemoryLayout, MemoryTheme } from './types/memoryTypes';

interface MemoryGameWrapperProps {
  layout?: MemoryLayout;
  theme?: MemoryTheme;
  requiresPayment?: boolean;
  entryFee?: number;
}

export function MemoryGameWrapper({
  layout = '3x4',
  theme = 'animals',
  requiresPayment = false,
  entryFee = 0
}: MemoryGameWrapperProps) {
  const gameConfig: GameConfig = {
    gameType: `memory-${layout}-${theme}`,
    requiresPayment,
    hasTimer: true,
    hasScore: true,
    hasMoves: true,
    timeLimit: undefined, // No time limit for Memory game
    entryFee,
    difficulty: layout // Use layout as difficulty indicator
  };

  const gameHooks: GameHooks = {
    onGameStart: () => console.log(`Memory game ${layout} ${theme} started!`),
    onGameComplete: (result) => console.log('Memory game completed:', result),
    onScoreUpdate: (score) => console.log('Score updated:', score),
    onMoveUpdate: (moves) => console.log('Moves updated:', moves),
    onError: (error) => console.error('Memory game error:', error)
  };

  return (
    <ResponsiveGameContainer maxWidth="xl" aspectRatio="auto">
      <BaseGameWrapper config={gameConfig} hooks={gameHooks}>
        {(gameProps) => (
          <MemoryGame
            layout={layout}
            theme={theme}
            gameState={gameProps.gameState}
            isActive={gameProps.isActive}
            onComplete={(stats) => {
              // Pass the stats directly to the completion handler
              gameProps.onComplete(stats);
              gameProps.onScoreUpdate(stats.score || 0);
            }}
            onScoreUpdate={gameProps.onScoreUpdate}
            onMoveUpdate={gameProps.onMoveUpdate}
          />
        )}
      </BaseGameWrapper>
    </ResponsiveGameContainer>
  );
}

export default MemoryGameWrapper;
