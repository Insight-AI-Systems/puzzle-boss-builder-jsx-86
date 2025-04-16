
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TestRunner } from '@/utils/testRunner';

export function useItemOrder() {
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedOrder = localStorage.getItem('progressItemsOrder');
      if (storedOrder) {
        setSavedOrder(JSON.parse(storedOrder));
      }
    } catch (err) {
      console.error('Error loading saved order:', err);
    }
  }, []);

  const saveOrderToDB = async (orderedItemIds: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to save item order",
        });
        return false;
      }

      // For now, we're not updating any database column
      // This prevents errors while we determine the best approach
      return true;
    } catch (error) {
      console.error('Error saving order to database:', error);
      return false;
    }
  };

  const updateItemsOrder = async (newOrder: string[]) => {
    try {
      console.log('Saving new order to localStorage:', newOrder);
      
      // Save to localStorage first for immediate feedback
      localStorage.setItem('progressItemsOrder', JSON.stringify(newOrder));
      setSavedOrder(newOrder);
      
      // Attempt to save to database (will just return true for now)
      const success = await saveOrderToDB(newOrder);
      
      if (success) {
        // Verify that the order was actually saved using TestRunner
        const persistenceVerified = await TestRunner.testProgressItemOrder(newOrder);
        
        if (persistenceVerified) {
          toast({
            title: "Order saved",
            description: "The new task order has been verified and saved successfully",
            className: "bg-green-800 border-green-900 text-white",
          });
          return true;
        } else {
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: "The order was saved but could not be verified. Please check the console.",
          });
          return false;
        }
      } else {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Failed to save the new order. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error('Error in updateItemsOrder:', error);
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      return false;
    }
  };

  return {
    savedOrder,
    updateItemsOrder
  };
}
