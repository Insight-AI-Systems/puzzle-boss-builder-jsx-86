
import React from 'react';
import { ProjectTask, ProjectTest } from '@/utils/types/projectTypes';
import { TaskCard } from './TaskCard';

interface PhaseContentProps {
  phaseTasks: ProjectTask[];
  tests: ProjectTest[];
  isTestRunning: boolean;
  onRunTests: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
}

export const PhaseContent: React.FC<PhaseContentProps> = ({
  phaseTasks,
  tests,
  isTestRunning,
  onRunTests,
  onUpdateStatus
}) => {
  return (
    <div className="space-y-3">
      {phaseTasks.map(task => {
        const taskTests = task.testIds?.map(testId => 
          tests.find(test => test.id === testId)
        ).filter(Boolean) || [];
        
        return (
          <TaskCard
            key={task.id}
            task={task}
            taskTests={taskTests}
            isTestRunning={isTestRunning}
            onRunTests={onRunTests}
            onUpdateStatus={onUpdateStatus}
          />
        );
      })}
    </div>
  );
};
