
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layouts/PageLayout';
import PuzzleGame from '@/components/puzzles/PuzzleGame';
import { Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PuzzlePlay = () => {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const { toast } = useToast();
  const [activePlayers, setActivePlayers] = useState<string[]>([]);

  // Mutation to update active players
  const updateActivePlayers = useMutation({
    mutationFn: async (action: 'join' | 'leave') => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('update_puzzle_active_players', {
        puzzle_id: puzzleId,
        user_id: user.id,
        action: action
      });

      if (error) {
        console.error('Error updating active players:', error);
      }
    }
  });

  // Fetch puzzle details
  const { data: puzzle, isLoading, error } = useQuery({
    queryKey: ['puzzle', puzzleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puzzles')
        .select('*, active_players')
        .eq('id', puzzleId)
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
      },
      onSuccess: (data) => {
        const currentActivePlayers = data.active_players?.map((player: any) => player.user_id) || [];
        setActivePlayers(currentActivePlayers);
      }
    }
  });

  // Track joining the puzzle when component mounts
  useEffect(() => {
    updateActivePlayers.mutate('join');

    // Clean up by leaving the puzzle when component unmounts
    return () => {
      updateActivePlayers.mutate('leave');
    };
  }, [puzzleId]);

  // Real-time subscription to active players
  useEffect(() => {
    const channel = supabase
      .channel('puzzle_active_players')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'puzzles',
          filter: `id=eq.${puzzleId}` 
        },
        (payload) => {
          const currentActivePlayers = payload.new.active_players?.map((player: any) => player.user_id) || [];
          setActivePlayers(currentActivePlayers);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [puzzleId]);

  // If there's no puzzle data yet, show a temp display with sample image
  if (isLoading || error || !puzzle) {
    return (
      <PageLayout title={isLoading ? "Loading Puzzle" : "Puzzle Demo"} className="max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-puzzle-aqua" />
          </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">{error ? "Sorry, this puzzle isn't available" : "Demo Puzzle"}</h2>
            <p className="mb-6 text-muted-foreground">
              {error 
                ? "The puzzle you're looking for might not exist or isn't currently active."
                : "Try out our new puzzle engine with this demo puzzle!"}
            </p>
            
            <div className="bg-card rounded-lg border shadow p-4 max-w-4xl mx-auto">
              <PuzzleGame 
                imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                rows={3}
                columns={3}
                showNumbers={false}
              />
            </div>
            
            <Button asChild className="mt-6 bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              <a href="/puzzles">Back to Puzzles</a>
            </Button>
          </div>
        )}
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Difficulty:</span>
            <span>{(puzzle.difficulty_level || 'Medium').charAt(0).toUpperCase() + (puzzle.difficulty_level || 'Medium').slice(1)}</span>
          </div>
          {puzzle.time_limit && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Time Limit:</span>
              <span>{Math.floor(puzzle.time_limit / 60)}:{(puzzle.time_limit % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-puzzle-aqua" />
            <span className="font-medium">Active Players:</span>
            <span>{activePlayers.length}</span>
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
