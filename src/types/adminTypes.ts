
import { UserProfile, UserRole } from './userTypes';
import { DateRange } from 'react-day-picker';

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  dateRange?: DateRange;
  role?: UserRole | null;
  roleSortDirection?: 'asc' | 'desc';
  country?: string | null;
  category?: string | null;
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
}

export interface RpcUserData {
  id: string;
  email: string;
  created_at: string;
  display_name: string | null;
  role: UserRole | null;
  country: string | null;
  categories_played: string[] | null;
}

