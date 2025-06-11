
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface UserFiltersProps {
  filterType: 'regular' | 'admin';
  setFilterType: (type: 'regular' | 'admin') => void;
  availableCountries: string[];
}

export function UserFilters({ filterType, setFilterType, availableCountries }: UserFiltersProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">View:</span>
      </div>
      
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select user type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="regular">Regular Users</SelectItem>
          <SelectItem value="admin">Admin Users</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
