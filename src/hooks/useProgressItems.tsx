
import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: items, isLoading, refetch } = useQuery({
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
        .order('created_at', { ascending: false });

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
    const { error } = await supabase
      .from('progress_comments')
      .insert({ content, progress_item_id: itemId });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding comment",
        description: error.message,
      });
      return false;
    }

    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
    
    queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    return true;
  };

  const syncTasks = async () => {
    setIsSyncing(true);
    try {
      const { syncProjectTasksToProgress } = await import('@/utils/syncTasks');
      const result = await syncProjectTasksToProgress();
      
      if (result.success) {
        toast({
          title: "Tasks synchronized",
          description: result.message || "Project tasks have been synchronized with progress items.",
        });
        
        // Force a complete refresh of the data
        await refetch();
        console.log('Refetch completed after sync');
      } else {
        toast({
          variant: "destructive",
          title: "Sync failed",
          description: result.message || "Failed to synchronize tasks. Please check the console for details.",
        });
      }
      return result.success;
    } catch (error) {
      console.error('Error in syncTasks:', error);
      toast({
        variant: "destructive",
        title: "Sync error",
        description: "An unexpected error occurred while syncing tasks.",
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    items,
    isLoading,
    isSyncing,
    addComment,
    syncTasks
  };
}
