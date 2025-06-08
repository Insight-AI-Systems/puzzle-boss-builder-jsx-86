
import { useState } from 'react';
import { gameRepository } from '@/data/repositories/GameRepository';
import { GameState } from '@/shared/contexts/GameContext';

export function useGameRepository() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProgress = async (gameState: GameState) => {
    try {
      setIsLoading(true);
      setError(null);
      await gameRepository.saveProgress(gameState);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save progress';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgress = async (userId: string, gameId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      return await gameRepository.loadProgress(userId, gameId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load progress';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveProgress,
    loadProgress,
    isLoading,
    error
  };
}
