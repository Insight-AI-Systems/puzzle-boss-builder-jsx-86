import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, TicketType, TicketStatus, TicketFilters, TicketPriority, TicketComment } from '@/types/ticketTypes';
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
        const dbStatus = filters.status === 'pending' ? 'open' : filters.status;
        query = query.eq('status', dbStatus);
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

      const transformedTickets = data.map(item => {
        const typedComments: TicketComment[] = Array.isArray(item.comments) 
          ? item.comments.map((comment: any) => ({
              id: comment.id || `comment-${Math.random().toString(36).substr(2, 9)}`,
              author: comment.author || comment.created_by || 'Unknown',
              content: comment.content || '',
              timestamp: comment.timestamp || comment.created_at || new Date().toISOString(),
              is_staff: comment.is_staff,
              created_by: comment.created_by,
              created_at: comment.created_at
            }))
          : [];

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type as TicketType,
          status: item.status as TicketStatus,
          priority: 'medium' as TicketPriority,
          created_by: item.created_by,
          assigned_to: item.assigned_to,
          comments: typedComments,
          created_at: item.created_at,
          updated_at: item.updated_at,
          userEmail: 'user@example.com',
          date: item.created_at
        } as Ticket;
      });

      setTickets(transformedTickets);
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
      const ticketData = {
        title,
        description,
        type,
        created_by: user.id,
        member_id: user.id, // Add required member_id field
        status: 'open' as const,
        priority: 'medium' as TicketPriority,
        comments: []
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select()
        .single();

      if (error) throw error;
      
      const newTicket: Ticket = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        priority: 'medium',
        created_by: data.created_by,
        assigned_to: data.assigned_to,
        comments: Array.isArray(data.comments) 
          ? data.comments.map((c: any) => ({
              id: c.id || `comment-${Math.random().toString(36).substr(2, 9)}`,
              author: c.author || c.created_by || 'Unknown',
              content: c.content || '',
              timestamp: c.timestamp || c.created_at || new Date().toISOString(),
              created_by: c.created_by,
              created_at: c.created_at
            }))
          : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setTickets(prev => [newTicket, ...prev]);
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
      const dbStatus = newStatus === 'pending' ? 'open' : newStatus;
      
      const { error } = await supabase
        .from('tickets')
        .update({ status: dbStatus })
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
