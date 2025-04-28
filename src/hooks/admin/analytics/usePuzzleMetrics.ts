
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuzzleMetrics } from '../types/analyticsTypes';

export const usePuzzleMetrics = () => {
  return useQuery({
    queryKey: ['puzzleMetrics'],
    queryFn: async () => {
      // Placeholder implementation until the backend is ready
      return {
        active_puzzles: 24,
        avg_completion_time: 7.42,
        completion_rate: 68.3,
        prize_redemption_rate: 92.7
      } as PuzzleMetrics;
    }
  });
};
