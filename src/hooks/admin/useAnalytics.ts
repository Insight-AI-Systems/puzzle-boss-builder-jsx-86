
// Import necessary hooks and libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define types for metrics data
export interface DailyMetrics {
  active_users: number;
  new_signups: number;
  puzzles_completed: number;
  revenue: number;
}

export interface MonthlyTrend {
  month_date: string;
  active_users: number;
  new_signups: number;
  puzzles_completed: number;
  revenue: number;
}

export interface CategoryRevenue {
  category_name: string;
  total_revenue: number;
}

export const useAnalytics = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Fetch daily metrics
  const { data: dailyMetrics, isLoading: isLoadingDailyMetrics } = useQuery({
    queryKey: ['dailyMetrics', selectedDate],
    queryFn: async () => {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .rpc('calculate_daily_metrics', { date_param: dateString });
        
      if (error) throw error;
      
      // Return the first item as it's a single row result
      return data[0] as DailyMetrics;
    }
  });
  
  // Fetch monthly trends
  const { data: monthlyTrends, isLoading: isLoadingMonthlyTrends } = useQuery({
    queryKey: ['monthlyTrends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_monthly_trends', { months_back: 6 });
        
      if (error) throw error;
      
      return data as MonthlyTrend[];
    }
  });
  
  // Fetch category revenue
  const { data: categoryRevenue, isLoading: isLoadingCategoryRevenue } = useQuery({
    queryKey: ['categoryRevenue', selectedDate],
    queryFn: async () => {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .rpc('get_category_revenue', { date_param: dateString });
        
      if (error) throw error;
      
      return data as CategoryRevenue[];
    }
  });
  
  return {
    dailyMetrics,
    monthlyTrends,
    categoryRevenue,
    isLoadingDailyMetrics,
    isLoadingMonthlyTrends,
    isLoadingCategoryRevenue,
    selectedDate,
    setSelectedDate
  };
};
