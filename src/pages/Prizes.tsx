
import React from 'react';
import { Trophy, Clock, MapPin, Gift } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePrizeWinners } from '@/hooks/usePrizeWinners';

const PrizeCard = ({ winner }: { winner: ReturnType<typeof usePrizeWinners>['winners'][0] }) => {
  return (
    <Card className="overflow-hidden border border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all hover:shadow-lg hover:shadow-puzzle-aqua/10">
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-b from-puzzle-black/50 to-puzzle-black/90">
        <img 
          src={winner.puzzle_image_url} 
          alt={winner.puzzle_name} 
          className="w-full h-full object-cover mix-blend-luminosity opacity-80"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90">
            <Gift className="h-4 w-4 mr-2" />
            ${winner.prize_value.toFixed(2)}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="border-puzzle-aqua/50">
            <MapPin className="h-4 w-4 mr-2" />
            {winner.winner_country}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {winner.completion_time.toFixed(2)}s
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{winner.puzzle_name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-sm text-muted-foreground">
          Won by {winner.winner_name}
        </p>
      </CardContent>
    </Card>
  );
};

const Prizes = () => {
  const { winners } = usePrizeWinners();

  return (
    <PageLayout 
      title="Prizes Won" 
      subtitle="Check out our latest puzzle champions and their amazing prizes"
      className="max-w-6xl"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-puzzle-aqua/10 rounded-full mb-4">
          <Trophy className="h-10 w-10 text-puzzle-gold" />
        </div>
        <h2 className="text-2xl font-bold text-puzzle-white mb-2">Today's Champions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          These skilled players completed their puzzles the fastest and won amazing prizes. 
          Can you beat their times?
        </p>
      </div>

      {winners.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No prize winners today. Be the first!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {winners.map((winner) => (
            <PrizeCard key={winner.id} winner={winner} />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default Prizes;
