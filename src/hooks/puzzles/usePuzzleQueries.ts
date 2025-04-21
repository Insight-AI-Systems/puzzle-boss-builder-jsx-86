
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { checkPuzzleTableExists } from './puzzleTableHelpers';
import type { Puzzle } from './puzzleTypes';

// Maps DB record to Puzzle interface
function mapDatabasePuzzle(item: any): Puzzle {
  return {
    id: item.id,
    name: item.title,
    category: item.categories?.name || '',
    category_id: item.category_id,
    difficulty: (item.pieces <= 9 ? 'easy' : item.pieces <= 16 ? 'medium' : 'hard') as Puzzle['difficulty'],
    imageUrl: item.image_url,
    timeLimit: 0,          // Placeholder: not in DB yet
    costPerPlay: 1.99,     // Placeholder: not in DB yet
    targetRevenue: item.income_target || 0,
    status: (item.status || 'draft') as Puzzle['status'],
    prize: item.title,
    description: item.description || '',
    puzzleOwner: '',       // Placeholder
    supplier: '',          // Placeholder
    completions: 0,        // Placeholder
    avgTime: 0,            // Placeholder
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
