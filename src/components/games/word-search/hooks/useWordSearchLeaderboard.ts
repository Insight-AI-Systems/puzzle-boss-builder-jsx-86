
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WordSearchLeaderboardEntry {
  id: string;
  player_id: string;
  player_name: string;
  score: number;
  completion_time_seconds: number;
  words_found: number;
  total_words: number;
  difficulty: string;
  category: string;
  incorrect_selections: number;
  hints_used: number;
  created_at: string;
}

export interface GameResult {
  score: number;
  completionTimeSeconds: number;
  wordsFound: number;
  totalWords: number;
  difficulty: string;
  category: string;
  incorrectSelections: number;
  hintsUsed: number;
}

export function useWordSearchLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<WordSearchLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLeaderboard = useCallback(async (limit: number = 10) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('word_search_leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .order('completion_time_seconds', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setLeaderboard(data || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitScore = useCallback(async (result: GameResult) => {
    if (!user) {
      console.log('No user logged in, skipping score submission');
      return false;
    }

    try {
      const playerName = user.username || user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Anonymous';
      
      const { error } = await supabase
        .from('word_search_leaderboard')
        .insert({
          player_id: user.id,
          player_name: playerName,
          score: result.score,
          completion_time_seconds: result.completionTimeSeconds,
          words_found: result.wordsFound,
          total_words: result.totalWords,
          difficulty: result.difficulty,
          category: result.category,
          incorrect_selections: result.incorrectSelections,
          hints_used: result.hintsUsed
        });

      if (error) {
        console.error('Error submitting score:', error);
        return false;
      }

      // Refresh leaderboard after submission
      await fetchLeaderboard();

      toast({
        title: "Score Submitted!",
        description: "Your score has been added to the leaderboard.",
      });

      return true;
    } catch (error) {
      console.error('Failed to submit score:', error);
      toast({
        title: "Submission Failed",
        description: "Could not submit your score. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, fetchLeaderboard, toast]);

  const getUserRank = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('word_search_leaderboard')
        .select('player_id, score, completion_time_seconds')
        .order('score', { ascending: false })
        .order('completion_time_seconds', { ascending: true });

      if (error || !data) return;

      const userIndex = data.findIndex(entry => entry.player_id === user.id);
      setUserRank(userIndex >= 0 ? userIndex + 1 : null);
    } catch (error) {
      console.error('Failed to get user rank:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
    getUserRank();
  }, [fetchLeaderboard, getUserRank]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('word-search-leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'word_search_leaderboard'
        },
        () => {
          fetchLeaderboard();
          getUserRank();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard, getUserRank]);

  return {
    leaderboard,
    userRank,
    isLoading,
    fetchLeaderboard,
    submitScore,
    getUserRank
  };
}
