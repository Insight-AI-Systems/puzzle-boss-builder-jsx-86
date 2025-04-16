
import { useState, useEffect } from 'react';
import { ProgressItem } from '@/hooks/useProgressItems';
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

  // Use the items array directly, which is already ordered by the drag and drop functionality
  useEffect(() => {
    if (state.workflowStage === 'selecting' && items.length > 0) {
      console.log('Finding highest priority task from list of', items.length, 'items');
      
      // Filter out completed tasks and use the first item in the filtered array
      const pendingTasks = items.filter(item => item.status !== 'completed');
      
      console.log('Pending tasks after filtering:', pendingTasks.map(t => t.title));
      
      if (pendingTasks.length > 0) {
        // Always select the first pending task as the highest priority
        const selectedTask = pendingTasks[0];
        console.log('Selected task for workflow:', selectedTask.title);
        
        setState(prev => ({
          ...prev,
          currentTask: selectedTask,
          workflowStage: 'proposal',
          progressValue: 25
        }));
      } else {
        console.log('No pending tasks found');
        setState(prev => ({ ...prev, currentTask: null }));
      }
    }
  }, [items, state.workflowStage]);

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
