
import { useEffect } from "react";
import { useFetchTickets } from "./useFetchTickets";
import { useAddTicket } from "./useAddTicket";
import { useTicketComment } from "./useTicketComment";
import { useTicketStatus } from "./useTicketStatus";

export const useSupportTickets = () => {
  const { tickets, isLoading, fetchTickets, isAdmin } = useFetchTickets();
  const { addTicket } = useAddTicket(fetchTickets);
  const { addComment } = useTicketComment(fetchTickets);
  const { updateTicketStatus } = useTicketStatus(fetchTickets);

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
