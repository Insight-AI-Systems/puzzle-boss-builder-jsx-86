import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PuzzleGame {
  id: string;
  name: string;
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pieces: number;
  timeLimit: number;
  cost: number;
  completions: number;
  avgTime: number;
  prizeValue: number;
}

interface PuzzleGameSelectorProps {
  puzzles: PuzzleGame[];
  onSelectPuzzle?: (puzzleId: string) => void;
}

export const PuzzleGameSelector: React.FC<PuzzleGameSelectorProps> = ({
  puzzles,
  onSelectPuzzle
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'Medium': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'Hard': return 'bg-red-400/20 text-red-400 border-red-400/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {puzzles.map((puzzle) => (
        <Card 
          key={puzzle.id} 
          className="bg-puzzle-black/50 border-puzzle-aqua/30 hover:border-puzzle-aqua/60 transition-all duration-300 group"
        >
          <CardHeader className="p-4">
            <div className="relative mb-3">
              <img 
                src={puzzle.imageUrl} 
                alt={puzzle.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge className={getDifficultyColor(puzzle.difficulty)}>
                  {puzzle.difficulty}
                </Badge>
                <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua/50">
                  {puzzle.pieces} pieces
                </Badge>
              </div>
            </div>
            <CardTitle className="text-puzzle-white text-lg">{puzzle.name}</CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Avg: {formatTime(puzzle.avgTime)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{puzzle.completions}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-puzzle-gold">
                  <Trophy className="h-4 w-4" />
                  <span>Prize: ${puzzle.prizeValue}</span>
                </div>
                <div className="text-puzzle-aqua font-medium">
                  ${puzzle.cost}
                </div>
              </div>
            </div>
            
            <Link to={`/puzzles/jigsaw/${puzzle.id}`}>
              <Button 
                className="w-full bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90 group-hover:shadow-lg transition-all"
                onClick={() => onSelectPuzzle?.(puzzle.id)}
              >
                <Star className="h-4 w-4 mr-2" />
                Play Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};