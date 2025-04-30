
import { supabase } from '@/integrations/supabase/client';
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';
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
        categories:category_id (name),
        profiles:manager_id (username, email)
      `);
    
    if (error) {
      debugLog('FINANCE HOOK', 'Error fetching commission payments:', DebugLevel.ERROR, error);
      throw error;
    }
    
    // Process data if available
    if (data && Array.isArray(data)) {
      debugLog('FINANCE HOOK', `Fetched ${data.length} commission payment records`, DebugLevel.INFO);
      safeResult = data.map(item => {
        // Handle potentially null profile data
        const profileData = item.profiles || {};
        const username = typeof profileData === 'object' && 'username' in profileData 
          ? profileData.username 
          : 'Unknown';
        const email = typeof profileData === 'object' && 'email' in profileData
          ? profileData.email
          : 'unknown@example.com';
          
        return {
          ...item,
          // Ensure expected property values exist even if DB returns null
          gross_income: item.gross_income || 0,
          net_income: item.net_income || 0,
          commission_amount: item.commission_amount || 0,
          payment_status: (item.payment_status as PaymentStatus) || PaymentStatus.PENDING,
          manager_name: username,
          manager_email: email,
          category_name: item.categories?.name || 'Unknown',
          is_overdue: false // Default value since property doesn't exist in DB
        } as CommissionPayment;
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

// Add the updateCommissionStatus function
export async function updateCommissionStatus(paymentId: string, status: PaymentStatus): Promise<void> {
  debugLog('FINANCE HOOK', `updateCommissionStatus called for ID: ${paymentId} with status: ${status}`, DebugLevel.INFO);
  
  try {
    const updateData: { payment_status: PaymentStatus; payment_date?: string | null } = {
      payment_status: status
    };
    
    // Add payment date when status is set to PAID
    if (status === PaymentStatus.PAID) {
      updateData.payment_date = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('commission_payments')
      .update(updateData)
      .eq('id', paymentId);
    
    if (error) {
      debugLog('FINANCE HOOK', 'Error updating commission payment status:', DebugLevel.ERROR, error);
      throw error;
    }
    
    debugLog('FINANCE HOOK', `Successfully updated payment ${paymentId} to ${status}`, DebugLevel.INFO);
  } catch (err) {
    debugLog('FINANCE HOOK', 'Exception in updateCommissionStatus:', DebugLevel.ERROR, err);
    throw err;
  }
}
