
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  SiteIncome, 
  SiteExpense, 
  CategoryManager, 
  CommissionPayment, 
  MonthlyFinancialSummary,
  MembershipSummary,
  CategoryRevenue,
  TimeFrame
} from '@/types/financeTypes';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths, parseISO } from 'date-fns';

export const useFinancials = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get financial summary for a specific month
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

  // Get financial summaries for multiple months
  const fetchFinancialTrends = async (months: number = 6): Promise<MonthlyFinancialSummary[]> => {
    setIsLoading(true);
    try {
      const currentDate = new Date();
      const summaries: MonthlyFinancialSummary[] = [];
      
      for (let i = 0; i < months; i++) {
        const date = subMonths(currentDate, i);
        const month = format(date, 'yyyy-MM');
        const summary = await fetchMonthlyFinancialSummary(month);
        if (summary) summaries.push(summary);
      }
      
      return summaries.reverse();
    } catch (error) {
      toast({
        title: 'Error fetching financial trends',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get all income records with optional filters
  const fetchIncomeRecords = async (
    startDate?: string,
    endDate?: string,
    sourceType?: string
  ): Promise<SiteIncome[]> => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('site_income')
        .select(`
          *,
          categories:category_id (name)
        `)
        .order('date', { ascending: false });

      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
      if (sourceType) query = query.eq('source_type', sourceType);

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      toast({
        title: 'Error fetching income records',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get all expense records with optional filters
  const fetchExpenseRecords = async (
    startDate?: string,
    endDate?: string,
    expenseType?: string
  ): Promise<SiteExpense[]> => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('site_expenses')
        .select(`
          *,
          categories:category_id (name)
        `)
        .order('date', { ascending: false });

      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
      if (expenseType) query = query.eq('expense_type', expenseType);

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      toast({
        title: 'Error fetching expense records',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get category managers with category details
  const fetchCategoryManagers = async (): Promise<CategoryManager[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('category_managers')
        .select(`
          *,
          profiles:user_id (username),
          categories:category_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include username and category_name
      return data.map(manager => ({
        ...manager,
        username: manager.profiles?.username,
        category_name: manager.categories?.name
      }));
    } catch (error) {
      toast({
        title: 'Error fetching category managers',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get commission payments with manager and category details
  const fetchCommissionPayments = async (period?: string): Promise<CommissionPayment[]> => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('commission_payments')
        .select(`
          *,
          category_managers:manager_id (
            id,
            user_id,
            profiles:user_id (username)
          ),
          categories:category_id (name)
        `)
        .order('created_at', { ascending: false });

      if (period) query = query.eq('period', period);

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to include manager_name and category_name
      return data.map(payment => ({
        ...payment,
        manager_name: payment.category_managers?.profiles?.username,
        category_name: payment.categories?.name
      }));
    } catch (error) {
      toast({
        title: 'Error fetching commission payments',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate category revenue and commissions
  const calculateCategoryRevenue = async (period: string): Promise<CategoryRevenue[]> => {
    setIsLoading(true);
    try {
      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError) throw categoriesError;
      
      const results: CategoryRevenue[] = [];
      
      // For each category, calculate revenue and costs
      for (const category of categories) {
        // Get income for category
        const { data: incomeData, error: incomeError } = await supabase
          .from('site_income')
          .select('amount')
          .eq('category_id', category.id)
          .like('date', `${period}-%`);
        
        if (incomeError) throw incomeError;
        
        // Get expenses for category
        const { data: expenseData, error: expenseError } = await supabase
          .from('site_expenses')
          .select('amount')
          .eq('category_id', category.id)
          .like('date', `${period}-%`);
        
        if (expenseError) throw expenseError;
        
        // Get category manager and commission rate
        const { data: managerData, error: managerError } = await supabase
          .from('category_managers')
          .select('commission_percent')
          .eq('category_id', category.id)
          .eq('active', true)
          .limit(1);
        
        if (managerError) throw managerError;
        
        const totalRevenue = incomeData.reduce((sum, record) => sum + record.amount, 0);
        const totalCosts = expenseData.reduce((sum, record) => sum + record.amount, 0);
        const netRevenue = totalRevenue - totalCosts;
        const commissionRate = managerData[0]?.commission_percent || 0;
        const commissionAmount = (netRevenue * commissionRate) / 100;
        
        results.push({
          category_id: category.id,
          category_name: category.name,
          total_revenue: totalRevenue,
          total_costs: totalCosts,
          net_revenue: netRevenue,
          commission_rate: commissionRate,
          commission_amount: commissionAmount
        });
      }
      
      return results;
    } catch (error) {
      toast({
        title: 'Error calculating category revenue',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Create new income record
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

  // Create new expense record
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

  // Create new commission payment
  const addCommissionPayment = async (payment: CommissionPayment) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('commission_payments').insert(payment).select();
      
      if (error) throw error;
      
      toast({
        title: 'Commission Payment Added',
        description: 'New commission payment created successfully',
      });
      
      return data[0];
    } catch (error) {
      toast({
        title: 'Error adding commission payment',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update commission payment status
  const updateCommissionPaymentStatus = async (id: string, status: PaymentStatus, paymentDate?: string) => {
    setIsLoading(true);
    try {
      const updateData: { payment_status: PaymentStatus; payment_date?: string } = { 
        payment_status: status 
      };
      
      if (status === 'paid' && !paymentDate) {
        updateData.payment_date = new Date().toISOString();
      } else if (paymentDate) {
        updateData.payment_date = paymentDate;
      }
      
      const { data, error } = await supabase
        .from('commission_payments')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Payment Status Updated',
        description: `Payment status changed to ${status}`,
      });
      
      return data[0];
    } catch (error) {
      toast({
        title: 'Error updating payment status',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Export data as CSV
  const exportDataToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Quote values with commas and escape quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        const escaped = stringValue.replace(/"/g, '""');
        return stringValue.includes(',') ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(','));
    }
    
    // Create and download CSV
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    fetchMonthlyFinancialSummary,
    fetchFinancialTrends,
    fetchIncomeRecords,
    fetchExpenseRecords,
    fetchCategoryManagers,
    fetchCommissionPayments,
    calculateCategoryRevenue,
    addSiteIncome,
    addSiteExpense,
    addCommissionPayment,
    updateCommissionPaymentStatus,
    exportDataToCSV,
    isLoading
  };
};
