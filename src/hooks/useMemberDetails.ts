
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MemberHistoryDetails } from '@/types/membershipTypes';

export function useMemberDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMemberDetails = async (userId: string): Promise<MemberHistoryDetails | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get financial summary
      const { data: summary } = await supabase.rpc('get_user_financial_summary', {
        user_id_param: userId
      });

      // Get memberships
      const { data: memberships } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', userId);

      // Get payment methods
      const { data: paymentMethods } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', userId);

      // Get transactions
      const { data: transactions } = await supabase
        .from('site_income')
        .select('*')
        .eq('user_id', userId);

      return {
        memberships: memberships || [],
        paymentMethods: paymentMethods || [],
        financialSummary: summary?.[0] || null,
        transactions: transactions || []
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch member details'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchMemberDetails
  };
}
