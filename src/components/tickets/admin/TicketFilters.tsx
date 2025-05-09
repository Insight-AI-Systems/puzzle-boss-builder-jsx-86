
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TicketStatus, TicketType } from '@/types/ticketTypes';
import type { TicketFilters as TicketFiltersType } from '@/types/ticketTypes';
import { Search, Filter } from 'lucide-react';

interface TicketFiltersProps {
  filters: TicketFiltersType;
  onUpdateFilters: (filters: Partial<TicketFiltersType>) => void;
  onSearch: (e: React.FormEvent) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function TicketFilters({
  filters,
  onUpdateFilters,
  onSearch,
  searchQuery,
  onSearchChange,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 gap-4">
      <form onSubmit={onSearch} className="flex w-full md:w-1/3 space-x-2">
        <Input
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" size="icon" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      <div className="flex items-center space-x-2">
        <Select 
          value={filters.status || ''} 
          onValueChange={(value) => onUpdateFilters({ status: value as TicketStatus })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.type || ''} 
          onValueChange={(value) => onUpdateFilters({ type: value as TicketType })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="external">External</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onUpdateFilters({ status: undefined, type: undefined })}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
