import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  SiteIncome,
  SiteExpense,
  CategoryManager,
  CommissionPayment,
  MonthlyFinancialSummary,
  CategoryRevenue
} from '@/types/financeTypes';

export function useFinancials() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMonthlyFinancialSummary = async (period: string): Promise<MonthlyFinancialSummary | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('monthly_financial_summary')
        .select('*')
        .eq('period', period)
        .single();

      if (error) {
        throw error;
      }

      return data || null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch monthly financial summary'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFinancialTrends = async (limit: number): Promise<MonthlyFinancialSummary[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('monthly_financial_summary')
        .select('*')
        .order('period', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch financial trends'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryRevenue = async (period: string): Promise<CategoryRevenue[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('category_revenue')
        .select('*')
        .eq('period', period);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch category revenue'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSiteIncomes = async (month: string): Promise<SiteIncome[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('site_incomes')
        .select(`
          *,
          categories:category_id (name)
        `)
        .like('date', `${month}%`);

      if (error) {
        throw error;
      }

      return data.map(income => ({
        id: income.id,
        source_type: income.source_type,
        amount: income.amount,
        user_id: income.user_id,
        category_id: income.category_id,
        date: income.date,
        method: income.method,
        notes: income.notes,
        categories: income.categories ? { name: income.categories.name } : undefined
      })) as SiteIncome[];
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
          categories:category_id (name)
        `)
        .like('date', `${month}%`);

      if (error) {
        throw error;
      }

      return data.map(expense => ({
        id: expense.id,
        expense_type: expense.expense_type,
        amount: expense.amount,
        payee: expense.payee,
        category_id: expense.category_id,
        date: expense.date,
        notes: expense.notes,
        categories: expense.categories ? { name: expense.categories.name } : undefined
      })) as SiteExpense[];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch site expenses'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryManagers = async () => {
    const { data, error } = await supabase
      .from('category_managers')
      .select(`
        *,
        categories:category_id (name),
        profiles (username)
      `);

    if (error) throw error;

    return data.map(manager => ({
      id: manager.id,
      user_id: manager.user_id,
      category_id: manager.category_id,
      commission_percent: manager.commission_percent,
      active: manager.active,
      username: manager.profiles?.username || 'Unknown',
      category_name: manager.categories?.name || 'Unknown',
      created_at: manager.created_at,
      updated_at: manager.updated_at,
      profiles: { username: manager.profiles?.username || 'Unknown' },
      categories: { name: manager.categories?.name || 'Unknown' }
    })) as CategoryManager[];
  };

  const fetchCommissionPayments = async () => {
    const { data, error } = await supabase
      .from('commission_payments')
      .select(`
        *,
        categories:category_id (name),
        category_managers (profiles (username))
      `);

    if (error) throw error;

    return data.map(payment => ({
      id: payment.id,
      manager_id: payment.manager_id,
      category_id: payment.category_id,
      period: payment.period,
      gross_income: payment.gross_income,
      net_income: payment.net_income,
      commission_amount: payment.commission_amount,
      payment_status: payment.payment_status,
      payment_date: payment.payment_date,
      manager_name: payment.category_managers?.profiles?.username || 'Unknown',
      category_name: payment.categories?.name || 'Unknown',
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      category_managers: {
        id: payment.category_managers?.id || '',
        user_id: payment.category_managers?.user_id || '',
        profiles: {
          username: payment.category_managers?.profiles?.username || 'Unknown'
        }
      },
      categories: { name: payment.categories?.name || 'Unknown' }
    })) as CommissionPayment[];
  };

  const generateCommissions = async (period: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-commissions', {
        body: { period }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate commissions'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchMonthlyFinancialSummary,
    fetchFinancialTrends,
    fetchCategoryRevenue,
    fetchSiteIncomes,
    fetchSiteExpenses,
    fetchCategoryManagers,
    fetchCommissionPayments,
    generateCommissions
  };
}
