
import React from 'react';
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ROLE_DEFINITIONS, UserRole } from '@/types/userTypes';
import { DateRange } from 'react-day-picker';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface UserTableFiltersProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
  onCountryChange: (country: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onRoleChange: (role: string | null) => void;
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
  const [isOpen, setIsOpen] = React.useState(false);

  // Count active filters
  const activeFilterCount = [
    dateRange?.from || dateRange?.to,
    countries.length > 0,
    categories.length > 0
  ].filter(Boolean).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex justify-between items-center mb-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Card className="p-4 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Date Range</p>
              <CalendarDateRangePicker 
                date={dateRange}
                onDateChange={onDateRangeChange}
              />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Country</p>
              <Select onValueChange={(value) => onCountryChange(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_countries">All Countries</SelectItem>
                  {countries.length > 0 ? (
                    countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_countries" disabled>No countries available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              <Select onValueChange={(value) => onCategoryChange(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_categories">All Categories</SelectItem>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_categories" disabled>No categories available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Role</p>
              <Select onValueChange={(value) => onRoleChange(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_roles">All Roles</SelectItem>
                  {Object.values(ROLE_DEFINITIONS).map((roleDef) => (
                    <SelectItem key={roleDef.role} value={roleDef.role}>
                      {roleDef.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
