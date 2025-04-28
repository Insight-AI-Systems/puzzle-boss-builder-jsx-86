
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyTrend } from '../types/analyticsTypes';

export const useMonthlyTrends = (fromDate: string, toDate: string) => {
  return useQuery({
    queryKey: ['monthlyTrends', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_trends', {
        months_back: 6
      });
      
      if (error) throw error;
      
      return data as MonthlyTrend[];
    }
  });
};
