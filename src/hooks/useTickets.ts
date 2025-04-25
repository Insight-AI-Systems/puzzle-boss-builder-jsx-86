
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { openSupportsAPI } from '@/services/openSupportsAPI';
import { Ticket, TicketFilters, TicketStatus } from '@/types/ticketTypes';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_FILTERS: TicketFilters = {
  page: 1,
  limit: 10,
};

export function useTickets(initialFilters: Partial<TicketFilters> = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filters, setFilters] = useState<TicketFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // Fetch tickets based on filters
  const {
    data: tickets,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => openSupportsAPI.getTickets(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to create a new ticket
  const createTicket = useMutation({
    mutationFn: (newTicket: Partial<Ticket>) => 
      openSupportsAPI.createTicket(newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Ticket Created',
        description: 'Your support ticket has been submitted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Mutation to update ticket status
  const updateTicketStatus = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: TicketStatus }) =>
      openSupportsAPI.changeTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Status Updated',
        description: 'The ticket status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update ticket status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Polling for ticket updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, [refetch]);

  // Functions to update filters
  const updateFilters = (newFilters: Partial<TicketFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when changing filters other than page
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const nextPage = () => {
    setFilters(prev => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  const prevPage = () => {
    setFilters(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  };

  return {
    tickets,
    isLoading,
    isError,
    error,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    createTicket,
    updateTicketStatus,
    refetch,
  };
}
