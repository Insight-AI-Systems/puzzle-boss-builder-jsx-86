
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      console.log('Categories fetched from database:', data);
      return data || [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0 // This ensures data is always considered stale and will be refetched
  });
}
