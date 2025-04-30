
export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'category_manager' 
  | 'social_media_manager' 
  | 'partner_manager' 
  | 'cfo' 
  | 'player';

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer_not_to_say' | 'other';

export type AgeGroup = 'under_18' | '18_24' | '25_34' | '35_44' | '45_54' | '55_64' | '65_plus';

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

// UserProfile extends Profile with additional properties needed in various components
export interface UserProfile {
  id: string;
  display_name: string | null;
  email: string | null;
  bio: string | null;
  avatar_url?: string | null;
  role: UserRole;
  country: string | null;
  categories_played: string[];
  credits: number;
  achievements: string[];
  referral_code: string | null;
  gender?: Gender;
  age_group?: AgeGroup;
  created_at: string;
  updated_at: string;
  last_sign_in?: string | null;
}

// Define the interface for role definition
interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: string[];
  canBeAssignedBy: UserRole[];
}

// Export the ROLE_DEFINITIONS object with roles and their permissions
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Complete administrative access to all site features and functions.',
    permissions: [
      'manage_users',
      'manage_roles',
      'manage_puzzles',
      'manage_categories',
      'manage_partners',
      'manage_finances',
      'manage_site_settings',
      'access_analytics',
      'manage_emails',
      'manage_security'
    ],
    canBeAssignedBy: ['super_admin']
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    description: 'General administrative access without some sensitive operations.',
    permissions: [
      'manage_users',
      'manage_puzzles',
      'manage_categories',
      'manage_partners',
      'access_analytics',
      'manage_emails'
    ],
    canBeAssignedBy: ['super_admin']
  },
  category_manager: {
    role: 'category_manager',
    label: 'Category Manager',
    description: 'Manages specific puzzle categories and content.',
    permissions: [
      'manage_assigned_categories',
      'create_puzzles',
      'edit_puzzles',
      'view_analytics'
    ],
    canBeAssignedBy: ['super_admin', 'admin']
  },
  social_media_manager: {
    role: 'social_media_manager',
    label: 'Social Media Manager',
    description: 'Manages social media content and promotions.',
    permissions: [
      'create_content',
      'schedule_posts',
      'view_analytics',
      'manage_winners'
    ],
    canBeAssignedBy: ['super_admin', 'admin']
  },
  partner_manager: {
    role: 'partner_manager',
    label: 'Partner Manager',
    description: 'Manages partnerships and prize suppliers.',
    permissions: [
      'manage_partners',
      'manage_prizes',
      'view_analytics'
    ],
    canBeAssignedBy: ['super_admin', 'admin']
  },
  cfo: {
    role: 'cfo',
    label: 'CFO',
    description: 'Access to financial data and reporting.',
    permissions: [
      'manage_finances',
      'view_analytics',
      'approve_payments',
      'export_financial_data'
    ],
    canBeAssignedBy: ['super_admin']
  },
  player: {
    role: 'player',
    label: 'Player',
    description: 'Standard user with puzzle access.',
    permissions: [
      'play_puzzles',
      'manage_profile',
      'view_leaderboards'
    ],
    canBeAssignedBy: ['super_admin', 'admin']
  }
};
