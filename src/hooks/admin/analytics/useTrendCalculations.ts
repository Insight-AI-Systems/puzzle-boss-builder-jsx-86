
import { MonthlyTrend } from '../types/analyticsTypes';

export const useTrendCalculations = (monthlyTrends: MonthlyTrend[] | undefined) => {
  const getTrendValue = (current: number, previous: number) => {
    if (previous === 0) return { value: "100%", direction: "up" as const };
    const percent = Math.round((current - previous) / previous * 100);
    return { 
      value: `${Math.abs(percent)}%`, 
      direction: percent >= 0 ? "up" as const : "down" as const
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

  return {
    getUserTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend
  };
};
