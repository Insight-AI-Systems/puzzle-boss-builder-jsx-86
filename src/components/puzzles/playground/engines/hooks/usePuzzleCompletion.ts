
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function usePuzzleCompletion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitCompletion = async (
    puzzleId: string,
    completionTime: number,
    movesCount: number,
    difficultyLevel: string,
    gameMode: string = 'classic'
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your completion.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('puzzle_completions')
        .insert({
          user_id: user.id,
          member_id: user.id, // Add required member_id field
          puzzle_id: puzzleId,
          completion_time: completionTime,
          moves_count: movesCount,
          difficulty_level: difficultyLevel,
          game_mode: gameMode,
        });

      if (error) throw error;

      toast({
        title: "Completion submitted!",
        description: "Your puzzle completion has been recorded.",
      });

      return true;
    } catch (error) {
      console.error('Error submitting completion:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to submit completion",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitCompletion,
    isSubmitting,
  };
}
