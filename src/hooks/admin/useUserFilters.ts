
import { useState } from 'react';

export function useUserFilters() {
  const [userType, setUserType] = useState<'regular' | 'admin'>('regular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  // Determine filter options based on selected user type
  const filterOptions = {
    searchQuery,
    role: selectedRole,
    country: selectedCountry,
    page,
    pageSize,
    // If viewing admin users, include all admin roles, otherwise exclude them
    userType
  };

  // Function to determine if a filter is active
  const hasActiveFilters = (): boolean => {
    return !!(searchQuery || selectedRole || selectedCountry);
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
    filterOptions,
    hasActiveFilters
  };
}
