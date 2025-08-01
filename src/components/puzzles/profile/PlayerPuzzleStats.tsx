import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Clock, Target, Zap, TrendingUp, Calendar, 
  Puzzle, Star, Award, MousePointer 
} from 'lucide-react';

interface PlayerStats {
  totalGames: number;
  gamesCompleted: number;
  totalTime: number;
  averageTime: number;
  bestTime: number;
  totalMoves: number;
  averageMoves: number;
  bestMoves: number;
  currentStreak: number;
  longestStreak: number;
  favoriteDifficulty: string;
  achievements: string[];
  recentGames: Array<{
    id: string;
    name: string;
    difficulty: string;
    completionTime: number;
    moves: number;
    completedAt: string;
  }>;
}

interface PlayerPuzzleStatsProps {
  stats: PlayerStats;
  className?: string;
}

export const PlayerPuzzleStats: React.FC<PlayerPuzzleStatsProps> = ({
  stats,
  className = ''
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionRate = stats.totalGames > 0 ? (stats.gamesCompleted / stats.totalGames) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'hard': return 'bg-red-400/20 text-red-400 border-red-400/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Games</p>
                <p className="text-2xl font-bold text-puzzle-white">{stats.totalGames}</p>
              </div>
              <Puzzle className="h-8 w-8 text-puzzle-aqua" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-puzzle-white">{stats.gamesCompleted}</p>
              </div>
              <Trophy className="h-8 w-8 text-puzzle-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Time</p>
                <p className="text-2xl font-bold text-puzzle-white">{formatTime(stats.bestTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-puzzle-aqua" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-puzzle-white">{stats.currentStreak}</p>
              </div>
              <Zap className="h-8 w-8 text-puzzle-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-puzzle-aqua" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="text-puzzle-white font-medium">{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
                <p className="text-lg font-semibold text-puzzle-white">
                  {formatTime(stats.averageTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Moves</p>
                <p className="text-lg font-semibold text-puzzle-white">
                  {stats.averageMoves}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Favorite Difficulty</p>
              <Badge className={getDifficultyColor(stats.favoriteDifficulty)}>
                {stats.favoriteDifficulty}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-puzzle-aqua" />
              Recent Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentGames.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent games</p>
            ) : (
              <div className="space-y-3">
                {stats.recentGames.slice(0, 5).map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium text-puzzle-white">{game.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDifficultyColor(game.difficulty)} variant="outline">
                          {game.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(game.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-puzzle-aqua">
                        <Clock className="h-3 w-3" />
                        {formatTime(game.completionTime)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MousePointer className="h-3 w-3" />
                        {game.moves} moves
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {stats.achievements.length > 0 && (
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Award className="h-5 w-5 text-puzzle-gold" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.achievements.map((achievement, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-puzzle-gold border-puzzle-gold/50"
                >
                  <Star className="h-3 w-3 mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};