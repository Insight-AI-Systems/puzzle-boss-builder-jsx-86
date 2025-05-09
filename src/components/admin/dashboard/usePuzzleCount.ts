
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePuzzleCount = (categoryId: string) => {
  return useQuery({
    queryKey: ['puzzle-count', categoryId],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('puzzles')
        .select('id', { count: 'exact' })
        .eq('category_id', categoryId);

      if (error) {
        console.error('Error fetching puzzle count:', error);
        throw error;
      }
      
      // Log the count for debugging
      console.log(`Category ${categoryId} has ${count} puzzles`);
      
      return count || 0;
    },
    // Keep the count data fresh
    staleTime: 30000, // 30 seconds
  });
};
