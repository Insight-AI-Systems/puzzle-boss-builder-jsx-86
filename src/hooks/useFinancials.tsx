
import { useState, useRef } from 'react';
import { FinancialsHookReturn } from './finance/types';
import { fetchMonthlyFinancialSummary } from './finance/queries/fetchMonthlyFinancialSummary';
import { fetchSiteIncomes } from './finance/queries/fetchIncomeData';
import { fetchSiteExpenses } from './finance/queries/fetchExpenseData';
import { fetchCategoryManagers } from './finance/queries/fetchManagerData';
import { fetchCommissionPayments } from './finance/queries/fetchCommissionData';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Hook providing access to financial data and operations
 * @returns Object containing financial state and query functions
 */
export function useFinancials(): FinancialsHookReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Cache to prevent duplicate requests
  const cache = useRef<Record<string, any>>({});
  const requestInProgress = useRef<Record<string, boolean>>({});

  /**
   * Wraps API operations with loading state, error handling, and caching
   * @param operation - Async function to execute
   * @param errorMessage - Fallback error message
   * @returns Result of the operation
   */
  const wrapWithLoadingAndError = async <T,>(
    operation: () => Promise<T>,
    operationName: string,
    errorMessage: string,
    cacheKey?: string
  ): Promise<T> => {
    // Check if we have a valid cache entry
    if (cacheKey && cache.current[cacheKey]) {
      debugLog('FINANCE HOOK', `Using cached result for: ${operationName}`, DebugLevel.INFO);
      return cache.current[cacheKey] as T;
    }
    
    // Check if request is already in progress
    if (cacheKey && requestInProgress.current[cacheKey]) {
      debugLog('FINANCE HOOK', `Request already in progress: ${operationName}`, DebugLevel.INFO);
      
      // Wait until the operation completes
      return new Promise((resolve) => {
        const checkCache = () => {
          if (!requestInProgress.current[cacheKey] && cache.current[cacheKey]) {
            resolve(cache.current[cacheKey] as T);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }
    
    debugLog('FINANCE HOOK', `Starting operation: ${operationName}`, DebugLevel.INFO);
    setIsLoading(true);
    setError(null);
    
    // Mark request as in progress
    if (cacheKey) {
      requestInProgress.current[cacheKey] = true;
    }
    
    try {
      // Execute the operation
      debugLog('FINANCE HOOK', `Executing operation function: ${operationName}`, DebugLevel.INFO);
      const result = await operation();
      debugLog('FINANCE HOOK', `Operation successful: ${operationName}`, DebugLevel.INFO, result);
      
      // Cache the result if we have a cache key
      if (cacheKey) {
        cache.current[cacheKey] = result;
      }
      
      return result;
    } catch (err) {
      // Handle error
      debugLog('FINANCE HOOK', `Operation failed: ${operationName}`, DebugLevel.ERROR, err);
      const actualError = err instanceof Error ? err : new Error(errorMessage);
      debugLog('FINANCE HOOK', `Error details: ${actualError.message}`, DebugLevel.ERROR);
      setError(actualError);
      throw actualError;
    } finally {
      // Always reset loading state
      debugLog('FINANCE HOOK', `Finishing operation: ${operationName}, resetting loading state`, DebugLevel.INFO);
      setIsLoading(false);
      
      // Mark request as complete
      if (cacheKey) {
        requestInProgress.current[cacheKey] = false;
      }
    }
  };

  return {
    isLoading,
    error,
    fetchMonthlyFinancialSummary: (period: string) => 
      wrapWithLoadingAndError(
        () => fetchMonthlyFinancialSummary(period),
        `fetchMonthlyFinancialSummary(${period})`, 
        'Failed to fetch monthly financial summary',
        `monthlySummary_${period}`
      ),
    fetchSiteIncomes: (startDate: string, endDate: string) => 
      wrapWithLoadingAndError(
        () => fetchSiteIncomes(startDate, endDate),
        `fetchSiteIncomes(${startDate}, ${endDate})`, 
        'Failed to fetch site incomes',
        `siteIncomes_${startDate}_${endDate}`
      ),
    fetchSiteExpenses: (month: string) => 
      wrapWithLoadingAndError(
        () => fetchSiteExpenses(month),
        `fetchSiteExpenses(${month})`, 
        'Failed to fetch site expenses',
        `siteExpenses_${month}`
      ),
    fetchCategoryManagers: () => 
      wrapWithLoadingAndError(
        () => fetchCategoryManagers(),
        'fetchCategoryManagers()', 
        'Failed to fetch category managers',
        'categoryManagers'
      ),
    fetchCommissionPayments: () => 
      wrapWithLoadingAndError(
        () => fetchCommissionPayments(),
        'fetchCommissionPayments()', 
        'Failed to fetch commission payments',
        'commissionPayments'
      ),
  };
}
