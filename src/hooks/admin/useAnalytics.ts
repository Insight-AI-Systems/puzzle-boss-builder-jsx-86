import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay, format } from 'date-fns';

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
  const [selectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const fromDate = dateRange?.from ? 
    format(startOfDay(dateRange.from), 'yyyy-MM-dd') : 
    format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd');
    
  const toDate = dateRange?.to ? 
    format(endOfDay(dateRange.to), 'yyyy-MM-dd') : 
    format(new Date(), 'yyyy-MM-dd');

  const { data: dailyMetrics, isLoading: isLoadingDailyMetrics } = useQuery({
    queryKey: ['dailyMetrics', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_daily_metrics', {
        date_param: selectedDate.toISOString().split('T')[0]
      });
      
      if (error) throw error;
      
      return Array.isArray(data) && data.length > 0 
        ? data[0] as DailyMetrics 
        : { active_users: 0, new_signups: 0, puzzles_completed: 0, revenue: 0 };
    }
  });

  const { data: monthlyTrends, isLoading: isLoadingMonthlyTrends } = useQuery({
    queryKey: ['monthlyTrends', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_trends', {
        months_back: 6
      });
      
      if (error) throw error;
      
      return data as MonthlyTrend[];
    }
  });

  const { data: categoryRevenue, isLoading: isLoadingCategoryRevenue } = useQuery({
    queryKey: ['categoryRevenue', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_category_revenue', {
        date_param: selectedDate.toISOString().split('T')[0]
      });
      
      if (error) throw error;
      
      return data as CategoryRevenue[];
    }
  });

  const getTrendValue = (current: number, previous: number): { value: string; direction: "up" | "down" } => {
    if (previous === 0) return { value: "100%", direction: "up" };
    const percent = Math.round((current - previous) / previous * 100);
    return { 
      value: `${Math.abs(percent)}%`, 
      direction: percent >= 0 ? "up" : "down" 
    };
  };

  const getUserTrend = () => {
    if (!monthlyTrends || monthlyTrends.length < 2) {
      return { value: "0%", direction: "up" as const };
    }
    return getTrendValue(
      monthlyTrends[0]?.active_users || 0,
      monthlyTrends[1]?.active_users || 0
    );
  };

  const getSignupTrend = () => {
    if (!monthlyTrends || monthlyTrends.length < 2) {
      return { value: "0%", direction: "up" as const };
    }
    return getTrendValue(
      monthlyTrends[0]?.new_signups || 0,
      monthlyTrends[1]?.new_signups || 0
    );
  };

  const getPuzzlesTrend = () => {
    if (!monthlyTrends || monthlyTrends.length < 2) {
      return { value: "0%", direction: "up" as const };
    }
    return getTrendValue(
      monthlyTrends[0]?.puzzles_completed || 0,
      monthlyTrends[1]?.puzzles_completed || 0
    );
  };

  const getRevenueTrend = () => {
    if (!monthlyTrends || monthlyTrends.length < 2) {
      return { value: "0%", direction: "up" as const };
    }
    return getTrendValue(
      monthlyTrends[0]?.revenue || 0,
      monthlyTrends[1]?.revenue || 0
    );
  };

  const activityBreakdown: ActivityBreakdown = {
    daily: dailyMetrics?.active_users || 0,
    weekly: Math.round((monthlyTrends?.[0]?.active_users || 0) / 4),
    monthly: monthlyTrends?.[0]?.active_users || 0,
    yearly: monthlyTrends?.reduce((sum, item) => sum + (item.active_users || 0), 0) || 0
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
    dateRange,
    setDateRange,
    getUserTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend
  };
};
