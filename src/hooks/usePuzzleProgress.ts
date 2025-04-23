
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuzzleProgress } from '@/types/puzzle-types';
import { useToast } from '@/hooks/use-toast';

export function usePuzzleProgress(puzzleId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['puzzle-progress', puzzleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puzzle_progress')
        .select('*')
        .eq('puzzle_id', puzzleId)
        .single();

      if (error) throw error;
      return data as PuzzleProgress;
    }
  });

  const updateProgress = useMutation({
    mutationFn: async (newProgress: Partial<PuzzleProgress>) => {
      const { data, error } = await supabase
        .from('puzzle_progress')
        .upsert({
          puzzle_id: puzzleId,
          ...newProgress,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
