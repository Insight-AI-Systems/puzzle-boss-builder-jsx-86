
import { AdminProfilesOptions, RpcUserData } from '@/types/adminTypes';
import { UserProfile } from '@/types/userTypes';

export function filterUserData(data: RpcUserData[], options: AdminProfilesOptions): RpcUserData[] {
  let filtered = [...data];
  
  // Filter by user type first (admin vs regular)
  if (options.userType) {
    const isAdmin = options.userType === 'admin';
    filtered = filtered.filter(user => {
      const userRole = user.role || 'player';
      // Admin roles are super_admin, admin, category_manager, social_media_manager, partner_manager, cfo
      const adminRoles = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
      const isUserAdmin = adminRoles.includes(userRole);
      return isAdmin ? isUserAdmin : !isUserAdmin;
    });
  }
  
  // Filter by search term (email or display name)
  if (options.searchTerm) {
    const searchLower = options.searchTerm.toLowerCase();
    filtered = filtered.filter(user => 
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.display_name && user.display_name.toLowerCase().includes(searchLower))
    );
  }
  
  // Filter by date range
  if (options.dateRange?.from) {
    const fromDate = new Date(options.dateRange.from);
    filtered = filtered.filter(user => {
      const createdDate = new Date(user.created_at);
      return createdDate >= fromDate;
    });
  }
  
  if (options.dateRange?.to) {
    const toDate = new Date(options.dateRange.to);
    toDate.setDate(toDate.getDate() + 1); // Include the end date
    filtered = filtered.filter(user => {
      const createdDate = new Date(user.created_at);
      return createdDate < toDate;
    });
  }
  
  // Filter by role
  if (options.role) {
    filtered = filtered.filter(user => user.role === options.role);
  }
  
  // Filter by country
  if (options.country) {
    filtered = filtered.filter(user => user.country === options.country);
  }
  
  // Filter by category
  if (options.category) {
    filtered = filtered.filter(user => 
      user.categories_played && user.categories_played.includes(options.category as string)
    );
  }
  
  // Filter by gender
  if (options.gender) {
    filtered = filtered.filter(user => user.gender === options.gender);
  }
  
  return filtered;
}

export function transformToUserProfile(userData: RpcUserData): UserProfile {
  return {
    id: userData.id,
    email: userData.email,
    display_name: userData.display_name,
    bio: null,
    avatar_url: userData.avatar_url || null,
    role: userData.role as any,
    country: userData.country,
    categories_played: userData.categories_played || [],
    credits: userData.credits || 0,
    tokens: userData.tokens || 0, // Added tokens field
    achievements: [],
    referral_code: null,
    created_at: userData.created_at,
    updated_at: userData.updated_at || userData.created_at,
    gender: userData.gender as any || null,
    custom_gender: userData.custom_gender || null,
    age_group: userData.age_group as any || null,
    last_sign_in: userData.last_sign_in
  };
}

export function extractUniqueValues(userData: RpcUserData[]) {
  const countries = [...new Set(userData.map(user => user.country).filter(Boolean))];
  const categoriesSet = new Set<string>();
  const genders = [...new Set(userData.map(user => user.gender).filter(Boolean))];
  
  // Extract all unique categories
  userData.forEach(user => {
    if (user.categories_played && Array.isArray(user.categories_played)) {
      user.categories_played.forEach(category => {
        if (category) categoriesSet.add(category);
      });
    }
  });
  
  const categories = Array.from(categoriesSet);
  
  return { countries, categories, genders };
}
