import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Award, Search } from 'lucide-react';

const PUZZLE_CATEGORIES = [
  'Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Gaming', 'All Categories'
];

const PLACEHOLDER_PUZZLES = [
  {
    id: 1,
    title: 'iPhone 15 Pro Challenge',
    players: 1245,
    timeLeft: '2 days',
    difficulty: 'Medium',
    prize: 'iPhone 15 Pro',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 2,
    title: 'PlayStation 5 Puzzle',
    players: 3782,
    timeLeft: '5 days',
    difficulty: 'Hard',
    prize: 'PlayStation 5',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 3,
    title: 'MacBook Air M2 Challenge',
    players: 2190,
    timeLeft: '1 day',
    difficulty: 'Easy',
    prize: 'MacBook Air M2',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 4,
    title: 'AirPods Pro Puzzle',
    players: 987,
    timeLeft: '3 days',
    difficulty: 'Easy',
    prize: 'AirPods Pro',
    category: 'Headphones',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 5,
    title: 'Samsung Galaxy Watch Challenge',
    players: 1567,
    timeLeft: '4 days',
    difficulty: 'Medium',
    prize: 'Samsung Galaxy Watch',
    category: 'Smartwatches',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 6,
    title: 'Nintendo Switch Puzzle',
    players: 2456,
    timeLeft: '2 days',
    difficulty: 'Medium',
    prize: 'Nintendo Switch',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=400&h=300'
  },
];

const PuzzleCard = ({ puzzle }: { puzzle: typeof PLACEHOLDER_PUZZLES[0] }) => {
  return (
    <Card className="overflow-hidden border border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-all hover:shadow-lg hover:shadow-puzzle-aqua/10">
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={puzzle.image} 
          alt={puzzle.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">{puzzle.category}</Badge>
          <Badge variant="outline" className="border-puzzle-gold text-puzzle-gold">
            {puzzle.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{puzzle.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{puzzle.players} players</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{puzzle.timeLeft} left</span>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <Award className="h-4 w-4 mr-1 text-puzzle-gold" />
          <span className="text-sm font-medium">Prize: {puzzle.prize}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80">
          Play Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const Puzzles = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPuzzles = PLACEHOLDER_PUZZLES.filter(puzzle => 
    puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.prize.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout 
      title="Puzzles" 
      subtitle="Compete in skill-based puzzles to win premium prizes"
      className="max-w-6xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search puzzles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Puzzles</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="ending">Ending Soon</TabsTrigger>
            <TabsTrigger value="new">Newest</TabsTrigger>
          </TabsList>
          
          <div className="hidden md:flex space-x-2">
            {PUZZLE_CATEGORIES.map((category) => (
              <Badge 
                key={category} 
                variant={category === 'All Categories' ? 'default' : 'outline'}
                className={category === 'All Categories' ? 'bg-puzzle-aqua hover:bg-puzzle-aqua/80' : 'hover:bg-puzzle-aqua/10'}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles.map((puzzle) => (
              <PuzzleCard key={puzzle.id} puzzle={puzzle} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles
              .sort((a, b) => b.players - a.players)
              .map((puzzle) => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ending" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles
              .sort((a, b) => parseInt(a.timeLeft) - parseInt(b.timeLeft))
              .map((puzzle) => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles
              .sort((a, b) => b.id - a.id)
              .map((puzzle) => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-10">
        <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
          Load More Puzzles
        </Button>
      </div>
    </PageLayout>
  );
};

export default Puzzles;
