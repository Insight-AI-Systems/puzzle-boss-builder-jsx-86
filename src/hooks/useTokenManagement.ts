
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TokenTransaction } from '@/types/userTypes';

export function useTokenManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Award tokens mutation
  const awardTokens = useMutation({
    mutationFn: async ({ targetUserId, tokens, adminNote }: { 
      targetUserId: string; 
      tokens: number; 
      adminNote?: string 
    }) => {
      console.log('Awarding tokens:', { targetUserId, tokens, adminNote });
      
      const { error } = await supabase.rpc('award_tokens', {
        target_user_id: targetUserId,
        tokens_to_add: tokens,
        admin_note: adminNote
      });

      if (error) {
        console.error('Error awarding tokens:', error);
        throw new Error(`Failed to award tokens: ${error.message}`);
      }

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Tokens awarded successfully!",
        description: "The tokens have been added to the user's account.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['member-profile'] });
      queryClient.invalidateQueries({ queryKey: ['token-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      
      setError(null);
    },
    onError: (error) => {
      console.error('Token award mutation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to award tokens';
      setError(new Error(errorMessage));
      toast({
        title: "Error awarding tokens",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Fetch token transactions
  const fetchTokenTransactions = async (userId?: string): Promise<TokenTransaction[]> => {
    if (!userId) return [];

    console.log('Fetching token transactions for user:', userId);
    
    const { data, error } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching token transactions:', error);
      throw new Error(`Failed to fetch token transactions: ${error.message}`);
    }

    return data || [];
  };

  // Query for token transactions
  const useTokenTransactions = (userId?: string) => {
    return useQuery({
      queryKey: ['token-transactions', userId],
      queryFn: () => fetchTokenTransactions(userId),
      enabled: !!userId,
    });
  };

  return {
    isLoading,
    error,
    awardTokens,
    useTokenTransactions,
    fetchTokenTransactions
  };
}
