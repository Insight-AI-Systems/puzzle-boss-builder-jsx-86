
import { supabase } from "@/integrations/supabase/client";
import { projectTracker } from "./ProjectTracker";
import { toast } from "@/hooks/use-toast";

export const syncProjectTasksToProgress = async () => {
  try {
    // Get all tasks from the project tracker
    const tasks = projectTracker.getAllTasks();
    console.log(`Found ${tasks.length} tasks to sync`);
    
    // First, get all existing progress items to check for duplicates
    const { data: existingItems, error: fetchError } = await supabase
      .from('progress_items')
      .select('id, title, status');
      
    if (fetchError) {
      console.error('Error fetching existing items:', fetchError);
      return { success: false, message: `Error fetching existing items: ${fetchError.message}` };
    }
    
    // Create a map of existing titles to avoid duplicates
    const existingTitles = new Map();
    if (existingItems) {
      existingItems.forEach(item => {
        if (!existingTitles.has(item.title)) {
          existingTitles.set(item.title, item);
        }
      });
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const task of tasks) {
      console.log(`Syncing task: ${task.name}`);
      
      try {
        // Map task status to progress item status
        const status = task.status === 'completed' ? 'completed' : 
                      task.status === 'in-progress' ? 'in_progress' : 
                      'pending';

        // Check if this task already exists
        const existingItem = existingTitles.get(task.name);

        if (!existingItem) {
          // Insert new progress item
          const { error: insertError } = await supabase
            .from('progress_items')
            .insert({
              title: task.name,
              status,
              priority: task.phase === 1 ? 'high' : 'medium',
              description: task.description || null
            });
          
          if (insertError) {
            console.error(`Error inserting task '${task.name}':`, insertError);
            errorCount++;
          } else {
            console.log(`Added new task: ${task.name}`);
            successCount++;
          }
        } else {
          // Update existing item if needed
          const { error: updateError } = await supabase
            .from('progress_items')
            .update({
              status,
              description: task.description || null
            })
            .eq('id', existingItem.id);
          
          if (updateError) {
            console.error(`Error updating task '${task.name}':`, updateError);
            errorCount++;
          } else {
            console.log(`Updated existing task: ${task.name}`);
            successCount++;
          }
        }
      } catch (taskError) {
        console.error(`Error processing task '${task.name}':`, taskError);
        errorCount++;
      }
    }
    
    console.log(`Sync complete: ${successCount} succeeded, ${errorCount} failed out of ${tasks.length} tasks`);
    
    if (errorCount > 0 && successCount > 0) {
      return { success: true, message: `Partially synced: ${successCount} succeeded, ${errorCount} failed` };
    } else if (errorCount > 0) {
      return { success: false, message: `Failed to sync ${errorCount} tasks` };
    } else {
      return { success: true, message: `Successfully synced ${successCount} tasks` };
    }
  } catch (error) {
    console.error("Error syncing tasks:", error);
    return { success: false, message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
