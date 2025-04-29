
import {
  SiteIncome,
  SiteExpense,
  CategoryManager,
  CommissionPayment,
  MonthlyFinancialSummary,
  PaymentStatus,
  ExpenseType,
  SourceType
} from '@/types/financeTypes';

export interface FinancialsState {
  isLoading: boolean;
  error: Error | null;
}

export interface FinancialsFunctions {
  fetchMonthlyFinancialSummary: (period: string) => Promise<MonthlyFinancialSummary | null>;
  fetchSiteIncomes: (startDate: string, endDate: string) => Promise<SiteIncome[]>;
  fetchSiteExpenses: (month: string) => Promise<SiteExpense[]>;
  fetchCategoryManagers: () => Promise<CategoryManager[]>;
  fetchCommissionPayments: () => Promise<CommissionPayment[]>;
}

export type FinancialsHookReturn = FinancialsState & FinancialsFunctions;
