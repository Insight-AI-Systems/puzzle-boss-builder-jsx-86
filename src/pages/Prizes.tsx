
import React from 'react';
import { Trophy, Clock, MapPin, Gift, RefreshCw, AlertTriangle } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const { winners, isLoading, error, refetch } = usePrizeWinners();

  const handleRefresh = () => {
    refetch();
  };

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
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4" 
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Winners
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin mb-2">
            <RefreshCw className="h-8 w-8 text-puzzle-aqua" />
          </div>
          <p className="text-muted-foreground">Loading prize winners...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 border border-destructive/20 rounded-lg bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-semibold mb-1">Error loading prize winners</p>
          <p className="text-muted-foreground text-sm mb-4">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
          <Button variant="destructive" size="sm" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {winners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2 text-lg">No prize winners found for today.</p>
              <p className="text-sm opacity-70">Check back later or be the first winner!</p>
              <div className="mt-4 text-xs text-muted-foreground/60">
                Debug info: Attempted to fetch winners for {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {winners.map((winner) => (
                <PrizeCard key={winner.id} winner={winner} />
              ))}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Prizes;
