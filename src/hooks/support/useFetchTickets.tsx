
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupportTicket, TicketFilters } from "@/types/supportTicketTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { mapFrontendStatusToDb, DbStatus, mapDbStatusToFrontend } from "@/utils/support/mappings";

export const useFetchTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  
  const fetchTickets = useCallback(async (filters?: Partial<TicketFilters>, isInternalView?: boolean) => {
    if (!user) {
      setTickets([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('issues')
        .select('*');

      // If admin is viewing internal issues
      if (isAdmin && isInternalView) {
        // Only fetch tickets with 'internal' category for admin internal view
        query = query
          .eq('category', 'internal')
          .order('created_at', { ascending: false });
          
        console.log('Fetching internal tickets for admin');
      } else {
        // Standard view - user's own tickets, excluding internal ones
        query = query
          .eq('created_by', user.id)
          .neq('category', 'internal')
          .order('created_at', { ascending: false });
          
        console.log('Fetching user tickets');
      }
      
      // Apply additional filters if provided
      if (filters?.status) {
        const dbStatus: DbStatus = mapFrontendStatusToDb(filters.status);
        query = query.eq('status', dbStatus);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
          
      if (error) {
        console.error("Error fetching support tickets:", error);
        setTickets([]);
        toast({
          title: "Failed to load support tickets",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
        return;
      }
      
      const userTickets = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: mapDbStatusToFrontend(item.status),
        priority: item.category === 'security' ? 'high' : item.category === 'feature' ? 'low' : 'medium',
        category: item.category || 'tech',
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        comments: []
      } as SupportTicket));
      
      setTickets(userTickets);
    } catch (err) {
      console.error("Exception fetching tickets:", err);
      toast({
        title: "Failed to load support tickets",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user, isAdmin, hasRole]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    isAdmin
  };
};
