
import { useState, useEffect } from 'react';
import { ProgressItem } from '@/types/progressTypes';
import { useToast } from "@/hooks/use-toast";

export interface TaskWorkflowState {
  currentTask: ProgressItem | null;
  workflowStage: 'selecting' | 'proposal' | 'implementation' | 'testing' | 'completed';
  proposal: string;
  progressValue: number;
}

export function useTaskWorkflow(items: ProgressItem[]) {
  const [state, setState] = useState<TaskWorkflowState>({
    currentTask: null,
    workflowStage: 'selecting',
    proposal: '',
    progressValue: 0
  });
  
  const { toast } = useToast();

  // Update the current task whenever items change or when in selecting stage
  useEffect(() => {
    if ((state.workflowStage === 'selecting' || !state.currentTask) && items.length > 0) {
      console.log('Finding top task from sorted list of', items.length, 'items');
      console.log('Current sorted items (first 3):', items.slice(0, 3).map(i => i.title));
      
      // Filter out completed tasks, strictly preserving the current order from the items array
      const pendingTasks = items.filter(item => item.status !== 'completed');
      
      console.log('Found', pendingTasks.length, 'pending tasks');
      
      if (pendingTasks.length > 0) {
        const topTask = pendingTasks[0];
        console.log('Selected top task for workflow:', topTask.title, 'with priority:', topTask.priority);
        
        // Only update if the top task has changed or we're in selecting stage
        if (!state.currentTask || state.currentTask.id !== topTask.id || state.workflowStage === 'selecting') {
          console.log('Updating current task in workflow to:', topTask.title);
          setState(prev => ({
            ...prev,
            currentTask: topTask,
            workflowStage: prev.workflowStage === 'selecting' ? 'proposal' : prev.workflowStage,
            progressValue: prev.workflowStage === 'selecting' ? 25 : prev.progressValue
          }));
        }
      } else {
        console.log('No pending tasks found');
        setState(prev => ({ ...prev, currentTask: null, workflowStage: 'selecting', progressValue: 0 }));
      }
    }
  }, [items, state.currentTask, state.workflowStage]);

  // Also check if the current task still exists in the items list
  useEffect(() => {
    if (state.currentTask && items.length > 0) {
      const currentTaskExists = items.some(item => item.id === state.currentTask?.id);
      if (!currentTaskExists) {
        console.log('Current task no longer exists in items list, resetting workflow');
        setState(prev => ({ ...prev, currentTask: null, workflowStage: 'selecting', progressValue: 0 }));
      }
    }
  }, [items, state.currentTask]);

  const generateProposal = () => {
    if (!state.currentTask) return;
    
    const proposalTemplate = 
      `Proposed Solution for: ${state.currentTask.title}
      
Description: 
This implementation will address the task by creating necessary components, 
updating the relevant data structures, and ensuring proper integration with 
existing systems.

Key Implementation Steps:
1. Analyze the requirements and design a solution
2. Create/update components to implement the functionality
3. Add tests to verify correct operation
4. Integrate with existing systems
5. Document the changes

Dependencies:
- None identified

Estimated Completion Time: 2-3 hours
      `;
    
    setState(prev => ({ ...prev, proposal: proposalTemplate }));
  };

  const setStage = (stage: TaskWorkflowState['workflowStage'], progress: number) => {
    setState(prev => ({ ...prev, workflowStage: stage, progressValue: progress }));
  };

  const resetWorkflow = () => {
    setState({
      currentTask: null,
      workflowStage: 'selecting',
      proposal: '',
      progressValue: 0
    });
  };

  return {
    ...state,
    generateProposal,
    setStage,
    resetWorkflow,
    setState
  };
}
