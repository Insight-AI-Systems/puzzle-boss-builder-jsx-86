
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const topPlayers = [
    { rank: 1, name: 'PuzzleMaster2024', score: 15420, games: 156 },
    { rank: 2, name: 'WordWizard', score: 14890, games: 143 },
    { rank: 3, name: 'BrainTeaser', score: 14250, games: 138 },
    { rank: 4, name: 'QuickSolver', score: 13760, games: 129 },
    { rank: 5, name: 'MindBender', score: 13420, games: 125 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-400" />;
      default: return <span className="text-puzzle-white font-bold">#{rank}</span>;
    }
  };

  return (
    <PageLayout 
      title="Leaderboard" 
      subtitle="See how you rank against the best puzzle solvers"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-puzzle-gold" />
              Top Players - All Time
            </CardTitle>
            <CardDescription>
              Rankings based on total score across all puzzle games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPlayers.map((player) => (
                <div 
                  key={player.rank} 
                  className="flex items-center justify-between p-4 bg-puzzle-gray/20 rounded-lg border border-puzzle-border"
                >
                  <div className="flex items-center gap-4">
                    {getRankIcon(player.rank)}
                    <div>
                      <h3 className="text-puzzle-white font-semibold">{player.name}</h3>
                      <p className="text-puzzle-white/60 text-sm">{player.games} games played</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-puzzle-aqua font-bold text-lg">{player.score.toLocaleString()}</p>
                    <p className="text-puzzle-white/60 text-sm">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Leaderboard;
