
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTickets } from '@/hooks/useTickets';
import { TicketStatus, TicketPriority } from '@/types/ticketTypes';
import { Search, MessageSquare, RefreshCw } from 'lucide-react';

// Helper to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Status badge component
const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const badgeVariant = 
    status === 'open' ? 'default' :
    status === 'pending' ? 'outline' :
    status === 'resolved' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant}>{status}</Badge>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const badgeVariant = 
    priority === 'low' ? 'outline' :
    priority === 'medium' ? 'default' :
    priority === 'high' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant}>{priority}</Badge>
  );
};

export default function TicketList() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  
  const {
    tickets,
    isLoading,
    isError,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    refetch
  } = useTickets();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  const handleStatusChange = (status: TicketStatus | undefined) => {
    updateFilters({ status, page: 1 });
  };

  const handlePriorityChange = (priority: TicketPriority | undefined) => {
    updateFilters({ priority, page: 1 });
  };

  const handleRowClick = (ticketId: string) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-2">
        <h2 className="text-xl font-bold">Support Tickets</h2>
        
        <div className="flex items-center space-x-2">
          <Button onClick={() => refetch()} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate('/support/new-ticket')} variant="default">
            <MessageSquare className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          <Input
            placeholder="Search tickets..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        {/* Status filter */}
        <Select onValueChange={(value) => handleStatusChange(value as TicketStatus || undefined)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Priority filter */}
        <Select onValueChange={(value) => handlePriorityChange(value as TicketPriority || undefined)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <RefreshCw className="h-6 w-6 animate-spin text-puzzle-aqua" />
        </div>
      ) : isError ? (
        <div className="p-6 text-center border border-destructive rounded-md">
          <p>Failed to load tickets. Please try again later.</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-2">
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets?.length > 0 ? (
                  tickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(ticket.id)}
                    >
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>{formatDate(ticket.date)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No tickets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Page {filters.page} • Showing {tickets?.length || 0} tickets
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={filters.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!tickets || tickets.length < filters.limit}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
