
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, DollarSign, Calendar, Gift, Star, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileWinningsTabProps {
  userId: string;
}

export function ProfileWinningsTab({ userId }: ProfileWinningsTabProps) {
  const { data: winnings, isLoading } = useQuery({
    queryKey: ['user-winnings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_winners')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: winningsStats } = useQuery({
    queryKey: ['winnings-stats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_winners')
        .select('prize_value, completion_time')
        .eq('user_id', userId);

      if (error) throw error;

      const totalWinnings = data.reduce((sum, win) => sum + win.prize_value, 0);
      const totalPrizes = data.length;
      const avgPrizeValue = totalPrizes > 0 ? totalWinnings / totalPrizes : 0;
      const biggestWin = Math.max(...data.map(win => win.prize_value), 0);

      return {
        totalWinnings,
        totalPrizes,
        avgPrizeValue,
        biggestWin,
      };
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Winnings Statistics */}
      {winningsStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-puzzle-gold" />
                Total Winnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-puzzle-gold">
                {formatCurrency(winningsStats.totalWinnings)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-puzzle-aqua" />
                Total Prizes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-puzzle-aqua">{winningsStats.totalPrizes}</p>
            </CardContent>
          </Card>

          <Card className="bg-puzzle-black/50 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Average Prize
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(winningsStats.avgPrizeValue)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-puzzle-black/50 border-yellow-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-400" />
                Biggest Win
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(winningsStats.biggestWin)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Winnings History */}
      <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Gift className="h-5 w-5 text-puzzle-gold" />
            Prize History
            {winningsStats && (
              <Badge variant="outline" className="ml-auto border-puzzle-gold/50 text-puzzle-gold">
                {winningsStats.totalPrizes} prizes won
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-puzzle-white/60">Loading winnings...</div>
            </div>
          ) : !winnings || winnings.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-puzzle-white/30 mx-auto mb-4" />
              <p className="text-puzzle-white/60">No prizes won yet</p>
              <p className="text-puzzle-white/40 text-sm">Keep playing to win your first prize!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {winnings.map((winning) => (
                <div 
                  key={winning.id} 
                  className="flex items-center gap-4 p-4 bg-puzzle-gold/10 rounded-lg border border-puzzle-gold/30"
                >
                  {/* Prize Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-puzzle-black/50 flex-shrink-0">
                    {winning.puzzle_image_url ? (
                      <img 
                        src={winning.puzzle_image_url} 
                        alt={winning.puzzle_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-puzzle-gold" />
                      </div>
                    )}
                  </div>

                  {/* Prize Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-puzzle-white font-medium">
                        {winning.puzzle_name}
                      </h3>
                      <Badge className="bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50">
                        <Trophy className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-puzzle-white/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(winning.created_at), { addSuffix: true })}
                      </span>
                      <span>Completion: {formatTime(winning.completion_time)}</span>
                      {winning.winner_country && (
                        <span>🌍 {winning.winner_country}</span>
                      )}
                    </div>
                  </div>

                  {/* Prize Value */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-puzzle-gold">
                      {formatCurrency(winning.prize_value)}
                    </p>
                    <p className="text-puzzle-white/60 text-sm">Prize Value</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Note */}
      <Card className="bg-purple-500/10 border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-purple-400 mt-0.5" />
            <div>
              <p className="text-purple-400 font-medium">Achievement Unlocked!</p>
              <p className="text-purple-300/80 text-sm mt-1">
                {winningsStats && winningsStats.totalPrizes > 0 
                  ? `Congratulations on winning ${winningsStats.totalPrizes} prize${winningsStats.totalPrizes > 1 ? 's' : ''}! Keep playing to unlock more achievements and bigger prizes.`
                  : "Play puzzles to start winning prizes and unlock achievements!"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
