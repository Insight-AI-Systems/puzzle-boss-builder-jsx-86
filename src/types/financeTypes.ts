
export interface SiteIncome {
  id: string;
  source_type: SourceType;  // Ensure this matches the SourceType enum
  amount: number;
  user_id?: string;
  category_id?: string;
  date: string;
  method: string;
  notes?: string;
  categories?: { name: string };
  profiles?: { username: string };
}

export interface CategoryManager {
  id: string;
  user_id: string;
  category_id: string;
  commission_percent: number;
  active: boolean;
  username: string;
  category_name: string;
  created_at?: string;
  updated_at?: string;
  profiles?: { username: string };
  categories?: { name: string };
}
