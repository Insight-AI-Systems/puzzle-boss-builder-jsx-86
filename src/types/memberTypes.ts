
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
  tokens: number; // Added tokens field
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

export interface MembershipDetails {
  status: 'active' | 'inactive' | 'suspended';
  tier: string;
  start_date: string;
  end_date: string | null;
  auto_renew: boolean;
}
