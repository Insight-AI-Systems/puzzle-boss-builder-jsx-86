
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Puzzle } from '@/hooks/puzzles/puzzleTypes';

interface PuzzleCardProps {
  puzzle: Puzzle;
}

export const PuzzleCard: React.FC<PuzzleCardProps> = ({ puzzle }) => {
  const difficultyClass = 
    puzzle.difficulty === 'easy' ? 'border-puzzle-gold text-puzzle-gold' : 
    puzzle.difficulty === 'hard' ? 'border-red-500 text-red-500' :
    'border-puzzle-aqua text-puzzle-aqua';
  
  return (
    <Card className="overflow-hidden border border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all hover:shadow-lg hover:shadow-puzzle-aqua/10">
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={puzzle.imageUrl} 
          alt={puzzle.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">{puzzle.category}</Badge>
          <Badge variant="outline" className={difficultyClass}>
            {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{puzzle.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{puzzle.completions || 0} completions</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{Math.floor(puzzle.timeLimit / 60)}:{(puzzle.timeLimit % 60).toString().padStart(2, '0')} time limit</span>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <Award className="h-4 w-4 mr-1 text-puzzle-gold" />
          <span className="text-sm font-medium">Prize: {puzzle.prize}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80"
          asChild
        >
          <Link to={`/puzzle/${puzzle.id}`}>Play Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
