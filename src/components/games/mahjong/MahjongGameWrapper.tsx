
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

  return (
    <BaseGameWrapper>
      <MahjongGame
        difficulty={difficulty}
        onGameComplete={handleGameComplete}
      />
    </BaseGameWrapper>
  );
};
