
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ProgressItem } from '@/hooks/useProgressItems';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, PlayCircle, PauseCircle } from 'lucide-react';

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
  const [currentTask, setCurrentTask] = useState<ProgressItem | null>(null);
  const [workflowStage, setWorkflowStage] = useState<'selecting' | 'proposal' | 'implementation' | 'testing' | 'completed'>('selecting');
  const [proposal, setProposal] = useState<string>('');
  const [progressValue, setProgressValue] = useState<number>(0);
  const { toast } = useToast();

  // Find the highest priority pending task
  useEffect(() => {
    if (items.length > 0 && workflowStage === 'selecting') {
      // Prioritize high priority tasks first, then medium, then low
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      
      const sortedItems = [...items]
        .filter(item => item.status !== 'completed')
        .sort((a, b) => {
          // First sort by priority
          const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                              priorityOrder[b.priority as keyof typeof priorityOrder];
          
          if (priorityDiff !== 0) return priorityDiff;
          
          // Then by updated date (most recent first)
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
      
      if (sortedItems.length > 0) {
        setCurrentTask(sortedItems[0]);
        setWorkflowStage('proposal');
        setProgressValue(25);
      } else {
        setCurrentTask(null);
      }
    }
  }, [items, workflowStage]);

  const handleApproveProposal = async () => {
    if (!currentTask) return;
    
    // Record the proposal as a comment
    const commentSuccess = await onAddComment(
      `APPROVED PROPOSAL: ${proposal}`, 
      currentTask.id
    );
    
    if (commentSuccess) {
      // Update the status to in_progress
      await onUpdateStatus(currentTask.id, 'in_progress');
      
      toast({
        title: "Proposal approved",
        description: "The task has been moved to implementation phase.",
      });
      
      setWorkflowStage('implementation');
      setProgressValue(50);
    } else {
      toast({
        variant: "destructive",
        title: "Error approving proposal",
        description: "There was an error saving the proposal. Please try again.",
      });
    }
  };

  const handleRejectProposal = () => {
    setProposal('');
    toast({
      title: "Proposal rejected",
      description: "Please provide a new proposal for this task.",
    });
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
      
      setWorkflowStage('testing');
      setProgressValue(75);
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
          
          setWorkflowStage('completed');
          setProgressValue(100);
          
          // Reset after a delay to select the next task
          setTimeout(() => {
            setWorkflowStage('selecting');
            setProgressValue(0);
            setProposal('');
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
        
        setWorkflowStage('implementation');
        setProgressValue(50);
      }
    }
  };

  const generateProposal = () => {
    // In a real implementation, this could be an AI-generated proposal
    // For now, we'll just provide a template
    if (!currentTask) return;
    
    const proposalTemplate = 
      `Proposed Solution for: ${currentTask.title}
      
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
    
    setProposal(proposalTemplate);
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
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-puzzle-white mb-1">{currentTask.title}</h3>
              <div className="flex items-center space-x-2">
                <Badge className={
                  currentTask.priority === 'high' ? 'bg-red-600' : 
                  currentTask.priority === 'medium' ? 'bg-amber-600' : 'bg-blue-600'
                }>
                  {currentTask.priority}
                </Badge>
                <Badge className={
                  currentTask.status === 'completed' ? 'bg-green-600' : 
                  currentTask.status === 'in_progress' ? 'bg-amber-600' : 'bg-slate-600'
                }>
                  {currentTask.status.replace('_', ' ')}
                </Badge>
              </div>
              {currentTask.description && (
                <p className="text-puzzle-white/80 mt-2">{currentTask.description}</p>
              )}
            </div>
            
            <Separator className="my-4 bg-puzzle-aqua/20" />
            
            <div className="mb-4">
              <div className="flex justify-between mb-2 text-puzzle-white/80">
                <span>Select Task</span>
                <span>Create Proposal</span>
                <span>Implementation</span>
                <span>Testing</span>
              </div>
              <Progress value={progressValue} className="h-2 bg-puzzle-black" />
            </div>
            
            {workflowStage === 'proposal' && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-puzzle-white mb-2">Proposal</h4>
                {proposal ? (
                  <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-4 text-puzzle-white whitespace-pre-line">
                    {proposal}
                  </div>
                ) : (
                  <div className="flex justify-center p-4">
                    <Button onClick={generateProposal}>
                      Generate Proposal
                    </Button>
                  </div>
                )}
                
                {proposal && (
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" onClick={handleRejectProposal}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={handleApproveProposal}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {workflowStage === 'implementation' && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-puzzle-white mb-2">Implementation</h4>
                <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-4 text-puzzle-white">
                  <div className="flex items-center">
                    <PlayCircle className="h-6 w-6 text-amber-500 mr-2" />
                    <span>Implementation in progress...</span>
                  </div>
                  <p className="mt-2">The team is currently implementing the approved solution.</p>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleImplementationComplete}>
                    Mark Implementation Complete
                  </Button>
                </div>
              </div>
            )}
            
            {workflowStage === 'testing' && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-puzzle-white mb-2">Testing</h4>
                <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-4 text-puzzle-white">
                  <div className="flex items-center">
                    <PauseCircle className="h-6 w-6 text-blue-500 mr-2" />
                    <span>Testing phase...</span>
                  </div>
                  <p className="mt-2">
                    Please verify that the implementation meets all requirements. Is it working as expected?
                  </p>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" onClick={() => handleTestingComplete(false)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Failed
                  </Button>
                  <Button onClick={() => handleTestingComplete(true)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Passed
                  </Button>
                </div>
              </div>
            )}
            
            {workflowStage === 'completed' && (
              <div className="mt-6">
                <div className="bg-green-900/20 border border-green-500 rounded-md p-4 text-puzzle-white">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    <span className="font-semibold">Task Completed Successfully!</span>
                  </div>
                  <p className="mt-2">
                    Moving to the next task shortly...
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
