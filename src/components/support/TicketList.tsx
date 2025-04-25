
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
import { Button } from '@/components/ui/button';
import { useTickets } from '@/hooks/useTickets';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { TicketFilters } from './filters/TicketFilters';
import { TicketTableRow } from './table/TicketTableRow';
import { TicketStatus, TicketPriority } from '@/types/ticketTypes';

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

  const handleStatusChange = (status: string) => {
    // Only pass defined TicketStatus values to updateFilters
    // Using "all" as a special case to clear the filter
    updateFilters({ 
      status: status === 'all' ? undefined : status as TicketStatus, 
      page: 1 
    });
  };

  const handlePriorityChange = (priority: string) => {
    // Only pass defined TicketPriority values to updateFilters
    // Using "all" as a special case to clear the filter
    updateFilters({ 
      priority: priority === 'all' ? undefined : priority as TicketPriority, 
      page: 1 
    });
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
      
      <TicketFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />
      
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
                    <TicketTableRow
                      key={ticket.id}
                      ticket={ticket}
                      onClick={handleRowClick}
                    />
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
