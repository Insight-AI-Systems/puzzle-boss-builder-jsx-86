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
      
      if (Array.isArray(data) && data.length > 0) {
        return data[0] as DailyMetrics;
      } 
      return { active_users: 0, new_signups: 0, puzzles_completed: 0, revenue: 0 };
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

  const { data: userDemographics, isLoading: isLoadingUserDemographics } = useQuery({
    queryKey: ['userDemographics'],
    queryFn: async () => {
      try {
        const { data: tableCheck, error: tableError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.error('Error checking profiles table:', tableError);
          return {
            gender_distribution: { 'not_specified': 0 },
            age_distribution: { 'not_specified': 0 },
            country_distribution: { 'not_specified': 0 }
          };
        }

        const { count: userCount, error: countError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
        
        if (countError) {
          console.error('Error getting user count:', countError);
          return {
            gender_distribution: { 'not_specified': 0 },
            age_distribution: { 'not_specified': 0 },
            country_distribution: { 'not_specified': 0 }
          };
        }
        
        const genderCounts: Record<string, number> = { 'not_specified': userCount || 0 };
        const ageCounts: Record<string, number> = { 'not_specified': userCount || 0 };
        const countryCounts: Record<string, number> = { 'not_specified': userCount || 0 };

        // Check for and process gender data
        try {
          const { data: genderTest, error: genderTestError } = await supabase
            .from('profiles')
            .select('gender')
            .limit(1);
            
          if (!genderTestError && genderTest && genderTest.length > 0) {
            const { data, error: usersError } = await supabase.from('profiles').select('gender');
            
            if (!usersError && data) {
              genderCounts['not_specified'] = 0;
              
              data.forEach((profile) => {
                if (profile && typeof profile === 'object' && 'gender' in profile) {
                  const gender = profile.gender || 'not_specified';
                  genderCounts[gender] = (genderCounts[gender] || 0) + 1;
                }
              });
            }
          } else {
            console.log('Gender column not available or error occurred:', genderTestError);
          }
        } catch (error) {
          console.log('Error checking gender column:', error);
        }
        
        // Check for and process age group data
        try {
          const { data: ageTest, error: ageTestError } = await supabase
            .from('profiles')
            .select('age_group')
            .limit(1);
            
          if (!ageTestError && ageTest && ageTest.length > 0) {
            const { data, error: usersError } = await supabase.from('profiles').select('age_group');
            
            if (!usersError && data) {
              ageCounts['not_specified'] = 0;
              
              data.forEach((profile) => {
                if (profile && typeof profile === 'object' && 'age_group' in profile) {
                  const ageGroup = profile.age_group || 'not_specified';
                  ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1;
                }
              });
            }
          } else {
            console.log('Age group column not available or error occurred:', ageTestError);
          }
        } catch (error) {
          console.log('Error checking age_group column:', error);
        }
        
        // Check for and process country data
        try {
          const { data: countryTest, error: countryTestError } = await supabase
            .from('profiles')
            .select('country')
            .limit(1);
            
          if (!countryTestError && countryTest && countryTest.length > 0) {
            const { data, error: usersError } = await supabase.from('profiles').select('country');
            
            if (!usersError && data) {
              countryCounts['not_specified'] = 0;
              
              data.forEach((profile) => {
                if (profile && typeof profile === 'object' && 'country' in profile) {
                  const country = profile.country || 'not_specified';
                  countryCounts[country] = (countryCounts[country] || 0) + 1;
                }
              });
            }
          } else {
            console.log('Country column not available or error occurred:', countryTestError);
          }
        } catch (error) {
          console.log('Error checking country column:', error);
        }
        
        return {
          gender_distribution: genderCounts,
          age_distribution: ageCounts,
          country_distribution: countryCounts
        };
      } catch (err) {
        console.error('Error in user demographics query:', err);
        return {
          gender_distribution: { 'not_specified': 0 },
          age_distribution: { 'not_specified': 0 },
          country_distribution: { 'not_specified': 0 }
        };
      }
    }
  });

  const { data: revenueMetrics, isLoading: isLoadingRevenueMetrics } = useQuery({
    queryKey: ['revenueMetrics', fromDate, toDate],
    queryFn: async () => {
      try {
        const { data: tableCheck, error: tableError } = await supabase
          .from('site_income')
          .select('id')
          .limit(1);
        
        if (tableError) {
          console.error('Error checking site_income table:', tableError);
          return {
            total_revenue: 0,
            avg_revenue_per_user: 0,
            credit_purchases: 0,
            revenue_by_type: { 'no_data': 0 }
          };
        }

        const { data: incomeData, error: incomeError } = await supabase
          .from('site_income')
          .select('amount, source_type')
          .gte('date', fromDate)
          .lte('date', toDate);
        
        if (incomeError) {
          console.error('Error fetching income data:', incomeError);
          return {
            total_revenue: 0,
            avg_revenue_per_user: 0,
            credit_purchases: 0,
            revenue_by_type: { 'no_data': 0 }
          };
        }
        
        const totalRevenue = incomeData?.reduce((sum, item) => sum + (parseFloat(item.amount as any) || 0), 0) || 0;
        
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
        
        if (userError) {
          console.error('Error counting users:', userError);
          return {
            total_revenue: totalRevenue,
            avg_revenue_per_user: 0,
            credit_purchases: 0,
            revenue_by_type: { 'no_data': totalRevenue }
          };
        }
        
        const revenueByType: Record<string, number> = {};
        if (incomeData && incomeData.length > 0) {
          incomeData.forEach(item => {
            const type = item.source_type || 'other';
            revenueByType[type] = (revenueByType[type] || 0) + (parseFloat(item.amount as any) || 0);
          });
        } else {
          revenueByType['no_data'] = 0;
        }
        
        const creditPurchases = incomeData?.filter(item => 
          item.source_type === 'puzzle' || item.source_type === 'membership'
        ).length || 0;
        
        return {
          total_revenue: totalRevenue,
          avg_revenue_per_user: userCount ? totalRevenue / userCount : 0,
          credit_purchases: creditPurchases,
          revenue_by_type: revenueByType
        };
      } catch (err) {
        console.error('Unexpected error in revenue metrics:', err);
        return {
          total_revenue: 0,
          avg_revenue_per_user: 0,
          credit_purchases: 0,
          revenue_by_type: { 'error': 0 }
        };
      }
    }
  });

  const { data: puzzleMetrics, isLoading: isLoadingPuzzleMetrics } = useQuery({
    queryKey: ['puzzleMetrics', fromDate, toDate],
    queryFn: async () => {
      try {
        const { data: puzzleCheck, error: puzzleCheckError } = await supabase
          .from('puzzles')
          .select('id')
          .limit(1);
        
        if (puzzleCheckError) {
          console.error('Error checking puzzles table:', puzzleCheckError);
          return {
            active_puzzles: 0,
            avg_completion_time: 0,
            completion_rate: 0,
            prize_redemption_rate: 0
          };
        }

        const { data: activePuzzles, error: puzzlesError } = await supabase
          .from('puzzles')
          .select('id')
          .eq('status', 'active');
        
        if (puzzlesError) {
          console.error('Error fetching puzzles:', puzzlesError);
          return {
            active_puzzles: 0,
            avg_completion_time: 0,
            completion_rate: 0,
            prize_redemption_rate: 0
          };
        }
        
        const { data: completionCheck, error: completionCheckError } = await supabase
          .from('puzzle_completions')
          .select('id')
          .limit(1);
        
        if (completionCheckError) {
          console.error('Error checking puzzle_completions table:', completionCheckError);
          return {
            active_puzzles: activePuzzles?.length || 0,
            avg_completion_time: 0,
            completion_rate: 0,
            prize_redemption_rate: 0
          };
        }

        const { data: completions, error: completionsError } = await supabase
          .from('puzzle_completions')
          .select('completion_time, is_winner');
        
        if (completionsError) {
          console.error('Error fetching completions:', completionsError);
          return {
            active_puzzles: activePuzzles?.length || 0,
            avg_completion_time: 0,
            completion_rate: 0,
            prize_redemption_rate: 0
          };
        }
        
        const totalCompletions = completions?.length || 0;
        const winners = completions?.filter(c => c.is_winner).length || 0;
        const completionTimes = completions
          ?.map(c => parseFloat(c.completion_time as any) || 0)
          .filter(Boolean);
        
        const avgTime = completionTimes?.length 
          ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length 
          : 0;
        
        const { data: progressCheck, error: progressCheckError } = await supabase
          .from('puzzle_progress')
          .select('id')
          .limit(1);
        
        let puzzleCount = 0;
        if (!progressCheckError) {
          const { count, error: countError } = await supabase
            .from('puzzle_progress')
            .select('id', { count: 'exact', head: true });
          
          if (!countError) {
            puzzleCount = count || 0;
          }
        }
        
        return {
          active_puzzles: activePuzzles?.length || 0,
          avg_completion_time: avgTime,
          completion_rate: puzzleCount ? (totalCompletions / puzzleCount) * 100 : 0,
          prize_redemption_rate: totalCompletions ? (winners / totalCompletions) * 100 : 0
        };
      } catch (err) {
        console.error('Unexpected error in puzzle metrics:', err);
        return {
          active_puzzles: 0,
          avg_completion_time: 0,
          completion_rate: 0,
          prize_redemption_rate: 0
        };
      }
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
