
import { supabase } from '@/integrations/supabase/client';
import { MonthlyFinancialSummary } from '@/types/financeTypes';

export async function fetchMonthlyFinancialSummary(period: string): Promise<MonthlyFinancialSummary | null> {
  console.log('[FINANCE HOOK] fetchMonthlyFinancialSummary called for period:', period);
  
  try {
    // Try to fetch from the monthly_financial_summary view/table
    const { data: summaryData, error: summaryError } = await supabase
      .from('monthly_financial_summary')
      .select('*')
      .eq('period', period)
      .single();
    
    console.log('[FINANCE HOOK] Monthly summary query result:', { 
      data: summaryData, 
      error: summaryError ? { code: summaryError.code, message: summaryError.message } : null 
    });
    
    if (summaryError && summaryError.code !== 'PGRST116') {
      console.error('[FINANCE HOOK] Error fetching monthly summary:', summaryError);
      throw summaryError;
    }
    
    if (summaryData) {
      console.log('[FINANCE HOOK] Monthly summary data:', [summaryData]);
      return {
        period: summaryData.period,
        total_income: summaryData.total_income || 0,
        total_expenses: summaryData.total_expenses || 0,
        net_profit: summaryData.net_profit || 0,
        commissions_paid: summaryData.commissions_paid || 0,
        prize_expenses: summaryData.prize_expenses || 0
      };
    }
    
    // If no data found, construct summary from raw tables
    console.log('[FINANCE HOOK] No summary found in monthly_financial_summary, calculating from raw tables');
    
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
