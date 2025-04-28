
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CategoryRevenue } from '../types/analyticsTypes';

export const useCategoryRevenue = (selectedDate: Date) => {
  return useQuery({
    queryKey: ['categoryRevenue', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_category_revenue', {
        date_param: selectedDate.toISOString().split('T')[0]
      });
      
      if (error) throw error;
      
      return data as CategoryRevenue[];
    }
  });
};
