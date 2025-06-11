
export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  role?: string;
  country?: string;
  credits?: number;
  tokens?: number; // Add missing tokens field
  created_at: string;
  updated_at: string;
}
