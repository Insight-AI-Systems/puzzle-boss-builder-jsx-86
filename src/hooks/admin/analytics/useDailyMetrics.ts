
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
      
      // Provide consistent default values to prevent mismatch in counts
      return { 
        active_users: 0, 
        new_signups: 0, 
        puzzles_completed: 0, 
        revenue: 0,
        total_users: 0 // Add total_users field to ensure consistency
      };
    }
  });
};
