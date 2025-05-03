
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FinancialTransaction } from '@/types/memberTypes';

export function useFinancialTransactions(userId?: string, options = { limit: 10, offset: 0 }) {
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch transactions for a user
  const transactionsQuery = useQuery({
    queryKey: ['financial-transactions', userId, options],
    queryFn: async () => {
      if (!userId) return { data: [], count: 0 };

      try {
        // Get transaction count
        const { count, error: countError } = await supabase
          .from('financial_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (countError) {
          throw new Error(`Failed to fetch transaction count: ${countError.message}`);
        }
        
        // Fetch transactions with pagination
        const { data, error: fetchError } = await supabase
          .from('financial_transactions')
          .select(`
            *,
            categories:category_id (name)
          `)
          .eq('user_id', userId)
          .order('transaction_date', { ascending: false })
          .range(options.offset, options.offset + options.limit - 1);
          
        if (fetchError) {
          throw new Error(`Failed to fetch transactions: ${fetchError.message}`);
        }
        
        return { 
          data: data as FinancialTransaction[], 
          count: count || 0 
        };
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        return { data: [], count: 0 };
      }
    },
    enabled: !!userId,
  });

  return {
    transactions: transactionsQuery.data?.data || [],
    totalCount: transactionsQuery.data?.count || 0,
    isLoading: transactionsQuery.isLoading,
    error,
    refetch: transactionsQuery.refetch,
  };
}
