
import React from 'react';
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      
      <CardFooter className="flex justify-between bg-gray-50 border-t">
        <div className="flex space-x-2">
          {task.status !== 'completed' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdateStatus(task.id, 'in-progress')}
              disabled={task.status === 'in-progress'}
            >
              Start
            </Button>
          )}
          
          {task.status === 'in-progress' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdateStatus(task.id, 'completed')}
            >
              Mark Complete
            </Button>
          )}
        </div>
        
        {taskTests.length > 0 && (
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onRunTests(task.id)}
            disabled={isTestRunning}
          >
            Run Tests
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
