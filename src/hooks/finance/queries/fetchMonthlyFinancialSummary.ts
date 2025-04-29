
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
    console.log('[FINANCE DEBUG] Fetch started for period:', period);
    
    // Validate input
    if (!period || typeof period !== 'string' || !period.match(/^\d{4}-\d{2}$/)) {
      console.error('[FINANCE ERROR] Invalid period format:', period);
      throw new Error('Invalid period format. Expected YYYY-MM');
    }
    
    console.log('[FINANCE DEBUG] Calling Supabase RPC with param:', { month_param: period });
    
    // Use an aliased parameter name to avoid column name ambiguity
    const { data, error: dbError } = await supabase
      .rpc('get_monthly_financial_summary', { month_param: period });

    // Log database response
    if (dbError) {
      console.error('[FINANCE ERROR] Database error fetching monthly summary:', dbError);
      console.error('[FINANCE ERROR] Error details:', JSON.stringify(dbError));
      throw dbError;
    }
    
    // Log successful response
    console.log('[FINANCE DEBUG] Monthly summary raw data:', JSON.stringify(data));
    
    // If data exists and is not empty, return the first item
    if (data && data.length > 0) {
      const result = {
        period: period, // Use the input parameter to avoid ambiguity
        total_income: data[0].total_income || 0,
        total_expenses: data[0].total_expenses || 0,
        net_profit: data[0].net_profit || 0,
        commissions_paid: data[0].commissions_paid || 0,
        prize_expenses: data[0].prize_expenses || 0
      };
      
      console.log('[FINANCE DEBUG] Processed summary data:', JSON.stringify(result));
      return result;
    }
    
    // Log when no data is found
    console.log('[FINANCE DEBUG] No financial data found for period:', period);
    
    // Return default object if no data
    const defaultResult = {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
    
    console.log('[FINANCE DEBUG] Returning default summary:', JSON.stringify(defaultResult));
    return defaultResult;
  } catch (err) {
    console.error('[FINANCE ERROR] Exception in fetchMonthlyFinancialSummary:', err);
    console.error('[FINANCE ERROR] Stack trace:', err instanceof Error ? err.stack : 'No stack trace');
    
    // Return a default object instead of throwing to prevent UI from breaking
    const errorResult = {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
    
    console.log('[FINANCE DEBUG] Returning error fallback data:', JSON.stringify(errorResult));
    return errorResult;
  }
}
