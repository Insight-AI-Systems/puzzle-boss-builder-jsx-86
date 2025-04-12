
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  role?: string;
  credits?: number;
  [key: string]: any;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResult<T = any> {
  data?: T;
  error?: AuthError;
  success?: boolean;
}

export interface AuthContext {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<AuthResult<Profile>>;
  isAdmin: boolean;
  isCategoryManager: boolean;
  isCFO: boolean;
  isSocialMediaManager: boolean;
  isPartnerManager: boolean;
  isPlayer: boolean;
}
