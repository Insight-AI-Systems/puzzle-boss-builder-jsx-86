
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
  availableCountries: string[];
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filterType,
  setFilterType,
  availableCountries
}) => {
  return (
    <div className="flex gap-2">
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="admin">Admins</SelectItem>
          <SelectItem value="player">Players</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
