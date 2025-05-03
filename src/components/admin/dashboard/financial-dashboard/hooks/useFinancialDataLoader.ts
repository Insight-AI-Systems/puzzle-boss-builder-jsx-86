
import { useState, useEffect, useCallback, useRef } from 'react';
import { MonthlyFinancialSummary } from '@/types/financeTypes';
import { useFinancials } from '@/hooks/useFinancials';
import { useToast } from '@/hooks/use-toast';

export const useFinancialDataLoader = (selectedMonth: string) => {
  const isInitialRender = useRef(true);
  const [financialData, setFinancialData] = useState<MonthlyFinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  const { 
    fetchMonthlyFinancialSummary, 
    fetchSiteIncomes, 
    fetchSiteExpenses, 
    fetchCommissionPayments 
  } = useFinancials();
  
  const { toast } = useToast();

  // Create default summary object to prevent null values
  const createDefaultSummary = useCallback((period: string): MonthlyFinancialSummary => {
    return {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
  }, []);

  const loadFinancialData = useCallback(async () => {
    // Skip if we've already loaded data
    if (financialData?.period === selectedMonth && !isInitialRender.current) {
      return;
    }
    
    setIsLoading(true);
    setLoadError(null);
    
    try {
      let summary: MonthlyFinancialSummary | null = null;
      
      try {
        summary = await fetchMonthlyFinancialSummary(selectedMonth);
      } catch (fetchError) {
        console.error('Error in fetchMonthlyFinancialSummary:', fetchError);
      }
      
      // Always set valid data to prevent rendering issues
      const finalData = summary || createDefaultSummary(selectedMonth);
      setFinancialData(finalData);
      
    } catch (err) {
      console.error('Error loading financial data:', err);
      setLoadError(err instanceof Error ? err : new Error('Unknown error occurred'));
      // Set fallback data even on error
      setFinancialData(createDefaultSummary(selectedMonth));
      
      toast({
        title: "Error loading financial data",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      isInitialRender.current = false;
    }
  }, [selectedMonth, fetchMonthlyFinancialSummary, createDefaultSummary, toast, financialData]);
  
  // Use a more controlled approach for loading data
  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData, selectedMonth]);

  const handleRetry = () => {
    loadFinancialData();
  };

  return {
    financialData,
    isLoading,
    loadError,
    handleRetry,
    fetchMonthlyFinancialSummary,
    fetchSiteIncomes,
    fetchSiteExpenses,
    fetchCommissionPayments
  };
};
