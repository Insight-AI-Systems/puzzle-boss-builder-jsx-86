
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, Medal, Crown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  timeSeconds: number;
  wordsFound: number;
  totalWords: number;
  score: number;
  completedAt: Date;
  incorrectSelections: number;
}

interface WordSearchLeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: 'rookie' | 'pro' | 'master';
  category: string;
}

export const WordSearchLeaderboard: React.FC<WordSearchLeaderboardProps> = ({
  isOpen,
  onClose,
  difficulty,
  category
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'all-time'>('daily');

  // Mock leaderboard data - replace with real API calls
  useEffect(() => {
    const mockData: LeaderboardEntry[] = [
      {
        rank: 1,
        playerName: "SpeedSearcher",
        timeSeconds: 45.23,
        wordsFound: 12,
        totalWords: 12,
        score: 1247,
        completedAt: new Date(),
        incorrectSelections: 0
      },
      {
        rank: 2,
        playerName: "WordHunter",
        timeSeconds: 52.67,
        wordsFound: 12,
        totalWords: 12,
        score: 1189,
        completedAt: new Date(),
        incorrectSelections: 1
      },
      {
        rank: 3,
        playerName: "PuzzleMaster",
        timeSeconds: 58.91,
        wordsFound: 12,
        totalWords: 12,
        score: 1156,
        completedAt: new Date(),
        incorrectSelections: 0
      },
      {
        rank: 4,
        playerName: "QuickFinder",
        timeSeconds: 61.44,
        wordsFound: 11,
        totalWords: 12,
        score: 1089,
        completedAt: new Date(),
        incorrectSelections: 2
      },
      {
        rank: 5,
        playerName: "SearchPro",
        timeSeconds: 67.82,
        wordsFound: 12,
        totalWords: 12,
        score: 1045,
        completedAt: new Date(),
        incorrectSelections: 3
      }
    ];

    setLeaderboard(mockData);
  }, [difficulty, category, timeframe]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-400" />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case 2:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      case 3:
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-puzzle-gold flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            Leaderboard - {category} ({difficulty})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timeframe Selector */}
          <div className="flex justify-center gap-2">
            {(['daily', 'weekly', 'all-time'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf 
                  ? "bg-puzzle-aqua text-puzzle-black" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
                }
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1).replace('-', ' ')}
              </Button>
            ))}
          </div>

          {/* Leaderboard Entries */}
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <Card 
                key={entry.rank} 
                className={`
                  bg-gray-900 border-gray-700 transition-all duration-200
                  ${entry.rank <= 3 ? 'ring-1 ring-puzzle-gold/30' : ''}
                `}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Rank and Player */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div>
                        <div className="font-semibold text-puzzle-white">
                          {entry.playerName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {entry.completedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      {/* Time */}
                      <div className="text-center">
                        <div className="text-puzzle-aqua font-bold">
                          {entry.timeSeconds.toFixed(2)}s
                        </div>
                        <div className="text-xs text-gray-400">Time</div>
                      </div>

                      {/* Words */}
                      <div className="text-center">
                        <div className="text-puzzle-gold font-bold">
                          {entry.wordsFound}/{entry.totalWords}
                        </div>
                        <div className="text-xs text-gray-400">Words</div>
                      </div>

                      {/* Penalties */}
                      <div className="text-center">
                        <div className="text-red-400 font-bold">
                          {entry.incorrectSelections}
                        </div>
                        <div className="text-xs text-gray-400">Penalties</div>
                      </div>

                      {/* Score */}
                      <div className="text-center">
                        <Badge className={getRankBadgeColor(entry.rank)}>
                          {entry.score.toLocaleString()}
                        </Badge>
                        <div className="text-xs text-gray-400 mt-1">Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Perfect Game Indicator */}
                  {entry.wordsFound === entry.totalWords && entry.incorrectSelections === 0 && (
                    <div className="mt-2 flex justify-center">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                        Perfect Game!
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Stats */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="text-center">
                <div className="text-lg font-semibold text-puzzle-white">
                  Competition Stats
                </div>
                <div className="text-sm text-gray-400">
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1).replace('-', ' ')} rankings
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-puzzle-aqua">
                    {leaderboard.length > 0 ? leaderboard[0].timeSeconds.toFixed(2) : '--'}s
                  </div>
                  <div className="text-xs text-gray-400">Best Time</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-puzzle-gold">
                    {leaderboard.length}
                  </div>
                  <div className="text-xs text-gray-400">Total Players</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-puzzle-white">
                    {leaderboard.length > 0 ? leaderboard[0].score.toLocaleString() : '--'}
                  </div>
                  <div className="text-xs text-gray-400">Top Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
          >
            Close Leaderboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
