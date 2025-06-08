
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';
import { useMemberProfile } from '@/hooks/useMemberProfile';
import { PaymentService, PaymentStatus, PaymentRequest, PaymentResult } from '@/business/services/PaymentService';

export function usePayment(entryFee?: number) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    verified: false,
    credits: 0,
    balance: 0,
    hasAccess: false,
    requiresPayment: Boolean(entryFee && entryFee > 0),
    willUseCredits: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { verifyGameEntry, wallet, fetchWallet } = usePaymentSystem();
  const { profile, refetch: refetchProfile } = useMemberProfile();

  // Initialize payment service
  const paymentService = new PaymentService({
    paymentSystem: { verifyGameEntry },
    profile,
    wallet
  });

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

      await fetchWallet();
    };

    initializePaymentStatus();
  }, [user, entryFee, fetchWallet, profile]);

  // Update payment status when wallet or profile changes
  useEffect(() => {
    if (entryFee && entryFee > 0) {
      const status = paymentService.validateBalance(entryFee);
      setPaymentStatus(status);
    }
  }, [wallet, profile, entryFee]);

  const processPayment = useCallback(async (gameId: string, testMode: boolean = false): Promise<boolean> => {
    if (!entryFee || entryFee <= 0) {
      return true;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to play games",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const request: PaymentRequest = {
        gameId,
        entryFee,
        userId: user.id,
        testMode
      };

      const result: PaymentResult = await paymentService.processEntry(request);
      
      if (result.success) {
        // Refresh profile to get updated credits/balance
        await refetchProfile();
        
        setPaymentStatus({
          verified: true,
          credits: result.credits,
          balance: result.balance,
          hasAccess: true,
          requiresPayment: true,
          willUseCredits: result.willUseCredits,
          transactionId: result.transactionId
        });

        const paymentMethod = result.willUseCredits ? 'credits' : 'wallet';
        const message = result.willUseCredits 
          ? `${entryFee} credits deducted. Remaining: ${result.credits}`
          : `$${entryFee.toFixed(2)} charged from wallet`;

        toast({
          title: `Payment Successful (${paymentMethod})`,
          description: message,
        });

        return true;
      } else {
        setPaymentStatus(prev => ({ ...prev, verified: false, hasAccess: false }));
        
        let title = "Payment Failed";
        let description = result.error || "Unable to process payment";
        
        if (result.error?.includes('Insufficient')) {
          title = "Insufficient Funds";
          description = `You need $${entryFee.toFixed(2)} to play this game. Add funds to your wallet or earn more credits.`;
        }

        toast({
          title,
          description,
          variant: "destructive"
        });

        return false;
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      setPaymentStatus(prev => ({ ...prev, verified: false, hasAccess: false }));
      
      toast({
        title: "System Error",
        description: "A system error occurred. Please try again or contact support.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [entryFee, user, profile, wallet, toast, refetchProfile]);

  return {
    paymentStatus,
    isProcessing,
    processPayment,
    currentBalance: paymentService.getCurrentBalance(),
    currentCredits: paymentService.getCurrentCredits(),
    paymentService
  };
}
