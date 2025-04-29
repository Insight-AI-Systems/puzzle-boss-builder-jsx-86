
import { useState } from 'react';
import { FinancialsHookReturn } from './finance/types';
import { fetchMonthlyFinancialSummary } from './finance/queries/fetchMonthlyFinancialSummary';
import { fetchSiteIncomes } from './finance/queries/fetchIncomeData';
import { fetchSiteExpenses } from './finance/queries/fetchExpenseData';
import { fetchCategoryManagers } from './finance/queries/fetchManagerData';
import { fetchCommissionPayments } from './finance/queries/fetchCommissionData';

/**
 * Hook providing access to financial data and operations
 * @returns Object containing financial state and query functions
 */
export function useFinancials(): FinancialsHookReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Wraps API operations with loading state and error handling
   * @param operation - Async function to execute
   * @param errorMessage - Fallback error message
   * @returns Result of the operation
   */
  const wrapWithLoadingAndError = async <T,>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    // Don't set loading state if already loading to prevent UI flickering
    if (!isLoading) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const actualError = err instanceof Error ? err : new Error(errorMessage);
      console.error(`Financial operation failed: ${errorMessage}`, err);
      setError(actualError);
      throw actualError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchMonthlyFinancialSummary: (period: string) => 
      wrapWithLoadingAndError(
        () => fetchMonthlyFinancialSummary(period), 
        'Failed to fetch monthly financial summary'
      ),
    fetchSiteIncomes: (startDate: string, endDate: string) => 
      wrapWithLoadingAndError(
        () => fetchSiteIncomes(startDate, endDate), 
        'Failed to fetch site incomes'
      ),
    fetchSiteExpenses: (month: string) => 
      wrapWithLoadingAndError(
        () => fetchSiteExpenses(month), 
        'Failed to fetch site expenses'
      ),
    fetchCategoryManagers: () => 
      wrapWithLoadingAndError(
        () => fetchCategoryManagers(), 
        'Failed to fetch category managers'
      ),
    fetchCommissionPayments: () => 
      wrapWithLoadingAndError(
        () => fetchCommissionPayments(), 
        'Failed to fetch commission payments'
      ),
  };
}
