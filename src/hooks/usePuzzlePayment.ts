import { useState } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PuzzlePaymentRequest } from '@/business/services/PaymentService';

interface PuzzlePaymentResult {
  success: boolean;
  sessionUrl?: string;
  error?: string;
}

export function usePuzzlePayment() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const startPuzzlePayment = async (
    puzzleImageId: string,
    difficulty: string,
    pieceCount: number
  ): Promise<PuzzlePaymentResult> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase puzzle games.",
        variant: "destructive",
      });
      return { success: false, error: "User not authenticated" };
    }

    setIsProcessing(true);
    try {
      console.log('Starting puzzle payment for:', { puzzleImageId, difficulty, pieceCount });
      
      const { data, error } = await supabase.functions.invoke('create-puzzle-payment', {
        body: {
          puzzleImageId,
          difficulty,
          pieceCount
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Payment session created",
          description: "Redirecting to payment page...",
        });

        return {
          success: true,
          sessionUrl: data.url
        };
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Puzzle payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  const getPuzzlePricing = async () => {
    try {
      const { data, error } = await supabase
        .from('puzzle_game_pricing')
        .select('*')
        .eq('is_active', true)
        .order('piece_count', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching puzzle pricing:', error);
      toast({
        title: "Error",
        description: "Failed to load puzzle pricing",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    startPuzzlePayment,
    getPuzzlePricing,
    isProcessing
  };
}