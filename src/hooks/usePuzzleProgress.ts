
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuzzleProgress, PuzzleProgressDB, mapDbToFrontendProgress, mapFrontendToDbProgress } from '@/types/puzzle-types';
import { useToast } from '@/hooks/use-toast';

export function usePuzzleProgress(puzzleId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Skip the query if puzzleId is empty
  const enabled = !!puzzleId;

  const { data: progress, isLoading } = useQuery({
    queryKey: ['puzzle-progress', puzzleId],
    queryFn: async () => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('puzzle_progress')
        .select('*')
        .eq('puzzle_id', puzzleId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      // If no data exists for this puzzle, return null
      if (!data) return null;
      
      // Map DB data to frontend model by extracting relevant fields
      // The actual DB schema differs from our PuzzleProgressDB interface
      const { 
        id, 
        user_id, 
        puzzle_id, 
        is_completed, 
        progress: puzzleProgress, 
        completion_time, 
        last_updated, 
        start_time 
      } = data;
      
      // Create a properly formatted PuzzleProgress object
      const mappedProgress: PuzzleProgress = {
        id,
        userId: user_id,
        puzzleId: puzzle_id,
        completionPercentage: puzzleProgress?.completion_percentage || 0,
        timeSpent: completion_time || 0,
        lastPlayed: last_updated,
        isComplete: is_completed || false,
        moves: puzzleProgress?.moves || 0,
        correctPieces: puzzleProgress?.correct_pieces || 0,
        totalPieces: puzzleProgress?.total_pieces || 0
      };
      
      return mappedProgress;
    },
    enabled // Only run this query if puzzleId is provided
  });

  const updateProgress = useMutation({
    mutationFn: async (newProgress: Partial<PuzzleProgress>) => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      // Convert our frontend model to match the actual DB schema
      const dbData = {
        user_id: user.id,
        puzzle_id: newProgress.puzzleId || puzzleId,
        is_completed: newProgress.isComplete || false,
        completion_time: newProgress.timeSpent || 0,
        progress: {
          completion_percentage: newProgress.completionPercentage || 0,
          moves: newProgress.moves || 0,
          correct_pieces: newProgress.correctPieces || 0,
          total_pieces: newProgress.totalPieces || 0
        }
      };
      
      const { data, error } = await supabase
        .from('puzzle_progress')
        .upsert(dbData)
        .select()
        .single();

      if (error) throw error;
      
      // Convert the response back to our frontend model
      const { 
        id, 
        user_id, 
        puzzle_id, 
        is_completed, 
        progress: puzzleProgress, 
        completion_time, 
        last_updated 
      } = data;
      
      return {
        id,
        userId: user_id,
        puzzleId: puzzle_id,
        completionPercentage: puzzleProgress?.completion_percentage || 0,
        timeSpent: completion_time || 0,
        lastPlayed: last_updated,
        isComplete: is_completed || false,
        moves: puzzleProgress?.moves || 0,
        correctPieces: puzzleProgress?.correct_pieces || 0,
        totalPieces: puzzleProgress?.total_pieces || 0
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzle-progress', puzzleId] });
    },
    onError: (error) => {
      toast({
        title: 'Error saving progress',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    progress,
    isLoading,
    updateProgress: updateProgress.mutate,
    isUpdating: updateProgress.isPending
  };
}
