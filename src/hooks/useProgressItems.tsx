
import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProgressItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
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

  const { data: items, isLoading } = useQuery({
    queryKey: ['progress-items'],
    queryFn: async () => {
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
        toast({
          variant: "destructive",
          title: "Error fetching progress items",
          description: error.message,
        });
        return [];
      }

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
      const success = await syncProjectTasksToProgress();
      
      if (success) {
        toast({
          title: "Tasks synchronized",
          description: "Project tasks have been synchronized with progress items.",
        });
        queryClient.invalidateQueries({ queryKey: ['progress-items'] });
      } else {
        toast({
          variant: "destructive",
          title: "Sync failed",
          description: "Failed to synchronize tasks. Please try again.",
        });
      }
      return success;
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
