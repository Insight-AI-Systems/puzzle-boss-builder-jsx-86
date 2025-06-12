
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Target } from 'lucide-react';
import { useWordSearchLeaderboard, WordSearchLeaderboardEntry } from './hooks/useWordSearchLeaderboard';

interface WordSearchLeaderboardProps {
  limit?: number;
  showTitle?: boolean;
}

export function WordSearchLeaderboard({ limit = 10, showTitle = true }: WordSearchLeaderboardProps) {
  const { leaderboard, isLoading, userRank } = useWordSearchLeaderboard();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-puzzle-gold" />
              Word Search Leaderboard
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-puzzle-aqua mx-auto"></div>
            <p className="text-sm text-gray-400 mt-2">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayEntries = leaderboard.slice(0, limit);

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-puzzle-gold" />
            Word Search Leaderboard
            {userRank && (
              <span className="text-sm font-normal text-puzzle-aqua">
                (Your Rank: #{userRank})
              </span>
            )}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {displayEntries.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No scores yet!</h3>
            <p className="text-gray-400">Be the first to complete a puzzle and claim the top spot!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index < 3 
                    ? 'bg-gradient-to-r from-puzzle-gold/10 to-puzzle-aqua/10 border-puzzle-gold/30' 
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-puzzle-gold min-w-[40px]">
                    {getRankBadge(index + 1)}
                  </span>
                  <div>
                    <div className="font-semibold text-puzzle-white">
                      {entry.player_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.difficulty} • {entry.category}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-puzzle-gold">
                      <Trophy className="h-3 w-3" />
                      <span className="font-bold">{entry.score.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-400">Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-puzzle-aqua">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(entry.completion_time_seconds)}</span>
                    </div>
                    <div className="text-xs text-gray-400">Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-400">
                      <Target className="h-3 w-3" />
                      <span>{entry.words_found}/{entry.total_words}</span>
                    </div>
                    <div className="text-xs text-gray-400">Words</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
