
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the puzzles table exists.
 */
export const checkPuzzleTableExists = async () => {
  try {
    const { error } = await supabase.from('puzzles').select('id').limit(1);
    if (error && error.message.includes('does not exist')) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error checking puzzles table:', err);
    return false;
  }
};
