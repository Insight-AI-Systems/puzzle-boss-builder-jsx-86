
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseType } from '@/types/financeTypes';

interface ExpenseFiltersProps {
  searchTerm: string;
  expenseTypeFilter: ExpenseType | '';
  onSearchChange: (value: string) => void;
  onTypeChange: (value: ExpenseType | '') => void;
}

export const ExpenseFilters = ({
  searchTerm,
  expenseTypeFilter,
  onSearchChange,
  onTypeChange
}: ExpenseFiltersProps) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search expenses..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64"
      />
      <Select 
        value={expenseTypeFilter} 
        onValueChange={(value) => onTypeChange(value as ExpenseType | '')}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          <SelectItem value={ExpenseType.PRIZES}>Prizes</SelectItem>
          <SelectItem value={ExpenseType.OPERATIONAL}>Operational</SelectItem>
          <SelectItem value={ExpenseType.MARKETING}>Marketing</SelectItem>
          <SelectItem value={ExpenseType.COMMISSIONS}>Commissions</SelectItem>
          <SelectItem value={ExpenseType.OTHER}>Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
