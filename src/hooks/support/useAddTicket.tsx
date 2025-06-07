
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useAddTicket() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitTicket = async (title: string, description: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a support ticket.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      const ticketData = {
        status: 'open' as const,
        type: 'external' as const,
        id: crypto.randomUUID(),
        title,
        description,
        created_by: user.id,
        member_id: user.id, // Add required member_id field
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('tickets')
        .insert(ticketData);

      if (error) throw error;

      toast({
        title: "Ticket submitted!",
        description: "Your support ticket has been created successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to submit ticket",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitTicket,
    isSubmitting,
  };
}
