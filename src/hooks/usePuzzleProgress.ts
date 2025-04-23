
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
      
      // Map DB data to frontend model
      return mapDbToFrontendProgress(data as PuzzleProgressDB);
    },
    enabled // Only run this query if puzzleId is provided
  });

  const updateProgress = useMutation({
    mutationFn: async (newProgress: Partial<PuzzleProgress>) => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      // Convert frontend model to DB model
      const dbData = mapFrontendToDbProgress(newProgress, user.id);
      
      // Ensure puzzle_id is always set correctly
      // This is required by the database schema
      dbData.puzzle_id = newProgress.puzzleId || puzzleId;
      
      // Ensure puzzle_id is set and create a properly typed object for the upsert
      const dataForUpsert = {
        ...dbData,
        puzzle_id: dbData.puzzle_id, // Enforce non-optional
        user_id: user.id // Ensure user_id is always set
      };
      
      const { data, error } = await supabase
        .from('puzzle_progress')
        .upsert(dataForUpsert)
        .select()
        .single();

      if (error) throw error;
      return mapDbToFrontendProgress(data as PuzzleProgressDB);
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
