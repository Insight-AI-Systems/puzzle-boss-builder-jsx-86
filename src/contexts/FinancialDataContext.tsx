
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MonthlyFinancialSummary } from '@/types/financeTypes';
import { useFinancials } from '@/hooks/useFinancials';
import { format } from 'date-fns';

interface FinancialDataContextType {
  financialSummary: MonthlyFinancialSummary | null;
  selectedMonth: string;
  isLoading: boolean;
  error: Error | null;
  setSelectedMonth: (month: string) => void;
  refreshData: () => Promise<void>;
  isCached: (month: string) => boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [financialSummary, setFinancialSummary] = useState<MonthlyFinancialSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cache, setCache] = useState<Record<string, MonthlyFinancialSummary>>({});
  const [loadingMonth, setLoadingMonth] = useState<string | null>(null);
  
  const { fetchMonthlyFinancialSummary } = useFinancials();

  // Create default summary object
  const createDefaultSummary = useCallback((period: string): MonthlyFinancialSummary => {
    console.log('[FINANCIAL CONTEXT] Creating default summary for period:', period);
    return {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
  }, []);

  // Check if data is already cached
  const isCached = useCallback((month: string) => {
    return !!cache[month];
  }, [cache]);

  // Load financial data with caching
  const loadFinancialData = useCallback(async (month: string) => {
    // Don't reload if we're already loading this month
    if (loadingMonth === month) {
      console.log(`[FINANCIAL CONTEXT] Already loading data for ${month}, skipping duplicate request`);
      return;
    }

    // Check if we have cached data
    if (cache[month]) {
      console.log(`[FINANCIAL CONTEXT] Using cached data for ${month}`);
      setFinancialSummary(cache[month]);
      return;
    }
    
    console.log(`[FINANCIAL CONTEXT] Loading data for ${month}`);
    setLoadingMonth(month);
    setLoading(true);
    setError(null);
    
    try {
      console.log('[FINANCIAL CONTEXT] Fetching financial summary');
      let summary: MonthlyFinancialSummary | null = null;
      
      try {
        console.log('[FINANCIAL CONTEXT] Calling fetchMonthlyFinancialSummary');
        summary = await fetchMonthlyFinancialSummary(month);
        console.log('[FINANCIAL CONTEXT] Fetch result:', summary);
      } catch (fetchError) {
        console.error('[FINANCIAL CONTEXT] Error in fetchMonthlyFinancialSummary:', fetchError);
        throw fetchError;
      }
      
      // Always set valid data to prevent rendering issues
      const finalData = summary || createDefaultSummary(month);
      console.log('[FINANCIAL CONTEXT] Setting data:', finalData);
      
      setFinancialSummary(finalData);
      
      // Update cache
      setCache(prevCache => ({
        ...prevCache,
        [month]: finalData
      }));
      
    } catch (err) {
      console.error('[FINANCIAL CONTEXT] Error loading financial data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      // Set fallback data even on error
      const fallbackData = createDefaultSummary(month);
      setFinancialSummary(fallbackData);
    } finally {
      console.log('[FINANCIAL CONTEXT] Data loading complete');
      setLoading(false);
      setLoadingMonth(null);
    }
  }, [fetchMonthlyFinancialSummary, createDefaultSummary, cache, loadingMonth]);

  // Update data when month changes
  React.useEffect(() => {
    loadFinancialData(selectedMonth);
  }, [selectedMonth, loadFinancialData]);

  // Function to force refresh data
  const refreshData = useCallback(async () => {
    console.log('[FINANCIAL CONTEXT] Force refreshing data');
    // Remove from cache to force reload
    setCache(prevCache => {
      const newCache = {...prevCache};
      delete newCache[selectedMonth];
      return newCache;
    });
    
    await loadFinancialData(selectedMonth);
  }, [selectedMonth, loadFinancialData]);

  const value = {
    financialSummary,
    selectedMonth,
    isLoading: loading,
    error,
    setSelectedMonth,
    refreshData,
    isCached
  };

  return (
    <FinancialDataContext.Provider value={value}>
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
