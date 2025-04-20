
import React from 'react';
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ROLE_DEFINITIONS, UserRole } from '@/types/userTypes';
import { DateRange } from 'react-day-picker';

interface UserTableFiltersProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
  onCountryChange: (country: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onRoleChange: (role: UserRole | null) => void;
  countries: string[];
  categories: string[];
  dateRange: DateRange | undefined;
}

export const UserTableFilters: React.FC<UserTableFiltersProps> = ({
  onDateRangeChange,
  onCountryChange,
  onCategoryChange,
  onRoleChange,
  countries,
  categories,
  dateRange,
}) => {
  return (
    <Card className="p-4 mb-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <CalendarDateRangePicker 
            date={dateRange}
            onChange={onDateRangeChange}
          />
        </div>
        
        <Select onValueChange={(value) => onCountryChange(value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={(value) => onCategoryChange(value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onRoleChange((value as UserRole) || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            {Object.values(ROLE_DEFINITIONS).map((roleDef) => (
              <SelectItem key={roleDef.role} value={roleDef.role}>
                {roleDef.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
