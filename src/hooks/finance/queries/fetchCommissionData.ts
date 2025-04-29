
import { supabase } from "@/integrations/supabase/client";
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';

/**
 * Fetches commission payment data from the database
 * @returns Promise resolving to an array of commission payments
 */
export async function fetchCommissionPayments(): Promise<CommissionPayment[]> {
  try {
    const { data, error } = await supabase
      .from('commission_payments')
      .select(`
        *,
        categories:category_id(name),
        manager:manager_id(username, email)
      `);

    if (error) {
      console.error('Supabase error fetching commission payments:', error);
      throw error;
    }

    return (data || []).map(payment => {
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
  } catch (err) {
    console.error('Error fetching commission payments:', err);
    return [];
  }
}
