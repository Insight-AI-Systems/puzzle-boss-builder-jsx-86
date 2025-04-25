import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { Search, AlertCircle, Clock, CheckCircle, Filter, ShieldAlert, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Badge } from '@/components/ui/badge';

export const TicketList = () => {
  const { tickets, isLoading, fetchTickets, isAdmin } = useSupportTickets();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const isInternalView = searchParams.get('view') === 'internal';
  
  const [filters, setFilters] = useState<Partial<TicketFilters>>({
    page: 1,
    limit: 10
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchTickets(filters, isInternalView);
    }
  }, [fetchTickets, user, isInternalView, filters]);

  const handleStatusChange = (status: string | undefined) => {
    if (status === "all") {
      const { status, ...restFilters } = filters;
      setFilters({
        ...restFilters,
        page: 1
      });
    } else {
      setFilters({
        ...filters,
        status: status as TicketStatus,
        page: 1
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ...filters,
      search: searchQuery,
      page: 1
    });
  };

  const goToTicketDetail = (ticketId: string) => {
    navigate(`/support/tickets/${ticketId}${isInternalView ? '?view=internal' : ''}`);
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
      case 'pending':
        return (
          <div className="flex items-center gap-1 rounded-full bg-orange-100 text-orange-800 px-2 py-1 text-xs">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
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

  const switchToTicketView = (internalView: boolean) => {
    navigate(internalView ? '/support/tickets?view=internal' : '/support/tickets');
  };

  const getTicketSourceInfo = (ticket: any) => {
    if (ticket.category === 'migrated') {
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Migrated</Badge>;
    }
    return null;
  };

  const { hasRole } = useAuth();
  const { toast } = useToast();
  const isSuperAdmin = hasRole('super_admin');
  
  const handleDeleteTicket = async (ticketId: string) => {
    if (!isSuperAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        await supabase
          .from('issues')
          .delete()
          .eq('id', ticketId);
          
        toast({
          title: "Ticket deleted",
          description: "The ticket has been permanently deleted.",
        });
        
        // Refresh the tickets list
        fetchTickets(filters, isInternalView);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the ticket. Please try again.",
          variant: "destructive",
        });
      }
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
              Please log in to view support tickets.
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {isAdmin && isInternalView ? (
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <span>Internal Issues</span>
            </div>
          ) : (
            "Support Tickets"
          )}
        </CardTitle>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Badge
              variant={isInternalView ? "outline" : "secondary"}
              className="cursor-pointer"
              onClick={() => switchToTicketView(false)}
            >
              User Tickets
            </Badge>
            <Badge
              variant={isInternalView ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => switchToTicketView(true)}
            >
              Internal Issues
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="flex items-center gap-2">
            <Select onValueChange={handleStatusChange}>
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
            <p>Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">No tickets found.</p>
            <Button onClick={() => navigate('/support/new-ticket')}>
              Create {isInternalView ? "Internal Issue" : "Support Ticket"}
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-puzzle-aqua/20">
                <TableHead className="text-puzzle-aqua">Ticket</TableHead>
                <TableHead className="text-puzzle-aqua">Status</TableHead>
                <TableHead className="text-puzzle-aqua">Source</TableHead>
                <TableHead className="text-puzzle-aqua">Created</TableHead>
                <TableHead className="text-puzzle-aqua">Last Update</TableHead>
                {isSuperAdmin && <TableHead className="text-puzzle-aqua">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  className="border-puzzle-aqua/20 hover:bg-puzzle-aqua/5 cursor-pointer"
                >
                  <TableCell 
                    onClick={() => goToTicketDetail(ticket.id)}
                    className="font-medium"
                  >
                    <div>
                      <div className="text-puzzle-white">{ticket.title}</div>
                      <div className="text-sm text-puzzle-white/60 truncate max-w-[300px]">
                        {ticket.description.split('\n')[0]}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => goToTicketDetail(ticket.id)}>
                    {getStatusBadge(ticket.status)}
                  </TableCell>
                  <TableCell onClick={() => goToTicketDetail(ticket.id)}>
                    {getTicketSourceInfo(ticket)}
                  </TableCell>
                  <TableCell onClick={() => goToTicketDetail(ticket.id)}>
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell onClick={() => goToTicketDetail(ticket.id)}>
                    {ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="w-[100px]">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTicket(ticket.id);
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
