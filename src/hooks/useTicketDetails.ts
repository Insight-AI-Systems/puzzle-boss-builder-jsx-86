
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { openSupportsAPI } from '@/services/openSupportsAPI';
import { useToast } from '@/hooks/use-toast';

export function useTicketDetails(ticketId: string | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: ticketDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['ticketDetails', ticketId],
    queryFn: () => ticketId ? openSupportsAPI.getTicket(ticketId) : null,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addComment = useMutation({
    mutationFn: ({ content, file }: { content: string; file?: string }) => {
      if (!ticketId) throw new Error("No ticket ID provided");
      return openSupportsAPI.addComment(ticketId, content, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketDetails', ticketId] });
      toast({
        title: 'Comment Added',
        description: 'Your comment has been added to the ticket.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => {
      if (!ticketId) throw new Error("No ticket ID provided");
      return openSupportsAPI.changeTicketStatus(ticketId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketDetails', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Status Updated',
        description: 'The ticket status has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  return {
    ticketDetails,
    isLoading,
    isError,
    error,
    addComment,
    updateStatus,
    refetch,
  };
}
