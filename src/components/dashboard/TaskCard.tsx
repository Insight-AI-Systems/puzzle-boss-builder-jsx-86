
import React from 'react';
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, RotateCw } from 'lucide-react';
import { ProjectTask, ProjectTest } from '@/utils/types/projectTypes';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskCardProps {
  task: ProjectTask;
  taskTests: ProjectTest[];
  isTestRunning: boolean;
  onRunTests: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  taskTests,
  isTestRunning,
  onRunTests,
  onUpdateStatus
}) => {
  const handleRunTests = () => {
    console.log('Running tests for task:', task.id);
    onRunTests(task.id);
  };

  const handleStartTask = () => {
    console.log('Starting task:', task.id);
    onUpdateStatus(task.id, 'in-progress');
  };

  const handleCompleteTask = () => {
    console.log('Completing task:', task.id);
    onUpdateStatus(task.id, 'completed');
  };

  return (
    <Card key={task.id} className="overflow-hidden">
      <div className="flex justify-between items-start p-4">
        <div>
          <h4 className="font-medium">{task.name}</h4>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
        <TaskStatusBadge status={task.status} />
      </div>
      
      {taskTests.length > 0 && (
        <>
          <Separator />
          <div className="p-4 bg-gray-50">
            <h5 className="text-sm font-medium mb-2">Tests</h5>
            <div className="space-y-2">
              {taskTests.map(test => test && (
                <div key={test.id} className="flex justify-between items-center">
                  <span className="text-sm">{test.name}</span>
                  {test.lastResult !== undefined && (
                    <Badge className={test.lastResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {test.lastResult ? 'Passed' : 'Failed'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <CardFooter className="flex justify-between bg-gray-50 border-t p-3">
        <div className="flex space-x-2">
          {task.status !== 'completed' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleStartTask}
              disabled={task.status === 'in-progress'}
              className="hover:bg-puzzle-aqua/10 hover:text-puzzle-aqua"
            >
              <Play className="h-4 w-4 mr-1" />
              {task.status === 'in-progress' ? 'In Progress' : 'Start'}
            </Button>
          )}
          
          {task.status === 'in-progress' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCompleteTask}
              className="hover:bg-green-100 hover:text-green-800"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
        </div>
        
        {taskTests.length > 0 && (
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleRunTests}
            disabled={isTestRunning}
            className="bg-puzzle-black/50 text-puzzle-white hover:bg-puzzle-aqua/20"
          >
            <RotateCw className={`h-4 w-4 mr-1 ${isTestRunning ? 'animate-spin' : ''}`} />
            {isTestRunning ? 'Running...' : 'Run Tests'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
