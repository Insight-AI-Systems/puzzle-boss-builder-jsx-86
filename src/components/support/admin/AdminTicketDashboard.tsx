
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { TicketFilters } from '@/components/support/ticket-list/TicketFilters';
import { TicketTable } from '@/components/support/ticket-list/TicketTable';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export const AdminTicketDashboard = () => {
  const { tickets, isLoading, fetchTickets, isAdmin, updateTicketStatus } = useSupportTickets();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const isSuperAdmin = hasRole('super_admin');

  const handleStatusChange = (status: string | undefined) => {
    fetchTickets({ status: status as any });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets({ search: searchQuery });
  };

  const goToTicketDetail = (ticketId: string) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!isSuperAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        const tableName = 'tickets';
        
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', ticketId);
          
        if (error) throw error;
        
        toast({
          title: "Ticket deleted",
          description: "The ticket has been permanently deleted.",
        });
        
        fetchTickets();
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

  return (
    <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
      <CardHeader>
        <CardTitle>Support Ticket Management</CardTitle>
      </CardHeader>
      <CardContent>
        <TicketFilters
          filters={{}}
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
              No tickets found.
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
