
import { SiteExpense, SiteIncome } from './financeTypes';

export interface UserFinancialSummary {
  total_spend: number;
  total_prizes: number;
  membership_revenue: number;
  puzzle_revenue: number;
  last_payment_date: string;
  membership_status: string;
}

export interface UserPaymentMethod {
  id: string;
  user_id: string;
  method_type: string;
  last_used: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberHistoryDetails {
  memberships: Array<{
    id: string;
    start_date: string;
    end_date?: string;
    amount: number;
    status: string;
  }>;
  paymentMethods: UserPaymentMethod[];
  financialSummary: UserFinancialSummary;
  transactions: Array<SiteIncome | SiteExpense>;
}
