
import { supabase } from "@/integrations/supabase/client";
import { SiteExpense, ExpenseType } from '@/types/financeTypes';

/**
 * Fetches expense data for a specified month
 * @param month - Month in YYYY-MM format
 * @returns Promise resolving to an array of expense records
 */
export async function fetchSiteExpenses(month: string): Promise<SiteExpense[]> {
  try {
    const { data, error } = await supabase
      .from('site_expenses')
      .select(`
        *,
        categories:category_id(name)
      `)
      .like('date', `${month}%`);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      expense_type: item.expense_type as ExpenseType,
      categories: { name: item.categories?.name || 'Unknown' }
    }));
  } catch (err) {
    console.error('Error fetching site expenses:', err);
    return [];
  }
}
