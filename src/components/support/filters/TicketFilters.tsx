
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketPriority, TicketStatus } from '@/types/ticketTypes';

interface TicketFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export const TicketFilters = ({
  searchInput,
  onSearchChange,
  onSearchSubmit,
  onStatusChange,
  onPriorityChange,
}: TicketFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <form onSubmit={onSearchSubmit} className="flex items-center space-x-2">
        <Input
          placeholder="Search tickets..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
      
      <Select onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
