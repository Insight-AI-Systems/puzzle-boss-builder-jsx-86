
import { useState } from 'react';
import { useDailyMetrics } from './analytics/useDailyMetrics';
import { useUserDemographics } from './analytics/useUserDemographics';
import { useMonthlyTrends } from './analytics/useMonthlyTrends';
import { useCategoryRevenue } from './analytics/useCategoryRevenue';
import { usePuzzleMetrics } from './analytics/usePuzzleMetrics';
import { useRevenueMetrics } from './analytics/useRevenueMetrics';
import { formatTime as formatTimeUtil } from '@/utils/puzzleUtils';

// Define the ActivityBreakdown type
export interface ActivityBreakdown {
  name: string;
  value: number;
}

// Define DateRange type
export interface DateRange {
  from: Date;
  to: Date;
}

export const useAnalytics = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  // Get daily metrics for the selected date
  const { data: dailyMetrics, isLoading: isLoadingDailyMetrics } = useDailyMetrics(selectedDate);
  
  // Get user demographics data
  const { data: userDemographics, isLoading: isLoadingUserDemographics } = useUserDemographics();
  
  // Get monthly trends for comparison
  const { data: monthlyTrends, isLoading: isLoadingMonthlyTrends } = useMonthlyTrends();
  
  // Get category revenue data
  const { data: categoryRevenue, isLoading: isLoadingCategoryRevenue } = useCategoryRevenue(selectedDate);
  
  // Get puzzle metrics
  const { data: puzzleMetrics, isLoading: isLoadingPuzzleMetrics } = usePuzzleMetrics();
  
  // Get revenue metrics
  const { data: revenueMetrics, isLoading: isLoadingRevenueMetrics, error } = useRevenueMetrics();
  
  // Calculate activity breakdown
  const activityBreakdown: ActivityBreakdown[] = [
    { name: 'Puzzles', value: dailyMetrics?.puzzles_completed || 0 },
    { name: 'Purchases', value: (dailyMetrics?.revenue || 0) > 0 ? Math.floor((dailyMetrics?.revenue || 0) / 10) : 0 },
    { name: 'Signups', value: dailyMetrics?.new_signups || 0 }
  ];
  
  // Calculate trend percentages compared to previous month
  const getPreviousMonthData = () => {
    if (!monthlyTrends || monthlyTrends.length < 2) return null;
    return monthlyTrends[1]; // Second item is the previous month
  };
  
  const getUserTrend = () => {
    const prevMonth = getPreviousMonthData();
    if (!prevMonth || !prevMonth.active_users) return 0;
    return calculatePercentChange(dailyMetrics?.active_users || 0, prevMonth.active_users);
  };
  
  const getSignupTrend = () => {
    const prevMonth = getPreviousMonthData();
    if (!prevMonth || !prevMonth.new_signups) return 0;
    return calculatePercentChange(dailyMetrics?.new_signups || 0, prevMonth.new_signups);
  };
  
  const getPuzzlesTrend = () => {
    const prevMonth = getPreviousMonthData();
    if (!prevMonth || !prevMonth.puzzles_completed) return 0;
    return calculatePercentChange(dailyMetrics?.puzzles_completed || 0, prevMonth.puzzles_completed);
  };
  
  const getRevenueTrend = () => {
    const prevMonth = getPreviousMonthData();
    if (!prevMonth || !prevMonth.revenue) return 0;
    return calculatePercentChange(dailyMetrics?.revenue || 0, prevMonth.revenue);
  };
  
  const calculatePercentChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  // Helper function to format time in MM:SS format
  const formatTime = (seconds: number): string => {
    return formatTimeUtil(seconds);
  };
  
  // Make sure we synchronize total_users between the two data sources to avoid discrepancies
  if (dailyMetrics && userDemographics && userDemographics.total_users !== undefined) {
    // Force TS to recognize the type
    const metrics = dailyMetrics as any;
    metrics.total_users = userDemographics.total_users;
  }
  
  return {
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    dailyMetrics,
    userDemographics,
    monthlyTrends,
    categoryRevenue,
    activityBreakdown,
    puzzleMetrics,
    revenueMetrics,
    error,
    isLoadingDailyMetrics,
    isLoadingUserDemographics,
    isLoadingMonthlyTrends,
    isLoadingCategoryRevenue,
    isLoadingPuzzleMetrics,
    isLoadingRevenueMetrics,
    getUserTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend,
    formatTime
  };
};
