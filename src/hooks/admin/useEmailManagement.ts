
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useEmailManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sendBulkEmail = useMutation({
    mutationFn: async ({ userIds, subject, body }: { userIds: string[]; subject: string; body: string }) => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-send-bulk-email', {
          body: { userIds, subject, body }
        });

        if (error) {
          throw new Error(`Failed to send emails: ${error.message}`);
        }

        return data;
      } catch (err) {
        console.error("Exception in sendBulkEmail:", err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: "Emails sent successfully",
        description: "Your message has been sent to the selected users."
      });
      queryClient.invalidateQueries({ queryKey: ['email-history'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send emails",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  return {
    sendBulkEmail
  };
}
