
import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTickets() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('member_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTickets(data || []);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast({
          title: "Error",
          description: "Failed to fetch tickets.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user, toast]);

  return { tickets, isLoading };
}
