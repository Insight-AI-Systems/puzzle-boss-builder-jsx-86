
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
  if (!period || typeof period !== 'string' || !period.match(/^\d{4}-\d{2}$/)) {
    console.error('[FINANCE ERROR] Invalid period format:', period);
    throw new Error('Invalid period format. Expected YYYY-MM');
  }
  
  try {
    console.log('[FINANCE DEBUG] Fetch started for period:', period);
    
    // Use an aliased parameter name to avoid column name ambiguity
    const { data, error: dbError } = await supabase
      .rpc('get_monthly_financial_summary', { month_param: period });

    // Handle database errors
    if (dbError) {
      console.error('[FINANCE ERROR] Database error fetching monthly summary:', dbError);
      console.error('[FINANCE ERROR] Error details:', JSON.stringify(dbError));
      throw dbError;
    }
    
    // Log successful response
    console.log('[FINANCE DEBUG] Monthly summary raw data:', data);
    
    // If data exists and is not empty, return the first item
    if (data && data.length > 0) {
      const result: MonthlyFinancialSummary = {
        period,
        total_income: data[0].total_income || 0,
        total_expenses: data[0].total_expenses || 0,
        net_profit: data[0].net_profit || 0,
        commissions_paid: data[0].commissions_paid || 0,
        prize_expenses: data[0].prize_expenses || 0
      };
      
      console.log('[FINANCE DEBUG] Processed summary data:', result);
      return result;
    }
    
    // Return default object if no data
    const defaultResult = {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
    
    console.log('[FINANCE DEBUG] No data found, returning default:', defaultResult);
    return defaultResult;
  } catch (err) {
    console.error('[FINANCE ERROR] Exception in fetchMonthlyFinancialSummary:', err);
    console.error('[FINANCE ERROR] Stack trace:', err instanceof Error ? err.stack : 'No stack trace');

    if (err instanceof Error) {
      // Rethrow the error for the caller to handle
      throw err;
    } else {
      throw new Error('Unknown error occurred while fetching financial data');
    }
  }
}
