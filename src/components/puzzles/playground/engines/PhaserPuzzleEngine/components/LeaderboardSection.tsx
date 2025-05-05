
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  user_name: string;
  completion_time: number;
  score: number;
}

interface LeaderboardSectionProps {
  puzzleId: string;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ puzzleId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // This will be replaced with actual Supabase query when the table exists
        // For now, using placeholder data
        const placeholderData: LeaderboardEntry[] = [
          { id: '1', user_name: 'PuzzleMaster', completion_time: 120, score: 1500 },
          { id: '2', user_name: 'JigsawChamp', completion_time: 145, score: 1350 },
          { id: '3', user_name: 'PieceWizard', completion_time: 180, score: 1200 },
          { id: '4', user_name: 'PuzzleNinja', completion_time: 210, score: 1050 },
          { id: '5', user_name: 'PuzzlePro', completion_time: 240, score: 900 },
        ];
        
        setLeaderboard(placeholderData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [puzzleId]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg">Top Solvers</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="spinner small"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between py-1 px-2 rounded-md bg-muted/20"
              >
                <div className="flex items-center">
                  <span className="font-semibold text-sm w-6">{index + 1}.</span>
                  <span className="text-sm">{entry.user_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-muted-foreground">{formatTime(entry.completion_time)}</span>
                  <span className="text-xs font-semibold">{entry.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">Leaderboard updates after each completed puzzle</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardSection;
