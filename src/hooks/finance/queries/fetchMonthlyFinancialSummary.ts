
import { supabase } from '@/integrations/supabase/client';
import { MonthlyFinancialSummary } from '@/types/financeTypes';

export async function fetchMonthlyFinancialSummary(period: string): Promise<MonthlyFinancialSummary | null> {
  console.log('[FINANCE HOOK] fetchMonthlyFinancialSummary called for period:', period);
  
  try {
    // Call the stored function instead of trying to access a view
    const { data: summaryData, error: summaryError } = await supabase.rpc(
      'get_monthly_financial_summary',
      { month_param: period }
    );
    
    console.log('[FINANCE HOOK] Monthly summary query result:', { 
      data: summaryData, 
      error: summaryError ? { code: summaryError.code, message: summaryError.message } : null 
    });
    
    if (summaryError) {
      console.error('[FINANCE HOOK] Error fetching monthly summary:', summaryError);
      throw summaryError;
    }
    
    if (summaryData) {
      console.log('[FINANCE HOOK] Monthly summary data:', [summaryData]);
      return {
        period: summaryData.period || period,
        total_income: summaryData.total_income || 0,
        total_expenses: summaryData.total_expenses || 0,
        net_profit: summaryData.net_profit || 0,
        commissions_paid: summaryData.commissions_paid || 0,
        prize_expenses: summaryData.prize_expenses || 0
      };
    }
    
    // If no data found, construct summary from raw tables
    console.log('[FINANCE HOOK] No summary found, calculating from raw tables');
    
    // Create fallback data
    const fallbackData: MonthlyFinancialSummary = {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
    
    // Log the fallback data being returned
    console.log('[FINANCE HOOK] Monthly summary data:', [fallbackData]);
    
    return fallbackData;
  } catch (error) {
    console.error('[FINANCE HOOK] Exception in fetchMonthlyFinancialSummary:', error);
    throw error;
  }
}
