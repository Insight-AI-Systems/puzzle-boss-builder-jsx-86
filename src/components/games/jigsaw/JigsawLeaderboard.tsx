import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

interface JigsawLeaderboardProps {
  puzzleSlug: string;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export const JigsawLeaderboard: React.FC<JigsawLeaderboardProps> = ({ puzzleSlug }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', puzzleSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('user_id, completion_time_seconds, moves, created_at')
        .eq('puzzle_slug', puzzleSlug)
        .order('completion_time_seconds', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    }
  });

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Top Times</h2>
        {isLoading && <div>Loading leaderboard...</div>}
        {error && <div>Failed to load leaderboard.</div>}
        {!isLoading && !error && (
          <ol className="space-y-1 list-decimal list-inside">
            {data && data.length > 0 ? (
              data.map((row: any, idx: number) => (
                <li key={`${row.user_id}-${idx}`} className="flex justify-between">
                  <span>Player {row.user_id ? String(row.user_id).slice(0, 8) : 'Anon'}</span>
                  <span className="font-mono">{formatTime(row.completion_time_seconds)}</span>
                </li>
              ))
            ) : (
              <div>No entries yet. Be the first!</div>
            )}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};

export default JigsawLeaderboard;
