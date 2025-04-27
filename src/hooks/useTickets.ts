
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, TicketType, TicketStatus, TicketFilters } from '@/types/ticketTypes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_PAGE_SIZE = 10;

export function useTickets(initialFilters?: Partial<TicketFilters>) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    ...initialFilters
  });

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      let query = supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query
        .range((filters.page - 1) * filters.limit, filters.page * filters.limit - 1);

      if (error) throw error;

      setTickets(data as Ticket[]);
    } catch (error: any) {
      setIsError(true);
      toast({
        title: "Error fetching tickets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (title: string, description: string, type: TicketType = 'external') => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          title,
          description,
          type,
          created_by: user.id,
          status: 'open' as TicketStatus,
        })
        .select()
        .single();

      if (error) throw error;
      
      setTickets(prev => [data as Ticket, ...prev]);
      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error creating ticket",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;

      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));

      toast({
        title: "Success",
        description: "Ticket status updated",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating ticket",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<TicketFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const nextPage = () => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const prevPage = () => {
    setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  return {
    tickets,
    isLoading,
    isError,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    createTicket,
    updateTicketStatus,
    refetch: fetchTickets
  };
}
