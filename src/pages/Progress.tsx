
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Save } from "lucide-react";
import { AddProgressItemDialog } from "@/components/AddProgressItemDialog";
import { useProgressItems } from "@/hooks/useProgressItems";
import { ProgressTable } from "@/components/progress/ProgressTable";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { AutomatedTaskFlow } from "@/components/progress/AutomatedTaskFlow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Progress = () => {
  const { 
    items, 
    isLoading, 
    isSyncing, 
    addComment, 
    syncTasks,
    updateItemStatus,
    updateItemPriority,
    updateItemsOrder
  } = useProgressItems();
  
  const [syncError, setSyncError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Show a toast when the page loads to inform about auto-saving
    toast({
      title: "Auto-save enabled",
      description: "Changes to task order, status, and priority are automatically saved",
      duration: 5000,
    });
  }, [toast]);

  // Add automatic sync on mount and periodic sync
  useEffect(() => {
    // Initial sync if no items exist
    if (!isLoading && (!items || items.length === 0)) {
      console.log('No progress items found, auto-syncing');
      syncTasks().catch(err => {
        console.error('Auto-sync failed:', err);
        setSyncError('Failed to automatically sync tasks. Please try manual sync.');
      });
    }

    // Set up periodic sync every 30 minutes
    const syncInterval = setInterval(() => {
      console.log('Running periodic sync');
      syncTasks().catch(err => {
        console.error('Periodic sync failed:', err);
        // Don't show UI error for periodic sync failures
      });
    }, 30 * 60 * 1000); // 30 minutes

    // Cleanup interval on unmount
    return () => clearInterval(syncInterval);
  }, [isLoading, items, syncTasks]);

  const handleManualSync = async () => {
    setSyncError(null);
    try {
      await syncTasks();
      toast({
        title: "Sync Successful",
        description: "Your tasks have been synchronized with the server",
        duration: 3000,
        className: "bg-green-800 border-green-900 text-white",
      });
    } catch (error) {
      console.error('Manual sync error:', error);
      setSyncError('Sync failed. Please try again later.');
    }
  };

  const handleOrderUpdate = async (itemIds: string[]) => {
    console.log("Progress.tsx: Updating order of items:", itemIds);
    const result = await updateItemsOrder(itemIds);
    return result;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-game text-puzzle-aqua mb-8">Loading progress...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-game text-puzzle-aqua">Project Progress Tracker</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
              onClick={handleManualSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
            <AddProgressItemDialog />
          </div>
        </div>
        
        {syncError && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-500 text-red-100">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sync Error</AlertTitle>
            <AlertDescription>{syncError}</AlertDescription>
          </Alert>
        )}
        
        <Alert className="bg-green-900/20 border-green-500 text-green-100">
          <Save className="h-4 w-4" />
          <AlertTitle>Auto-save enabled</AlertTitle>
          <AlertDescription>
            Changes to task order, status, and priorities are automatically saved to both your browser and database
          </AlertDescription>
        </Alert>
        
        <AutomatedTaskFlow 
          items={items || []} 
          onUpdateStatus={updateItemStatus}
          onAddComment={addComment}
        />
        
        <ProgressSummary items={items || []} />
        
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Current Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressTable 
              items={items || []} 
              onAddComment={addComment}
              onUpdateStatus={updateItemStatus}
              onUpdatePriority={updateItemPriority}
              onUpdateItemsOrder={handleOrderUpdate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
