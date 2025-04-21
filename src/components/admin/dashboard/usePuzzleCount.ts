
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePuzzleCount(categoryId?: string) {
  return useQuery({
    queryKey: ['puzzle-count', categoryId],
    queryFn: async () => {
      if (!categoryId) return 0;
      const { count, error } = await supabase
        .from('puzzles')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)
        .eq('status', 'active');

      if (error) throw error;
      return count || 0;
    },
    enabled: !!categoryId
  });
}
