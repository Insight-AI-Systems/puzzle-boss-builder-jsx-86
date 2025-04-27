
export enum SourceType {
  MEMBERSHIP = 'membership',
  PUZZLE = 'puzzle',
  PRIZE = 'prize',
  OTHER = 'other'
}

export enum ExpenseType {
  OPERATIONAL = 'operational',
  MARKETING = 'marketing',
  PRIZES = 'prizes',
  COMMISSIONS = 'commissions',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected'
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface SiteIncome {
  id: string;
  source_type: SourceType;
  amount: number;
  user_id?: string;
  category_id?: string;
  date: string;
  method: string;
  notes?: string;
  categories?: { name: string };
  profiles?: { username: string };
}

export interface SiteExpense {
  id: string;
  expense_type: ExpenseType;
  amount: number;
  payee?: string;
  category_id?: string;
  date: string;
  notes?: string;
  categories?: { name: string };
}

export interface CategoryManager {
  id: string;
  user_id: string;
  category_id: string;
  commission_percent: number;
  active: boolean;
  username: string;
  category_name: string;
  created_at?: string;
  updated_at?: string;
  profiles?: { username: string };
  categories?: { name: string };
}

export interface CommissionPayment {
  id: string;
  manager_id: string;
  category_id: string;
  period: string;
  gross_income: number;
  net_income: number;
  commission_amount: number;
  payment_status: PaymentStatus;
  payment_date?: string;
  manager_name: string;
  category_name: string;
}

export interface MonthlyFinancialSummary {
  period: string;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  commissions_paid: number;
  prize_expenses: number;
}

export interface Membership {
  id: string;
  user_id: string;
  membership_type: string;
  status: string;
  start_date: string;
  end_date?: string;
  last_payment_date?: string;
  amount: number;
  profiles?: { username: string };
}

export interface MembershipStats {
  period: string;
  active_members: number;
  expired_members: number;
  canceled_members: number;
  revenue: number;
  churn_rate: number;
}

