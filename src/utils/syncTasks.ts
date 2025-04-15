
import { supabase } from "@/integrations/supabase/client";
import { projectTracker } from "./projectTracker";

/**
 * Synchronizes project tracker tasks with progress items in Supabase
 * Orders tasks by their technical dependencies and phase
 */
export const syncProjectTasksToProgress = async () => {
  try {
    // Get all tasks from the project tracker
    const tasks = projectTracker.getAllTasks();
    
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
    
    // For each task, ensure there's a corresponding progress item
    for (const task of sortedTasks) {
      // Check if a progress item already exists for this task
      const { data: existingItems } = await supabase
        .from('progress_items')
        .select('id, title, status, priority')
        .eq('title', task.name)
        .maybeSingle();
      
      if (!existingItems) {
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
        
        // Insert new progress item
        await supabase
          .from('progress_items')
          .insert({
            title: task.name,
            status,
            priority,
          });
      } else {
        // Update existing item if task status changed
        let status = existingItems.status;
        if (
          (task.status === 'completed' && existingItems.status !== 'completed') ||
          (task.status === 'in-progress' && existingItems.status !== 'in_progress') ||
          (task.status === 'pending' && existingItems.status !== 'pending')
        ) {
          if (task.status === 'completed') status = 'completed';
          if (task.status === 'in-progress') status = 'in_progress';
          if (task.status === 'pending') status = 'pending';
          
          await supabase
            .from('progress_items')
            .update({ status })
            .eq('id', existingItems.id);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing tasks:", error);
    return false;
  }
};
