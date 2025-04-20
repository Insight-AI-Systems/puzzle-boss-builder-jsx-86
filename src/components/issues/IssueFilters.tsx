
import React, { useState } from 'react';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IssueFilters } from '@/types/issueTypes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface IssueFiltersProps {
  filters: IssueFilters;
  onFilterChange: (filters: Partial<IssueFilters>) => void;
  categories: string[];
}

export function IssueFiltersComponent({ filters, onFilterChange, categories }: IssueFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'status', label: 'Status' },
    { value: 'title', label: 'Title' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchTerm: e.target.value });
  };

  const toggleSortDirection = () => {
    onFilterChange({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => onFilterChange({ sortBy: value as IssueFilters['sortBy'] })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSortDirection}
            title={filters.sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {filters.sortDirection === 'asc' ? 
              <SortAsc className="h-4 w-4" /> : 
              <SortDesc className="h-4 w-4" />
            }
          </Button>
          
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Status</h4>
                  <Select 
                    value={filters.statusFilter} 
                    onValueChange={(value) => onFilterChange({ statusFilter: value as IssueFilters['statusFilter'] })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="wip">Work In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {categories.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Category</h4>
                      <Select 
                        value={filters.categoryFilter} 
                        onValueChange={(value) => onFilterChange({ categoryFilter: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
