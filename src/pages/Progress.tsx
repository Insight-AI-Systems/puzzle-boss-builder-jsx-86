
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AddProgressItemDialog } from "@/components/AddProgressItemDialog";
import { useProgressItems } from "@/hooks/useProgressItems";
import { ProgressTable } from "@/components/progress/ProgressTable";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { AutomatedTaskFlow } from "@/components/progress/AutomatedTaskFlow";
import { toast } from "@/hooks/use-toast";

const Progress = () => {
  const { 
    items, 
    isLoading, 
    isSyncing, 
    addComment, 
    syncTasks,
    updateItemStatus,
    updateItemPriority
  } = useProgressItems();

  // Automatically sync tasks if there are no items
  useEffect(() => {
    if (!isLoading && (!items || items.length === 0)) {
      console.log('No progress items found, suggesting sync');
      toast({
        title: "No tasks found",
        description: "Click 'Sync Project Tasks' to import tasks",
      });
    }
  }, [isLoading, items]);

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
              onClick={syncTasks}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {items && items.length > 0 ? 'Sync Project Tasks' : 'Import Project Tasks'}
            </Button>
            <AddProgressItemDialog />
          </div>
        </div>
        
        {/* Add automated task flow component */}
        <AutomatedTaskFlow 
          items={items || []} 
          onUpdateStatus={updateItemStatus}
          onAddComment={addComment}
        />
        
        {/* Progress summary */}
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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
