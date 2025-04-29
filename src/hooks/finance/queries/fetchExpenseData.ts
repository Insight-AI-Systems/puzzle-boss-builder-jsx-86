
import { supabase } from "@/integrations/supabase/client";
import { SiteExpense, ExpenseType } from '@/types/financeTypes';

/**
 * Fetches expense data for a specified month
 * @param month - Month in YYYY-MM format
 * @returns Promise resolving to an array of expense records
 */
export async function fetchSiteExpenses(month: string): Promise<SiteExpense[]> {
  console.log('[FINANCE DEBUG] fetchSiteExpenses called with month:', month);
  
  if (!month || typeof month !== 'string') {
    console.error('[FINANCE ERROR] Invalid month parameter in fetchSiteExpenses:', month);
    return [];
  }

  try {
    console.log('[FINANCE DEBUG] Executing Supabase query for expenses in month:', month);
    
    const { data, error } = await supabase
      .from('site_expenses')
      .select(`
        *,
        categories:category_id(name)
      `)
      .like('date', `${month}%`);

    if (error) {
      console.error('[FINANCE ERROR] Supabase error fetching site expenses:', error);
      console.error('[FINANCE ERROR] Error details:', JSON.stringify(error));
      throw error;
    }
    
    console.log('[FINANCE DEBUG] Raw expenses data returned:', data ? data.length : 'none');
    
    const processedData = (data || []).map(item => ({
      ...item,
      expense_type: item.expense_type as ExpenseType,
      categories: { name: item.categories?.name || 'Unknown' }
    }));
    
    console.log('[FINANCE DEBUG] Processed expenses count:', processedData.length);
    return processedData;
  } catch (err) {
    console.error('[FINANCE ERROR] Error fetching site expenses:', err);
    console.error('[FINANCE ERROR] Stack trace:', err instanceof Error ? err.stack : 'No stack trace');
    return [];
  }
}
