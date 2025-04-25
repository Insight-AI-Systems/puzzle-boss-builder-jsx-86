
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { usePrizeWinners } from '@/hooks/usePrizeWinners';

const PrizeCard = ({ winner }: { winner: ReturnType<typeof usePrizeWinners>['winners'][0] }) => {
  return (
    <Card className="overflow-hidden border border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all hover:shadow-lg hover:shadow-puzzle-aqua/10">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-b from-puzzle-black/50 to-puzzle-black/90">
        <img 
          src={winner.puzzle_image_url} 
          alt={winner.puzzle_name} 
          className="w-full h-full object-cover mix-blend-luminosity opacity-80"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-puzzle-gold hover:bg-puzzle-gold/90">${winner.prize_value}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="border-puzzle-aqua/50">{winner.winner_country}</Badge>
          <span className="text-lg font-bold text-puzzle-gold">{winner.completion_time.toFixed(2)}s</span>
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
        <h2 className="text-2xl font-bold text-puzzle-white mb-2">Today's Winners</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          These skilled players completed their puzzles the fastest and won amazing prizes. 
          Can you beat their times?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {winners.map((winner) => (
          <PrizeCard key={winner.id} winner={winner} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Prizes;
