
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
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { TicketStatus, TicketFilters } from '@/types/supportTicketTypes';
import { Search, AlertCircle, Clock, CheckCircle, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const TicketList = () => {
  const { tickets, isLoading, fetchTickets } = useSupportTickets();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState<Partial<TicketFilters>>({
    page: 1,
    limit: 10
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (status: string | undefined) => {
    const newFilters = {
      ...filters,
      status: status as TicketStatus | undefined,
      page: 1 // Reset to first page on filter change
    };
    setFilters(newFilters);
    fetchTickets(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = {
      ...filters,
      search: searchQuery,
      page: 1 // Reset to first page on search
    };
    setFilters(newFilters);
    fetchTickets(newFilters);
  };

  const goToTicketDetail = (ticketId: string) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-1 text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>Open</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </div>
        );
      case 'resolved':
      case 'closed':
        return (
          <div className="flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs">
            <CheckCircle className="h-3 w-3" />
            <span>Resolved</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-800 px-2 py-1 text-xs">
            <span>Unknown</span>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-puzzle-aqua mb-4" />
            <h3 className="text-xl font-medium mb-2">Authentication Required</h3>
            <p className="text-puzzle-white/70 mb-6">
              Please log in to view your support tickets.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
      <CardHeader>
        <CardTitle>My Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="flex items-center gap-2">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="Search tickets..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading your tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">You don't have any support tickets yet.</p>
            <Button onClick={() => navigate('/support/new-ticket')}>
              Create Your First Ticket
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-puzzle-aqua/20">
                <TableHead className="text-puzzle-aqua">Ticket</TableHead>
                <TableHead className="text-puzzle-aqua">Status</TableHead>
                <TableHead className="text-puzzle-aqua">Created</TableHead>
                <TableHead className="text-puzzle-aqua">Last Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  onClick={() => goToTicketDetail(ticket.id)}
                  className="border-puzzle-aqua/20 hover:bg-puzzle-aqua/5 cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div>
                      <div className="text-puzzle-white">{ticket.title}</div>
                      <div className="text-sm text-puzzle-white/60 truncate max-w-[300px]">
                        {ticket.description.split('\n')[0]}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
