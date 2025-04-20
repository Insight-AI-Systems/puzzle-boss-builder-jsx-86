
import { UserProfile } from './userTypes';

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

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  selectedCountry?: string;
  selectedCategory?: string;
  role?: string;
  roleSortDirection?: 'asc' | 'desc';
}
