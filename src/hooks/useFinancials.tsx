
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  SiteIncome, 
  SiteExpense, 
  CategoryManager, 
  CommissionPayment, 
  MonthlyFinancialSummary 
} from '@/types/financeTypes';
import { useToast } from '@/hooks/use-toast';

export const useFinancials = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMonthlyFinancialSummary = async (month: string): Promise<MonthlyFinancialSummary | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_monthly_financial_summary', { month_param: month });
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      toast({
        title: 'Error fetching financial summary',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addSiteIncome = async (income: SiteIncome) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('site_income').insert(income).select();
      
      if (error) throw error;
      
      toast({
        title: 'Income Added',
        description: 'New income record created successfully',
      });
      
      return data[0];
    } catch (error) {
      toast({
        title: 'Error adding income',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addSiteExpense = async (expense: SiteExpense) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('site_expenses').insert(expense).select();
      
      if (error) throw error;
      
      toast({
        title: 'Expense Added',
        description: 'New expense record created successfully',
      });
      
      return data[0];
    } catch (error) {
      toast({
        title: 'Error adding expense',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchMonthlyFinancialSummary,
    addSiteIncome,
    addSiteExpense,
    isLoading
  };
};
