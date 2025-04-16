
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProgressItem } from '@/types/progressTypes';

export function useItemOrder() {
  const [savedOrder, setSavedOrder] = useState<string[]>([]);

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

      const priorities = ['high', 'high', 'medium', 'medium', 'low'];
      
      const updatePromises = orderedItemIds.map(async (itemId, index) => {
        const newPriority = priorities[Math.min(index, priorities.length - 1)];
        
        const { error } = await supabase
          .from('progress_items')
          .update({ 
            priority: newPriority,
            updated_at: new Date().toISOString(),
            last_edited_by: user.id
          })
          .eq('id', itemId);
          
        if (error) {
          console.error(`Error updating priority for item ${itemId}:`, error);
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
      localStorage.setItem('progressItemsOrder', JSON.stringify(newOrder));
      setSavedOrder(newOrder);
      
      const success = await saveOrderToDB(newOrder);
      
      if (success) {
        toast({
          title: "Order updated",
          description: "Item order has been successfully saved",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Order update failed",
          description: "Failed to save item order in the database",
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
