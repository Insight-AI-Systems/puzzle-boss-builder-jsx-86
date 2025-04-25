
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTicketComment = (onCommentAdded: () => void) => {
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');

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

      const { data: ticket, error: ticketError } = await supabase
        .from('issues')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (ticketError || !ticket) {
        toast({
          title: "Comment Failed",
          description: "Could not find the ticket to comment on.",
          variant: "destructive",
        });
        return false;
      }
      
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

      await onCommentAdded();
      
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
  }, [toast, user, isAdmin, onCommentAdded]);

  return { addComment };
};
