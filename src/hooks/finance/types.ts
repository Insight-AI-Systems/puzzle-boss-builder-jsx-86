
import { 
  MonthlyFinancialSummary, 
  SiteIncome, 
  SiteExpense, 
  CategoryManager, 
  CommissionPayment 
} from '@/types/financeTypes';

export interface FinancialsHookReturn {
  isLoading: boolean;
  error: Error | null;
  fetchMonthlyFinancialSummary: (period: string) => Promise<MonthlyFinancialSummary>;
  fetchSiteIncomes: (startDate: string, endDate: string) => Promise<SiteIncome[]>;
  fetchSiteExpenses: (month: string) => Promise<SiteExpense[]>;
  fetchCategoryManagers: () => Promise<CategoryManager[]>;
  fetchCommissionPayments: () => Promise<CommissionPayment[]>;
}
