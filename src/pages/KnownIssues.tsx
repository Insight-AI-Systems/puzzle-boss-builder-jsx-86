
import React, { useState } from 'react';
import { TicketList } from '@/components/admin/tickets/TicketList';
import { TicketForm } from '@/components/admin/tickets/TicketForm';
import { useTickets, TicketStatus } from '@/hooks/useTickets';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const KnownIssues = () => {
  const { user } = useAuth();
  const { tickets, isLoadingTickets, createTicket, updateTicket } = useTickets();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateTicket = (values: { heading: string; description: string; status: TicketStatus }) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a ticket",
        variant: "destructive"
      });
      return;
    }

    createTicket.mutate(
      {
        ...values,
        created_by: user.id
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Ticket created successfully",
          });
          setIsFormOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to create ticket: ${error.message}`,
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleUpdateTicket = (id: string, updates: Partial<typeof tickets[0]>) => {
    updateTicket.mutate(
      { id, ...updates },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Ticket updated successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update ticket: ${error.message}`,
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Known Issues</h1>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isFormOpen ? 'Cancel' : 'Add New Issue'}
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Issue</h2>
          <TicketForm onSubmit={handleCreateTicket} />
        </div>
      )}

      <TicketList 
        tickets={tickets || []} 
        isLoading={isLoadingTickets} 
        onUpdateStatus={(id, status) => {
          handleUpdateTicket(id, { status });
        }}
        onUpdateTicket={handleUpdateTicket}
      />
    </div>
  );
};

export default KnownIssues;
