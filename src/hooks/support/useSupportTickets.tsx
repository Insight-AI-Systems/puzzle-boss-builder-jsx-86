
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupportTicket, TicketFilters, convertIssueToTicket } from "@/types/supportTicketTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useKnownIssues } from "@/hooks/issues";
import { knownIssues } from "@/data/knownIssues";
import { SUPPORT_SYSTEM_CONFIG } from "@/services/openSupportsConfig";

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { issues } = useKnownIssues();
  
  // Function to fetch user's tickets from Supabase
  const fetchTickets = useCallback(async (filters?: Partial<TicketFilters>) => {
    if (!user) {
      // Use known issues as sample tickets for development or non-authenticated users
      const sampleTickets = knownIssues.map(convertIssueToTicket);
      setTickets(sampleTickets);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('issues')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
          
      if (error) {
        console.error("Error fetching support tickets:", error);
        
        // Fallback to known issues for demonstration
        const fallbackTickets = knownIssues.map(convertIssueToTicket);
        setTickets(fallbackTickets);
        toast({
          title: "Failed to load your support tickets",
          description: "Using sample data instead. Please try refreshing.",
          variant: "destructive",
        });
        return;
      }
      
      // Map database issues to support tickets
      const userTickets = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status === 'wip' ? 'in-progress' : item.status === 'completed' ? 'resolved' : 'open',
        priority: item.category === 'security' ? 'high' : item.category === 'feature' ? 'low' : 'medium',
        category: 'tech',
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        comments: []
      } as SupportTicket));
      
      setTickets(userTickets);
    } catch (err) {
      console.error("Exception fetching tickets:", err);
      
      // Fallback to known issues for demonstration
      const fallbackTickets = knownIssues.map(convertIssueToTicket);
      setTickets(fallbackTickets);
      toast({
        title: "Failed to load your support tickets",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  // Add ticket function
  const addTicket = useCallback(async (newTicket: Partial<SupportTicket>): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to create a support ticket.",
          variant: "destructive",
        });
        return false;
      }

      // Prepare the ticket data for database insertion
      const ticketData = {
        id: newTicket.id || crypto.randomUUID(),
        title: newTicket.title,
        description: newTicket.description,
        status: 'open', // New tickets always start as open
        category: newTicket.category || 'tech',
        created_by: user.id,
        modified_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('issues')
        .insert(ticketData);

      if (error) {
        console.error("Error adding ticket:", error);
        toast({
          title: "Ticket Creation Failed",
          description: `Could not create the ticket: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      // Refresh the tickets list
      await fetchTickets();
      
      toast({
        title: "Ticket Created",
        description: `Your support ticket has been submitted successfully.`,
      });
      
      return true;
    } catch (err) {
      console.error("Error adding ticket:", err);
      toast({
        title: "Ticket Creation Failed",
        description: "An unexpected error occurred while creating your ticket.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, fetchTickets, user]);

  // Add comment to ticket
  const addComment = useCallback(async (ticketId: string, content: string): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to add a comment.",
          variant: "destructive",
        });
        return false;
      }

      // For now, we'll just update the ticket's description to include the comment
      // In a real implementation, you'd add to a comments table
      const { error } = await supabase
        .from('issues')
        .update({
          description: supabase.rpc('append_comment', { 
            original_text: tickets.find(t => t.id === ticketId)?.description || '',
            comment_text: `\n\nComment (${new Date().toLocaleString()}):\n${content}`
          }),
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) {
        console.error("Error adding comment:", error);
        toast({
          title: "Comment Failed",
          description: `Could not add your comment: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      // Refresh the tickets to show the updated comment
      await fetchTickets();
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the ticket.",
      });
      
      return true;
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({
        title: "Comment Failed",
        description: "An unexpected error occurred while adding your comment.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, fetchTickets, user, tickets]);

  // Automatically fetch tickets when the component mounts
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    addTicket,
    addComment
  };
};
