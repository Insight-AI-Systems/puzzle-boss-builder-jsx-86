
import { supabase } from "@/integrations/supabase/client";
import { projectTracker } from "./ProjectTracker";

export const syncProjectTasksToProgress = async () => {
  try {
    // Get all tasks from the project tracker
    const tasks = projectTracker.getAllTasks();
    console.log(`Found ${tasks.length} tasks to sync`);
    
    let successCount = 0;
    
    for (const task of tasks) {
      console.log(`Syncing task: ${task.name}`);
      
      // Check if a progress item already exists for this task
      const { data: existingItem, error: queryError } = await supabase
        .from('progress_items')
        .select('id, title, status')
        .eq('title', task.name)
        .maybeSingle();
      
      if (queryError) {
        console.error(`Error checking existing task '${task.name}':`, queryError);
        continue;
      }

      // Map task status to progress item status
      const status = task.status === 'completed' ? 'completed' : 
                    task.status === 'in-progress' ? 'in_progress' : 
                    'pending';

      if (!existingItem) {
        // Insert new progress item
        const { error: insertError } = await supabase
          .from('progress_items')
          .insert({
            title: task.name,
            status,
            priority: task.phase === 1 ? 'high' : 'medium',
            description: task.description
          });
        
        if (insertError) {
          console.error(`Error inserting task '${task.name}':`, insertError);
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
            description: task.description
          })
          .eq('id', existingItem.id);
        
        if (updateError) {
          console.error(`Error updating task '${task.name}':`, updateError);
        } else {
          console.log(`Updated existing task: ${task.name}`);
          successCount++;
        }
      }
    }
    
    console.log(`Successfully synced ${successCount} out of ${tasks.length} tasks`);
    return successCount > 0;
  } catch (error) {
    console.error("Error syncing tasks:", error);
    return false;
  }
}
