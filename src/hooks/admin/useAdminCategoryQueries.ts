
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminCategory } from '@/types/categoryTypes';
import { mapDbCategory } from '@/utils/admin/categoryMappers';

export function useAdminCategoryQueries() {
  const categoriesQuery = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async (): Promise<AdminCategory[]> => {
      console.log('Admin: Fetching categories from Supabase...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching admin categories:', error);
        throw error;
      }

      console.log('Admin categories fetched successfully:', data);
      return Array.isArray(data) ? data.map(mapDbCategory) : [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 1000,
  });

  return categoriesQuery;
}
