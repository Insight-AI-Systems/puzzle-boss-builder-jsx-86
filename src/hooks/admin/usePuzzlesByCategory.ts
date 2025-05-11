
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PuzzleInfo {
  id: string;
  title: string;
  status: string;
  image_url?: string;
}

export function usePuzzlesByCategoryId(categoryId: string | null) {
  const fetchPuzzlesByCategory = async () => {
    if (!categoryId) return [];

    // Modified query to get all puzzles for the category without status filter
    const { data, error } = await supabase
      .from('puzzles')
      .select('id, title, status, image_url')
      .eq('category_id', categoryId);

    if (error) {
      console.error('Error fetching puzzles by category:', error);
      throw error;
    }

    return data || [];
  };

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['puzzles-by-category', categoryId],
    queryFn: fetchPuzzlesByCategory,
    enabled: !!categoryId,
  });

  return {
    puzzles: data as PuzzleInfo[],
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
