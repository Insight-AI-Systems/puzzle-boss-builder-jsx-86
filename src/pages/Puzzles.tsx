
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid3X3, Brain, Zap, Square, BookOpen } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Puzzles: React.FC = () => {
  const puzzleGames = [
    {
      name: 'Word Search Arena',
      href: '/puzzles/word-search',
      icon: Search,
      description: 'Find hidden words in challenging grids',
      difficulty: 'Easy',
      players: '1,234 active'
    },
    {
      name: 'Speed Sudoku',
      href: '/puzzles/sudoku',
      icon: Grid3X3,
      description: 'Classic number puzzle with time pressure',
      difficulty: 'Medium',
      players: '892 active'
    },
    {
      name: 'Memory Master',
      href: '/puzzles/memory',
      icon: Brain,
      description: 'Test your memory with matching pairs',
      difficulty: 'Easy',
      players: '567 active'
    },
    {
      name: 'Trivia Lightning',
      href: '/puzzles/trivia',
      icon: Zap,
      description: 'Quick-fire questions across multiple categories',
      difficulty: 'Medium',
      players: '743 active'
    },
    {
      name: 'Block Puzzle Pro',
      href: '/puzzles/blocks',
      icon: Square,
      description: 'Fit blocks together to clear lines',
      difficulty: 'Hard',
      players: '445 active'
    },
    {
      name: 'Daily Crossword',
      href: '/puzzles/crossword',
      icon: BookOpen,
      description: 'Traditional crossword puzzles updated daily',
      difficulty: 'Medium',
      players: '623 active'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-puzzle-white';
    }
  };

  return (
    <PageLayout 
      title="Puzzle Games" 
      subtitle="Choose from our collection of brain-challenging puzzle games"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzleGames.map((game) => {
          const Icon = game.icon;
          return (
            <Card key={game.href} className="bg-puzzle-black/50 border-puzzle-aqua/30 hover:border-puzzle-aqua/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="h-8 w-8 text-puzzle-aqua" />
                  <div>
                    <CardTitle className="text-puzzle-white">{game.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                      <span className="text-puzzle-white/60 text-sm">• {game.players}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-puzzle-white/70 mb-4">
                  {game.description}
                </CardDescription>
                <Link to={game.href}>
                  <Button className="w-full bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                    Play Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default Puzzles;
