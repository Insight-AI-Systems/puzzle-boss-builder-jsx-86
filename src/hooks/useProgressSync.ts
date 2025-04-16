
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useProgressSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

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
        await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
        console.log('Refetch completed after sync');
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Sync failed",
          description: result.message || "Failed to synchronize tasks. Please check the console for details.",
        });
        return false;
      }
    } catch (error) {
      console.error('Error in syncTasks:', error);
      toast({
        variant: "destructive",
        title: "Sync error",
        description: error instanceof Error ? error.message : "An unexpected error occurred while syncing tasks.",
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return { isSyncing, syncTasks };
};
