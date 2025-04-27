
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupportTicket, TicketFilters } from "@/types/supportTicketTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useInternalIssues } from "./useInternalIssues";
import { useUserTickets } from "./useUserTickets";

export const useFetchTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  const { fetchInternalIssues } = useInternalIssues();
  const { fetchUserTickets } = useUserTickets();
  
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
        allTickets = await fetchInternalIssues();
      } else {
        allTickets = await fetchUserTickets(user.id, isAdmin, filters);
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
  }, [toast, user, isAdmin, fetchInternalIssues, fetchUserTickets, hasError]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    isAdmin
  };
};
