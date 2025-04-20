
export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'category_manager'
  | 'social_media_manager'
  | 'partner_manager'
  | 'cfo'
  | 'player';

export interface UserProfile {
  id: string;
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
    description: 'Extensive management capabilities with limited role assignment',
    permissions: ['manage_users', 'manage_puzzles', 'manage_categories', 'view_analytics'],
    canBeAssignedBy: ['super_admin']
  },
  'category_manager': {
    role: 'category_manager',
    label: 'Category Manager',
    description: 'Management of specific puzzle categories',
    permissions: ['manage_assigned_categories', 'create_puzzles', 'view_category_analytics'],
    canBeAssignedBy: ['super_admin', 'admin']
  },
  'social_media_manager': {
    role: 'social_media_manager',
    label: 'Social Media Manager',
    description: 'Access to winner info and marketing materials',
    permissions: ['view_winners', 'schedule_promotions', 'view_marketing_analytics'],
    canBeAssignedBy: ['super_admin', 'admin']
  },
  'partner_manager': {
    role: 'partner_manager',
    label: 'Partner Manager',
    description: 'Supplier and prize management',
    permissions: ['manage_partners', 'manage_prizes', 'schedule_promotions'],
    canBeAssignedBy: ['super_admin', 'admin']
  },
  'cfo': {
    role: 'cfo',
    label: 'CFO',
    description: 'Financial reporting and payment system management',
    permissions: ['view_financial_reports', 'manage_payments', 'view_revenue_tracking'],
    canBeAssignedBy: ['super_admin', 'admin']
  },
  'player': {
    role: 'player',
    label: 'Player',
    description: 'Standard player account',
    permissions: ['play_puzzles', 'view_profile', 'claim_prizes'],
    canBeAssignedBy: ['super_admin', 'admin']
  }
};
