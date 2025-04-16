
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useProgressSync } from "./useProgressSync";
import { addCommentToItem } from "@/utils/progress/commentOperations";
import { updateItemStatus, updateItemPriority } from "@/utils/progress/statusOperations";

export interface ProgressItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description?: string; 
  created_at: string;
  updated_at: string;
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

  const { data: items, isLoading } = useQuery({
    queryKey: ['progress-items'],
    queryFn: async () => {
      console.log('Fetching progress items...');
      
      // Use created_at as secondary sort after priority to ensure consistent ordering
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

  return {
    items,
    isLoading,
    isSyncing,
    addComment,
    syncTasks,
    updateItemStatus: handleUpdateItemStatus,
    updateItemPriority: handleUpdateItemPriority
  };
}
