
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the puzzles table exists in the database
 */
export const checkPuzzleTableExists = async (): Promise<boolean> => {
  try {
    // Try to query the puzzles table
    const { error } = await supabase
      .from('puzzles')
      .select('id')
      .limit(1);
    
    // If there's no error, the table exists
    return !error;
  } catch (error) {
    console.error('Error checking if puzzles table exists:', error);
    return false;
  }
};
