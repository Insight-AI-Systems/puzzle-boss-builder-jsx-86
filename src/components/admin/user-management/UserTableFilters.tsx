
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_DEFINITIONS } from '@/types/userTypes';

interface UserTableFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string | null;
  onRoleChange: (role: string | null) => void;
  selectedCountry: string | null;
  onCountryChange: (country: string | null) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function UserTableFilters({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedCountry,
  onCountryChange,
  hasActiveFilters,
  onClearFilters
}: UserTableFiltersProps) {
  // List of available countries (this could be pulled from the database)
  const availableCountries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* First row with search and filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="w-full sm:w-auto flex flex-wrap gap-2">
          <Select
            value={selectedRole || 'all'}
            onValueChange={(value) => onRoleChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {Object.values(ROLE_DEFINITIONS).map((role) => (
                <SelectItem key={role.role} value={role.role}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedCountry || 'all'}
            onValueChange={(value) => onCountryChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {availableCountries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="flex items-center text-muted-foreground">
            <Filter className="h-4 w-4 mr-1" />
            Active filters:
          </span>
          
          {searchQuery && (
            <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md flex items-center">
              Search: {searchQuery}
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {selectedRole && (
            <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md flex items-center">
              Role: {ROLE_DEFINITIONS[selectedRole as keyof typeof ROLE_DEFINITIONS]?.label || selectedRole}
              <button
                onClick={() => onRoleChange(null)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {selectedCountry && (
            <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md flex items-center">
              Country: {availableCountries.find(c => c.value === selectedCountry)?.label || selectedCountry}
              <button
                onClick={() => onCountryChange(null)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
