
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  active: boolean;
  plan: string;
  renewalDate?: string;
  credits: number;
  maxCredits: number;
}

export const useSubscription = () => {
  const { toast } = useToast();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    active: false,
    plan: 'Free',
    credits: 10,
    maxCredits: 100
  });

  const checkSubscription = async () => {
    setIsCheckingSubscription(true);
    
    try {
      // Call the edge function to check subscription status
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        // Log the error, but continue with default subscription data
        console.error("Error checking subscription:", error);
        
        toast({
          title: "Unable to refresh membership status",
          description: "Using default membership information. This won't affect your admin access.",
          variant: "destructive",
        });
        
        // Continue with default subscription data
        return;
      }
      
      if (data) {
        setSubscriptionData({
          active: data.subscribed || false,
          plan: data.subscription_tier || 'Free',
          renewalDate: data.subscription_end,
          credits: data.subscribed ? 50 : 10,
          maxCredits: 100
        });
        
        toast({
          title: "Subscription Status Updated",
          description: "Your membership information has been refreshed.",
        });
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Update Failed",
        description: "Unable to refresh your membership status. This won't affect your admin access.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const openCustomerPortal = async () => {
    setIsLoadingPortal(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast({
        title: "Portal Access Failed",
        description: "Unable to access subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPortal(false);
    }
  };

  return {
    subscriptionData,
    isCheckingSubscription,
    isLoadingPortal,
    checkSubscription,
    openCustomerPortal,
  };
};
