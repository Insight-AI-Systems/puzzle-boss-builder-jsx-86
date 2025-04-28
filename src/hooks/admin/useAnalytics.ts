
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay, format } from 'date-fns';
import { useDailyMetrics } from './analytics/useDailyMetrics';
import { useMonthlyTrends } from './analytics/useMonthlyTrends';
import { useCategoryRevenue } from './analytics/useCategoryRevenue';
import { useUserDemographics } from './analytics/useUserDemographics';
import { useTrendCalculations } from './analytics/useTrendCalculations';
import type { ActivityBreakdown } from './types/analyticsTypes';

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

  // Use the new modularized hooks
  const { data: dailyMetrics, isLoading: isLoadingDailyMetrics } = useDailyMetrics(selectedDate);
  const { data: monthlyTrends, isLoading: isLoadingMonthlyTrends } = useMonthlyTrends(fromDate, toDate);
  const { data: categoryRevenue, isLoading: isLoadingCategoryRevenue } = useCategoryRevenue(selectedDate);
  const { data: userDemographics, isLoading: isLoadingUserDemographics } = useUserDemographics();

  const {
    getUserTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend
  } = useTrendCalculations(monthlyTrends);

  const activityBreakdown: ActivityBreakdown = {
    daily: dailyMetrics?.active_users || 0,
    weekly: Math.round((monthlyTrends?.[0]?.active_users || 0) / 4),
    monthly: monthlyTrends?.[0]?.active_users || 0,
    yearly: monthlyTrends?.reduce((sum, item) => sum + (item.active_users || 0), 0) || 0
  };

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
    activityBreakdown,
    formatTime,
    isLoadingDailyMetrics,
    isLoadingMonthlyTrends,
    isLoadingCategoryRevenue,
    isLoadingUserDemographics,
    selectedDate,
    dateRange,
    setDateRange,
    getUserTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend
  };
};

export type * from './types/analyticsTypes';
