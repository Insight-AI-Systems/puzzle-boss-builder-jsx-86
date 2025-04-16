
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
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
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
        description: "Unable to refresh your membership status. Please try again.",
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
