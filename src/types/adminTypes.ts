
import { UserProfile, UserRole, Gender, AgeGroup } from './userTypes';

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  role?: UserRole;
  country?: string;
  category?: string;
  gender?: Gender;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  roleSortDirection?: 'asc' | 'desc';
  lastLoginSortDirection?: 'asc' | 'desc';
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
  genders: string[];
  signup_stats: { month: string; count: number }[];
}

export interface RpcUserData {
  id: string;
  email: string | null;
  created_at: string;
  updated_at?: string;
  display_name?: string | null;
  role?: string;
  country?: string | null;
  gender?: string | null;
  custom_gender?: string | null;
  age_group?: string | null;
  categories_played?: string[];
  credits?: number;
  achievements?: any[];
  referral_code?: string | null;
  last_sign_in?: string | null;
}

export interface UserStats {
  total: number;
  genderBreakdown: { [key: string]: number };
  ageBreakdown?: { [key: string]: number };
}
