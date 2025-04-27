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

  const fetchSiteIncomes = async (month: string): Promise<SiteIncome[]> => {
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
        .like('date', `${month}%`);

      if (error) throw error;
      
      return data?.map(item => ({
        ...item,
        source_type: item.source_type as SourceType,
        profiles: { username: item.profiles?.username || 'Anonymous' },
        categories: { name: item.categories?.name || 'Unknown' }
      })) || [];
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

      return data.map(manager => ({
        ...manager,
        username: manager.profiles?.username || 'Unknown',
        category_name: manager.categories?.name || 'Unknown',
        profiles: {
          username: manager.profiles?.username || 'Unknown',
          email: manager.profiles?.email
        }
      })) || [];
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

      return data.map(payment => ({
        ...payment,
        manager_name: payment.manager?.username || 'Unknown',
        manager_email: payment.manager?.email,
        category_name: payment.categories?.name || 'Unknown',
        payment_status: payment.payment_status as PaymentStatus
      })) || [];
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
