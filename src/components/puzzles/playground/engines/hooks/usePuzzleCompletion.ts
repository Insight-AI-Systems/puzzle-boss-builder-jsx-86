
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsePuzzleCompletionProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

export const usePuzzleCompletion = ({ imageUrl, rows, columns }: UsePuzzleCompletionProps) => {
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);

  const handlePuzzleComplete = async (timeElapsedMs: number) => {
    if (!completed) {
      setCompleted(true);
      // Convert to seconds and round to 2 decimal places
      const totalTimeInSeconds = parseFloat((timeElapsedMs / 1000).toFixed(2));
      setSolveTime(totalTimeInSeconds);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          const { error } = await supabase
            .from('puzzle_completions')
            .insert([
              {
                user_id: user.id,
                puzzle_id: imageUrl,
                completion_time: totalTimeInSeconds,
                moves_count: 0,
                difficulty_level: `${rows}x${columns}`,
                game_mode: 'classic'
              }
            ]);

          if (error) {
            console.error('Error saving puzzle completion:', error);
          }
        } catch (error) {
          console.error('Error in handlePuzzleComplete:', error);
        }
      }
      return totalTimeInSeconds;
    }
    return solveTime;
  };

  const resetCompletion = () => {
    console.log("Resetting puzzle completion state");
    setCompleted(false);
    setSolveTime(null);
  };

  return {
    completed,
    solveTime,
    handlePuzzleComplete,
    resetCompletion
  };
};
