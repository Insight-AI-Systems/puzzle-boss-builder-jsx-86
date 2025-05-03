
import { UserProfile } from './userTypes';
import { XeroContact } from './integration';

export type AddressType = 'billing' | 'shipping';

export interface UserAddress {
  id: string;
  user_id: string;
  address_type: AddressType;
  is_default: boolean;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface XeroUserMapping {
  id: string;
  user_id: string;
  xero_contact_id: string;
  sync_status: 'active' | 'inactive' | 'error';
  last_synced: string;
  created_at: string;
}

export interface UserMembershipDetail {
  id: string;
  user_id: string;
  membership_id: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'expired' | 'canceled' | 'suspended';
  auto_renew: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  transaction_type: 'membership' | 'puzzle' | 'prize' | 'refund' | 'other';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string;
  xero_invoice_id?: string;
  xero_transaction_id?: string;
  category_id?: string;
  transaction_date: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface MemberDetailedProfile extends UserProfile {
  full_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  tax_id?: string;
  terms_accepted: boolean;
  terms_accepted_at?: string;
  marketing_opt_in: boolean;
  addresses?: UserAddress[];
  membership_details?: UserMembershipDetail;
  xero_mapping?: XeroUserMapping;
  financial_summary?: MemberFinancialSummary;
}

export interface MemberFinancialSummary {
  total_spend: number;
  total_prizes: number;
  membership_revenue: number;
  puzzle_revenue: number;
  last_payment_date?: string;
  membership_status: string;
  xero_contact_id?: string;
  membership_end_date?: string;
  lifetime_value: number;
}

export interface MemberSyncData {
  profile: MemberDetailedProfile;
  xeroContact?: XeroContact;
}
