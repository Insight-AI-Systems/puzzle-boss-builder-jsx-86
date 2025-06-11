
import { UserRole, Gender, AgeGroup } from './userTypes';

export interface MemberDetailedProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url?: string | null;
  role: UserRole;
  country: string | null;
  categories_played: string[];
  credits: number;
  tokens: number;
  achievements: string[];
  referral_code: string | null;
  created_at: string;
  updated_at: string;
  
  // Extended profile fields
  full_name: string | null;
  username: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  date_of_birth: string | null;
  tax_id: string | null;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  marketing_opt_in: boolean;
  gender: Gender | null;
  custom_gender: string | null;
  age_group: AgeGroup | null;
  
  // Financial and membership data
  financial_summary?: MemberFinancialSummary;
  membership_details?: MembershipDetails;
  addresses?: Address[];
  xero_mapping?: XeroUserMapping;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'billing' | 'shipping';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export type AddressType = 'billing' | 'shipping';
export type UserAddress = Address; // Alias for backward compatibility

export interface MembershipDetails {
  status: 'active' | 'inactive' | 'suspended';
  tier: string;
  start_date: string;
  end_date: string | null;
  auto_renew: boolean;
}

export type UserMembershipDetail = MembershipDetails; // Alias for backward compatibility

export interface MemberFinancialSummary {
  total_spend: number;
  total_prizes: number;
  membership_revenue: number;
  puzzle_revenue: number;
  last_payment_date: string | null;
  membership_status: string;
  xero_contact_id: string | null;
  membership_end_date: string | null;
  lifetime_value: number;
}

export interface XeroUserMapping {
  id: string;
  user_id: string;
  xero_contact_id: string;
  xero_invoice_id?: string;
  sync_status: 'pending' | 'synced' | 'error';
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  status: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface MemberSyncData {
  user_id: string;
  xero_contact_id: string;
  sync_data: Record<string, any>;
}
