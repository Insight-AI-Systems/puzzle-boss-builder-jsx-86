import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

export interface UserTableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
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
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4">
      <div className="relative grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search users..." 
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select 
        value={selectedRole || "all"} 
        onValueChange={(val) => onRoleChange(val === "all" ? null : val)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {Object.entries(ROLE_DEFINITIONS).map(([role, def]) => (
            <SelectItem key={role} value={role}>
              {def.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={selectedCountry || "all"} 
        onValueChange={(val) => onCountryChange(val === "all" ? null : val)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          {/* Add more countries as needed */}
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClearFilters} 
          title="Clear all filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
