
export type UserRole = 'player' | 'admin' | 'super_admin' | 'category_manager';

export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  role?: UserRole;
  email?: string;
  created_at?: string;
  last_sign_in?: string;
}
