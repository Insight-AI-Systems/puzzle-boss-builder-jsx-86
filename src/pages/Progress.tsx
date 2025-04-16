import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Save } from "lucide-react";
import { AddProgressItemDialog } from "@/components/AddProgressItemDialog";
import { useProgressItems } from "@/hooks/useProgressItems";
import { ProgressTable } from "@/components/progress/ProgressTable";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ProgressItem } from '@/types/progressTypes';

const Progress = () => {
  const { 
    items: initialItems,
    isLoading, 
    isSyncing, 
    addComment, 
    syncTasks,
    updateItemStatus,
    updateItemPriority,
    updateItemsOrder,
    isSavingOrder
  } = useProgressItems();

  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);
  const { toast } = useToast();

  // Update local state when items from hook changes
  useEffect(() => {
    if (initialItems) {
      setProgressItems(initialItems);
    }
  }, [initialItems]);

  useEffect(() => {
    // Auto-save notification
    toast({
      title: "Auto-save enabled",
      description: "Changes to task order, status, and priority are automatically saved",
      duration: 5000,
    });
  }, [toast]);

  useEffect(() => {
    if (!isLoading && (!initialItems || initialItems.length === 0)) {
      console.log('No progress items found, auto-syncing');
      syncTasks().catch(err => {
        console.error('Auto-sync failed:', err);
        setSyncError('Failed to automatically sync tasks. Please try manual sync.');
      });
    }

    const syncInterval = setInterval(() => {
      console.log('Running periodic sync');
      syncTasks().catch(err => {
        console.error('Periodic sync failed:', err);
      });
    }, 30 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, [isLoading, initialItems, syncTasks]);

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

  const handleUpdateItemsOrder = async (itemIds: string[]) => {
    console.log('Progress.tsx: Updating order with', itemIds.length, 'items');
    const success = await updateItemsOrder(itemIds);

    if (success) {
      // Update local state to match new order explicitly
      const reorderedItems = itemIds
        .map(id => progressItems.find(item => item.id === id))
        .filter(Boolean) as ProgressItem[];
        
      console.log('Setting reordered items:', reorderedItems.map(item => item.title).join(', '));
      setProgressItems(reorderedItems);
      return true;
    }
    return false;
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
        
        <ProgressSummary items={progressItems} />
        
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Current Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressTable 
              items={progressItems} 
              onAddComment={addComment}
              onUpdateStatus={updateItemStatus}
              onUpdatePriority={updateItemPriority}
              onUpdateItemsOrder={handleUpdateItemsOrder}
              isSavingOrder={isSavingOrder}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
