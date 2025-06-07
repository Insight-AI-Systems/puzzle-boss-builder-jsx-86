
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, Clock, Trophy, Target, TrendingUp, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileGameHistoryTabProps {
  userId: string;
}

export function ProfileGameHistoryTab({ userId }: ProfileGameHistoryTabProps) {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: gameHistory, isLoading } = useQuery({
    queryKey: ['game-history', userId, page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puzzle_completions')
        .select(`
          *,
          puzzles:puzzle_id (
            title,
            image_url,
            difficulty_level,
            pieces
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) throw error;
      return data;
    },
  });

  const { data: gameStats } = useQuery({
    queryKey: ['game-stats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puzzle_completions')
        .select('completion_time, is_winner, difficulty_level')
        .eq('user_id', userId);

      if (error) throw error;

      const totalGames = data.length;
      const totalWins = data.filter(game => game.is_winner).length;
      const avgTime = data.reduce((sum, game) => sum + game.completion_time, 0) / totalGames;
      const fastestTime = Math.min(...data.map(game => game.completion_time));

      return {
        totalGames,
        totalWins,
        winRate: totalGames > 0 ? (totalWins / totalGames) * 100 : 0,
        avgTime: avgTime || 0,
        fastestTime: fastestTime === Infinity ? 0 : fastestTime,
      };
    },
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Statistics */}
      {gameStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <Gamepad2 className="h-4 w-4 text-puzzle-aqua" />
                Total Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-puzzle-aqua">{gameStats.totalGames}</p>
            </CardContent>
          </Card>

          <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-puzzle-gold" />
                Total Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-puzzle-gold">{gameStats.totalWins}</p>
            </CardContent>
          </Card>

          <Card className="bg-puzzle-black/50 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-green-400" />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">
                {gameStats.winRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-puzzle-black/50 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-400" />
                Best Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-400">
                {formatTime(gameStats.fastestTime)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game History */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-puzzle-aqua" />
            Game History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-puzzle-white/60">Loading game history...</div>
            </div>
          ) : !gameHistory || gameHistory.length === 0 ? (
            <div className="text-center py-8">
              <Gamepad2 className="h-12 w-12 text-puzzle-white/30 mx-auto mb-4" />
              <p className="text-puzzle-white/60">No games played yet</p>
              <p className="text-puzzle-white/40 text-sm">Start playing puzzles to see your history here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {gameHistory.map((game) => (
                <div 
                  key={game.id} 
                  className="flex items-center gap-4 p-4 bg-puzzle-black/30 rounded-lg border border-puzzle-aqua/20"
                >
                  {/* Puzzle Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-puzzle-black/50 flex-shrink-0">
                    {game.puzzles?.image_url ? (
                      <img 
                        src={game.puzzles.image_url} 
                        alt={game.puzzles.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gamepad2 className="h-6 w-6 text-puzzle-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Game Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-puzzle-white font-medium">
                        {game.puzzles?.title || 'Unknown Puzzle'}
                      </h3>
                      {game.is_winner && (
                        <Badge className="bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50">
                          <Trophy className="h-3 w-3 mr-1" />
                          Winner
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-puzzle-white/60">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(game.completion_time)}
                      </span>
                      <Badge className={getDifficultyColor(game.difficulty_level || 'medium')}>
                        {game.difficulty_level || 'Medium'}
                      </Badge>
                      <span>{game.puzzles?.pieces || 0} pieces</span>
                      <span>{formatDistanceToNow(new Date(game.completed_at), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Moves Count */}
                  <div className="text-right">
                    <p className="text-puzzle-white font-medium">{game.moves_count || 0}</p>
                    <p className="text-puzzle-white/60 text-sm">moves</p>
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              {gameHistory.length === limit && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(page + 1)}
                    className="border-puzzle-aqua/30 text-puzzle-aqua hover:bg-puzzle-aqua/10"
                  >
                    Load More Games
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
