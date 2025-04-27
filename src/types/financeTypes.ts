
export type SourceType = 'membership' | 'pay-to-play' | 'sponsorship' | 'other';
export type ExpenseType = 'prizes' | 'salaries' | 'infrastructure' | 'commissions' | 'other';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'cancelled';

export interface SiteIncome {
  id?: string;
  source_type: SourceType;
  amount: number;
  user_id?: string;
  category_id?: string;
  date: string;
  method: string;
  notes?: string;
}

export interface SiteExpense {
  id?: string;
  expense_type: ExpenseType;
  amount: number;
  payee?: string;
  category_id?: string;
  date: string;
  notes?: string;
}

export interface CategoryManager {
  id?: string;
  user_id: string;
  category_id: string;
  commission_percent: number;
  active: boolean;
}

export interface CommissionPayment {
  id?: string;
  manager_id: string;
  category_id: string;
  period: string;
  gross_income: number;
  net_income: number;
  commission_amount: number;
  payment_status: PaymentStatus;
  payment_date?: string;
}

export interface MonthlyFinancialSummary {
  period: string;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  commissions_paid: number;
  prize_expenses: number;
}
