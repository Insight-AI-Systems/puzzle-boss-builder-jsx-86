import { UserProfile } from './userTypes';

export interface UserStats {
  total: number;
  genderBreakdown: {
    [key: string]: number;
  };
  ageBreakdown?: {
    [key: string]: number;
  };
  adminCount: number;
  regularCount: number;
}

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  roleSortDirection?: 'asc' | 'desc';
  lastLoginSortDirection?: 'asc' | 'desc';
  searchTerm?: string;
  role?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  dateRange?: { from?: Date; to?: Date };
  gender?: string;
  userType?: 'regular' | 'admin';
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
  genders: string[];
  signup_stats: Array<{month: string; count: number}>;
}

export interface RpcUserData {
  id: string;
  email?: string;
  display_name?: string;
  role: string;
  last_sign_in?: string;
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
  gender?: string;
  custom_gender?: string;
  age_group?: string;
  country?: string;
  categories_played?: string[];
  credits?: number;
}

// Financial data interfaces for better type checking
export interface FinancialFilterOptions {
  period?: string;
  startDate?: string;
  endDate?: string;
  sourceType?: string;
  expenseType?: string;
  searchTerm?: string;
  status?: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  filename: string;
}
