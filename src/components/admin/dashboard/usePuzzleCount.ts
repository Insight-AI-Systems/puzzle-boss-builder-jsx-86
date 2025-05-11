
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePuzzleCount = (categoryId: string) => {
  return useQuery({
    queryKey: ['puzzle-count', categoryId],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('puzzles')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', categoryId)
          .eq('status', 'active'); // Only count active puzzles

        if (error) {
          console.error('Error fetching puzzle count:', error);
          throw error;
        }
        
        return count || 0;
      } catch (error) {
        console.error('Error in usePuzzleCount:', error);
        throw error;
      }
    },
    // Keep the count data fresh
    staleTime: 30000, // 30 seconds
  });
};
