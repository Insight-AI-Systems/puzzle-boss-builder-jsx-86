
import { supabase } from '@/integrations/supabase/client';
import { CommissionPayment } from '@/types/financeTypes';
import { debugLog, DebugLevel } from '@/utils/debug';

export async function fetchCommissionPayments(): Promise<CommissionPayment[]> {
  debugLog('FINANCE HOOK', 'fetchCommissionPayments called', DebugLevel.INFO);
  
  try {
    // Empty array fallback - prevents UI errors with null data
    let safeResult: CommissionPayment[] = [];
    
    // Make DB query
    const { data, error } = await supabase
      .from('commission_payments')
      .select(`
        *,
        categories:category_id (name)
      `);
    
    if (error) {
      debugLog('FINANCE HOOK', 'Error fetching commission payments:', DebugLevel.ERROR, error);
      throw error;
    }
    
    // Process data if available
    if (data && Array.isArray(data)) {
      debugLog('FINANCE HOOK', `Fetched ${data.length} commission payment records`, DebugLevel.INFO);
      safeResult = data.map(item => {
        // Create manager name from profiles data or placeholder
        const managerName = "Unknown";
        const managerEmail = "unknown@example.com";
        
        return {
          ...item,
          // Ensure expected property values exist even if DB returns null
          gross_income: item.gross_income || 0,
          net_income: item.net_income || 0,
          commission_amount: item.commission_amount || 0,
          payment_status: item.payment_status || 'pending',
          manager_name: item.manager_name || managerName,
          manager_email: item.manager_email || managerEmail,
          category_name: item.categories?.name || 'Unknown',
          is_overdue: item.is_overdue || false
        };
      });
    } else {
      debugLog('FINANCE HOOK', 'No commission payment data found or invalid response format', DebugLevel.WARN);
    }
    
    return safeResult;
  } catch (err) {
    debugLog('FINANCE HOOK', 'Exception in fetchCommissionPayments:', DebugLevel.ERROR, err);
    throw err;
  }
}
