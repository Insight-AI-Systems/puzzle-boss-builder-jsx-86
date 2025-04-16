
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ProgressItem } from '@/hooks/useProgressItems';
import { CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTaskWorkflow } from '@/hooks/useTaskWorkflow';
import { ProposalStage } from './workflow/ProposalStage';
import { ImplementationStage } from './workflow/ImplementationStage';
import { TestingStage } from './workflow/TestingStage';
import { CompletedStage } from './workflow/CompletedStage';
import { TaskHeader } from './workflow/TaskHeader';
import { TaskProgress } from './workflow/TaskProgress';

interface AutomatedTaskFlowProps {
  items: ProgressItem[];
  onUpdateStatus: (itemId: string, status: string) => Promise<boolean>;
  onAddComment: (content: string, itemId: string) => Promise<boolean>;
}

export const AutomatedTaskFlow: React.FC<AutomatedTaskFlowProps> = ({
  items,
  onUpdateStatus,
  onAddComment,
}) => {
  const { toast } = useToast();
  const {
    currentTask,
    workflowStage,
    proposal,
    progressValue,
    generateProposal,
    setStage,
    resetWorkflow,
    setState
  } = useTaskWorkflow(items);

  const handleApproveProposal = async () => {
    if (!currentTask) return;
    
    const commentSuccess = await onAddComment(
      `APPROVED PROPOSAL: ${proposal}`, 
      currentTask.id
    );
    
    if (commentSuccess) {
      await onUpdateStatus(currentTask.id, 'in_progress');
      
      toast({
        title: "Proposal approved",
        description: "The task has been moved to implementation phase.",
      });
      
      setStage('implementation', 50);
    } else {
      toast({
        variant: "destructive",
        title: "Error approving proposal",
        description: "There was an error saving the proposal. Please try again.",
      });
    }
  };

  const handleImplementationComplete = async () => {
    if (!currentTask) return;
    
    const commentSuccess = await onAddComment(
      "IMPLEMENTATION COMPLETED: Ready for testing", 
      currentTask.id
    );
    
    if (commentSuccess) {
      toast({
        title: "Implementation completed",
        description: "The task is now ready for testing.",
      });
      
      setStage('testing', 75);
    }
  };

  const handleTestingComplete = async (success: boolean) => {
    if (!currentTask) return;
    
    if (success) {
      const commentSuccess = await onAddComment(
        "TESTING COMPLETED: All tests passed successfully", 
        currentTask.id
      );
      
      if (commentSuccess) {
        const statusSuccess = await onUpdateStatus(currentTask.id, 'completed');
        
        if (statusSuccess) {
          toast({
            title: "Task completed",
            description: "The task has been marked as completed.",
          });
          
          setStage('completed', 100);
          
          setTimeout(() => {
            resetWorkflow();
          }, 3000);
        }
      }
    } else {
      const commentSuccess = await onAddComment(
        "TESTING FAILED: Implementation needs revision", 
        currentTask.id
      );
      
      if (commentSuccess) {
        toast({
          variant: "destructive",
          title: "Testing failed",
          description: "The implementation needs revision.",
        });
        
        setStage('implementation', 50);
      }
    }
  };

  // If no pending tasks
  if (!currentTask && workflowStage === 'selecting') {
    return (
      <Card className="mt-6 bg-puzzle-black/50 border-puzzle-aqua/20">
        <CardHeader>
          <CardTitle className="text-puzzle-white">Task Automation</CardTitle>
          <CardDescription className="text-puzzle-white/70">
            All tasks have been completed. Add new tasks to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <CheckCircle className="h-16 w-16 text-green-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-puzzle-white">All Caught Up!</h3>
              <p className="text-puzzle-white/70">No pending tasks in the system.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 bg-puzzle-black/50 border-puzzle-aqua/20">
      <CardHeader>
        <CardTitle className="text-puzzle-white">Task Automation Flow</CardTitle>
        <CardDescription className="text-puzzle-white/70">
          Automate your workflow from proposal to completion
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentTask && (
          <>
            <TaskHeader task={currentTask} />
            <Separator className="my-4 bg-puzzle-aqua/20" />
            <TaskProgress progressValue={progressValue} />
            
            {workflowStage === 'proposal' && (
              <ProposalStage
                proposal={proposal}
                onGenerateProposal={generateProposal}
                onApprove={handleApproveProposal}
                onReject={() => setState(prev => ({ ...prev, proposal: '' }))}
              />
            )}
            
            {workflowStage === 'implementation' && (
              <ImplementationStage onComplete={handleImplementationComplete} />
            )}
            
            {workflowStage === 'testing' && (
              <TestingStage onComplete={handleTestingComplete} />
            )}
            
            {workflowStage === 'completed' && <CompletedStage />}
          </>
        )}
      </CardContent>
    </Card>
  );
};
