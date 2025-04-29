
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
  try {
    const { data, error } = await supabase
      .from('site_income')
      .select(`
        *,
        categories:category_id(name),
        profiles:user_id(username)
      `)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;
    
    return (data || []).map(item => {
      const username = item.profiles && typeof item.profiles === 'object' ? 
                      ((item.profiles as any).username as string || 'Anonymous') : 'Anonymous';

      return {
        ...item,
        source_type: item.source_type as SourceType,
        profiles: { username }
      };
    });
  } catch (err) {
    console.error('Error fetching site incomes:', err);
    return [];
  }
}
