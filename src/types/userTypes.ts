export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'category_manager'
  | 'social_media_manager'
  | 'partner_manager'
  | 'cfo'
  | 'player';

export type Gender = 
  | 'male'
  | 'female'
  | 'non-binary'
  | 'prefer-not-to-say'
  | 'custom';

export type AgeGroup = 
  | '13-17'
  | '18-24'
  | '25-34'
  | '35-44'
  | '45-60'
  | '60+';

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  country: string | null;
  categories_played: string[];
  credits: number;
  achievements: any[];
  referral_code: string | null;
  created_at: string;
  updated_at: string;
  gender?: Gender | null;
  custom_gender?: string | null;
  age_group?: AgeGroup | null;
  last_sign_in?: string | null;
}

export interface RolePermission {
  role: UserRole;
  label: string;
  description: string;
  permissions: string[];
  canBeAssignedBy: UserRole[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RolePermission> = {
  'super_admin': {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Complete access to all features and functionality',
    permissions: ['all'],
    canBeAssignedBy: ['super_admin']
  },
  'admin': {
    role: 'admin',
    label: 'Admin',
    description: 'Administrative access with some limitations',
    permissions: ['manage_users', 'manage_content', 'view_analytics', 'manage_settings'],
    canBeAssignedBy: ['super_admin']
  },
  'category_manager': {
    role: 'category_manager',
    label: 'Category Manager',
    description: 'Management of specific puzzle categories and puzzle creation',
    permissions: ['manage_assigned_categories', 'create_puzzles', 'view_category_analytics', 'manage_categories'],
    canBeAssignedBy: ['super_admin']
  },
  'social_media_manager': {
    role: 'social_media_manager',
    label: 'Social Media Manager',
    description: 'Access to winner info, marketing materials, and content management',
    permissions: ['view_winners', 'schedule_promotions', 'view_marketing_analytics', 'manage_content'],
    canBeAssignedBy: ['super_admin']
  },
  'partner_manager': {
    role: 'partner_manager',
    label: 'Partner Manager',
    description: 'Supplier and prize management, and partner relationship coordination',
    permissions: ['manage_partners', 'manage_prizes', 'schedule_promotions'],
    canBeAssignedBy: ['super_admin']
  },
  'cfo': {
    role: 'cfo',
    label: 'CFO',
    description: 'Financial reporting, payment system management, and revenue tracking',
    permissions: ['view_financial_reports', 'manage_payments', 'view_revenue_tracking', 'view_analytics'],
    canBeAssignedBy: ['super_admin']
  },
  'player': {
    role: 'player',
    label: 'Player',
    description: 'Standard player account with access to game features',
    permissions: ['play_puzzles', 'view_profile', 'claim_prizes'],
    canBeAssignedBy: ['super_admin']
  }
};
