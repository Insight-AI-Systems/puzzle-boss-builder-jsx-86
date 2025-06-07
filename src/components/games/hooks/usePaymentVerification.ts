
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';
import { useMemberProfile } from '@/hooks/useMemberProfile';

export interface PaymentStatus {
  verified: boolean;
  credits: number;
  balance: number;
  hasAccess: boolean;
  requiresPayment: boolean;
  willUseCredits: boolean;
  transactionId?: string;
}

export function usePaymentVerification(entryFee?: number) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    verified: false,
    credits: 0,
    balance: 0,
    hasAccess: false,
    requiresPayment: Boolean(entryFee && entryFee > 0),
    willUseCredits: false
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { verifyGameEntry, wallet, fetchWallet } = usePaymentSystem();
  const { profile } = useMemberProfile();

  // Initialize payment status
  useEffect(() => {
    const initializePaymentStatus = async () => {
      if (!user) {
        setPaymentStatus(prev => ({ ...prev, hasAccess: false }));
        return;
      }

      if (!entryFee || entryFee <= 0) {
        setPaymentStatus({
          verified: true,
          credits: profile?.credits || 0,
          balance: wallet?.balance || 0,
          hasAccess: true,
          requiresPayment: false,
          willUseCredits: false
        });
        return;
      }

      // Fetch wallet to get current balance
      await fetchWallet();
    };

    initializePaymentStatus();
  }, [user, entryFee, fetchWallet, profile]);

  // Update payment status when wallet or profile changes
  useEffect(() => {
    if (entryFee && entryFee > 0) {
      const credits = profile?.credits || 0;
      const balance = wallet?.balance || 0;
      const willUseCredits = credits >= entryFee;
      const hasAccess = credits >= entryFee || balance >= entryFee;

      setPaymentStatus(prev => ({
        ...prev,
        credits,
        balance,
        hasAccess,
        willUseCredits
      }));
    }
  }, [wallet, profile, entryFee]);

  const verifyPayment = useCallback(async (gameId: string, testMode: boolean = false) => {
    if (!entryFee || entryFee <= 0) {
      setPaymentStatus({
        verified: true,
        credits: profile?.credits || 0,
        balance: wallet?.balance || 0,
        hasAccess: true,
        requiresPayment: false,
        willUseCredits: false
      });
      return true;
    }

    if (!user) {
      setPaymentStatus(prev => ({ ...prev, hasAccess: false }));
      return false;
    }

    setIsVerifying(true);
    try {
      const credits = profile?.credits || 0;
      const balance = wallet?.balance || 0;

      // Check if we can use credits first
      if (credits >= entryFee) {
        // Use credits - call our new credit-based verification
        const result = await verifyGameEntry(gameId, entryFee, testMode, true); // true = use credits
        
        setPaymentStatus({
          verified: result.success,
          credits: result.success ? credits - entryFee : credits,
          balance,
          hasAccess: result.canPlay,
          requiresPayment: true,
          willUseCredits: true,
          transactionId: result.transactionId
        });

        if (result.success) {
          toast({
            title: "Credits Used",
            description: `${entryFee} credits deducted. Remaining: ${credits - entryFee}`,
          });
        }

        return result.success;
      } else {
        // Use wallet balance - existing logic
        const result = await verifyGameEntry(gameId, entryFee, testMode, false); // false = use wallet
        
        setPaymentStatus({
          verified: result.success,
          credits,
          balance: result.balance,
          hasAccess: result.canPlay,
          requiresPayment: true,
          willUseCredits: false,
          transactionId: result.transactionId
        });

        if (!result.success) {
          toast({
            title: "Payment verification failed",
            description: result.error || "Unable to verify payment",
            variant: "destructive"
          });
        }

        return result.success;
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast({
        title: "Payment verification failed",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [entryFee, user, profile, wallet, toast, verifyGameEntry]);

  const processPayment = useCallback(async (gameId: string, testMode: boolean = false) => {
    return await verifyPayment(gameId, testMode);
  }, [verifyPayment]);

  return {
    paymentStatus,
    isVerifying,
    verifyPayment,
    processPayment,
    currentBalance: wallet?.balance || 0,
    currentCredits: profile?.credits || 0
  };
}
