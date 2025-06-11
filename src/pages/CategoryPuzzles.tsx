
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useCategories';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronLeft } from 'lucide-react';
import { PuzzlePreview } from '@/components/puzzles/components/PuzzlePreview';

type CategoryPuzzle = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  difficulty_level: string;
  status: string;
  total_plays: number;
  prize_amount: number;
}

const CategoryPuzzles = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categories } = useCategories();
  
  // Find the current category
  const currentCategory = categories?.find(cat => cat.id === categoryId);

  // Fetch puzzles for this category with better error handling
  const { data: puzzles, isLoading, error } = useQuery({
    queryKey: ['category-puzzles', categoryId],
    queryFn: async () => {
      if (!categoryId) {
        console.log('No categoryId provided');
        return [];
      }
      
      console.log('Fetching puzzles for category:', categoryId);
      
      try {
        const { data, error } = await supabase
          .from('puzzles')
          .select('*')
          .eq('category_id', categoryId)
          .eq('status', 'active')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Database error fetching puzzles:', error);
          throw error;
        }
        
        console.log('Fetched puzzles:', data);
        
        return (data || []).map(puzzle => ({
          ...puzzle,
          total_plays: puzzle.completions || 0,
          prize_amount: puzzle.prize_value || 0
        })) as CategoryPuzzle[];
      } catch (err) {
        console.error('Error in puzzle fetch:', err);
        throw err;
      }
    },
    enabled: !!categoryId,
    retry: 3,
    retryDelay: 1000
  });

  // Filter puzzles based on search term
  const filteredPuzzles = puzzles?.filter(puzzle =>
    puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!categoryId) {
    return (
      <PageLayout title="Category Not Found" className="max-w-7xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Category not found.</p>
          <Button asChild variant="outline">
            <Link to="/categories">Back to Categories</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={currentCategory?.name || 'Category Puzzles'} className="max-w-7xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link 
          to="/categories" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
      </div>

      {/* Category Header */}
      <section className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          {currentCategory?.image_url && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={currentCategory.image_url} 
                alt={currentCategory.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{currentCategory?.name || 'Category Puzzles'}</h1>
            <p className="text-muted-foreground">
              {currentCategory?.description || 'Explore puzzles in this category'}
            </p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search puzzles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            Failed to load puzzles: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Puzzles Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPuzzles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPuzzles.map(puzzle => (
            <Card key={puzzle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold truncate">{puzzle.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-square relative rounded-md overflow-hidden mb-3">
                  <PuzzlePreview imageUrl={puzzle.image_url} difficulty={puzzle.difficulty_level} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Difficulty: {puzzle.difficulty_level}</span>
                  <span>{puzzle.total_plays} plays</span>
                </div>
                {puzzle.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{puzzle.description}</p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                {puzzle.prize_amount > 0 && (
                  <Badge className="bg-puzzle-gold text-black">
                    Prize: ${puzzle.prize_amount}
                  </Badge>
                )}
                <div className="flex-1" />
                <Button 
                  asChild
                  size="sm"
                  className="bg-puzzle-aqua hover:bg-puzzle-aqua/80"
                >
                  <Link to={`/puzzle/${puzzle.id}`}>Play</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {error ? 'Failed to load puzzles.' : 
             searchTerm ? 'No puzzles found matching your search.' : 
             'No puzzles available in this category yet.'}
          </p>
          {searchTerm && !error && (
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Clear Search
            </Button>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default CategoryPuzzles;
