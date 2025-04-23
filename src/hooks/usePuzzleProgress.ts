
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuzzleProgress, PuzzleProgressDB, mapDbToFrontendProgress, mapFrontendToDbProgress } from '@/types/puzzle-types';
import { useToast } from '@/hooks/use-toast';

export function usePuzzleProgress(puzzleId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    }
  });

  const updateProgress = useMutation({
    mutationFn: async (newProgress: Partial<PuzzleProgress>) => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      // Convert frontend model to DB model
      const dbData = mapFrontendToDbProgress(newProgress, user.id);
      
      // If puzzleId is provided in newProgress, ensure it's added as puzzle_id
      if (newProgress.puzzleId) {
        dbData.puzzle_id = newProgress.puzzleId;
      } else {
        dbData.puzzle_id = puzzleId;
      }
      
      const { data, error } = await supabase
        .from('puzzle_progress')
        .upsert(dbData)
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
