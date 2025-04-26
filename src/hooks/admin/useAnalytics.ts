
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAnalytics() {
  const { data: dailyMetrics } = useQuery({
    queryKey: ['daily-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_daily_metrics', {
        date_param: new Date().toISOString().split('T')[0]
      });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: monthlyTrends } = useQuery({
    queryKey: ['monthly-trends'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_trends', {
        months_back: 12
      });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: categoryRevenue } = useQuery({
    queryKey: ['category-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_category_revenue', {
        date_param: new Date().toISOString().split('T')[0]
      });
      
      if (error) throw error;
      return data;
    },
  });

  return {
    dailyMetrics,
    monthlyTrends,
    categoryRevenue,
  };
}
