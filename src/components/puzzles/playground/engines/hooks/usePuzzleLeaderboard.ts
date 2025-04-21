
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  player_id: string;
  player_name: string | null;
  time_seconds: number;
  created_at: string;
}

export function useLeaderboard(puzzleId: string | null | undefined) {
  const queryClient = useQueryClient();

  const fetchLeaderboard = async () => {
    if (!puzzleId) return [];
    // Fetch top 10 times for the puzzle
    const { data, error } = await supabase
      .from('puzzle_leaderboard')
      .select('id, player_id, player_name, time_seconds, created_at')
      .eq('puzzle_id', puzzleId)
      .order('time_seconds', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data as LeaderboardEntry[];
  };

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard', puzzleId],
    queryFn: fetchLeaderboard,
    enabled: !!puzzleId,
    refetchOnMount: true,
  });

  const addTime = useMutation({
    mutationFn: async ({
      puzzle_id,
      player_id,
      player_name,
      time_seconds
    }: {
      puzzle_id: string;
      player_id: string;
      player_name: string | null;
      time_seconds: number;
    }) => {
      const { error } = await supabase.from('puzzle_leaderboard').insert([
        { puzzle_id, player_id, player_name, time_seconds }
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard', puzzleId] });
    }
  });

  return {
    leaderboard: leaderboardQuery.data ?? [],
    leaderboardLoading: leaderboardQuery.isLoading,
    leaderboardError: leaderboardQuery.error,
    submitTime: addTime.mutateAsync,
    refreshing: leaderboardQuery.isRefetching,
    refetch: leaderboardQuery.refetch,
  };
}
