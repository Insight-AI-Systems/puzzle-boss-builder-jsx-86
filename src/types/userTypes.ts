
export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'category_manager' 
  | 'social_media_manager' 
  | 'partner_manager' 
  | 'cfo' 
  | 'player';

export interface Profile {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
  bio?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}
