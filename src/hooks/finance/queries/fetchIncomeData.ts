
import { supabase } from "@/integrations/supabase/client";
import { SiteIncome, SourceType } from '@/types/financeTypes';

/**
 * Fetches income data for a specified date range
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Promise resolving to an array of income records
 */
export async function fetchSiteIncomes(
  startDate: string, 
  endDate: string
): Promise<SiteIncome[]> {
  console.log('[FINANCE DEBUG] fetchSiteIncomes called with dates:', { startDate, endDate });
  
  if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
    console.error('[FINANCE ERROR] Invalid date parameters in fetchSiteIncomes:', { startDate, endDate });
    return [];
  }

  try {
    console.log('[FINANCE DEBUG] Executing Supabase query for income between:', startDate, 'and', endDate);
    
    const { data, error } = await supabase
      .from('site_income')
      .select(`
        *,
        categories:category_id(name),
        profiles:user_id(username)
      `)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('[FINANCE ERROR] Supabase error fetching site incomes:', error);
      console.error('[FINANCE ERROR] Error details:', JSON.stringify(error));
      throw error;
    }
    
    console.log('[FINANCE DEBUG] Raw income data returned:', data ? data.length : 'none');
    
    const processedData = (data || []).map(item => {
      const username = item.profiles && typeof item.profiles === 'object' ? 
                     ((item.profiles as any).username as string || 'Anonymous') : 'Anonymous';

      return {
        ...item,
        source_type: item.source_type as SourceType,
        profiles: { username }
      };
    });
    
    console.log('[FINANCE DEBUG] Processed income count:', processedData.length);
    return processedData;
  } catch (err) {
    console.error('[FINANCE ERROR] Error fetching site incomes:', err);
    console.error('[FINANCE ERROR] Stack trace:', err instanceof Error ? err.stack : 'No stack trace');
    return [];
  }
}
