
import { supabase } from '@/integrations/supabase/client';
import { CategoryManager } from '@/types/financeTypes';
import { debugLog, DebugLevel } from '@/utils/debug';

export async function fetchCategoryManagers(): Promise<CategoryManager[]> {
  debugLog('FINANCE HOOK', 'fetchCategoryManagers called', DebugLevel.INFO);
  
  try {
    // Empty array fallback - prevents UI errors with null data
    let safeResult: CategoryManager[] = [];
    
    // Make DB query with relationships
    const { data, error } = await supabase
      .from('category_managers')
      .select(`
        *,
        profiles:user_id (username, email),
        categories:category_id (name)
      `);
    
    if (error) {
      debugLog('FINANCE HOOK', 'Error fetching category managers:', DebugLevel.ERROR, error);
      throw error;
    }
    
    // Process data if available
    if (data && Array.isArray(data)) {
      debugLog('FINANCE HOOK', `Fetched ${data.length} category manager records`, DebugLevel.INFO);
      safeResult = data.map(item => ({
        ...item,
        // Ensure expected property values exist even if DB returns null
        commission_percent: item.commission_percent || 0,
        active: item.active !== false, // Default to true if undefined
        username: item.profiles?.username || 'Unknown',
        category_name: item.categories?.name || 'Unknown',
        profiles: {
          username: item.profiles?.username || 'Unknown',
          email: item.profiles?.email || 'unknown@example.com'
        },
        categories: {
          name: item.categories?.name || 'Unknown'
        }
      }));
    } else {
      debugLog('FINANCE HOOK', 'No category manager data found or invalid response format', DebugLevel.WARN);
    }
    
    return safeResult;
  } catch (err) {
    debugLog('FINANCE HOOK', 'Exception in fetchCategoryManagers:', DebugLevel.ERROR, err);
    throw err;
  }
}
