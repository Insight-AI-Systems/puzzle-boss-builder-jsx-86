
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useProgressSync } from "./useProgressSync";
import { addCommentToItem } from "@/utils/progress/commentOperations";
import { updateItemStatus, updateItemPriority } from "@/utils/progress/statusOperations";
import { useEffect, useState } from "react";

export interface ProgressItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description?: string; 
  created_at: string;
  updated_at: string;
  last_edited_by?: string;
  progress_comments: ProgressComment[];
}

export interface ProgressComment {
  id: string;
  content: string;
  progress_item_id: string;
  created_at: string;
}

export function useProgressItems() {
  const queryClient = useQueryClient();
  const { isSyncing, syncTasks } = useProgressSync();
  const [savedOrder, setSavedOrder] = useState<string[]>([]);

  // Load saved order from localStorage
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

  // Save order to Supabase
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

      // First, retrieve all items to get their current priorities
      const { data: items, error: fetchError } = await supabase
        .from('progress_items')
        .select('id, priority')
        .in('id', orderedItemIds);

      if (fetchError) {
        console.error('Error fetching items for reordering:', fetchError);
        return false;
      }

      // Create a map of priorities based on the new order
      const priorities = ['high', 'high', 'medium', 'medium', 'low'];
      
      // Create batch update operations
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
      
      // Execute all updates
      const results = await Promise.all(updatePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error saving order to database:', error);
      return false;
    }
  };

  const { data: items, isLoading } = useQuery({
    queryKey: ['progress-items'],
    queryFn: async () => {
      console.log('Fetching progress items...');
      
      const { data, error } = await supabase
        .from('progress_items')
        .select(`
          *,
          progress_comments (
            *
          )
        `)
        .order('priority', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching progress items:', error);
        toast({
          variant: "destructive",
          title: "Error fetching progress items",
          description: error.message,
        });
        return [];
      }

      console.log(`Fetched ${data?.length || 0} progress items:`, data);
      
      // Apply saved order from localStorage if it exists
      if (savedOrder.length > 0 && data) {
        // Sort items based on the saved order
        const sortedData = [...data].sort((a, b) => {
          const indexA = savedOrder.indexOf(a.id);
          const indexB = savedOrder.indexOf(b.id);
          
          // If an item isn't in the saved order, put it at the end
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
        });
        
        console.log('Applied saved order to items');
        return sortedData as ProgressItem[] || [];
      }
      
      return data as ProgressItem[] || [];
    },
  });

  const addComment = async (content: string, itemId: string) => {
    const success = await addCommentToItem(content, itemId);
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    }
    return success;
  };

  const handleUpdateItemStatus = async (itemId: string, status: string) => {
    const success = await updateItemStatus(itemId, status);
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    }
    return success;
  };

  const handleUpdateItemPriority = async (itemId: string, priority: string) => {
    console.log(`Updating priority for item ${itemId} to ${priority}`);
    const success = await updateItemPriority(itemId, priority);
    if (success) {
      console.log(`Successfully updated priority for item ${itemId}`);
      await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    } else {
      console.error(`Failed to update priority for item ${itemId}`);
    }
    return success;
  };

  const updateItemsOrder = async (newOrder: string[]) => {
    try {
      console.log('Saving new order to localStorage and database:', newOrder);
      // Save to localStorage for immediate UI consistency
      localStorage.setItem('progressItemsOrder', JSON.stringify(newOrder));
      setSavedOrder(newOrder);
      
      // Update the database with the new priorities based on order
      const success = await saveOrderToDB(newOrder);
      
      if (success) {
        toast({
          title: "Order updated",
          description: "Item order has been successfully saved",
        });
        // Refresh data to show updated priorities
        await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
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
    items,
    isLoading,
    isSyncing,
    addComment,
    syncTasks,
    updateItemStatus: handleUpdateItemStatus,
    updateItemPriority: handleUpdateItemPriority,
    updateItemsOrder
  };
}
