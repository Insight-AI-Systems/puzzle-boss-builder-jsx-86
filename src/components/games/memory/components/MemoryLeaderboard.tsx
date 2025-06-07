
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  moves: number;
  timeElapsed: number;
  accuracy: number;
  isPerfectGame: boolean;
}

interface MemoryLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  layout: string;
  personalBests: {
    highestScore: number;
    fastestTime: number;
    lowestMoves: number;
    bestAccuracy: number;
  };
}

export function MemoryLeaderboard({ 
  leaderboard, 
  layout, 
  personalBests 
}: MemoryLeaderboardProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-puzzle-gold" />
          Leaderboard - {layout.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <div>No scores yet. Be the first to complete a game!</div>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-puzzle-gold font-bold">#{index + 1}</span>
                  <div>
                    <div className="font-semibold text-puzzle-white">{entry.playerName}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(entry.timeElapsed)} • {entry.moves} moves • {entry.accuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-puzzle-gold">{entry.score.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
