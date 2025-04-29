
import { supabase } from "@/integrations/supabase/client";
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';

/**
 * Fetches commission payment data from the database
 * @returns Promise resolving to an array of commission payments
 */
export async function fetchCommissionPayments(): Promise<CommissionPayment[]> {
  console.log('[FINANCE DEBUG] fetchCommissionPayments called');
  
  try {
    console.log('[FINANCE DEBUG] Executing Supabase query for commission payments');
    
    const { data, error } = await supabase
      .from('commission_payments')
      .select(`
        *,
        categories:category_id(name),
        manager:manager_id(username, email)
      `);

    if (error) {
      console.error('[FINANCE ERROR] Supabase error fetching commission payments:', error);
      console.error('[FINANCE ERROR] Error details:', JSON.stringify(error));
      throw error;
    }

    console.log('[FINANCE DEBUG] Raw commission data returned:', data ? data.length : 'none');
    
    const processedData = (data || []).map(payment => {
      let managerName = 'Unknown';
      let managerEmail: string | undefined = undefined;
      
      if (payment.manager && typeof payment.manager === 'object') {
        const manager = payment.manager as any;
        managerName = manager && 'username' in manager ? 
                     (manager.username as string || 'Unknown') : 'Unknown';
        managerEmail = manager && 'email' in manager ? 
                      (manager.email as string) : undefined;
      }

      return {
        ...payment,
        manager_name: managerName,
        manager_email: managerEmail,
        category_name: payment.categories?.name || 'Unknown',
        payment_status: payment.payment_status as PaymentStatus
      };
    });
    
    console.log('[FINANCE DEBUG] Processed commission payments count:', processedData.length);
    return processedData;
  } catch (err) {
    console.error('[FINANCE ERROR] Error fetching commission payments:', err);
    console.error('[FINANCE ERROR] Stack trace:', err instanceof Error ? err.stack : 'No stack trace');
    return [];
  }
}
