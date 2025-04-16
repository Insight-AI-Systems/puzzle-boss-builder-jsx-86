
import { supabase } from "@/integrations/supabase/client";
import { projectTracker } from "./ProjectTracker";
import { toast } from "@/hooks/use-toast";

export const syncProjectTasksToProgress = async () => {
  try {
    // Get all tasks from the project tracker
    const tasks = projectTracker.getAllTasks();
    console.log(`Found ${tasks.length} tasks to sync`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const task of tasks) {
      console.log(`Syncing task: ${task.name}`);
      
      try {
        // Check if a progress item already exists for this task
        // Use .eq() with .select() instead of .maybeSingle() to handle duplicate titles
        const { data: existingItems, error: queryError } = await supabase
          .from('progress_items')
          .select('id, title, status')
          .eq('title', task.name);
        
        if (queryError) {
          console.error(`Error checking existing task '${task.name}':`, queryError);
          errorCount++;
          continue;
        }

        // Map task status to progress item status
        const status = task.status === 'completed' ? 'completed' : 
                      task.status === 'in-progress' ? 'in_progress' : 
                      'pending';

        if (!existingItems || existingItems.length === 0) {
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
          // Handle case where there may be multiple items with the same title
          let updatedCount = 0;
          
          // Update the first matching item only
          const firstItem = existingItems[0];
          
          // Update existing item if needed
          const { error: updateError } = await supabase
            .from('progress_items')
            .update({
              status,
              description: task.description || null
            })
            .eq('id', firstItem.id);
          
          if (updateError) {
            console.error(`Error updating task '${task.name}':`, updateError);
            errorCount++;
          } else {
            console.log(`Updated existing task: ${task.name}`);
            successCount++;
            
            // If there are duplicates, log it so we're aware
            if (existingItems.length > 1) {
              console.warn(`Found ${existingItems.length} items with title '${task.name}', only updated the first one.`);
            }
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
