
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useEmailManagement() {
  const sendBulkEmail = useMutation({
    mutationFn: async ({ 
      userIds, 
      subject, 
      body 
    }: { 
      userIds: string[]; 
      subject: string; 
      body: string; 
    }) => {
      console.log(`Sending email to ${userIds.length} users`);
      
      const { data, error } = await supabase.functions.invoke('admin-email-users', {
        body: { userIds, subject, body }
      });
      
      if (error) throw error;
      return data;
    }
  });

  return {
    sendBulkEmail
  };
}
