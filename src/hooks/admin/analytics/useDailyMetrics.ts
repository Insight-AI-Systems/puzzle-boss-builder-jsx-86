
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DailyMetrics } from '../types/analyticsTypes';

export const useDailyMetrics = (selectedDate: Date) => {
  return useQuery({
    queryKey: ['dailyMetrics', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_daily_metrics', {
        date_param: selectedDate.toISOString().split('T')[0]
      });
      
      if (error) throw error;
      
      if (Array.isArray(data) && data.length > 0) {
        return data[0] as DailyMetrics;
      } 
      
      // Get total users count directly if the function doesn't return it
      let totalUsers = 0;
      try {
        const { count, error: countError } = await supabase.rpc('count_total_users');
        if (!countError && count !== null) {
          totalUsers = count;
        }
      } catch (countErr) {
        console.error("Failed to get total users count:", countErr);
      }
      
      // Provide consistent default values to prevent mismatch in counts
      return { 
        active_users: 0, 
        new_signups: 0, 
        puzzles_completed: 0, 
        revenue: 0,
        total_users: totalUsers
      };
    }
  });
};
