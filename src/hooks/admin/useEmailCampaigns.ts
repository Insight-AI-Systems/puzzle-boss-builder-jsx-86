
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailCampaign } from '@/components/admin/email/types';

export function useEmailCampaigns() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch campaigns from the database
  const {
    data: campaigns,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['email-campaigns'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('email_campaigns')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as EmailCampaign[];
      } catch (error) {
        console.error('Error fetching email campaigns:', error);
        throw error;
      }
    }
  });

  // Create campaign
  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'sent' | 'opened'>) => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          ...campaign,
          sent: 0,
          opened: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      return data as EmailCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
    onError: (error) => {
      console.error('Error creating campaign:', error);
      toast({
        title: "Failed to create campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const refreshCampaigns = () => {
    refetch();
  };

  const createCampaign = async (campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'sent' | 'opened'>) => {
    return createCampaignMutation.mutateAsync(campaign);
  };

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    refreshCampaigns
  };
}
