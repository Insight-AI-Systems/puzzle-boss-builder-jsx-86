
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TicketStatus, TicketFilters as TTicketFilters } from '@/types/supportTicketTypes';

interface TicketFiltersProps {
  filters: Partial<TTicketFilters>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onStatusChange: (status: string | undefined) => void;
}

export const TicketFilters = ({
  filters,
  searchQuery,
  onSearchChange,
  onSearch,
  onStatusChange,
}: TicketFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
      <div className="flex items-center gap-2">
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={onSearch} className="flex gap-2">
        <Input 
          placeholder="Search tickets..." 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
