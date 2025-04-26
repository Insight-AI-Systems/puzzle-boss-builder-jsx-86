
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layouts/PageLayout';
import PuzzleGame from '@/components/puzzles/PuzzleGame';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PuzzlePlay = () => {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const { toast } = useToast();
  
  const { data: puzzle, isLoading, error } = useQuery({
    queryKey: ['puzzle', puzzleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('id', puzzleId)
        .eq('status', 'active')
        .maybeSingle();
        
      if (error) throw error;
      if (!data) throw new Error('Puzzle not found or not active');
      
      return data;
    },
    meta: {
      onError: (err: Error) => {
        console.error('Error loading puzzle:', err);
        toast({
          title: "Error loading puzzle",
          description: "This puzzle could not be loaded. It may not exist or is not currently active.",
          variant: "destructive"
        });
      }
    }
  });

  if (isLoading) {
    return (
      <PageLayout title="Loading Puzzle" className="max-w-6xl">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-puzzle-aqua" />
        </div>
      </PageLayout>
    );
  }

  if (error || !puzzle) {
    return (
      <PageLayout title="Puzzle Not Found" className="max-w-6xl">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Sorry, this puzzle isn't available</h2>
          <p className="mb-6 text-muted-foreground">The puzzle you're looking for might not exist or isn't currently active.</p>
          <Button asChild className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            <a href="/puzzles">Back to Puzzles</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Get rows and columns from puzzle config, with defaults
  const config = puzzle.puzzle_config as { rows?: number; columns?: number } || {};
  const rows = config?.rows || 4;
  const columns = config?.columns || 4;

  return (
    <PageLayout title={puzzle.title} className="max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{puzzle.title}</h2>
        {puzzle.description && (
          <p className="text-muted-foreground mb-4">{puzzle.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Difficulty:</span>
            <span>{(puzzle.difficulty_level || 'Medium').charAt(0).toUpperCase() + (puzzle.difficulty_level || 'Medium').slice(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Time Limit:</span>
            <span>{Math.floor(puzzle.time_limit / 60)}:{(puzzle.time_limit % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow p-4">
        <PuzzleGame 
          imageUrl={puzzle.image_url}
          puzzleId={puzzle.id}
          rows={rows}
          columns={columns}
          showNumbers={false}
        />
      </div>
    </PageLayout>
  );
};

export default PuzzlePlay;
