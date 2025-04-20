
export type IssueStatus = 'wip' | 'completed';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  status: IssueStatus;
  created_by: string;
  modified_by: string;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  modifier_name?: string;
}

export interface IssueFormData {
  title: string;
  description: string;
  category?: string | null;
}

export interface IssueFilters {
  searchTerm: string;
  statusFilter: IssueStatus | 'all';
  categoryFilter: string | 'all';
  sortBy: 'created_at' | 'updated_at' | 'status' | 'title';
  sortDirection: 'asc' | 'desc';
}

// Add type for Supabase issue query results
export interface IssueWithProfiles {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  status: IssueStatus;
  created_by: string;
  modified_by: string;
  created_at: string;
  updated_at: string;
  creator?: {
    username?: string | null;
    email?: string | null;
  } | null;
  modifier?: {
    username?: string | null;
    email?: string | null;
  } | null;
}
