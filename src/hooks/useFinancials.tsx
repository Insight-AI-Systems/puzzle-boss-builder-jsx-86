
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
      const { data, error } = await supabase
        .rpc('get_monthly_financial_summary', { month_param: period });

      if (error) throw error;
      return data?.[0] || null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch monthly financial summary'));
      return null;
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
      
      return data?.map(item => {
        // If profiles is an object with error, provide default username
        const username = typeof item.profiles === 'object' && 
                        item.profiles !== null && 
                        !('username' in item.profiles) 
                        ? 'Anonymous' 
                        : item.profiles?.username || 'Anonymous';

        return {
          ...item,
          source_type: item.source_type as SourceType,
          profiles: { username }
        };
      }) || [];
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
      return data?.map(item => ({
        ...item,
        expense_type: item.expense_type as ExpenseType,
        categories: { name: item.categories?.name || 'Unknown' }
      })) || [];
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

      return data.map(manager => {
        // Handle potential error in profiles relation
        let username = 'Unknown';
        let email = undefined;
        
        if (typeof manager.profiles === 'object' && manager.profiles !== null) {
          if ('username' in manager.profiles) {
            username = manager.profiles.username || 'Unknown';
          }
          if ('email' in manager.profiles) {
            email = manager.profiles.email;
          }
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
      }) || [];
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

      return data.map(payment => {
        // Handle potential error in manager relation
        let managerName = 'Unknown';
        let managerEmail = undefined;
        
        if (typeof payment.manager === 'object' && payment.manager !== null) {
          if ('username' in payment.manager) {
            managerName = payment.manager.username || 'Unknown';
          }
          if ('email' in payment.manager) {
            managerEmail = payment.manager.email;
          }
        }

        return {
          ...payment,
          manager_name: managerName,
          manager_email: managerEmail,
          category_name: payment.categories?.name || 'Unknown',
          payment_status: payment.payment_status as PaymentStatus
        };
      }) || [];
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
