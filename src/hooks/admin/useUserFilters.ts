
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { UserRole } from '@/types/userTypes';
import { AdminProfilesOptions } from '@/types/adminTypes';

export function useUserFilters(pageSize: number = 10) {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roleSortDirection, setRoleSortDirection] = useState<'asc' | 'desc'>('asc');

  const filterOptions: AdminProfilesOptions = {
    page,
    pageSize,
    searchTerm,
    dateRange,
    role: selectedRole,
    roleSortDirection,
    country: selectedCountry,
    category: selectedCategory
  };

  return {
    page,
    setPage,
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
    filterOptions,
    pageSize
  };
}
