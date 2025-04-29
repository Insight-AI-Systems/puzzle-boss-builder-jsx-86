
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RevenueMetrics } from '../types/analyticsTypes';

export const useRevenueMetrics = () => {
  return useQuery({
    queryKey: ['revenueMetrics'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_revenue_metrics');
        
        if (error) throw error;
        
        return data as RevenueMetrics;
      } catch (err) {
        console.error('Error fetching revenue metrics:', err);
        throw err;
      }
    }
  });
};

