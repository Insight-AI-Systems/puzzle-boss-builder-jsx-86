
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import PuzzleEnginePlayground from '@/components/puzzles/playground/PuzzleEnginePlayground';
import { PuzzlePreview } from '@/components/puzzles/components/PuzzlePreview';

type PuzzleItem = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  difficulty_level: string;
  status: string;
  total_plays: number;
  prize_amount: number;
  category_id: string;
  category_name?: string;
}

const Puzzles = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch active puzzles
  const { data: puzzles, isLoading } = useQuery({
    queryKey: ['puzzles', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('puzzles')
        .select('*, categories(name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query.limit(20);
      
      if (error) throw error;
      
      // Format data to include category_name and ensure it matches the PuzzleItem type
      return data.map(puzzle => ({
        ...puzzle,
        category_name: puzzle.categories?.name || 'Uncategorized',
        total_plays: puzzle.completions || 0,
        prize_amount: puzzle.prize_value || 0
      })) as PuzzleItem[];
    }
  });

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  return (
    <PageLayout title="Jigsaw Puzzles" className="max-w-7xl">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Solve Beautiful Jigsaw Puzzles</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Challenge yourself with our collection of stunning jigsaw puzzles.
          Compete for prizes or just relax and enjoy the fun of puzzle solving.
        </p>
      </section>

      {/* Showcase our new puzzle engine */}
      <section className="mb-12 bg-muted/30 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Try Our New Puzzle Engine</h2>
        <div className="max-w-lg mx-auto">
          <PuzzleEnginePlayground 
            difficulty="easy"
            heroMode={true}
            showNumbersToggle={true}
          />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-3">Our advanced puzzle engine features smooth dragging, precise snap-to-grid, and progress saving.</p>
          <Button asChild variant="default" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            <Link to="/how-it-works">Learn More About Our Engine</Link>
          </Button>
        </div>
      </section>

      {/* Category filter */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge 
            className={`cursor-pointer ${!selectedCategory ? 'bg-primary' : 'bg-secondary hover:bg-primary/80'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge 
              key={category.id}
              className={`cursor-pointer ${selectedCategory === category.id ? 'bg-primary' : 'bg-secondary hover:bg-primary/80'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Puzzle grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {puzzles && puzzles.map(puzzle => (
            <Card key={puzzle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold truncate">{puzzle.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-square relative rounded-md overflow-hidden mb-3">
                  <PuzzlePreview imageUrl={puzzle.image_url} difficulty={puzzle.difficulty_level} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Difficulty: {puzzle.difficulty_level}</span>
                  <span>{puzzle.total_plays || 0} plays</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Badge variant="outline">{puzzle.category_name}</Badge>
                {puzzle.prize_amount > 0 && (
                  <Badge className="bg-puzzle-gold">Prize: ${puzzle.prize_amount}</Badge>
                )}
              </CardFooter>
              <Button 
                asChild
                className="w-full rounded-t-none bg-puzzle-aqua hover:bg-puzzle-aqua/80"
              >
                <Link to={`/puzzle/${puzzle.id}`}>Play Now</Link>
              </Button>
            </Card>
          ))}
          
          {puzzles && puzzles.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No puzzles found in this category.</p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default Puzzles;
