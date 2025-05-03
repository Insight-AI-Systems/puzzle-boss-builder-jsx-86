
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyTrend } from '../types/analyticsTypes';

export const useMonthlyTrends = (fromDate?: string, toDate?: string) => {
  const months_back = fromDate ? undefined : 6; // Use months_back only if no date range is provided
  
  return useQuery({
    queryKey: ['monthlyTrends', fromDate, toDate, months_back],
    queryFn: async () => {
      if (fromDate && toDate) {
        // Use date range if provided
        const { data, error } = await supabase.rpc('get_monthly_trends_range', {
          from_date: fromDate,
          to_date: toDate
        });
        
        if (error) {
          console.error('Error fetching monthly trends with date range:', error);
          // Fall back to regular function if the range version doesn't exist
          const fallbackResult = await supabase.rpc('get_monthly_trends', {
            months_back: 6
          });
          
          if (fallbackResult.error) throw fallbackResult.error;
          return fallbackResult.data as MonthlyTrend[];
        }
        
        return data as MonthlyTrend[];
      } else {
        // Use months back as default
        const { data, error } = await supabase.rpc('get_monthly_trends', {
          months_back: months_back
        });
        
        if (error) throw error;
        return data as MonthlyTrend[];
      }
    }
  });
};
