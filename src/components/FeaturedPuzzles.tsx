
import React from 'react';
import { Trophy, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { usePuzzles } from '@/hooks/usePuzzles';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface PuzzleCardProps {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prize: string;
  timeLimit: number; // in seconds
  completions: number;
  imageUrl: string;
  prizeValue: number;
}

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500'
};

const PuzzleCard: React.FC<PuzzleCardProps> = ({ 
  title, difficulty, prize, timeLimit, completions, imageUrl, prizeValue
}) => {
  const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const formattedPrizeValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(prizeValue);
  
  // Format time limit as "X days left" or "X hours left"
  const daysLeft = Math.ceil(timeLimit / (60 * 60 * 24));
  const timeLeft = daysLeft > 0 ? `${daysLeft} days left` : 'Ending soon';
  
  return (
    <Card className="card-highlight overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-puzzle-black to-transparent z-10" />
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className={`absolute top-2 right-2 z-20 ${difficultyColors[difficulty]}`}>
          {formattedDifficulty}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-puzzle-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-xl font-game text-puzzle-gold">{formattedPrizeValue}</div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-puzzle-aqua" />
          <span>{timeLeft}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} className="text-puzzle-aqua" />
          <span>{completions} players</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const FeaturedPuzzles: React.FC = () => {
  const { puzzles, isLoading, isError } = usePuzzles();
  
  // Get active puzzles and sort by prize value (descending)
  const featuredPuzzles = puzzles
    .filter(puzzle => puzzle.status === 'active')
    .sort((a, b) => (b.prizeValue || 0) - (a.prizeValue || 0))
    .slice(0, 4); // Only show top 4 most valuable puzzles
  
  if (isLoading) {
    return (
      <section className="py-16" id="prizes">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-puzzle-white">
            Featured <span className="text-puzzle-aqua">Competitions</span>
          </h2>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-puzzle-aqua" />
          </div>
        </div>
      </section>
    );
  }
  
  if (isError || featuredPuzzles.length === 0) {
    return null; // Don't show the section if there's an error or no puzzles
  }

  return (
    <section className="py-16" id="prizes">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          Featured <span className="text-puzzle-aqua">Competitions</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Join these active competitions and race to solve puzzles for a chance to win premium prizes from top brands.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPuzzles.map((puzzle) => (
            <PuzzleCard 
              key={puzzle.id}
              title={puzzle.name}
              difficulty={puzzle.difficulty}
              prize={puzzle.prize || puzzle.name}
              timeLimit={puzzle.timeLimit}
              completions={puzzle.completions || 0}
              imageUrl={puzzle.imageUrl}
              prizeValue={puzzle.prizeValue || 0}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button className="btn-primary" asChild>
            <Link to="/puzzles">View All Competitions</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPuzzles;
