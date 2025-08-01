
import { useState } from 'react';
import { useDailyMetrics } from './analytics/useDailyMetrics';
import { useMemberDemographics } from './analytics/useMemberDemographics';
import { useMonthlyTrends } from './analytics/useMonthlyTrends';
import { useCategoryRevenue } from './analytics/useCategoryRevenue';

import { useRevenueMetrics } from './analytics/useRevenueMetrics';
// formatTime utility function inline since puzzleUtils was removed
const formatTimeUtil = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

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
  
  // Get member demographics data
  const { data: memberDemographics, isLoading: isLoadingMemberDemographics } = useMemberDemographics();
  
  // Get monthly trends for comparison
  const { data: monthlyTrends, isLoading: isLoadingMonthlyTrends } = useMonthlyTrends(
    dateRange.from.toISOString().split('T')[0],
    dateRange.to.toISOString().split('T')[0]
  );
  
  // Get category revenue data
  const { data: categoryRevenue, isLoading: isLoadingCategoryRevenue } = useCategoryRevenue(selectedDate);
  
  // Get puzzle metrics - removed, will be available with new puzzle system
  const puzzleMetrics = null;
  const isLoadingPuzzleMetrics = false;
  
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
  
  const getActiveMemberTrend = () => {
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
  if (dailyMetrics && memberDemographics) {
    // Ensure we have consistent total members count
    // Trust the memberDemographics.total_members value as the source of truth
    if (memberDemographics.total_members !== undefined && 
        (dailyMetrics.total_users === undefined || 
         dailyMetrics.total_users === 0 ||
         dailyMetrics.total_users !== memberDemographics.total_members)) {
      
      console.log("Synchronizing total members count:", {
        dailyMetricsBefore: dailyMetrics.total_users,
        memberDemographicsValue: memberDemographics.total_members
      });
      
      // Force TS to recognize the type
      const metrics = dailyMetrics as any;
      metrics.total_users = memberDemographics.total_members;
    }
  }
  
  return {
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    dailyMetrics,
    memberDemographics,
    monthlyTrends,
    categoryRevenue,
    activityBreakdown,
    puzzleMetrics,
    revenueMetrics,
    error,
    isLoadingDailyMetrics,
    isLoadingMemberDemographics,
    isLoadingMonthlyTrends,
    isLoadingCategoryRevenue,
    isLoadingPuzzleMetrics,
    isLoadingRevenueMetrics,
    getActiveMemberTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend,
    formatTime,
    // Backward compatibility
    userDemographics: memberDemographics,
    isLoadingUserDemographics: isLoadingMemberDemographics,
    getUserTrend: getActiveMemberTrend
  };
};
