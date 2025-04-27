
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentStatus } from '@/types/financeTypes';
import { useToast } from '@/hooks/use-toast';

export function useCommissionManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const updatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('commission_payments')
        .update({ 
          payment_status: status,
          payment_date: status === PaymentStatus.PAID ? new Date().toISOString() : null
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Payment status has been updated to ${status}`,
      });

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update payment status'));
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCommissions = async (period: string) => {
    setIsLoading(true);
    try {
      // Call the database function directly
      const { error } = await supabase.rpc('calculate_monthly_commissions', { month_param: period });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Commission calculations have been generated",
      });

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate commissions'));
      toast({
        title: "Error",
        description: "Failed to generate commissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updatePaymentStatus,
    generateCommissions
  };
}
