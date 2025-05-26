
export type UserRole = 'player' | 'admin' | 'super_admin' | 'category_manager' | 'social_media_manager' | 'partner_manager' | 'cfo';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';

export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  role?: UserRole;
  email?: string;
  created_at?: string;
  last_sign_in?: string;
  country?: string;
  bio?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  categories_played?: string[];
  credits?: number;
  achievements?: string[];
  referral_code?: string;
  updated_at?: string;
  gender?: Gender;
  custom_gender?: string;
  age_group?: AgeGroup;
}

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: string[];
  canBeAssignedBy: UserRole[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  player: {
    role: 'player',
    label: 'Player',
    description: 'Regular user who can play puzzles',
    permissions: ['play_puzzles', 'view_profile'],
    canBeAssignedBy: ['admin', 'super_admin']
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    description: 'Administrator with broad system access',
    permissions: ['manage_users', 'manage_puzzles', 'view_analytics', 'play_puzzles', 'view_profile'],
    canBeAssignedBy: ['super_admin']
  },
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Highest level administrator with full system access',
    permissions: ['manage_users', 'manage_puzzles', 'view_analytics', 'manage_system', 'assign_roles', 'play_puzzles', 'view_profile'],
    canBeAssignedBy: ['super_admin']
  },
  category_manager: {
    role: 'category_manager',
    label: 'Category Manager',
    description: 'Manages puzzle categories and content',
    permissions: ['manage_categories', 'manage_puzzles', 'view_analytics', 'play_puzzles', 'view_profile'],
    canBeAssignedBy: ['admin', 'super_admin']
  },
  social_media_manager: {
    role: 'social_media_manager',
    label: 'Social Media Manager',
    description: 'Manages social media content and campaigns',
    permissions: ['manage_content', 'view_analytics', 'play_puzzles', 'view_profile'],
    canBeAssignedBy: ['admin', 'super_admin']
  },
  partner_manager: {
    role: 'partner_manager',
    label: 'Partner Manager',
    description: 'Manages partnerships and business relationships',
    permissions: ['manage_partners', 'view_analytics', 'play_puzzles', 'view_profile'],
    canBeAssignedBy: ['admin', 'super_admin']
  },
  cfo: {
    role: 'cfo',
    label: 'CFO',
    description: 'Chief Financial Officer with financial oversight',
    permissions: ['view_financials', 'manage_finances', 'view_analytics', 'play_puzzles', 'view_profile'],
    canBeAssignedBy: ['super_admin']
  }
};
