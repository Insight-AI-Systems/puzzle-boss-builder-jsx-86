
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Filter, X, CheckCircle2, Clock, Calendar, CalendarDays, Users
} from "lucide-react";
import { ROLE_DEFINITIONS, UserRole } from '@/types/userTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedUserFilterProps {
  onFilterChange: (filters: UserFilterCriteria) => void;
  filters: UserFilterCriteria;
  availableCountries: string[];
  totalUsers: number;
  visibleUsers: number;
}

export interface UserFilterCriteria {
  roles: UserRole[];
  countries: string[];
  activityStatus: 'all' | 'active' | 'inactive' | 'recent';
  createdAfter: string | null;
  createdBefore: string | null;
  minLoginCount: number;
  hasCompletedProfile: boolean | null;
}

export function AdvancedUserFilter({
  onFilterChange,
  filters,
  availableCountries,
  totalUsers,
  visibleUsers
}: AdvancedUserFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState<UserFilterCriteria>(filters);
  
  // Calculate whether any filters are active
  const hasActiveFilters = 
    localFilters.roles.length > 0 || 
    localFilters.countries.length > 0 || 
    localFilters.activityStatus !== 'all' ||
    localFilters.createdAfter !== null ||
    localFilters.createdBefore !== null ||
    localFilters.minLoginCount > 0 ||
    localFilters.hasCompletedProfile !== null;
  
  // Handle filter changes
  const updateFilters = (changes: Partial<UserFilterCriteria>) => {
    setLocalFilters(prev => ({
      ...prev,
      ...changes
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };
  
  // Clear filters
  const clearFilters = () => {
    const resetFilters = {
      roles: [],
      countries: [],
      activityStatus: 'all' as const,
      createdAfter: null,
      createdBefore: null,
      minLoginCount: 0,
      hasCompletedProfile: null
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    setIsOpen(false);
  };
  
  // Toggle role selection
  const toggleRole = (role: UserRole) => {
    if (localFilters.roles.includes(role)) {
      updateFilters({ roles: localFilters.roles.filter(r => r !== role) });
    } else {
      updateFilters({ roles: [...localFilters.roles, role] });
    }
  };
  
  // Toggle country selection
  const toggleCountry = (country: string) => {
    if (localFilters.countries.includes(country)) {
      updateFilters({ countries: localFilters.countries.filter(c => c !== country) });
    } else {
      updateFilters({ countries: [...localFilters.countries, country] });
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.roles.length + filters.countries.length + 
                     (filters.activityStatus !== 'all' ? 1 : 0) +
                     (filters.createdAfter !== null ? 1 : 0) +
                     (filters.createdBefore !== null ? 1 : 0) +
                     (filters.minLoginCount > 0 ? 1 : 0) +
                     (filters.hasCompletedProfile !== null ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                <h4 className="font-medium text-sm flex items-center justify-between">
                  <span>Advanced User Filters</span>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs flex items-center"
                      onClick={clearFilters}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Clear All
                    </Button>
                  )}
                </h4>
                
                <div>
                  <Label className="text-xs mb-2 flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1 opacity-70" />
                    User Role
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {Object.values(ROLE_DEFINITIONS).map((roleDef) => (
                      <div
                        key={roleDef.role}
                        onClick={() => toggleRole(roleDef.role)}
                        className={`text-xs px-2 py-1.5 rounded cursor-pointer flex items-center gap-1
                          ${localFilters.roles.includes(roleDef.role) 
                            ? 'bg-primary/20 border border-primary/30' 
                            : 'bg-muted/50 border border-transparent hover:border-primary/20'}
                        `}
                      >
                        {localFilters.roles.includes(roleDef.role) && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {roleDef.label}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-xs mb-2 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 opacity-70" />
                    Activity Status
                  </Label>
                  <Select
                    value={localFilters.activityStatus}
                    onValueChange={(value) => 
                      updateFilters({ activityStatus: value as 'all' | 'active' | 'inactive' | 'recent' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* More filters can be added here */}
                
                <div className="pt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{visibleUsers}</span> of <span className="font-medium">{totalUsers}</span> users
        </div>
      </div>
    </div>
  );
}
