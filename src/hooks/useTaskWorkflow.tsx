
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

  // Find the highest priority pending task based on array index order from drag-and-drop
  useEffect(() => {
    if (state.workflowStage === 'selecting' && items.length > 0) {
      console.log('Finding highest priority task from list of', items.length, 'items');
      
      // Filter out completed tasks and use array order to determine priority
      // Since the array is already sorted by the drag-and-drop functionality
      const pendingTasks = items.filter(item => item.status !== 'completed');
      
      if (pendingTasks.length > 0) {
        console.log('Selected pending task:', pendingTasks[0].title);
        // Select the first pending task as it will be the highest priority
        // due to the drag-and-drop ordering
        setState(prev => ({
          ...prev,
          currentTask: pendingTasks[0],
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
