
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Trophy, Gift, Users } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Play,
      title: 'Choose Your Puzzle',
      description: 'Select from our variety of brain-challenging puzzle games including word search, sudoku, memory games, and more.'
    },
    {
      icon: Users,
      title: 'Compete & Play',
      description: 'Challenge yourself against the clock or compete with other players. Track your progress and improve your skills.'
    },
    {
      icon: Trophy,
      title: 'Climb the Leaderboards',
      description: 'Earn points for completing puzzles and achieving high scores. See how you rank against other puzzle enthusiasts.'
    },
    {
      icon: Gift,
      title: 'Win Amazing Prizes',
      description: 'Top performers and consistent players earn rewards including cash prizes, gift cards, and exclusive puzzle content.'
    }
  ];

  return (
    <PageLayout 
      title="How It Works" 
      subtitle="Learn how to play, compete, and win on PuzzleBoss"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="bg-puzzle-black/50 border-puzzle-aqua/30 text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-puzzle-aqua" />
                  </div>
                  <CardTitle className="text-puzzle-white text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-puzzle-white/70">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white text-2xl text-center">Ready to Get Started?</CardTitle>
            <CardDescription className="text-center text-lg">
              Join thousands of puzzle enthusiasts and start your journey to becoming a PuzzleBoss champion!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <p className="text-puzzle-white/80">
                • Free to play with optional premium features
              </p>
              <p className="text-puzzle-white/80">
                • Daily challenges and tournaments
              </p>
              <p className="text-puzzle-white/80">
                • Real prizes for top performers
              </p>
              <p className="text-puzzle-white/80">
                • Cross-platform play on any device
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default HowItWorks;
