
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Trophy, Star } from 'lucide-react';

const PrizesWon: React.FC = () => {
  return (
    <PageLayout 
      title="Prizes Won" 
      subtitle="Track your achievements and claim your rewards"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Gift className="h-6 w-6 text-puzzle-gold" />
              Your Prize Collection
            </CardTitle>
            <CardDescription>
              Prizes you've earned through completing puzzles and achieving high scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-puzzle-gold mx-auto mb-4" />
              <h3 className="text-puzzle-white text-xl font-semibold mb-2">No Prizes Yet</h3>
              <p className="text-puzzle-white/60 mb-6">
                Complete puzzles and climb the leaderboards to earn amazing prizes!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-puzzle-gray/20 rounded-lg border border-puzzle-border">
                  <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="text-puzzle-white font-semibold">Daily Challenges</h4>
                  <p className="text-puzzle-white/60 text-sm">Complete daily puzzles to earn points</p>
                </div>
                <div className="p-4 bg-puzzle-gray/20 rounded-lg border border-puzzle-border">
                  <Trophy className="h-8 w-8 text-puzzle-gold mx-auto mb-2" />
                  <h4 className="text-puzzle-white font-semibold">Leaderboard Rewards</h4>
                  <p className="text-puzzle-white/60 text-sm">Top players win weekly prizes</p>
                </div>
                <div className="p-4 bg-puzzle-gray/20 rounded-lg border border-puzzle-border">
                  <Gift className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                  <h4 className="text-puzzle-white font-semibold">Achievement Unlocks</h4>
                  <p className="text-puzzle-white/60 text-sm">Special rewards for milestones</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PrizesWon;
