
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/hooks/useTickets';
import { TicketForm } from '@/components/admin/tickets/TicketForm';
import { TicketList } from '@/components/admin/tickets/TicketList';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layouts/PageLayout';

const KnownIssues = () => {
  const { isAdmin, user } = useAuth();
  const { tickets, isLoadingTickets, createTicket, updateTicket } = useTickets();
  const { toast } = useToast();

  if (!isAdmin) {
    return (
      <PageLayout title="Unauthorized">
        <p className="text-center text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </PageLayout>
    );
  }

  const handleCreateTicket = async (values: {
    heading: string;
    description: string;
    status: 'WIP' | 'Completed';
  }) => {
    try {
      await createTicket.mutateAsync(values);
      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: 'WIP' | 'Completed') => {
    try {
      await updateTicket.mutateAsync({ id, status });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout 
      title="Known Issues" 
      subtitle="Track and manage system issues"
      className="space-y-8"
    >
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Create New Ticket</h2>
        <TicketForm 
          onSubmit={handleCreateTicket} 
          isSubmitting={createTicket.isPending} 
        />
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">All Tickets</h2>
        {isLoadingTickets ? (
          <p>Loading tickets...</p>
        ) : (
          <TicketList 
            tickets={tickets || []} 
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default KnownIssues;
