
import React from 'react';
import { BaseGameWrapper } from '@/components/games/BaseGameWrapper';
import { MahjongGame } from './MahjongGame';
import { useGameContext } from '@/shared/contexts/GameContext';

interface MahjongGameWrapperProps {
  difficulty?: 'rookie' | 'pro' | 'master';
}

export const MahjongGameWrapper: React.FC<MahjongGameWrapperProps> = ({ 
  difficulty = 'rookie' 
}) => {
  const { updateScore, completeGame } = useGameContext();

  const handleGameComplete = (score: number, time: number) => {
    updateScore(score);
    completeGame();
  };

  const gameConfig = {
    gameType: 'mahjong',
    requiresPayment: difficulty !== 'rookie',
    hasTimer: true,
    hasScore: true,
    hasMoves: true,
    difficulty
  };

  return (
    <BaseGameWrapper config={gameConfig}>
      <MahjongGame
        difficulty={difficulty}
        onGameComplete={handleGameComplete}
      />
    </BaseGameWrapper>
  );
};
