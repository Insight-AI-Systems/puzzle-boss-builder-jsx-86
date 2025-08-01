
import { useState, useEffect } from 'react';
import { PaymentService } from '@/business/services/PaymentService';
import { PaymentError } from '@/infrastructure/errors';

export interface PaymentStatus {
  hasAccess: boolean;
  isPaid: boolean;
  transactionId?: string;
}

export interface PuzzlePaymentStatus {
  hasAccess: boolean;
  isPaid: boolean;
  sessionId?: string;
  puzzleImageId?: string;
}

export function usePayment(entryFee: number) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    hasAccess: entryFee === 0, // Free games have immediate access
    isPaid: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock payment service for now - this would be properly injected in a real implementation
  const mockPaymentService = {
    verifyPayment: async (request: any) => {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        transactionId: `mock_${Date.now()}`,
        balance: 100,
        credits: 50,
        error: null,
        requiresPayment: entryFee > 0,
        willUseCredits: false
      };
    }
  };

  const processPayment = async (gameId: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);

      if (entryFee === 0) {
        setPaymentStatus({ hasAccess: true, isPaid: true });
        return true;
      }

      const result = await mockPaymentService.verifyPayment({
        gameId,
        entryFee,
        userId: 'mock-user',
        testMode: true
      });

      if (result.success) {
        setPaymentStatus({
          hasAccess: true,
          isPaid: true,
          transactionId: result.transactionId
        });
        return true;
      } else {
        throw new PaymentError(
          result.error || 'Payment failed',
          'PAYMENT_FAILED',
          'medium',
          true
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment processing failed';
      setError(message);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPuzzlePayment = async (
    puzzleImageId: string,
    difficulty: string,
    pieceCount: number
  ): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);

      const result = await mockPaymentService.verifyPayment({
        gameId: `puzzle_${puzzleImageId}`,
        entryFee: getBasePriceForDifficulty(difficulty, pieceCount),
        userId: 'mock-user',
        testMode: true
      });

      if (result.success) {
        return true;
      } else {
        throw new PaymentError(
          result.error || 'Puzzle payment failed',
          'PAYMENT_FAILED',
          'medium',
          true
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Puzzle payment processing failed';
      setError(message);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const getBasePriceForDifficulty = (difficulty: string, pieceCount: number): number => {
    // Mock pricing logic - in real implementation, this would come from the database
    switch (difficulty.toLowerCase()) {
      case 'easy': return 2.00;
      case 'medium': return 3.50;
      case 'hard': return 5.00;
      default: return 2.00;
    }
  };

  return {
    paymentStatus,
    isProcessing,
    error,
    processPayment,
    processPuzzlePayment
  };
}
