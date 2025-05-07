
import { UserProfile } from './userTypes';

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  role?: string | null;
  country?: string | null;
  gender?: string | null;
  roleSortDirection?: 'asc' | 'desc';
  lastLoginSortDirection?: 'asc' | 'desc';
  userType?: 'regular' | 'admin';
}

export interface RpcUserData {
  id: string;
  email: string;
  display_name: string;
  role?: string;
  created_at: string;
  updated_at?: string;
  last_sign_in?: string | null;
  gender?: string | null;
  custom_gender?: string | null;
  age_group?: string | null;
  country?: string | null;
  categories_played?: string[] | null;
  avatar_url?: string | null;
  credits?: number | null;
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
  genders: string[];
  signup_stats: { month: string; count: number }[];
}

export interface UserStats {
  total: number;
  genderBreakdown: { [key: string]: number };
  ageBreakdown?: { [key: string]: number };
  adminCount: number;
  regularCount: number;
}
