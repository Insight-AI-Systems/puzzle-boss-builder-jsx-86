
import { supabase } from "@/integrations/supabase/client";
import { MonthlyFinancialSummary } from '@/types/financeTypes';

/**
 * Fetches monthly financial summary data from the database
 * @param period - The month to fetch data for, in YYYY-MM format
 * @returns Promise resolving to the financial summary or null
 */
export async function fetchMonthlyFinancialSummary(
  period: string
): Promise<MonthlyFinancialSummary | null> {
  try {
    // Create a safe query with proper parameters
    const { data, error: dbError } = await supabase
      .rpc('get_monthly_financial_summary', { month_param: period });

    if (dbError) {
      console.error('Database error fetching monthly summary:', dbError);
      throw dbError;
    }
    
    console.log('Monthly summary data:', data);
    
    // If data exists and is not empty, return the first item
    if (data && data.length > 0) {
      return data[0] as MonthlyFinancialSummary;
    }
    
    // Return default object if no data
    return {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
  } catch (err) {
    console.error('Exception in fetchMonthlyFinancialSummary:', err);
    
    // Return a default object instead of throwing to prevent UI from breaking
    return {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
  }
}
