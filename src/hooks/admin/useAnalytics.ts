
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DailyMetrics {
  active_users: number;
  new_signups: number;
  puzzles_completed: number;
  revenue: number;
}

interface MonthlyTrend {
  month_date: string;
  active_users: number;
  new_signups: number;
  puzzles_completed: number;
  revenue: number;
}

interface CategoryRevenue {
  category_name: string;
  total_revenue: number;
}

export function useAnalytics() {
  const { data: dailyMetrics, isLoading: isDailyLoading } = useQuery({
    queryKey: ['daily-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_daily_metrics', {
        date_param: new Date().toISOString().split('T')[0]
      });
      
      if (error) throw error;
      return data as DailyMetrics;
    },
  });

  const { data: monthlyTrends, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ['monthly-trends'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_trends', {
        months_back: 12
      });
      
      if (error) throw error;
      return data as MonthlyTrend[];
    },
  });

  const { data: categoryRevenue, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['category-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_category_revenue', {
        date_param: new Date().toISOString().split('T')[0]
      });
      
      if (error) throw error;
      return data as CategoryRevenue[];
    },
  });

  const isLoading = isDailyLoading || isMonthlyLoading || isCategoryLoading;

  return {
    dailyMetrics,
    monthlyTrends,
    categoryRevenue,
    isLoading
  };
}
