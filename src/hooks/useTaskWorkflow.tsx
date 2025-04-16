
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

  // Find the highest priority pending task
  useEffect(() => {
    if (items.length > 0 && state.workflowStage === 'selecting') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      
      const sortedItems = [...items]
        .filter(item => item.status !== 'completed')
        .sort((a, b) => {
          const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                              priorityOrder[b.priority as keyof typeof priorityOrder];
          
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
      
      if (sortedItems.length > 0) {
        setState(prev => ({
          ...prev,
          currentTask: sortedItems[0],
          workflowStage: 'proposal',
          progressValue: 25
        }));
      } else {
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
