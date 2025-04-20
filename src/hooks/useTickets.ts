
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Ticket {
  id: string;
  heading: string;
  description: string;
  status: 'WIP' | 'Completed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useTickets() {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ticket[];
    }
  });

  const createTicket = useMutation({
    mutationFn: async (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticket)
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
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
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
