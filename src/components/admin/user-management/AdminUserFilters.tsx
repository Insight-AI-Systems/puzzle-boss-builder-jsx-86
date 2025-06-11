
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Search, RefreshCw, Filter, ArrowUpDown } from "lucide-react";
import { UserRole } from '@/types/userTypes';
import { DateRange } from 'react-day-picker';

interface AdminUserFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  roleFilter: UserRole | 'all';
  onRoleFilterChange: (role: UserRole | 'all') => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
  dateRange?: DateRange;
  onDateRangeChange: (range?: DateRange) => void;
  sortBy: 'name' | 'email' | 'role' | 'created_at' | 'last_sign_in';
  onSortByChange: (sortBy: 'name' | 'email' | 'role' | 'created_at' | 'last_sign_in') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  availableCountries: string[];
  availableRoles: string[];
  onRefresh: () => void;
}

export const AdminUserFilters: React.FC<AdminUserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onRefresh
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="category_manager">Category Manager</SelectItem>
              <SelectItem value="social_media_manager">Social Media Manager</SelectItem>
              <SelectItem value="partner_manager">Partner Manager</SelectItem>
              <SelectItem value="cfo">CFO</SelectItem>
              <SelectItem value="player">Player</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active (30 days)</SelectItem>
              <SelectItem value="inactive">Inactive (30+ days)</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="created_at">Created Date</SelectItem>
                <SelectItem value="last_sign_in">Last Sign In</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* Date Range */}
          <div className="flex-1">
            <CalendarDateRangePicker
              date={dateRange}
              onDateChange={onDateRangeChange}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
