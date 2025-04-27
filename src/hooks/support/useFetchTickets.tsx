
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
    setHasError(false);
    
    if (!user) {
      setTickets([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      let allTickets: SupportTicket[] = [];
      
      if (isInternalView && isAdmin) {
        // For issues table, fetch the issues first
        const { data: issuesData, error: issuesError } = await supabase
          .from('issues')
          .select(`
            id, title, description, status, category, created_at, updated_at, created_by
          `)
          .eq('category', 'internal')
          .order('created_at', { ascending: false });
          
        if (issuesError) {
          console.error("Error fetching internal issues:", issuesError);
          throw issuesError;
        }
        
        if (!issuesData || issuesData.length === 0) {
          allTickets = [];
        } else {
          // Get the unique creator IDs from the issues
          const creatorIds = [...new Set(issuesData.map(item => item.created_by))];
          
          // Fetch profiles for those creators in a separate query
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email')
            .in('id', creatorIds);
            
          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
            throw profilesError;
          }
          
          // Create a map of user IDs to emails for quick lookup
          const userEmailMap = new Map();
          profilesData?.forEach(profile => {
            userEmailMap.set(profile.id, profile.email);
          });
          
          const mappedIssues = issuesData.map(item => {
            // Look up the email using the created_by ID
            const creatorEmail = userEmailMap.get(item.created_by) || 'Unknown';
            
            return {
              id: item.id,
              title: item.title,
              description: item.description,
              status: mapDbStatusToFrontend(item.status),
              priority: (item.category === 'security' ? 'high' : 
                        item.category === 'feature' ? 'low' : 'medium'),
              category: 'internal',
              created_at: item.created_at,
              updated_at: item.updated_at,
              created_by: creatorEmail,
              comments: []
            } as SupportTicket;
          });
          
          allTickets = mappedIssues;
        }
      } 
      else {
        // For tickets table, using the same approach
        const ticketsQuery = supabase
          .from('tickets')
          .select(`
            id, title, description, status, created_at, updated_at, created_by, comments
          `);
        
        if (isAdmin) {
          ticketsQuery.order('created_at', { ascending: false });
        } else {
          ticketsQuery
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });
        }
        
        if (filters?.status) {
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
        
        if (!ticketsData || ticketsData.length === 0) {
          allTickets = [];
        } else {
          // Get unique creator IDs from tickets
          const creatorIds = [...new Set(ticketsData.map(item => item.created_by))];
          
          // Fetch profiles for those creators
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email')
            .in('id', creatorIds);
            
          if (profilesError) {
            console.error("Error fetching profiles for tickets:", profilesError);
            throw profilesError;
          }
          
          // Create a map of user IDs to emails
          const userEmailMap = new Map();
          profilesData?.forEach(profile => {
            userEmailMap.set(profile.id, profile.email);
          });
        
          const mappedTickets = ticketsData.map(item => {
            let comments: TicketComment[] = [];
            
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
            
            const ticketStatus = mapDbStatusToFrontend(item.status);
            
            // Look up the email using the created_by ID
            const creatorEmail = userEmailMap.get(item.created_by) || 'Unknown';
            
            return {
              id: item.id,
              title: item.title,
              description: item.description,
              status: ticketStatus,
              priority: 'medium',
              category: 'tech',
              created_at: item.created_at,
              updated_at: item.updated_at,
              created_by: creatorEmail,
              comments: comments
            } as SupportTicket;
          });
          
          allTickets = mappedTickets;
        }
      }
      
      setTickets(allTickets);
    } catch (err) {
      console.error("Exception fetching tickets:", err);
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
