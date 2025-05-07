
import { RpcUserData } from '@/types/adminTypes';
import { UserProfile } from '@/types/userTypes';

// Define admin roles for filtering
const ADMIN_ROLES = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];

export const filterUserData = (
  users: RpcUserData[],
  filters: {
    searchQuery?: string;
    role?: string | null;
    country?: string | null;
    gender?: string | null;
    userType?: 'regular' | 'admin';
  }
): RpcUserData[] => {
  return users.filter((user) => {
    // User type filter (admin vs regular)
    if (filters.userType === 'admin') {
      const isAdminRole = ADMIN_ROLES.includes(user.role || 'player');
      if (!isAdminRole) return false;
    } else if (filters.userType === 'regular') {
      const isAdminRole = ADMIN_ROLES.includes(user.role || 'player');
      if (isAdminRole) return false;
    }
    
    // Search query filter
    if (
      filters.searchQuery &&
      !(
        user.email?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    ) {
      return false;
    }

    // Role filter
    if (filters.role && user.role !== filters.role) {
      return false;
    }

    // Country filter
    if (filters.country && user.country !== filters.country) {
      return false;
    }

    // Gender filter
    if (filters.gender && user.gender !== filters.gender) {
      return false;
    }

    return true;
  });
};

export const transformToUserProfile = (user: RpcUserData): UserProfile => {
  return {
    id: user.id,
    email: user.email || null,
    display_name: user.display_name || 'Anonymous User',
    bio: null,
    avatar_url: user.avatar_url || null,
    role: (user.role || 'player') as any,
    country: user.country || null,
    categories_played: user.categories_played || [],
    credits: user.credits || 0,
    achievements: [],
    referral_code: null,
    gender: user.gender as any,
    custom_gender: user.custom_gender || null,
    age_group: user.age_group as any,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
    last_sign_in: user.last_sign_in || null
  };
};

export const extractUniqueValues = (users: RpcUserData[]) => {
  const countries = [...new Set(users.map(user => user.country).filter(Boolean))];
  
  const categoriesSet = new Set<string>();
  users.forEach(user => {
    if (Array.isArray(user.categories_played)) {
      user.categories_played.forEach(cat => categoriesSet.add(cat));
    }
  });
  const categories = [...categoriesSet];

  const genders = [...new Set(users.map(user => user.gender).filter(Boolean))];
  
  return { countries, categories, genders };
};
