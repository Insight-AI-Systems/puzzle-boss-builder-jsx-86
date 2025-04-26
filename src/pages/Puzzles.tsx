
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { usePuzzles } from '@/hooks/usePuzzles';
import PageLayout from '@/components/layouts/PageLayout';
import { PuzzleSearch } from '@/components/puzzles/PuzzleSearch';
import { PuzzleCategories } from '@/components/puzzles/PuzzleCategories';
import { PuzzleGrid } from '@/components/puzzles/PuzzleGrid';

const Puzzles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { puzzles, isLoading, isError } = usePuzzles();
  
  const activePuzzles = puzzles.filter(puzzle => puzzle.status === "active");
  
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
      <PuzzleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Puzzles</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="ending">Ending Soon</TabsTrigger>
            <TabsTrigger value="new">Newest</TabsTrigger>
          </TabsList>
          <PuzzleCategories />
        </div>
        
        <TabsContent value="all" className="mt-0">
          <PuzzleGrid puzzles={filteredPuzzles} />
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          <PuzzleGrid 
            puzzles={filteredPuzzles.sort((a, b) => (b.completions || 0) - (a.completions || 0))} 
          />
        </TabsContent>
        
        <TabsContent value="ending" className="mt-0">
          <PuzzleGrid 
            puzzles={filteredPuzzles.sort((a, b) => (a.timeLimit || 0) - (b.timeLimit || 0))} 
          />
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <PuzzleGrid 
            puzzles={filteredPuzzles.sort((a, b) => 
              new Date(b.created_at || Date.now()).getTime() - 
              new Date(a.created_at || Date.now()).getTime()
            )} 
          />
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
