export interface DailyMetrics {
  active_users: number;
  new_signups: number;
  puzzles_completed: number;
  revenue: number;
  total_users: number; // Keep this for API compatibility but will display as "members"
}

export interface MonthlyTrend {
  month_date: string;
  active_users: number;
  new_signups: number;
  puzzles_completed: number;
  revenue: number;
  total_users: number;
}

export interface CategoryRevenue {
  category_name: string;
  total_revenue: number;
}

export interface MemberDemographics {
  gender_distribution: Record<string, number>;
  age_distribution: Record<string, number>;
  country_distribution: Record<string, number>;
  total_members: number;
}

export interface PuzzleMetrics {
  active_puzzles: number;
  avg_completion_time: number;
  completion_rate: number;
  prize_redemption_rate: number;
}

export interface RevenueMetrics {
  total_revenue: number;
  avg_revenue_per_user: number;
  credit_purchases: number;
  revenue_by_type: Record<string, number>;
}

export interface ActivityBreakdown {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface TrendValue {
  value: string | number;
  direction: "up" | "down";
}

// Backward compatibility - keep UserDemographics as alias
export type UserDemographics = MemberDemographics;
