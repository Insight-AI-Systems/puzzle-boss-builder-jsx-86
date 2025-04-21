
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsePuzzleCompletionProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

export const usePuzzleCompletion = ({ imageUrl, rows, columns }: UsePuzzleCompletionProps) => {
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);

  const handlePuzzleComplete = async (startTime: number | null) => {
    if (!completed) {
      setCompleted(true);
      let totalTime: number;
      
      if (startTime) {
        // Calculate time based on actual elapsed milliseconds
        totalTime = (Date.now() - startTime) / 1000;
      } else {
        // Fallback if no start time is available
        totalTime = 0;
      }
      
      setSolveTime(totalTime);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          const { error } = await supabase
            .from('puzzle_completions')
            .insert([
              {
                user_id: user.id,
                puzzle_id: imageUrl,
                completion_time: totalTime,
                moves_count: 0,
                difficulty_level: `${rows}x${columns}`,
                game_mode: 'classic'
              }
            ]);

          if (error) {
            console.error('Error saving puzzle completion:', error);
          }
        } catch (error) {
          console.error('Error in savePuzzleCompletion:', error);
        }
      }
      return totalTime;
    }
    return null;
  };

  const resetCompletion = () => {
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
