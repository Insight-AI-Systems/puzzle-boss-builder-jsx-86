
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TestRunner } from '@/utils/testRunner';

export function useItemOrder() {
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedOrder();
  }, []);

  const loadSavedOrder = async () => {
    try {
      // First try to load from database
      const { data: items, error } = await supabase
        .from('progress_items')
        .select('id, order_index, updated_at')
        .order('order_index', { ascending: true })
        .not('order_index', 'is', null);

      const localStorageOrder = localStorage.getItem('progressItemsOrder');
      const localStorageTimestamp = localStorage.getItem('progressItemsOrderTimestamp');
      
      if (items && items.length > 0) {
        const orderFromDb = items.map(item => item.id);
        const latestDbUpdate = Math.max(...items.map(item => 
          new Date(item.updated_at).getTime()
        ));

        // If localStorage exists, compare timestamps
        if (localStorageOrder && localStorageTimestamp) {
          const savedTimestamp = parseInt(localStorageTimestamp, 10);
          if (savedTimestamp > latestDbUpdate) {
            // localStorage is more recent, use it
            setSavedOrder(JSON.parse(localStorageOrder));
            return;
          }
        }

        // Use database order and update localStorage
        setSavedOrder(orderFromDb);
        localStorage.setItem('progressItemsOrder', JSON.stringify(orderFromDb));
        localStorage.setItem('progressItemsOrderTimestamp', Date.now().toString());
        return;
      }

      // Fallback to localStorage if no order in database
      if (localStorageOrder) {
        setSavedOrder(JSON.parse(localStorageOrder));
      }
    } catch (err) {
      console.error('Error loading saved order:', err);
    }
  };

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

      // Update order_index for each item using upsert
      const updates = orderedItemIds.map((id, index) => ({
        id,
        order_index: index,
        title: undefined // Adding undefined for required fields that we don't want to update
      }));

      const { error } = await supabase
        .from('progress_items')
        .upsert(updates, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error saving order to database:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving order to database:', error);
      return false;
    }
  };

  const updateItemsOrder = async (newOrder: string[]) => {
    try {
      console.log('Saving new order to localStorage and database:', newOrder);
      
      // Save to localStorage with timestamp
      const timestamp = Date.now();
      localStorage.setItem('progressItemsOrder', JSON.stringify(newOrder));
      localStorage.setItem('progressItemsOrderTimestamp', timestamp.toString());
      setSavedOrder(newOrder);
      
      // Attempt to save to database
      const success = await saveOrderToDB(newOrder);
      
      if (success) {
        // Verify that the order was actually saved using TestRunner
        const persistenceVerified = await TestRunner.testProgressItemOrder(newOrder);
        
        if (persistenceVerified) {
          toast({
            title: "Order saved",
            description: "The new task order has been saved and verified in both local storage and database",
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
