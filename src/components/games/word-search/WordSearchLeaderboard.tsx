
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown, User, Clock, Target, Zap } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  timeElapsed: number;
  wordsFound: number;
  totalWords: number;
  difficulty: 'rookie' | 'pro' | 'master';
  isCurrentPlayer?: boolean;
}

interface WordSearchLeaderboardProps {
  currentPlayerScore: {
    score: number;
    timeElapsed: number;
    wordsFound: number;
    totalWords: number;
    difficulty: 'rookie' | 'pro' | 'master';
  };
  onPlayAgain: () => void;
  onBackToArena: () => void;
}

export function WordSearchLeaderboard({
  currentPlayerScore,
  onPlayAgain,
  onBackToArena
}: WordSearchLeaderboardProps) {
  // Mock leaderboard data - in real app this would come from the server
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, playerName: 'WordMaster', score: 12500, timeElapsed: 145000, wordsFound: 12, totalWords: 12, difficulty: 'master' },
    { rank: 2, playerName: 'SpeedReader', score: 11800, timeElapsed: 152000, wordsFound: 12, totalWords: 12, difficulty: 'master' },
    { rank: 3, playerName: 'PuzzlePro', score: 11200, timeElapsed: 168000, wordsFound: 12, totalWords: 12, difficulty: 'pro' },
    { rank: 4, playerName: 'You', score: currentPlayerScore.score, timeElapsed: currentPlayerScore.timeElapsed, wordsFound: currentPlayerScore.wordsFound, totalWords: currentPlayerScore.totalWords, difficulty: currentPlayerScore.difficulty, isCurrentPlayer: true },
    { rank: 5, playerName: 'SearchGuru', score: 10800, timeElapsed: 175000, wordsFound: 10, totalWords: 12, difficulty: 'pro' },
    { rank: 6, playerName: 'QuickFinder', score: 10500, timeElapsed: 182000, wordsFound: 11, totalWords: 12, difficulty: 'rookie' },
    { rank: 7, playerName: 'WordHunter', score: 10200, timeElapsed: 195000, wordsFound: 9, totalWords: 12, difficulty: 'rookie' },
    { rank: 8, playerName: 'FastSeeker', score: 9800, timeElapsed: 210000, wordsFound: 8, totalWords: 12, difficulty: 'rookie' },
  ];

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Trophy className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'master': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  const getRankBackgroundColor = (rank: number, isCurrentPlayer?: boolean) => {
    if (isCurrentPlayer) {
      return 'bg-gradient-to-r from-puzzle-aqua/20 to-puzzle-gold/20 border-puzzle-aqua';
    }
    if (rank <= 3) {
      return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30';
    }
    return 'bg-gray-900/50 border-gray-700';
  };

  return (
    <div className="fixed inset-0 bg-puzzle-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-puzzle-aqua/10 to-puzzle-gold/10 border-b border-gray-700">
          <CardTitle className="text-3xl font-bold text-puzzle-white flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-puzzle-gold" />
            Leaderboard
            <Trophy className="h-8 w-8 text-puzzle-gold" />
          </CardTitle>
          <p className="text-gray-400 mt-2">Top Word Search Champions</p>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {leaderboardData.map((entry) => (
              <div
                key={`${entry.rank}-${entry.playerName}`}
                className={`flex items-center gap-4 p-4 border-b border-gray-800 transition-all duration-200 hover:bg-gray-800/50 ${getRankBackgroundColor(entry.rank, entry.isCurrentPlayer)}`}
              >
                {/* Rank & Icon */}
                <div className="flex items-center gap-2 w-16">
                  <span className={`text-lg font-bold ${entry.isCurrentPlayer ? 'text-puzzle-aqua' : 'text-puzzle-white'}`}>
                    #{entry.rank}
                  </span>
                  {getRankIcon(entry.rank)}
                </div>

                {/* Player Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-full ${entry.isCurrentPlayer ? 'bg-puzzle-aqua/20' : 'bg-gray-700'}`}>
                    <User className={`h-4 w-4 ${entry.isCurrentPlayer ? 'text-puzzle-aqua' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold truncate ${entry.isCurrentPlayer ? 'text-puzzle-aqua' : 'text-puzzle-white'}`}>
                      {entry.playerName}
                      {entry.isCurrentPlayer && (
                        <Badge className="ml-2 bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50">
                          You
                        </Badge>
                      )}
                    </div>
                    <Badge className={`text-xs ${getDifficultyColor(entry.difficulty)}`}>
                      {entry.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-puzzle-gold">
                      <Zap className="h-3 w-3" />
                      <span className="font-bold">{entry.score}</span>
                    </div>
                    <div className="text-xs text-gray-400">Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-puzzle-aqua">
                      <Clock className="h-3 w-3" />
                      <span className="font-bold">{formatTime(entry.timeElapsed)}</span>
                    </div>
                    <div className="text-xs text-gray-400">Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-400">
                      <Target className="h-3 w-3" />
                      <span className="font-bold">{entry.wordsFound}/{entry.totalWords}</span>
                    </div>
                    <div className="text-xs text-gray-400">Words</div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="md:hidden text-right">
                  <div className="text-lg font-bold text-puzzle-gold">{entry.score}</div>
                  <div className="text-xs text-gray-400">{formatTime(entry.timeElapsed)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-800/50 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={onPlayAgain}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold px-6 py-2"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={onBackToArena}
                variant="outline"
                className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black px-6 py-2"
              >
                Back to Arena
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
