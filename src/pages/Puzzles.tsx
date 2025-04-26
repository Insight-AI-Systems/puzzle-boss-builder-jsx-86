import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Award, Search } from 'lucide-react';
import { usePuzzles } from '@/hooks/usePuzzles';
import { Loader2 } from 'lucide-react';

const PUZZLE_CATEGORIES = [
  'Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Gaming', 'All Categories'
];

const PuzzleCard = ({ puzzle }) => {
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
        <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80">
          Play Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const Puzzles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { puzzles, isLoading, isError } = usePuzzles();
  
  const activePuzzles = puzzles.filter(puzzle => puzzle.status === "active");
  
  console.log("All puzzles:", puzzles);
  console.log("Active puzzles:", activePuzzles);

  const filteredPuzzles = activePuzzles.filter(puzzle => 
    puzzle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.prize?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <PageLayout 
        title="Puzzles" 
        subtitle="Loading puzzles..."
        className="max-w-6xl"
      >
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-puzzle-aqua" />
        </div>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout 
        title="Puzzles" 
        subtitle="Error loading puzzles"
        className="max-w-6xl"
      >
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">Failed to load puzzles. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </PageLayout>
    );
  }

  if (activePuzzles.length === 0) {
    return (
      <PageLayout 
        title="Puzzles" 
        subtitle="No puzzles available yet"
        className="max-w-6xl"
      >
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">No active puzzles found. Please check back later.</p>
        </div>
      </PageLayout>
    );
  }

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
              .sort((a, b) => (b.completions || 0) - (a.completions || 0))
              .map((puzzle) => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ending" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles
              .sort((a, b) => (a.timeLimit || 0) - (b.timeLimit || 0))
              .map((puzzle) => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles
              .sort((a, b) => new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime())
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
