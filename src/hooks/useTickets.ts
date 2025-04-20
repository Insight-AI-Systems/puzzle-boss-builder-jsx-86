
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type TicketStatus = 'WIP' | 'Completed' | 'In Review';

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
      // Type assertion to match Supabase's expected schema
      const ticketForDatabase = {
        ...ticket,
        status: ticket.status === 'In Review' ? 'WIP' : ticket.status // Convert 'In Review' to 'WIP' for storage
      } as any;

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
      // Type assertion to match Supabase's expected schema
      const updatesForDatabase = {
        ...updates,
        status: updates.status === 'In Review' ? 'WIP' : updates.status // Convert 'In Review' to 'WIP' for storage
      } as any;

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
