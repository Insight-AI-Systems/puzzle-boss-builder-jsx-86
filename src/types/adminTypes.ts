
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
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
}
