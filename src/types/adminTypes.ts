
import { DateRange } from 'react-day-picker';
import { UserRole, UserProfile } from './userTypes';

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  dateRange?: DateRange;
  role?: UserRole;
  roleSortDirection?: 'asc' | 'desc';
  country?: string | null;
  category?: string | null;
  gender?: string | null;
}

export interface RpcUserData {
  id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  country: string | null;
  categories_played: string[];
  credits: number;
  created_at: string;
  updated_at: string;
  gender?: string | null;
  custom_gender?: string | null;
  age_group?: string | null;
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
  genders: string[];
  signup_stats: MonthlySignupData[];
}

export interface MonthlySignupData {
  month: string;
  count: number;
}

export interface UserStats {
  total: number;
  genderBreakdown: { [key: string]: number };
  ageBreakdown?: { [key: string]: number };
}
