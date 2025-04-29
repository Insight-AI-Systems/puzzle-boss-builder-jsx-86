
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SiteIncome, SiteExpense } from '@/types/financeTypes';
import { useToast } from '@/hooks/use-toast';

export function useFinancialRecords() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const fetchIncomeRecords = async (startDate: string, endDate: string, sourceType?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching income records from', startDate, 'to', endDate);
      
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

      if (queryError) {
        console.error('Error fetching income records:', queryError);
        throw queryError;
      }
      
      console.log(`Found ${data?.length || 0} income records`);
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch income records';
      console.error(errorMessage, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: "Error loading financial data",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const exportDataToCSV = (data: SiteIncome[] | SiteExpense[], filename: string) => {
    if (!data.length) {
      toast({
        title: "No data to export",
        description: "There are no records available to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clean the data for export - handle objects and nulls properly
      const cleanData = data.map(row => {
        const cleanRow = { ...row };
        Object.keys(cleanRow).forEach(key => {
          const value = cleanRow[key as keyof typeof cleanRow];
          if (value === null) {
            // @ts-ignore - we know this is safe
            cleanRow[key] = '';
          } else if (typeof value === 'object') {
            // @ts-ignore - we know this is safe
            cleanRow[key] = JSON.stringify(value);
          }
        });
        return cleanRow;
      });

      const headers = Object.keys(cleanData[0]).join(',');
      const csvData = cleanData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${csvData}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${data.length} records exported to ${filename}.csv`,
      });
    } catch (err) {
      console.error('Error exporting data:', err);
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "An unknown error occurred during export",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    error,
    fetchIncomeRecords,
    exportDataToCSV
  };
}
