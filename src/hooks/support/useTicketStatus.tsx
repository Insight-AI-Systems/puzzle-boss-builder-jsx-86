
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { mapFrontendStatusToDb, DbStatus } from "@/utils/support/mappings";

export const useTicketStatus = (onStatusUpdated: () => void) => {
  const { toast } = useToast();
  const { user, hasRole } = useClerkAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');

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

      const { data: ticket, error: ticketError } = await supabase
        .from('issues')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (ticketError || !ticket) {
        toast({
          title: "Update Failed",
          description: "Could not find the ticket to update.",
          variant: "destructive",
        });
        return false;
      }

      if (ticket.created_by !== user.id && !isAdmin) {
        toast({
          title: "Permission Denied",
          description: "You do not have permission to update this ticket.",
          variant: "destructive",
        });
        return false;
      }

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

      await onStatusUpdated();
      
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
  }, [toast, user, isAdmin, onStatusUpdated]);

  return { updateTicketStatus };
};
