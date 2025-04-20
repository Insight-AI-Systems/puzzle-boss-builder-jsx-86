
import { useState } from 'react';
import { IssueFilters } from '@/types/issueTypes';

export function useIssuesFilters() {
  const [filters, setFilters] = useState<IssueFilters>({
    searchTerm: '',
    statusFilter: 'all',
    categoryFilter: 'all',
    sortBy: 'created_at',
    sortDirection: 'desc'
  });

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  const updateFilters = (newFilters: Partial<IssueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    filters,
    updateFilters,
    uniqueCategories,
    setUniqueCategories
  };
}
