
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
      
      // Extract the data from the database response
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
      
      // Parse the progress object safely
      const progressData = typeof puzzleProgress === 'string' 
        ? JSON.parse(puzzleProgress) 
        : puzzleProgress || {};
        
      // Create a properly formatted PuzzleProgress object
      const mappedProgress: PuzzleProgress = {
        id,
        userId: user_id,
        puzzleId: puzzle_id,
        completionPercentage: progressData.completion_percentage || 0,
        timeSpent: completion_time || 0,
        lastPlayed: last_updated,
        isComplete: is_completed || false,
        moves: progressData.moves || 0,
        correctPieces: progressData.correct_pieces || 0,
        totalPieces: progressData.total_pieces || 0
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
      
      // Prepare the progress object
      const progressData = {
        completion_percentage: newProgress.completionPercentage || 0,
        moves: newProgress.moves || 0,
        correct_pieces: newProgress.correctPieces || 0,
        total_pieces: newProgress.totalPieces || 0
      };
      
      // Convert our frontend model to match the actual DB schema
      const dbData = {
        user_id: user.id,
        puzzle_id: newProgress.puzzleId || puzzleId,
        is_completed: newProgress.isComplete || false,
        completion_time: newProgress.timeSpent || 0,
        progress: progressData
      };
      
      const { data, error } = await supabase
        .from('puzzle_progress')
        .upsert(dbData)
        .select()
        .single();

      if (error) throw error;
      
      // Parse the progress object safely
      const returnedProgressData = typeof data.progress === 'string'
        ? JSON.parse(data.progress)
        : data.progress || {};
      
      // Convert the response back to our frontend model
      return {
        id: data.id,
        userId: data.user_id,
        puzzleId: data.puzzle_id,
        completionPercentage: returnedProgressData.completion_percentage || 0,
        timeSpent: data.completion_time || 0,
        lastPlayed: data.last_updated,
        isComplete: data.is_completed || false,
        moves: returnedProgressData.moves || 0,
        correctPieces: returnedProgressData.correct_pieces || 0,
        totalPieces: returnedProgressData.total_pieces || 0
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
