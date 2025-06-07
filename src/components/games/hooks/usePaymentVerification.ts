
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PaymentStatus {
  verified: boolean;
  credits: number;
  hasAccess: boolean;
  requiresPayment: boolean;
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

  const verifyPayment = useCallback(async () => {
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
      // Mock verification - replace with actual payment verification
      const mockCredits = 50; // Mock user credits
      const hasEnoughCredits = mockCredits >= entryFee;
      
      setPaymentStatus({
        verified: hasEnoughCredits,
        credits: mockCredits,
        hasAccess: hasEnoughCredits,
        requiresPayment: true
      });

      if (!hasEnoughCredits) {
        toast({
          title: "Insufficient credits",
          description: `You need ${entryFee} credits to play this game`,
          variant: "destructive"
        });
      }

      return hasEnoughCredits;
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
  }, [entryFee, user, toast]);

  const processPayment = useCallback(async () => {
    if (!entryFee || !user) return false;

    try {
      // Mock payment processing - replace with actual payment processing
      console.log(`Processing payment of ${entryFee} credits`);
      
      toast({
        title: "Payment processed",
        description: "You can now start the game",
      });

      setPaymentStatus(prev => ({ 
        ...prev, 
        verified: true, 
        hasAccess: true,
        credits: prev.credits - entryFee
      }));

      return true;
    } catch (error) {
      console.error('Payment processing failed:', error);
      toast({
        title: "Payment failed",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    }
  }, [entryFee, user, toast]);

  return {
    paymentStatus,
    isVerifying,
    verifyPayment,
    processPayment
  };
}
