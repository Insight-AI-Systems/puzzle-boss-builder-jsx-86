
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailCampaign } from '@/components/admin/email/types';

export function useEmailCampaigns() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock data for email campaigns
  const mockCampaigns: EmailCampaign[] = [
    {
      id: '1',
      name: 'Welcome Series',
      status: 'scheduled',
      audience: 'New Users',
      recipients: 124,
      sent: 0,
      opened: 0,
      scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Monthly Newsletter',
      status: 'completed',
      audience: 'All Subscribers',
      recipients: 500,
      sent: 487,
      opened: 312,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Fetch campaigns with a mocked implementation
  const {
    data: campaigns,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['email-campaigns'],
    queryFn: async () => {
      try {
        // In a real implementation, this would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('email_campaigns')
        //   .select('*')
        //   .order('created_at', { ascending: false });
          
        // if (error) throw error;
        // return data as EmailCampaign[];
        
        // For now, return mock data
        return mockCampaigns;
      } catch (error) {
        console.error('Error fetching email campaigns:', error);
        throw error;
      }
    }
  });

  // Create campaign
  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'sent' | 'opened'>) => {
      // In a real implementation, this would insert to Supabase
      // const { data, error } = await supabase
      //   .from('email_campaigns')
      //   .insert({
      //     ...campaign,
      //     sent: 0,
      //     opened: 0
      //   })
      //   .select()
      //   .single();
        
      // if (error) throw error;
      
      // Mock implementation
      const newCampaign: EmailCampaign = {
        ...campaign,
        id: (Math.floor(Math.random() * 1000)).toString(),
        sent: 0,
        opened: 0,
        created_at: new Date().toISOString()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newCampaign;
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
