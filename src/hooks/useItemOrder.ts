
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProgressItem } from '@/types/progressTypes';

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

      // Update order_index for each item
      const updatePromises = orderedItemIds.map(async (itemId, index) => {
        const { error } = await supabase
          .from('progress_items')
          .update({ 
            updated_at: new Date().toISOString(),
            last_edited_by: user.id,
            // Store the index as an integer for proper sorting
            order_index: index
          })
          .eq('id', itemId);
          
        if (error) {
          console.error(`Error updating order for item ${itemId}:`, error);
          return false;
        }
        return true;
      });
      
      const results = await Promise.all(updatePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error saving order to database:', error);
      return false;
    }
  };

  const updateItemsOrder = async (newOrder: string[]) => {
    try {
      console.log('Saving new order to localStorage and database:', newOrder);
      
      // Save to localStorage first for immediate feedback
      localStorage.setItem('progressItemsOrder', JSON.stringify(newOrder));
      setSavedOrder(newOrder);
      
      // Then save to database
      const success = await saveOrderToDB(newOrder);
      
      if (success) {
        toast({
          title: "Order updated",
          description: "Task order has been successfully saved",
          className: "bg-green-800 border-green-900 text-white",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Order update failed",
          description: "Failed to save task order in the database",
        });
        return false;
      }
    } catch (error) {
      console.error('Error in updateItemsOrder:', error);
      toast({
        variant: "destructive",
        title: "Order update error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  };

  return {
    savedOrder,
    updateItemsOrder
  };
}
