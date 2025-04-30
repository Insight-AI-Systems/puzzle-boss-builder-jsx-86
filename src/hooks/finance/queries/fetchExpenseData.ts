
import { supabase } from '@/integrations/supabase/client';
import { SiteExpense } from '@/types/financeTypes';
import { debugLog, DebugLevel } from '@/utils/debug';

export async function fetchSiteExpenses(month: string): Promise<SiteExpense[]> {
  debugLog('FINANCE HOOK', `fetchSiteExpenses called for month: ${month}`, DebugLevel.INFO);
  
  try {
    // Calculate date range based on month (YYYY-MM format)
    const startDate = `${month}-01`;
    const year = parseInt(month.substring(0, 4));
    const monthNum = parseInt(month.substring(5, 7));
    const lastDay = new Date(year, monthNum, 0).getDate();
    const endDate = `${month}-${lastDay}`;
    
    debugLog('FINANCE HOOK', `Date range calculated: ${startDate} to ${endDate}`, DebugLevel.INFO);
    
    // Empty array fallback - prevents UI errors with null data
    let safeResult: SiteExpense[] = [];
    
    // Make DB query with relationships
    const { data, error } = await supabase
      .from('site_expenses')
      .select(`
        *,
        categories:category_id (name)
      `)
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) {
      debugLog('FINANCE HOOK', 'Error fetching site expenses:', DebugLevel.ERROR, error);
      throw error;
    }
    
    // Process data if available
    if (data && Array.isArray(data)) {
      debugLog('FINANCE HOOK', `Fetched ${data.length} expense records`, DebugLevel.INFO);
      safeResult = data.map(item => ({
        ...item,
        // Ensure expected property values exist even if DB returns null
        amount: item.amount || 0,
        expense_type: item.expense_type || 'other',
        payee: item.payee || 'Unknown',
        date: item.date,
        id: item.id,
        categories: item.categories || { name: 'Unknown' }
      } as SiteExpense));
    } else {
      debugLog('FINANCE HOOK', 'No expense data found or invalid response format', DebugLevel.WARN);
    }
    
    return safeResult;
  } catch (err) {
    debugLog('FINANCE HOOK', 'Exception in fetchSiteExpenses:', DebugLevel.ERROR, err);
    throw err;
  }
}
