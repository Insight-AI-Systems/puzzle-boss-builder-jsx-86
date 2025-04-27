
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';
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
      const { data: managers } = await supabase
        .from('category_managers')
        .select('*')
        .eq('active', true);

      if (!managers) return;

      for (const manager of managers) {
        // Calculate gross income for the category in this period
        const { data: incomeData } = await supabase
          .from('site_income')
          .select('amount')
          .eq('category_id', manager.category_id)
          .like('date', `${period}%`);

        const grossIncome = incomeData?.reduce((sum, record) => sum + record.amount, 0) || 0;
        const commissionAmount = (grossIncome * manager.commission_percent) / 100;

        // Create or update commission payment record
        const { error } = await supabase
          .from('commission_payments')
          .upsert({
            manager_id: manager.user_id,
            category_id: manager.category_id,
            period,
            gross_income: grossIncome,
            net_income: grossIncome - commissionAmount,
            commission_amount: commissionAmount,
            payment_status: PaymentStatus.PENDING
          });

        if (error) throw error;
      }

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
