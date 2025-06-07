
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeaderboardEntry, GameResult } from '../types/GameTypes';

export function useLeaderboard(gameType: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchLeaderboard = useCallback(async (timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time') => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: LeaderboardEntry[] = [
        { rank: 1, playerId: '1', playerName: 'GameMaster', score: 98500, timeElapsed: 125000, completedAt: new Date() },
        { rank: 2, playerId: '2', playerName: 'SpeedRunner', score: 95200, timeElapsed: 132000, completedAt: new Date() },
        { rank: 3, playerId: '3', playerName: 'PuzzlePro', score: 92800, timeElapsed: 145000, completedAt: new Date() },
      ];
      
      setLeaderboard(mockData);
      
      // Find user's rank if logged in
      const userEntry = mockData.find(entry => entry.playerId === 'current_user');
      setUserRank(userEntry?.rank || null);
      
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      toast({
        title: "Failed to load leaderboard",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [gameType, toast]);

  const submitScore = useCallback(async (result: GameResult) => {
    try {
      // Mock submission - replace with actual API call
      console.log('Submitting score:', result);
      
      toast({
        title: "Score submitted!",
        description: "Your result has been recorded on the leaderboard",
      });
      
      // Refresh leaderboard after submission
      await fetchLeaderboard();
      
      return true;
    } catch (error) {
      console.error('Failed to submit score:', error);
      toast({
        title: "Failed to submit score",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchLeaderboard, toast]);

  return {
    leaderboard,
    userRank,
    isLoading,
    fetchLeaderboard,
    submitScore
  };
}
