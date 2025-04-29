
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { UserRole } from '@/types/userTypes';
import { AdminProfilesOptions } from '@/types/adminTypes';

export function useUserFilters(initialPageSize: number = 10) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roleSortDirection, setRoleSortDirection] = useState<'asc' | 'desc'>('asc');
  const [userType, setUserType] = useState<'regular' | 'admin'>('regular');

  const filterOptions: AdminProfilesOptions = {
    page,
    pageSize,
    searchTerm: searchTerm.trim(), // Trim whitespace to avoid unnecessary queries
    dateRange,
    role: selectedRole,
    roleSortDirection,
    country: selectedCountry,
    category: selectedCategory,
    userType
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateRange(undefined);
    setSelectedCountry(null);
    setSelectedCategory(null);
    setSelectedRole(null);
    setRoleSortDirection('asc');
    setPage(0);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    selectedCountry,
    setSelectedCountry,
    selectedCategory,
    setSelectedCategory,
    selectedRole,
    setSelectedRole,
    roleSortDirection,
    setRoleSortDirection,
    userType,
    setUserType,
    filterOptions,
    resetFilters
  };
}
