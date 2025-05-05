
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  time_seconds: number;
}

interface LeaderboardSectionProps {
  puzzleId: string;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ puzzleId }) => {
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // This is a placeholder - we'll implement actual leaderboard data fetching later
        setLeaderboardEntries([
          { id: '1', player_name: 'PuzzleMaster', time_seconds: 120 },
          { id: '2', player_name: 'JigsawPro', time_seconds: 145 },
          { id: '3', player_name: 'PuzzleWiz', time_seconds: 180 }
        ]);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, [puzzleId]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="border-puzzle-amber border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Top Solvers</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="spinner small"></div>
          </div>
        ) : leaderboardEntries.length > 0 ? (
          <div className="space-y-2">
            {leaderboardEntries.map((entry, index) => (
              <div key={entry.id} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <div className="flex items-center">
                  <span className="w-6 text-center font-semibold">{index + 1}</span>
                  <span className="ml-2">{entry.player_name}</span>
                </div>
                <span className="font-mono">{formatTime(entry.time_seconds)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No records yet. Be the first to solve this puzzle!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardSection;
