
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { checkPuzzleTableExists } from './puzzleTableHelpers';
import type { Puzzle } from './puzzleTypes';
import { mapStatusFromDatabase } from './puzzleTypes';

// Maps DB record to Puzzle interface
function mapDatabasePuzzle(item: any): Puzzle {
  // Determine difficulty based on pieces
  let difficulty: Puzzle['difficulty'] = 'medium';
  if (item.pieces <= 9) {
    difficulty = 'easy';
  } else if (item.pieces <= 16) {
    difficulty = 'medium';
  } else {
    difficulty = 'hard';
  }

  return {
    id: item.id,
    name: item.title,
    category: item.categories?.name || '',
    category_id: item.category_id,
    difficulty: difficulty,
    imageUrl: item.image_url,
    // Since these columns don't exist in the DB yet, we use defaults
    timeLimit: 300, // Default 5 minutes (300 seconds)
    costPerPlay: 1.99, // Default cost per play
    targetRevenue: item.income_target || 0,
    status: mapStatusFromDatabase(item.status || 'draft'),
    prize: item.title, // Using title as prize name for now
    description: item.description || '',
    // Default values for columns that don't exist yet
    puzzleOwner: '',
    supplier: '',
    completions: 0,
    avgTime: 0,
    prizeValue: item.prize_value || 0,
  };
}

export function usePuzzleQueries() {
  const fetchPuzzles = async () => {
    const tableExists = await checkPuzzleTableExists();
    if (!tableExists) {
      console.warn('Puzzles table does not exist');
      return [];
    }
    const { data, error } = await supabase
      .from('puzzles')
      .select(`*, categories:category_id(name)`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapDatabasePuzzle);
  };

  const puzzlesQuery = useQuery({
    queryKey: ['puzzles'],
    queryFn: fetchPuzzles,
    staleTime: 5 * 60 * 1000,
  });

  return puzzlesQuery;
}
