
import { UserProfile, UserRole, Gender, AgeGroup } from './userTypes';

// API/RPC Data Types
export interface RpcUserData {
  id: string;
  email?: string;
  display_name?: string;
  role?: string;
  country?: string;
  categories_played?: string[];
  credits?: number;
  created_at: string;
  updated_at?: string;
  last_sign_in?: string | null;
  gender?: string | null;
  custom_gender?: string | null;
  age_group?: string | null;
}

// User Statistics Types
export interface UserStats {
  total: number;
  genderBreakdown: { [key: string]: number };
  ageBreakdown?: { [key: string]: number };
}

export interface MonthlySignupData {
  month: string;
  count: number;
}

// Admin Panel Options and Results
export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  dateRange?: { from?: Date; to?: Date };
  role?: UserRole | null;
  roleSortDirection?: 'asc' | 'desc';
  lastLoginSortDirection?: 'asc' | 'desc';
  country?: string | null;
  category?: string | null;
  gender?: string | null;
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
  genders: string[];
  signup_stats: MonthlySignupData[];
}
