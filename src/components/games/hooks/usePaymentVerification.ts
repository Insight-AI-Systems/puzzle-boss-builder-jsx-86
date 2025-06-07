
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';

export interface PaymentStatus {
  verified: boolean;
  credits: number;
  hasAccess: boolean;
  requiresPayment: boolean;
  transactionId?: string;
}

export function usePaymentVerification(entryFee?: number) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    verified: false,
    credits: 0,
    hasAccess: false,
    requiresPayment: Boolean(entryFee && entryFee > 0)
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { verifyGameEntry, wallet } = usePaymentSystem();

  const verifyPayment = useCallback(async (gameId: string, testMode: boolean = false) => {
    if (!entryFee || entryFee <= 0) {
      setPaymentStatus({
        verified: true,
        credits: 0,
        hasAccess: true,
        requiresPayment: false
      });
      return true;
    }

    if (!user) {
      setPaymentStatus(prev => ({ ...prev, hasAccess: false }));
      return false;
    }

    setIsVerifying(true);
    try {
      const result = await verifyGameEntry(gameId, entryFee, testMode);
      
      setPaymentStatus({
        verified: result.success,
        credits: result.balance,
        hasAccess: result.canPlay,
        requiresPayment: true,
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
  }, [entryFee, user, toast, verifyGameEntry]);

  const processPayment = useCallback(async (gameId: string, testMode: boolean = false) => {
    return await verifyPayment(gameId, testMode);
  }, [verifyPayment]);

  return {
    paymentStatus,
    isVerifying,
    verifyPayment,
    processPayment,
    currentBalance: wallet?.balance || 0
  };
}
