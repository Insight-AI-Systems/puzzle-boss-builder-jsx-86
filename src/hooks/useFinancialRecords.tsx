
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SiteIncome, SiteExpense } from '@/types/financeTypes';

export function useFinancialRecords() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIncomeRecords = async (startDate: string, endDate: string, sourceType?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('site_income')
        .select(`
          *,
          categories:category_id (name),
          profiles:user_id (username)
        `)
        .gte('date', startDate)
        .lte('date', endDate);

      if (sourceType) {
        query = query.eq('source_type', sourceType);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch income records'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const exportDataToCSV = (data: SiteIncome[] | SiteExpense[], filename: string) => {
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
    fetchIncomeRecords,
    exportDataToCSV
  };
}
