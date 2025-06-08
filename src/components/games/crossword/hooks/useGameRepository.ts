
import { useCallback } from 'react';
import { gameRepository } from '@/data/repositories/GameRepository';
import { CrosswordProgress } from '@/business/engines/crossword';

export function useGameRepository() {
  const saveProgress = useCallback(async (puzzleId: string, progress: CrosswordProgress) => {
    try {
      await gameRepository.saveGameState({
        gameId: puzzleId,
        userId: 'current-user', // This should come from auth context
        gameState: progress,
        score: 0,
        moves: 0,
        timeElapsed: Date.now() - progress.startTime
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, []);

  const loadProgress = useCallback(async (puzzleId: string) => {
    try {
      const history = await gameRepository.getGameHistory('current-user', 1);
      return history.find(session => session.game_id === puzzleId);
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  }, []);

  return {
    saveProgress,
    loadProgress
  };
}
