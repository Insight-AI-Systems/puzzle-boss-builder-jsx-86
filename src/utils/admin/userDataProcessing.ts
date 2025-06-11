import { UserProfile, UserRole } from '@/types/userTypes';

// Helper type to represent the RPC response structure
interface RpcUserData {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  role: string;
  country: string | null;
  categories_played: string[];
  credits: number;
  tokens?: number;
  created_at: string;
  updated_at: string;
  last_sign_in: string | null;
}

// Helper function to categorize user roles
const isAdminRole = (role: UserRole): boolean => {
  const adminRoles: UserRole[] = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
  return adminRoles.includes(role);
};

// Helper function to filter admin profiles
export const filterAdminProfiles = (profiles: UserProfile[]): UserProfile[] => {
  return profiles.filter(profile => isAdminRole(profile.role));
};

// Helper function to extract unique countries from user profiles
export const extractAvailableCountries = (profiles: UserProfile[]): string[] => {
  const countries = new Set<string>();
  profiles.forEach(profile => {
    if (profile.country) {
      countries.add(profile.country);
    }
  });
  return Array.from(countries);
};

export function processUserProfileData(userData: RpcUserData[]): UserProfile[] {
  return userData.map(user => ({
    id: user.id,
    email: user.email,
    display_name: user.username,
    bio: user.bio,
    avatar_url: user.avatar_url,
    role: user.role as UserRole,
    country: user.country,
    categories_played: user.categories_played || [],
    credits: user.credits,
    tokens: user.tokens || 0,
    achievements: [],
    referral_code: null,
    created_at: user.created_at,
    updated_at: user.updated_at,
    last_sign_in: user.last_sign_in
  }));
}
