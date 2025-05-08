
import { useState } from 'react';
import { UserRole } from '@/types/userTypes';
import { UserFilterCriteria } from '@/components/admin/user-management/AdvancedUserFilter';

export function useUserFilters() {
  // Change to accept 'regular' as a value
  const [userType, setUserType] = useState<'regular' | 'admin' | 'player'>('regular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<UserFilterCriteria>({
    roles: [],
    countries: [],
    activityStatus: 'all',
    createdAfter: null,
    createdBefore: null,
    minLoginCount: 0,
    hasCompletedProfile: null
  });
  
  // Filter options based on selected user type
  const filterOptions = {
    searchQuery,
    role: selectedRole as UserRole | null,
    country: selectedCountry,
    page,
    pageSize,
    userType,
    advancedFilters
  };

  // Function to determine if a filter is active
  const hasActiveFilters = (): boolean => {
    return !!(
      searchQuery || 
      selectedRole || 
      selectedCountry ||
      advancedFilters.roles.length > 0 ||
      advancedFilters.countries.length > 0 ||
      advancedFilters.activityStatus !== 'all' ||
      advancedFilters.createdAfter !== null ||
      advancedFilters.createdBefore !== null ||
      advancedFilters.minLoginCount > 0 ||
      advancedFilters.hasCompletedProfile !== null
    );
  };

  return {
    userType,
    setUserType,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    page, 
    setPage,
    pageSize,
    setPageSize,
    selectedCountry,
    setSelectedCountry,
    advancedFilters,
    setAdvancedFilters,
    filterOptions,
    hasActiveFilters
  };
}
