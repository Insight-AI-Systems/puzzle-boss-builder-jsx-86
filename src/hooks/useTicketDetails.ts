
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { openSupportsAPI } from '@/services/openSupportsAPI';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const sendNotification = async (payload: {
    recipientEmail: string;
    ticketTitle: string;
    ticketId: string;
    updateType: 'status' | 'comment';
    newStatus?: string;
    commentAuthor?: string;
    commentContent?: string;
  }) => {
    const { error } = await supabase.functions.invoke('send-ticket-notification', {
      body: payload,
    });
    
    if (error) {
      console.error('Error sending notification:', error);
    }
  };

  const addComment = useMutation({
    mutationFn: async ({ content, file }: { content: string; file?: string }) => {
      if (!ticketId) throw new Error("No ticket ID provided");
      const result = await openSupportsAPI.addComment(ticketId, content, file);

      // Get the ticket creator's email and assigned admin's email
      const { data: ticket } = await supabase
        .from('tickets')
        .select('created_by, assigned_to')
        .eq('id', ticketId)
        .single();

      if (ticket) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', [ticket.created_by, ticket.assigned_to].filter(Boolean));

        if (profiles) {
          const { data: currentUser } = await supabase.auth.getUser();
          profiles.forEach(profile => {
            if (profile.id !== currentUser?.user?.id && profile.email) {
              sendNotification({
                recipientEmail: profile.email,
                ticketTitle: ticketDetails?.title || 'Support Ticket',
                ticketId,
                updateType: 'comment',
                commentAuthor: currentUser?.user?.email || 'A user',
                commentContent: content
              });
            }
          });
        }
      }

      return result;
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
    mutationFn: async (status: string) => {
      if (!ticketId) throw new Error("No ticket ID provided");
      const result = await openSupportsAPI.changeTicketStatus(ticketId, status);

      // Get the ticket creator's email and assigned admin's email
      const { data: ticket } = await supabase
        .from('tickets')
        .select('created_by, assigned_to')
        .eq('id', ticketId)
        .single();

      if (ticket) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', [ticket.created_by, ticket.assigned_to].filter(Boolean));

        if (profiles) {
          const { data: currentUser } = await supabase.auth.getUser();
          profiles.forEach(profile => {
            if (profile.id !== currentUser?.user?.id && profile.email) {
              sendNotification({
                recipientEmail: profile.email,
                ticketTitle: ticketDetails?.title || 'Support Ticket',
                ticketId,
                updateType: 'status',
                newStatus: status
              });
            }
          });
        }
      }

      return result;
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
