
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupportTicket, TicketFilters } from "@/types/supportTicketTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { mapFrontendStatusToDb, mapDbStatusToFrontend, DbStatus } from "@/utils/support/mappings";

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  
  // Function to fetch user's tickets from Supabase
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
        query = query
          .eq('category', 'internal')
          .order('created_at', { ascending: false });
      } 
      // Regular user view or admin viewing user tickets
      else {
        query = query
          .eq('created_by', user.id)
          .neq('category', 'internal')
          .order('created_at', { ascending: false });
      }
      
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
      
      // Map database issues to support tickets
      const userTickets = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: mapDbStatusToFrontend(item.status) as any,
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

      // Determine if this is an internal ticket based on category
      const isInternalTicket = newTicket.category === 'internal';
      
      // Only admins can create internal tickets
      if (isInternalTicket && !isAdmin) {
        toast({
          title: "Permission Denied",
          description: "You do not have permission to create internal tickets.",
          variant: "destructive",
        });
        return false;
      }

      // Convert frontend status to database status using mapping function
      const dbStatus: DbStatus = mapFrontendStatusToDb(newTicket.status as string || 'open');

      // Prepare the ticket data for database insertion
      const ticketData = {
        id: newTicket.id || crypto.randomUUID(),
        title: newTicket.title,
        description: newTicket.description,
        status: dbStatus,
        category: isInternalTicket ? 'internal' : 
                 newTicket.category === 'tech' ? 'bug' : 
                 newTicket.category === 'billing' ? 'feature' : 
                 'ui',
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
      await fetchTickets({}, isInternalTicket);
      
      toast({
        title: "Ticket Created",
        description: `Your ${isInternalTicket ? 'internal issue' : 'support ticket'} has been submitted successfully.`,
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
  }, [toast, fetchTickets, user, isAdmin]);

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
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        toast({
          title: "Comment Failed",
          description: "Could not find the ticket to comment on.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check permissions - only ticket creator or admin can comment on a ticket
      if (ticket.created_by !== user.id && !isAdmin) {
        toast({
          title: "Permission Denied",
          description: "You do not have permission to comment on this ticket.",
          variant: "destructive",
        });
        return false;
      }
      
      const updatedDescription = `${ticket.description}\n\nComment (${new Date().toLocaleString()}):\n${content}`;
      
      const { error } = await supabase
        .from('issues')
        .update({
          description: updatedDescription,
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

      // Check if this is an internal ticket
      const isInternalTicket = ticket.category === 'internal';
      
      // Refresh the tickets to show the updated comment
      await fetchTickets({}, isInternalTicket);
      
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
  }, [toast, fetchTickets, user, tickets, isAdmin]);

  // Update ticket status
  const updateTicketStatus = useCallback(async (ticketId: string, newStatus: string): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to update a ticket.",
          variant: "destructive",
        });
        return false;
      }

      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        toast({
          title: "Update Failed",
          description: "Could not find the ticket to update.",
          variant: "destructive",
        });
        return false;
      }

      // Only admins can update any ticket, others can only update their own
      if (ticket.created_by !== user.id && !isAdmin) {
        toast({
          title: "Permission Denied",
          description: "You do not have permission to update this ticket.",
          variant: "destructive",
        });
        return false;
      }

      // Convert frontend status to database status
      const dbStatus: DbStatus = mapFrontendStatusToDb(newStatus);
      
      const { error } = await supabase
        .from('issues')
        .update({
          status: dbStatus,
          updated_at: new Date().toISOString(),
          modified_by: user.id
        })
        .eq('id', ticketId);

      if (error) {
        console.error("Error updating ticket status:", error);
        toast({
          title: "Update Failed",
          description: `Could not update ticket status: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      // Check if this is an internal ticket
      const isInternalTicket = ticket.category === 'internal';
      
      // Refresh the tickets list
      await fetchTickets({}, isInternalTicket);
      
      toast({
        title: "Status Updated",
        description: "The ticket status has been updated successfully.",
      });
      
      return true;
    } catch (err) {
      console.error("Error updating ticket status:", err);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating the ticket status.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, fetchTickets, user, tickets, isAdmin]);

  // Automatically fetch tickets when the component mounts
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    addTicket,
    addComment,
    updateTicketStatus,
    isAdmin
  };
};
