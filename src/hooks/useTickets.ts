
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define the possible UI statuses, which may differ from DB statuses
export type TicketStatus = 'WIP' | 'Completed' | 'In Review';

// Define the possible DB statuses (based on Supabase enum)
export type DBTicketStatus = 'WIP' | 'Completed';

export interface Ticket {
  id: string;
  heading: string;
  description: string;
  status: TicketStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  createdByUser?: {
    username: string;
  };
}

// Utility function to convert UI status to DB status
export const uiStatusToDbStatus = (status: TicketStatus): DBTicketStatus => {
  return status === 'In Review' ? 'WIP' : status;
};

// Utility function to convert DB status to UI status
// This would need custom logic if you want to show "In Review" for some WIP tickets
export const dbStatusToUiStatus = (status: DBTicketStatus): TicketStatus => {
  return status as TicketStatus;
};

export function useTickets() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: tickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*, profiles:created_by(username)')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      return ticketsData.map((ticket: any) => ({
        ...ticket,
        createdByUser: ticket.profiles
      }));
    }
  });

  const createTicket = useMutation({
    mutationFn: async (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
      // Convert UI status to DB status
      const ticketForDatabase = {
        ...ticket,
        status: uiStatusToDbStatus(ticket.status)
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert(ticketForDatabase)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ticket> & { id: string }) => {
      // Convert UI status to DB status if status is being updated
      const updatesForDatabase = {
        ...updates,
        status: updates.status ? uiStatusToDbStatus(updates.status) : undefined
      };

      const { data, error } = await supabase
        .from('tickets')
        .update(updatesForDatabase)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  return {
    tickets,
    isLoadingTickets,
    createTicket,
    updateTicket
  };
}
