
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/types/ticketTypes';
import { useToast } from '@/hooks/use-toast';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data);
    } catch (error: any) {
      toast({
        title: "Error fetching tickets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (title: string, description: string) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([{ 
          title, 
          description,
          type: 'external'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTickets(prev => [data, ...prev]);
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

  useEffect(() => {
    fetchTickets();
  }, []);

  return { tickets, isLoading, createTicket, fetchTickets };
}
