
import { RpcUserData, AdminProfilesOptions } from '@/types/adminTypes';
import { UserProfile, UserRole } from '@/types/userTypes';

export const filterUserData = (data: RpcUserData[], options: AdminProfilesOptions) => {
  const {
    searchTerm = '',
    dateRange,
    role,
    country,
    category
  } = options;

  let filteredData = [...data];

  if (searchTerm) {
    filteredData = filteredData.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm)
    );
  }

  if (dateRange?.from) {
    const fromDate = new Date(dateRange.from);
    filteredData = filteredData.filter(user => {
      const userDate = new Date(user.created_at);
      return userDate >= fromDate;
    });
  }

  if (dateRange?.to) {
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    filteredData = filteredData.filter(user => {
      const userDate = new Date(user.created_at);
      return userDate <= toDate;
    });
  }

  if (role) {
    filteredData = filteredData.filter(user => user.role === role);
  }

  if (country) {
    filteredData = filteredData.filter(user => user.country === country);
  }

  if (category) {
    filteredData = filteredData.filter(user => 
      user.categories_played && 
      Array.isArray(user.categories_played) && 
      user.categories_played.includes(category)
    );
  }

  return filteredData;
};

export const transformToUserProfile = (user: RpcUserData): UserProfile => ({
  id: user.id,
  display_name: user.display_name || 'N/A',
  bio: null,
  avatar_url: null,
  role: (user.role || 'player') as UserRole,
  country: user.country || null,
  categories_played: user.categories_played || [],
  credits: 0,
  achievements: [],
  referral_code: null,
  created_at: user.created_at,
  updated_at: user.created_at,
  email: user.email || null
});

export const extractUniqueValues = (data: RpcUserData[]) => {
  const uniqueCountries = new Set<string>();
  const uniqueCategories = new Set<string>();
  
  data.forEach(user => {
    if (user.country) uniqueCountries.add(user.country);
    if (user.categories_played && Array.isArray(user.categories_played)) {
      user.categories_played.forEach(cat => uniqueCategories.add(cat));
    }
  });

  return {
    countries: Array.from(uniqueCountries),
    categories: Array.from(uniqueCategories)
  };
};
