
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

  console.log('[FINANCE HOOK] useFinancials hook initialized');

  /**
   * Wraps API operations with loading state and error handling
   * @param operation - Async function to execute
   * @param errorMessage - Fallback error message
   * @returns Result of the operation
   */
  const wrapWithLoadingAndError = async <T,>(
    operation: () => Promise<T>,
    operationName: string,
    errorMessage: string
  ): Promise<T> => {
    console.log(`[FINANCE HOOK] Starting operation: ${operationName}`);
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the operation
      console.log(`[FINANCE HOOK] Executing operation function: ${operationName}`);
      const result = await operation();
      console.log(`[FINANCE HOOK] Operation successful: ${operationName}`, result);
      return result;
    } catch (err) {
      // Handle error
      console.error(`[FINANCE HOOK] Operation failed: ${operationName}`, err);
      const actualError = err instanceof Error ? err : new Error(errorMessage);
      console.error(`[FINANCE HOOK] Error details: ${actualError.message}`);
      setError(actualError);
      throw actualError;
    } finally {
      // Always reset loading state
      console.log(`[FINANCE HOOK] Finishing operation: ${operationName}, resetting loading state`);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchMonthlyFinancialSummary: (period: string) => 
      wrapWithLoadingAndError(
        () => fetchMonthlyFinancialSummary(period),
        `fetchMonthlyFinancialSummary(${period})`, 
        'Failed to fetch monthly financial summary'
      ),
    fetchSiteIncomes: (startDate: string, endDate: string) => 
      wrapWithLoadingAndError(
        () => fetchSiteIncomes(startDate, endDate),
        `fetchSiteIncomes(${startDate}, ${endDate})`, 
        'Failed to fetch site incomes'
      ),
    fetchSiteExpenses: (month: string) => 
      wrapWithLoadingAndError(
        () => fetchSiteExpenses(month),
        `fetchSiteExpenses(${month})`, 
        'Failed to fetch site expenses'
      ),
    fetchCategoryManagers: () => 
      wrapWithLoadingAndError(
        () => fetchCategoryManagers(),
        'fetchCategoryManagers()', 
        'Failed to fetch category managers'
      ),
    fetchCommissionPayments: () => 
      wrapWithLoadingAndError(
        () => fetchCommissionPayments(),
        'fetchCommissionPayments()', 
        'Failed to fetch commission payments'
      ),
  };
}
