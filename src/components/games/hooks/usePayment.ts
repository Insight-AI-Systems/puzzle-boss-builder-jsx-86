
import { useState, useEffect } from 'react';
import { PaymentService } from '@/business/services/PaymentService';

export interface PaymentStatus {
  hasAccess: boolean;
  isPaid: boolean;
  transactionId?: string;
}

export function usePayment(entryFee: number) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    hasAccess: entryFee === 0, // Free games have immediate access
    isPaid: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentService = new PaymentService();

  const processPayment = async (gameId: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);

      if (entryFee === 0) {
        setPaymentStatus({ hasAccess: true, isPaid: true });
        return true;
      }

      const result = await paymentService.processPayment({
        amount: entryFee,
        currency: 'USD',
        gameId,
        description: `Game entry fee for ${gameId}`
      });

      if (result.success) {
        setPaymentStatus({
          hasAccess: true,
          isPaid: true,
          transactionId: result.transactionId
        });
        return true;
      } else {
        setError(result.error || 'Payment failed');
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment processing failed';
      setError(message);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    paymentStatus,
    isProcessing,
    error,
    processPayment
  };
}
