
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupportTicket, TicketFilters, TicketComment, TicketStatus } from "@/types/supportTicketTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { mapFrontendStatusToDb, DbStatus, mapDbStatusToFrontend } from "@/utils/support/mappings";

export const useFetchTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  
  const fetchTickets = useCallback(async (filters?: Partial<TicketFilters>, isInternalView?: boolean) => {
    // Reset error state at the start of each fetch
    setHasError(false);
    
    if (!user) {
      setTickets([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      let allTickets: SupportTicket[] = [];
      
      // Logic for fetching internal issues (from issues table)
      if (isInternalView && isAdmin) {
        const { data: issuesData, error: issuesError } = await supabase
          .from('issues')
          .select('*')
          .eq('category', 'internal')
          .order('created_at', { ascending: false });
          
        if (issuesError) {
          console.error("Error fetching internal issues:", issuesError);
          throw issuesError;
        }
        
        // Map issues data to SupportTicket format
        const mappedIssues = issuesData.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: mapDbStatusToFrontend(item.status),
          priority: (item.category === 'security' ? 'high' : 
                    item.category === 'feature' ? 'low' : 'medium'),
          category: 'internal',
          created_at: item.created_at,
          updated_at: item.updated_at,
          created_by: item.created_by,
          comments: []
        } as SupportTicket));
        
        allTickets = mappedIssues;
      } 
      // Logic for fetching regular user tickets (from tickets table)
      else {
        const ticketsQuery = supabase
          .from('tickets')
          .select('*');
        
        if (isAdmin) {
          // Admin can see all user tickets
          ticketsQuery.order('created_at', { ascending: false });
        } else {
          // Regular users can only see their own tickets
          ticketsQuery
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });
        }
        
        // Apply filters if provided
        if (filters?.status) {
          // Type assertion for database query
          ticketsQuery.eq('status', filters.status === 'pending' ? 'deferred' as any : filters.status as any);
        }
        
        if (filters?.search) {
          ticketsQuery.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        
        const { data: ticketsData, error: ticketsError } = await ticketsQuery;
        
        if (ticketsError) {
          console.error("Error fetching user tickets:", ticketsError);
          throw ticketsError;
        }
        
        // Map tickets data to SupportTicket format
        const mappedTickets = ticketsData.map(item => {
          // Ensure comments is treated as an array
          let comments: TicketComment[] = [];
          
          // Parse comments if they exist and are in the correct format
          if (item.comments && Array.isArray(item.comments)) {
            comments = item.comments.map((comment: any) => ({
              id: comment.id || crypto.randomUUID(),
              ticket_id: item.id,
              content: comment.content,
              created_by: comment.created_by,
              created_at: comment.created_at || new Date().toISOString(),
              is_staff: comment.is_staff
            }));
          }
          
          // Map database status to frontend status
          const ticketStatus = mapDbStatusToFrontend(item.status);
          
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            status: ticketStatus,
            priority: 'medium',
            category: 'tech',
            created_at: item.created_at,
            updated_at: item.updated_at,
            created_by: item.created_by,
            comments: comments
          } as SupportTicket;
        });
        
        allTickets = mappedTickets;
      }
      
      setTickets(allTickets);
    } catch (err) {
      console.error("Exception fetching tickets:", err);
      // Only show toast if we haven't already flagged an error for this fetch attempt
      if (!hasError) {
        setHasError(true);
        toast({
          title: "Failed to load support tickets",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      }
      setTickets([]);
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
