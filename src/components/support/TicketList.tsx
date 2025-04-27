
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { TicketStatus, TicketFilters } from '@/types/supportTicketTypes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { TicketFilters as TicketFilterComponent } from './ticket-list/TicketFilters';
import { TicketTable } from './ticket-list/TicketTable';

export const TicketList = () => {
  const { tickets, isLoading, fetchTickets, isAdmin } = useSupportTickets();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const isInternalView = searchParams.get('view') === 'internal';
  const { toast } = useToast();
  const isSuperAdmin = hasRole('super_admin');
  
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
      const { status: _, ...restFilters } = filters;
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

  const handleDeleteTicket = async (ticketId: string) => {
    if (!isSuperAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        const tableName = isInternalView ? 'issues' : 'tickets';
        
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', ticketId);
          
        if (error) throw error;
        
        toast({
          title: "Ticket deleted",
          description: "The ticket has been permanently deleted.",
        });
        
        fetchTickets(filters, isInternalView);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to delete the ticket. Please try again.",
          variant: "destructive",
        });
        console.error("Delete ticket error:", error);
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
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Internal Issues</span>
            </div>
          ) : (
            "Support Tickets"
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TicketFilterComponent
          filters={filters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
        />

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-puzzle-white/70">
              No {isInternalView ? 'internal issues' : 'support tickets'} found.
              Please use the {isInternalView ? '"Create Internal Ticket"' : '"New Support Ticket"'} button at the top of the page to create one.
            </p>
          </div>
        ) : (
          <TicketTable
            tickets={tickets}
            isSuperAdmin={isSuperAdmin}
            onTicketClick={goToTicketDetail}
            onDeleteTicket={handleDeleteTicket}
          />
        )}
      </CardContent>
    </Card>
  );
};
