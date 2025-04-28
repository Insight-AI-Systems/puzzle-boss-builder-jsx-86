
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import {
  SiteIncome,
  SiteExpense,
  CategoryManager,
  CommissionPayment,
  MonthlyFinancialSummary,
  PaymentStatus,
  ExpenseType,
  SourceType
} from '@/types/financeTypes';

export function useFinancials() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMonthlyFinancialSummary = async (period: string): Promise<MonthlyFinancialSummary | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Fix the ambiguous column reference by using aliases in the query
      const { data, error } = await supabase
        .rpc('get_monthly_financial_summary', { month_param: period });

      if (error) {
        console.error('Error fetching monthly summary:', error);
        throw error;
      }
      
      console.log('Monthly summary data:', data);
      return data?.[0] || {
        period,
        total_income: 0,
        total_expenses: 0,
        net_profit: 0,
        commissions_paid: 0,
        prize_expenses: 0
      };
    } catch (err) {
      console.error('Exception in fetchMonthlyFinancialSummary:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch monthly financial summary'));
      return {
        period,
        total_income: 0,
        total_expenses: 0,
        net_profit: 0,
        commissions_paid: 0,
        prize_expenses: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSiteIncomes = async (startDate: string, endDate: string): Promise<SiteIncome[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('site_income')
        .select(`
          *,
          categories:category_id(name),
          profiles:user_id(username)
        `)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      
      return (data || []).map(item => {
        const username = item.profiles && typeof item.profiles === 'object' ? 
                        ((item.profiles as any).username as string || 'Anonymous') : 'Anonymous';

        return {
          ...item,
          source_type: item.source_type as SourceType,
          profiles: { username }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch site incomes'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSiteExpenses = async (month: string): Promise<SiteExpense[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('site_expenses')
        .select(`
          *,
          categories:category_id(name)
        `)
        .like('date', `${month}%`);

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        expense_type: item.expense_type as ExpenseType,
        categories: { name: item.categories?.name || 'Unknown' }
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch site expenses'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryManagers = async (): Promise<CategoryManager[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('category_managers')
        .select(`
          *,
          categories(name),
          profiles:user_id(username, email)
        `);

      if (error) throw error;

      return (data || []).map(manager => {
        let username = 'Unknown';
        let email: string | undefined = undefined;
        
        if (manager.profiles && typeof manager.profiles === 'object') {
          const profiles = manager.profiles as any;
          username = profiles && 'username' in profiles ? 
                    (profiles.username as string || 'Unknown') : 'Unknown';
          email = profiles && 'email' in profiles ? 
                 (profiles.email as string) : undefined;
        }

        return {
          ...manager,
          username: username,
          category_name: manager.categories?.name || 'Unknown',
          profiles: {
            username: username,
            email: email
          }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch category managers'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommissionPayments = async (): Promise<CommissionPayment[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('commission_payments')
        .select(`
          *,
          categories:category_id(name),
          manager:manager_id(username, email)
        `);

      if (error) throw error;

      return (data || []).map(payment => {
        let managerName = 'Unknown';
        let managerEmail: string | undefined = undefined;
        
        if (payment.manager && typeof payment.manager === 'object') {
          const manager = payment.manager as any;
          managerName = manager && 'username' in manager ? 
                       (manager.username as string || 'Unknown') : 'Unknown';
          managerEmail = manager && 'email' in manager ? 
                        (manager.email as string) : undefined;
        }

        return {
          ...payment,
          manager_name: managerName,
          manager_email: managerEmail,
          category_name: payment.categories?.name || 'Unknown',
          payment_status: payment.payment_status as PaymentStatus
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch commission payments'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchMonthlyFinancialSummary,
    fetchSiteIncomes,
    fetchSiteExpenses,
    fetchCategoryManagers,
    fetchCommissionPayments
  };
}
