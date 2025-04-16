
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface TaskProgressProps {
  progressValue: number;
}

export const TaskProgress: React.FC<TaskProgressProps> = ({ progressValue }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2 text-puzzle-white/80">
        <span>Select Task</span>
        <span>Create Proposal</span>
        <span>Implementation</span>
        <span>Testing</span>
      </div>
      <Progress value={progressValue} className="h-2 bg-puzzle-black" />
    </div>
  );
};
