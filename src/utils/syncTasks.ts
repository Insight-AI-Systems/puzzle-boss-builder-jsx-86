
import { supabase } from "@/integrations/supabase/client";
import { projectTracker } from "./ProjectTracker";

/**
 * Synchronizes project tracker tasks with progress items in Supabase
 * Orders tasks by their technical dependencies and phase
 */
export const syncProjectTasksToProgress = async () => {
  try {
    // Get all tasks from the project tracker
    const tasks = projectTracker.getAllTasks();
    console.log(`Found ${tasks.length} tasks to sync`);
    
    // Sort tasks by phase and dependencies
    const sortedTasks = [...tasks].sort((a, b) => {
      // First sort by phase
      if (a.phase !== b.phase) {
        return a.phase - b.phase;
      }
      
      // Then consider dependencies - if B depends on A, A should come first
      if (b.dependsOn?.includes(a.id)) {
        return -1;
      }
      if (a.dependsOn?.includes(b.id)) {
        return 1;
      }
      
      // Default sort by id for stable ordering
      return a.id.localeCompare(b.id);
    });
    
    // Track success count
    let successCount = 0;
    
    // For each task, ensure there's a corresponding progress item
    for (const task of sortedTasks) {
      // Check if a progress item already exists for this task
      const { data: existingItems, error: queryError } = await supabase
        .from('progress_items')
        .select('id, title, status, priority')
        .eq('title', task.name)
        .maybeSingle();
      
      if (queryError) {
        console.error(`Error checking for existing task '${task.name}':`, queryError);
        continue;
      }
      
      // Map task status to progress item status
      let status = 'pending';
      if (task.status === 'completed') status = 'completed';
      if (task.status === 'in-progress') status = 'in_progress';
      
      // Determine priority based on phase and dependencies
      let priority = 'medium';
      if (task.phase === 1) priority = 'high';
      if (task.dependsOn && task.dependsOn.length > 0) {
        const allDependenciesCompleted = task.dependsOn.every(depId => {
          const depTask = tasks.find(t => t.id === depId);
          return depTask && depTask.status === 'completed';
        });
        if (!allDependenciesCompleted) priority = 'low';
      }
      
      if (!existingItems) {
        // Insert new progress item
        const { data: insertResult, error: insertError } = await supabase
          .from('progress_items')
          .insert({
            title: task.name,
            status,
            priority,
            description: task.description
          })
          .select('id')
          .single();
        
        if (insertError) {
          console.error(`Error inserting task '${task.name}':`, insertError);
        } else {
          console.log(`Added new task: ${task.name} (${insertResult.id})`);
          successCount++;
        }
      } else {
        // Update existing item if task status changed
        let needsUpdate = false;
        let updates: any = {};
        
        if (
          (task.status === 'completed' && existingItems.status !== 'completed') ||
          (task.status === 'in-progress' && existingItems.status !== 'in_progress') ||
          (task.status === 'pending' && existingItems.status !== 'pending')
        ) {
          updates.status = status;
          needsUpdate = true;
        }
        
        // Also update description if it might be missing
        updates.description = task.description;
        needsUpdate = true;
        
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('progress_items')
            .update(updates)
            .eq('id', existingItems.id);
          
          if (updateError) {
            console.error(`Error updating task '${task.name}':`, updateError);
          } else {
            console.log(`Updated existing task: ${task.name}`);
            successCount++;
          }
        }
      }
    }
    
    console.log(`Synchronized ${successCount} tasks to progress items`);
    return successCount > 0;
  } catch (error) {
    console.error("Error syncing tasks:", error);
    return false;
  }
};
