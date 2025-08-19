import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import { EnhancedJigsawWrapper } from '@/components/games/jigsaw/EnhancedJigsawWrapper';
import { JigsawLeaderboard } from '@/components/games/jigsaw/JigsawLeaderboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function EnhancedJigsawGamePage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('game');
  const [gameStats, setGameStats] = useState<any>(null);

  // Fetch puzzle data if ID is provided
  const { data: puzzle, isLoading, error } = useQuery({
    queryKey: ['puzzle', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('jigsaw_puzzles')
        .select('*, images:jigsaw_puzzle_images(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Mutation to save game score
  const saveScoreMutation = useMutation({
    mutationFn: async (stats: any) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('jigsaw_scores')
        .insert({
          puzzle_id: id,
          user_id: session.session.user.id,
          score: stats.score,
          time_seconds: stats.time,
          moves: stats.moves,
          completed: true
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Score Saved!',
        description: 'Your puzzle score has been saved to the leaderboard.',
      });
    },
    onError: (error) => {
      console.error('Failed to save score:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your score. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handlePuzzleComplete = async (stats: any) => {
    console.log('🎉 Puzzle completed with stats:', stats);
    setGameStats(stats);
    
    // Save score to database
    if (id) {
      await saveScoreMutation.mutateAsync(stats);
    }
    
    // Switch to leaderboard tab
    setActiveTab('leaderboard');
  };

  if (id && isLoading) {
    return (
      <PageLayout title="Loading Puzzle..." subtitle="">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (id && error) {
    return (
      <PageLayout title="Error" subtitle="">
        <Card className="p-8 text-center">
          <p className="text-red-500 mb-4">Failed to load puzzle</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </PageLayout>
    );
  }

  const title = puzzle?.title || "Enhanced Jigsaw Puzzle";
  const subtitle = puzzle?.description || "Experience our advanced puzzle engine with Konva rendering";
  const imageUrl = puzzle?.images?.[0]?.original_image_url || 
                  puzzle?.images?.[0]?.large_image_url || 
                  puzzle?.images?.[0]?.medium_image_url;
  const difficulty = puzzle?.difficulty_level || 'medium';

  return (
    <PageLayout title={title} subtitle={subtitle}>
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="game">Play Game</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-4">
            <EnhancedJigsawWrapper
              difficulty={difficulty as 'easy' | 'medium' | 'hard'}
              imageUrl={imageUrl}
              onComplete={handlePuzzleComplete}
            />
          </TabsContent>

          <TabsContent value="leaderboard">
            <JigsawLeaderboard puzzleId={id} />
          </TabsContent>

          <TabsContent value="stats">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Game Statistics</h3>
              
              {gameStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Last Score</p>
                      <p className="text-2xl font-bold">{gameStats.score}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="text-2xl font-bold">{gameStats.time}s</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Moves</p>
                      <p className="text-2xl font-bold">{gameStats.moves}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                      <p className="text-2xl font-bold">
                        {Math.round((gameStats.score / gameStats.moves) * 10) / 10}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Performance Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <p>• Speed Rating: {gameStats.time < 60 ? 'Excellent' : gameStats.time < 180 ? 'Good' : 'Average'}</p>
                      <p>• Efficiency: {gameStats.moves < 50 ? 'Very Efficient' : gameStats.moves < 100 ? 'Efficient' : 'Can Improve'}</p>
                      <p>• Overall Performance: {gameStats.score > 800 ? '⭐⭐⭐⭐⭐' : gameStats.score > 600 ? '⭐⭐⭐⭐' : '⭐⭐⭐'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Complete a puzzle to see your statistics</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Puzzle Information Card */}
        {puzzle && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-bold mb-3">Puzzle Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Difficulty</p>
                <p className="font-semibold capitalize">{difficulty}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Piece Count</p>
                <p className="font-semibold">{puzzle.piece_count || 'Variable'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-semibold">{puzzle.category || 'General'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-semibold">
                  {new Date(puzzle.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}