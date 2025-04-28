
// Import necessary hooks and libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay, format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

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

export interface ActivityBreakdown {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export const useAnalytics = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  
  // Format dates for queries
  const fromDate = dateRange?.from ? 
    format(startOfDay(dateRange.from), 'yyyy-MM-dd') : 
    format(subDays(new Date(), 30), 'yyyy-MM-dd');
    
  const toDate = dateRange?.to ? 
    format(endOfDay(dateRange.to), 'yyyy-MM-dd') : 
    format(new Date(), 'yyyy-MM-dd');
  
  // Fetch daily metrics with date range
  const { data: dailyMetrics, isLoading: isLoadingDailyMetrics } = useQuery({
    queryKey: ['dailyMetrics', selectedDate, fromDate, toDate],
    queryFn: async () => {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .rpc('calculate_daily_metrics', { date_param: dateString });
        
      if (error) throw error;
      
      // Ensure we're returning a single object, not an array
      return data && data.length > 0 ? data[0] as DailyMetrics : {
        active_users: 0,
        new_signups: 0,
        puzzles_completed: 0,
        revenue: 0
      } as DailyMetrics;
    }
  });
  
  // Fetch monthly trends with date range
  const { data: monthlyTrends, isLoading: isLoadingMonthlyTrends } = useQuery({
    queryKey: ['monthlyTrends', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_monthly_trends', { 
          months_back: 6,
          // In a production environment, we would update the RPC to accept date parameters
          // For now, we'll filter the results client-side
        });
        
      if (error) throw error;
      
      // Filter results by date range client-side (ideally this would be done in the database)
      const filteredData = data.filter((item: MonthlyTrend) => {
        const itemDate = new Date(item.month_date);
        const from = dateRange?.from ? startOfMonth(dateRange.from) : null;
        const to = dateRange?.to ? endOfMonth(dateRange.to) : null;
        
        if (from && to) {
          return itemDate >= from && itemDate <= to;
        }
        return true;
      });
      
      return filteredData as MonthlyTrend[];
    }
  });
  
  // Fetch category revenue with date range
  const { data: categoryRevenue, isLoading: isLoadingCategoryRevenue } = useQuery({
    queryKey: ['categoryRevenue', selectedDate, fromDate, toDate],
    queryFn: async () => {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .rpc('get_category_revenue', { date_param: dateString });
        
      if (error) throw error;
      
      return data as CategoryRevenue[];
    }
  });
  
  // Calculate activity breakdown by timeframes
  const activityBreakdown = dailyMetrics ? {
    daily: dailyMetrics.active_users,
    weekly: monthlyTrends?.slice(0, 1).reduce((sum, item) => sum + item.active_users / 4, 0) || 0,
    monthly: monthlyTrends?.slice(0, 1).reduce((sum, item) => sum + item.active_users, 0) || 0,
    yearly: monthlyTrends?.reduce((sum, item) => sum + item.active_users, 0) || 0
  } : {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0
  };
  
  return {
    dailyMetrics,
    monthlyTrends,
    categoryRevenue,
    activityBreakdown,
    isLoadingDailyMetrics,
    isLoadingMonthlyTrends,
    isLoadingCategoryRevenue,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange
  };
};
