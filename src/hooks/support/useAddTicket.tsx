
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupportTicket } from "@/types/supportTicketTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { mapFrontendStatusToDb, DbStatus } from "@/utils/support/mappings";

export const useAddTicket = (onTicketAdded: () => void) => {
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');

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

      const isInternalTicket = newTicket.category === 'internal';
      
      if (isInternalTicket && !isAdmin) {
        toast({
          title: "Permission Denied",
          description: "You do not have permission to create internal tickets.",
          variant: "destructive",
        });
        return false;
      }

      const dbStatus: DbStatus = mapFrontendStatusToDb(newTicket.status as string || 'open');

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

      await onTicketAdded();
      
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
  }, [toast, user, isAdmin, onTicketAdded]);

  return { addTicket };
};
