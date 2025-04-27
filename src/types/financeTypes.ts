
export type SourceType = 'membership' | 'pay-to-play' | 'sponsorship' | 'other';
export type ExpenseType = 'prizes' | 'salaries' | 'infrastructure' | 'commissions' | 'other';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'cancelled';
export type TimeFrame = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

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
  username?: string;
  category_name?: string;
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
  manager_name?: string;
  category_name?: string;
}

export interface MonthlyFinancialSummary {
  period: string;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  commissions_paid: number;
  prize_expenses: number;
}

export interface MembershipSummary {
  period: string;
  active_members: number;
  lapsed_members: number;
  canceled_members: number;
  revenue: number;
}

export interface CategoryRevenue {
  category_id: string;
  category_name: string;
  total_revenue: number;
  total_costs: number;
  net_revenue: number;
  commission_rate: number;
  commission_amount: number;
}

export interface FinancialChartData {
  name: string;
  value: number;
  color?: string;
}
