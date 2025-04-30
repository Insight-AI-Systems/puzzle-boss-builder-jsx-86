
import { supabase } from '@/integrations/supabase/client';
import { SiteIncome } from '@/types/financeTypes';
import { debugLog, DebugLevel } from '@/utils/debug';

export async function fetchSiteIncomes(startDate: string, endDate: string): Promise<SiteIncome[]> {
  debugLog('FINANCE HOOK', `fetchSiteIncomes called with date range: ${startDate} to ${endDate}`, DebugLevel.INFO);
  
  try {
    // Empty array fallback - prevents UI errors with null data
    let safeResult: SiteIncome[] = [];
    
    // Make DB query with relationships
    const { data, error } = await supabase
      .from('site_income')
      .select(`
        *,
        categories:category_id (name),
        profiles:user_id (username)
      `)
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) {
      debugLog('FINANCE HOOK', 'Error fetching site incomes:', DebugLevel.ERROR, error);
      throw error;
    }
    
    // Process data if available
    if (data && Array.isArray(data)) {
      debugLog('FINANCE HOOK', `Fetched ${data.length} income records`, DebugLevel.INFO);
      safeResult = data.map(item => ({
        ...item,
        // Ensure expected property values exist even if DB returns null
        amount: item.amount || 0,
        source_type: item.source_type || 'other',
        method: item.method || 'unknown',
        date: item.date,
        id: item.id,
        categories: item.categories || { name: 'Unknown' },
        profiles: item.profiles || { username: 'Unknown' }
      }));
    } else {
      debugLog('FINANCE HOOK', 'No income data found or invalid response format', DebugLevel.WARN);
    }
    
    return safeResult;
  } catch (err) {
    debugLog('FINANCE HOOK', 'Exception in fetchSiteIncomes:', DebugLevel.ERROR, err);
    throw err;
  }
}
