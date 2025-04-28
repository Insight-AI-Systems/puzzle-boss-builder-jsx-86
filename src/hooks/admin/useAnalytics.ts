
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

export interface UserDemographics {
  gender_distribution: Record<string, number>;
  age_distribution: Record<string, number>;
  country_distribution: Record<string, number>;
}

export interface RevenueMetrics {
  total_revenue: number;
  avg_revenue_per_user: number;
  credit_purchases: number;
  revenue_by_type: Record<string, number>;
}

export interface PuzzleMetrics {
  active_puzzles: number;
  avg_completion_time: number;
  completion_rate: number;
  prize_redemption_rate: number;
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

  // User metrics from real data
  const { data: userDemographics, isLoading: isLoadingUserDemographics } = useQuery({
    queryKey: ['userDemographics'],
    queryFn: async () => {
      // Get user profiles for demographic data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('gender, age_group, country')
        .not('gender', 'is', null);
      
      if (profilesError) throw profilesError;
      
      // Process gender distribution
      const genderCounts: Record<string, number> = {};
      profiles?.forEach(profile => {
        const gender = profile.gender || 'unknown';
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      });
      
      // Process age distribution
      const ageCounts: Record<string, number> = {};
      profiles?.forEach(profile => {
        const age = profile.age_group || 'unknown';
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      });
      
      // Process country distribution
      const countryCounts: Record<string, number> = {};
      profiles?.forEach(profile => {
        const country = profile.country || 'unknown';
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });
      
      return {
        gender_distribution: genderCounts,
        age_distribution: ageCounts,
        country_distribution: countryCounts
      };
    }
  });

  // Revenue metrics from real data
  const { data: revenueMetrics, isLoading: isLoadingRevenueMetrics } = useQuery({
    queryKey: ['revenueMetrics', fromDate, toDate],
    queryFn: async () => {
      // Get total revenue
      const { data: incomeData, error: incomeError } = await supabase
        .from('site_income')
        .select('amount, source_type')
        .gte('date', fromDate)
        .lte('date', toDate);
      
      if (incomeError) throw incomeError;
      
      // Calculate total revenue
      const totalRevenue = incomeData?.reduce((sum, item) => sum + (parseFloat(item.amount as any) || 0), 0) || 0;
      
      // Get user count for avg revenue calculation
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      if (userError) throw userError;
      
      // Calculate revenue by type
      const revenueByType: Record<string, number> = {};
      incomeData?.forEach(item => {
        const type = item.source_type || 'other';
        revenueByType[type] = (revenueByType[type] || 0) + (parseFloat(item.amount as any) || 0);
      });
      
      // Filter for credit purchases
      const creditPurchases = incomeData?.filter(item => 
        item.source_type === 'puzzle' || item.source_type === 'membership'
      ).length || 0;
      
      return {
        total_revenue: totalRevenue,
        avg_revenue_per_user: userCount ? totalRevenue / userCount : 0,
        credit_purchases: creditPurchases,
        revenue_by_type: revenueByType
      };
    }
  });

  // Puzzle metrics from real data
  const { data: puzzleMetrics, isLoading: isLoadingPuzzleMetrics } = useQuery({
    queryKey: ['puzzleMetrics', fromDate, toDate],
    queryFn: async () => {
      // Get active puzzles
      const { data: activePuzzles, error: puzzlesError } = await supabase
        .from('puzzles')
        .select('id')
        .eq('status', 'active');
      
      if (puzzlesError) throw puzzlesError;
      
      // Get puzzle completion data
      const { data: completions, error: completionsError } = await supabase
        .from('puzzle_completions')
        .select('completion_time, is_winner');
      
      if (completionsError) throw completionsError;
      
      // Calculate metrics
      const totalCompletions = completions?.length || 0;
      const winners = completions?.filter(c => c.is_winner).length || 0;
      const completionTimes = completions
        ?.map(c => parseFloat(c.completion_time as any) || 0)
        .filter(Boolean);
      
      const avgTime = completionTimes?.length 
        ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length 
        : 0;
      
      // Get total puzzles for completion rate
      const { count: puzzleCount, error: countError } = await supabase
        .from('puzzle_progress')
        .select('id', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      return {
        active_puzzles: activePuzzles?.length || 0,
        avg_completion_time: avgTime,
        completion_rate: puzzleCount ? (totalCompletions / puzzleCount) * 100 : 0,
        prize_redemption_rate: totalCompletions ? (winners / totalCompletions) * 100 : 0
      };
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

  // Format time for display (seconds to mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    dailyMetrics,
    monthlyTrends,
    categoryRevenue,
    userDemographics,
    revenueMetrics,
    puzzleMetrics,
    activityBreakdown,
    formatTime,
    isLoadingDailyMetrics,
    isLoadingMonthlyTrends,
    isLoadingCategoryRevenue,
    isLoadingUserDemographics,
    isLoadingRevenueMetrics,
    isLoadingPuzzleMetrics,
    selectedDate,
    dateRange,
    setDateRange,
    getUserTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend
  };
};
