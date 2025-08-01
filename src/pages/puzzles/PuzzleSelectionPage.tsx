import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import { PuzzleGameSelector } from '@/components/puzzles/game-selection/PuzzleGameSelector';
import { DifficultySelector } from '@/components/puzzles/difficulty/DifficultySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Puzzle, Clock, Star, Users } from 'lucide-react';

// Mock data - in real app would come from API
const mockPuzzles = [
  {
    id: 'puzzle-1',
    name: 'Mountain Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    difficulty: 'Easy' as const,
    pieces: 20,
    timeLimit: 300,
    cost: 1.99,
    completions: 1234,
    avgTime: 180,
    prizeValue: 10
  },
  {
    id: 'puzzle-2',
    name: 'City Skyline',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    difficulty: 'Medium' as const,
    pieces: 100,
    timeLimit: 600,
    cost: 2.99,
    completions: 892,
    avgTime: 420,
    prizeValue: 25
  },
  {
    id: 'puzzle-3',
    name: 'Ocean Waves',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
    difficulty: 'Hard' as const,
    pieces: 500,
    timeLimit: 1800,
    cost: 4.99,
    completions: 445,
    avgTime: 1200,
    prizeValue: 50
  }
];

const difficulties = [
  {
    id: 'easy',
    name: 'Easy',
    pieces: 20,
    gridSize: '4×5',
    timeEstimate: '3-5 min',
    price: 1.99,
    description: 'Perfect for beginners and quick games'
  },
  {
    id: 'medium',
    name: 'Medium',
    pieces: 100,
    gridSize: '10×10',
    timeEstimate: '10-15 min',
    price: 2.99,
    description: 'Good balance of challenge and fun'
  },
  {
    id: 'hard',
    name: 'Hard',
    pieces: 500,
    gridSize: '20×25',
    timeEstimate: '30-45 min',
    price: 4.99,
    description: 'For experienced puzzle solvers'
  }
];

export const PuzzleSelectionPage: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const filteredPuzzles = mockPuzzles.filter(puzzle => 
    puzzle.difficulty.toLowerCase() === selectedDifficulty
  );

  return (
    <PageLayout 
      title="Jigsaw Puzzles" 
      subtitle="Choose your puzzle and test your skills"
    >
      <div className="space-y-8">
        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
            <CardContent className="p-4 text-center">
              <Puzzle className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
              <div className="text-2xl font-bold text-puzzle-white">150+</div>
              <div className="text-sm text-muted-foreground">Total Puzzles</div>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-puzzle-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-puzzle-white">2.5K</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
              <div className="text-2xl font-bold text-puzzle-white">8:42</div>
              <div className="text-sm text-muted-foreground">Avg Completion</div>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-puzzle-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-puzzle-white">$250</div>
              <div className="text-sm text-muted-foreground">Daily Prizes</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="puzzles">
          <TabsList className="grid w-full grid-cols-2 bg-puzzle-black/50 border border-puzzle-aqua/30">
            <TabsTrigger value="puzzles" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
              Browse Puzzles
            </TabsTrigger>
            <TabsTrigger value="difficulty" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
              Select Difficulty
            </TabsTrigger>
          </TabsList>

          <TabsContent value="puzzles" className="space-y-6">
            {/* Quick Difficulty Filter */}
            <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
              <CardHeader>
                <CardTitle className="text-puzzle-white">Filter by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <Button
                      key={diff.id}
                      variant={selectedDifficulty === diff.id ? "default" : "outline"}
                      className={selectedDifficulty === diff.id 
                        ? "bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
                        : "text-puzzle-aqua border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
                      }
                      onClick={() => setSelectedDifficulty(diff.id)}
                    >
                      {diff.name} ({diff.pieces} pieces)
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <PuzzleGameSelector puzzles={filteredPuzzles} />
          </TabsContent>

          <TabsContent value="difficulty" className="space-y-6">
            <DifficultySelector
              difficulties={difficulties}
              selectedDifficulty={selectedDifficulty}
              onSelect={setSelectedDifficulty}
            />
            
            <div className="text-center">
              <Link to={`/puzzles/jigsaw/custom?difficulty=${selectedDifficulty}`}>
                <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                  Start Custom Puzzle
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default PuzzleSelectionPage;