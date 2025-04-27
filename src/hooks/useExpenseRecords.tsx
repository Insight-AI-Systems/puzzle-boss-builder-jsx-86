
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SiteExpense, ExpenseType } from '@/types/financeTypes';

export function useExpenseRecords() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExpenseRecords = async (startDate: string, endDate: string, expenseType?: ExpenseType) => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('site_expenses')
        .select(`
          *,
          categories:category_id (name)
        `)
        .gte('date', startDate)
        .lte('date', endDate);

      if (expenseType) {
        query = query.eq('expense_type', expenseType);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      return (data as SiteExpense[]) || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch expense records'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = (data: SiteExpense[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(',');
    const csvData = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${csvData}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    isLoading,
    error,
    fetchExpenseRecords,
    exportToCSV
  };
}
