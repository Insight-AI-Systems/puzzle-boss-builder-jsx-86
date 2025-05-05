
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  time_seconds: number;
  player_id?: string;
}

interface LeaderboardSectionProps {
  puzzleId: string;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ puzzleId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // For demo puzzles that don't have UUID format, use a fallback query
        let query;
        
        // Check if puzzleId looks like a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (uuidRegex.test(puzzleId)) {
          // Use direct UUID match
          query = supabase
            .from('puzzle_leaderboard')
            .select('id, player_name, time_seconds, player_id')
            .eq('puzzle_id', puzzleId)
            .order('time_seconds', { ascending: true })
            .limit(10);
        } else {
          // For demo puzzles with non-UUID ids, try to find by a text field if your schema supports it
          // Or just get some sample data for demonstration
          query = supabase
            .from('puzzle_leaderboard')
            .select('id, player_name, time_seconds, player_id')
            .limit(10)
            .order('time_seconds', { ascending: true });
        }
        
        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setLeaderboard(data || []);
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        setError(`Failed to load leaderboard: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [puzzleId]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-sm text-muted-foreground py-4 text-center">
            {error.includes('invalid input syntax') ? 
              'Leaderboard will be available when the puzzle is registered.' : 
              error}
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-1">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="flex justify-between items-center text-sm py-1 border-b border-muted last:border-0">
                <div>
                  <span className="font-medium mr-2">#{index + 1}</span>
                  <span>{entry.player_name || 'Anonymous'}</span>
                </div>
                <div className="font-mono">{formatTime(entry.time_seconds)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-4 text-center">
            No entries yet. Be the first to complete this puzzle!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardSection;
