import React from 'react';
import { BaseGameWrapper } from '../BaseGameWrapper';
import { ResponsiveGameContainer } from '../ResponsiveGameContainer';
import { FixedHeadbreaker } from './FixedHeadbreaker';
import { GameConfig, GameHooks } from '../types/GameTypes';

interface JigsawGameWrapperProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  pieceCount?: 20 | 100 | 500;
  imageUrl?: string;
}

export function JigsawGameWrapper({ 
  difficulty = 'medium',
  pieceCount = 100,
  imageUrl 
}: JigsawGameWrapperProps) {
  
  const gameConfig: GameConfig = {
    gameType: 'jigsaw',
    hasTimer: true,
    hasScore: true,
    hasMoves: true,
    difficulty,
    requiresPayment: pieceCount > 100, // Premium for 500 pieces
    entryFee: pieceCount > 100 ? 2.99 : undefined
  };

  const gameHooks: GameHooks = {
    onGameStart: () => console.log('Jigsaw game started'),
    onGameComplete: (stats) => console.log('Jigsaw game completed:', stats),
    onScoreUpdate: (score) => console.log('Score updated:', score),
    onMoveUpdate: (moves) => console.log('Moves updated:', moves),
    onError: (error) => console.error('Jigsaw game error:', error)
  };

  return (
    <ResponsiveGameContainer maxWidth="full" aspectRatio="auto">
      <BaseGameWrapper config={gameConfig} hooks={gameHooks}>
        {(gameProps) => (
          <FixedHeadbreaker
            difficulty={difficulty}
            imageUrl={imageUrl}
            onComplete={(stats) => {
              gameProps.onComplete(stats);
              gameProps.onScoreUpdate(stats.score || 0);
            }}
          />
        )}
      </BaseGameWrapper>
    </ResponsiveGameContainer>
  );
}

export default JigsawGameWrapper;