
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Users } from 'lucide-react';

export const CompetitionHighlights: React.FC = () => {
  return (
    <section className="py-16 bg-puzzle-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-game text-puzzle-white mb-4">
            Competition Highlights
          </h2>
          <p className="text-puzzle-white/70">
            Join our exciting competitions and win amazing prizes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-puzzle-black border-puzzle-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-puzzle-white">
                <Trophy className="h-5 w-5 text-puzzle-gold" />
                Weekly Tournament
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-puzzle-white/70">
                Compete against players worldwide in our weekly puzzle tournament
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black border-puzzle-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-puzzle-white">
                <Clock className="h-5 w-5 text-puzzle-aqua" />
                Speed Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-puzzle-white/70">
                Test your speed in time-limited puzzle challenges
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black border-puzzle-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-puzzle-white">
                <Users className="h-5 w-5 text-puzzle-gold" />
                Team Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-puzzle-white/70">
                Join forces with other players in collaborative puzzle events
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
