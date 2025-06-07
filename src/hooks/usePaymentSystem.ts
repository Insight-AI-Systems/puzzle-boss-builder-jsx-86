import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  PaymentMethod,
  UserWallet,
  GameTransaction,
  GamePrizePool,
  PaymentVerificationResult,
  RefundRequest,
  TransactionReceipt,
  PrizeDistribution
} from '@/types/payments';

// Helper functions to convert database results to proper types
const convertToPaymentMethod = (dbMethod: any): PaymentMethod => ({
  id: dbMethod.id,
  user_id: dbMethod.user_id,
  method_type: dbMethod.method_type as PaymentMethod['method_type'],
  provider: dbMethod.provider,
  last_four: dbMethod.last_four,
  is_default: dbMethod.is_default,
  is_active: dbMethod.is_active,
  metadata: dbMethod.metadata as Record<string, any>,
  created_at: dbMethod.created_at,
  updated_at: dbMethod.updated_at
});

const convertToGamePrizePool = (dbPool: any): GamePrizePool => ({
  id: dbPool.id,
  game_id: dbPool.game_id,
  game_type: dbPool.game_type,
  entry_fee: dbPool.entry_fee,
  total_pool: dbPool.total_pool,
  entries_count: dbPool.entries_count,
  max_entries: dbPool.max_entries,
  prize_distribution: Array.isArray(dbPool.prize_distribution) 
    ? dbPool.prize_distribution as PrizeDistribution[]
    : [],
  status: dbPool.status as GamePrizePool['status'],
  created_at: dbPool.created_at,
  updated_at: dbPool.updated_at
});

const convertToTransactionReceipt = (dbReceipt: any): TransactionReceipt => ({
  id: dbReceipt.id,
  transaction_id: dbReceipt.transaction_id,
  receipt_number: dbReceipt.receipt_number,
  user_id: dbReceipt.user_id,
  amount: dbReceipt.amount,
  currency: dbReceipt.currency,
  description: dbReceipt.description,
  receipt_data: dbReceipt.receipt_data as Record<string, any>,
  created_at: dbReceipt.created_at
});

export function usePaymentSystem() {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get user wallet
  const fetchWallet = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If wallet doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('Creating new wallet for user:', user.id);
          const { data: newWallet, error: createError } = await supabase
            .from('user_wallets')
            .insert({
              user_id: user.id,
              balance: 0.00,
              currency: 'USD'
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating wallet:', createError);
            throw createError;
          }
          setWallet(newWallet);
          return newWallet;
        }
        throw error;
      }
      
      setWallet(data);
      return data;
    } catch (error) {
      console.error('Error fetching/creating wallet:', error);
      return null;
    }
  }, [user]);

  // Get payment methods
  const fetchPaymentMethods = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false });

      if (error) throw error;
      
      const convertedMethods = (data || []).map(convertToPaymentMethod);
      setPaymentMethods(convertedMethods);
      return convertedMethods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }, [user]);

  // Verify payment for game entry - updated to handle credits with better error handling
  const verifyGameEntry = useCallback(async (
    gameId: string,
    entryFee: number,
    testMode: boolean = false,
    useCredits: boolean = false
  ): Promise<PaymentVerificationResult> => {
    if (!user) {
      return {
        success: false,
        canPlay: false,
        balance: 0,
        entryFee,
        error: 'User not authenticated'
      };
    }

    setLoading(true);

    try {
      // In test mode, bypass payment verification
      if (testMode) {
        return {
          success: true,
          canPlay: true,
          balance: 999999,
          entryFee: 0
        };
      }

      if (useCredits) {
        // Handle credit-based payment with improved error handling
        console.log('Processing credit payment for user:', user.id, 'amount:', entryFee);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw new Error('Unable to fetch user credits');
        }

        const currentCredits = profile.credits || 0;
        console.log('Current credits:', currentCredits, 'Required:', entryFee);
        
        if (currentCredits < entryFee) {
          return {
            success: false,
            canPlay: false,
            balance: wallet?.balance || 0,
            entryFee,
            error: `Insufficient credits. You have ${currentCredits}, but need ${entryFee} credits.`
          };
        }

        // Create credit transaction with better error handling
        console.log('Creating credit transaction...');
        const { data: transaction, error: transactionError } = await supabase
          .from('financial_transactions')
          .insert({
            user_id: user.id,
            member_id: user.id,
            transaction_type: 'puzzle',
            amount: entryFee,
            currency: 'CREDITS',
            status: 'completed',
            description: `Game entry fee for game ${gameId} (Credits)`,
            metadata: { game_id: gameId, payment_method: 'credits' }
          })
          .select()
          .single();

        if (transactionError) {
          console.error('Error creating transaction:', transactionError);
          throw new Error('Unable to process credit payment');
        }

        console.log('Transaction created:', transaction.id);

        // Deduct credits from profile with better error handling
        console.log('Updating profile credits...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            credits: currentCredits - entryFee,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating credits:', updateError);
          throw new Error('Unable to deduct credits');
        }

        console.log('Credits updated successfully');

        return {
          success: true,
          canPlay: true,
          balance: wallet?.balance || 0,
          entryFee,
          transactionId: transaction.id
        };
      } else {
        // Handle wallet-based payment (existing logic with better error handling)
        const currentWallet = await fetchWallet();
        if (!currentWallet) {
          throw new Error('Unable to access wallet');
        }

        if (currentWallet.balance < entryFee) {
          return {
            success: false,
            canPlay: false,
            balance: currentWallet.balance,
            entryFee,
            error: `Insufficient wallet balance. You have $${currentWallet.balance.toFixed(2)}, but need $${entryFee.toFixed(2)}.`
          };
        }

        // Perform fraud detection check
        const riskScore = await performFraudCheck(user.id, entryFee);
        if (riskScore > 80) {
          return {
            success: false,
            canPlay: false,
            balance: currentWallet.balance,
            entryFee,
            error: 'Transaction flagged for review. Please contact support.'
          };
        }

        // Create entry fee transaction
        const { data: transaction, error: transactionError } = await supabase
          .from('game_transactions')
          .insert({
            user_id: user.id,
            game_id: gameId,
            transaction_type: 'entry_fee',
            amount: entryFee,
            status: 'pending',
            description: `Game entry fee for game ${gameId}`,
            currency: 'USD',
            metadata: {}
          })
          .select()
          .single();

        if (transactionError) throw transactionError;

        // Deduct from wallet balance
        const { error: walletError } = await supabase
          .from('user_wallets')
          .update({ 
            balance: currentWallet.balance - entryFee,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (walletError) throw walletError;

        // Update transaction to completed
        await supabase
          .from('game_transactions')
          .update({ status: 'completed' })
          .eq('id', transaction.id);

        // Generate receipt
        const receipt = await generateReceipt(transaction.id);

        // Update local wallet state
        setWallet(prev => prev ? { ...prev, balance: prev.balance - entryFee } : null);

        return {
          success: true,
          canPlay: true,
          balance: currentWallet.balance - entryFee,
          entryFee,
          transactionId: transaction.id,
          receipt: receipt || undefined
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      
      return {
        success: false,
        canPlay: false,
        balance: wallet?.balance || 0,
        entryFee,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [user, wallet, fetchWallet]);

  // Process refund
  const processRefund = useCallback(async (request: RefundRequest): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);

    try {
      // Get original transaction
      const { data: originalTransaction, error: fetchError } = await supabase
        .from('game_transactions')
        .select('*')
        .eq('id', request.transactionId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (originalTransaction.status === 'refunded') {
        throw new Error('Transaction already refunded');
      }

      const refundAmount = request.amount || originalTransaction.amount;

      // Create refund transaction
      const { data: refundTransaction, error: refundError } = await supabase
        .from('game_transactions')
        .insert({
          user_id: user.id,
          game_id: originalTransaction.game_id,
          session_id: originalTransaction.session_id,
          transaction_type: 'refund',
          amount: refundAmount,
          status: 'completed',
          currency: 'USD',
          description: `Refund for transaction ${request.transactionId}: ${request.reason}`,
          metadata: { original_transaction_id: request.transactionId, reason: request.reason }
        })
        .select()
        .single();

      if (refundError) throw refundError;

      // Update wallet balance
      const currentWallet = await fetchWallet();
      if (currentWallet) {
        await supabase
          .from('user_wallets')
          .update({ 
            balance: currentWallet.balance + refundAmount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        setWallet(prev => prev ? { ...prev, balance: prev.balance + refundAmount } : null);
      }

      // Mark original transaction as refunded
      await supabase
        .from('game_transactions')
        .update({ status: 'refunded' })
        .eq('id', request.transactionId);

      // Generate refund receipt
      await generateReceipt(refundTransaction.id);

      toast({
        title: "Refund Processed",
        description: `$${refundAmount.toFixed(2)} has been refunded to your account`,
      });

      return true;
    } catch (error) {
      console.error('Refund error:', error);
      toast({
        title: "Refund Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, fetchWallet, toast]);

  // Get prize pool for game
  const getPrizePool = useCallback(async (gameId: string): Promise<GamePrizePool | null> => {
    try {
      const { data, error } = await supabase
        .from('game_prize_pools')
        .select('*')
        .eq('game_id', gameId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return convertToGamePrizePool(data);
    } catch (error) {
      console.error('Error fetching prize pool:', error);
      return null;
    }
  }, []);

  // Add funds to wallet (for testing)
  const addFunds = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);

    try {
      // Create deposit transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('game_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'deposit',
          amount,
          status: 'completed',
          currency: 'USD',
          description: `Wallet deposit of $${amount.toFixed(2)}`,
          metadata: { method: 'test_deposit' }
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update wallet balance
      const currentWallet = await fetchWallet();
      if (currentWallet) {
        await supabase
          .from('user_wallets')
          .update({ 
            balance: currentWallet.balance + amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        setWallet(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
      }

      toast({
        title: "Funds Added",
        description: `$${amount.toFixed(2)} has been added to your wallet`,
      });

      return true;
    } catch (error) {
      console.error('Add funds error:', error);
      toast({
        title: "Failed to Add Funds",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, fetchWallet, toast]);

  // Helper function for fraud detection
  const performFraudCheck = async (userId: string, amount: number): Promise<number> => {
    try {
      // Simple fraud detection - in real implementation, this would be more sophisticated
      const riskFactors = [];
      let riskScore = 0;

      // Check for high-frequency transactions
      const { data: recentTransactions } = await supabase
        .from('game_transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('created_at', { ascending: false });

      if (recentTransactions && recentTransactions.length > 10) {
        riskFactors.push('high_frequency_transactions');
        riskScore += 30;
      }

      // Check for large amounts
      if (amount > 100) {
        riskFactors.push('large_amount');
        riskScore += 20;
      }

      // Log fraud check (only if fraud_detection_logs table exists)
      try {
        await supabase.from('fraud_detection_logs').insert({
          user_id: userId,
          risk_score: riskScore,
          risk_factors: riskFactors,
          action_taken: riskScore > 80 ? 'blocked' : 'allowed'
        });
      } catch (logError) {
        console.warn('Could not log fraud detection:', logError);
      }

      return riskScore;
    } catch (error) {
      console.error('Fraud check error:', error);
      return 0; // Allow transaction on error
    }
  };

  // Helper function to generate receipt - simplified to avoid trigger issues
  const generateReceipt = async (transactionId: string): Promise<TransactionReceipt | null> => {
    try {
      const { data: transaction } = await supabase
        .from('game_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (!transaction) return null;

      // Generate a simple receipt number manually
      const timestamp = Date.now();
      const receiptNumber = `RCP-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${timestamp.toString().slice(-6)}`;

      const { data: receipt, error } = await supabase
        .from('transaction_receipts')
        .insert({
          receipt_number: receiptNumber,
          transaction_id: transactionId,
          user_id: transaction.user_id,
          amount: transaction.amount,
          currency: transaction.currency || 'USD',
          description: transaction.description,
          receipt_data: {
            transaction_type: transaction.transaction_type,
            game_id: transaction.game_id,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Receipt generation error:', error);
        return null;
      }
      
      return convertToTransactionReceipt(receipt);
    } catch (error) {
      console.error('Error generating receipt:', error);
      return null;
    }
  };

  return {
    loading,
    wallet,
    paymentMethods,
    fetchWallet,
    fetchPaymentMethods,
    verifyGameEntry,
    processRefund,
    getPrizePool,
    addFunds
  };
}
