
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProgressItem } from '@/hooks/useProgressItems';

interface TaskHeaderProps {
  task: ProgressItem;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-puzzle-white mb-1">{task.title}</h3>
      <div className="flex items-center space-x-2">
        <Badge className={
          task.priority === 'high' ? 'bg-red-600' : 
          task.priority === 'medium' ? 'bg-amber-600' : 'bg-blue-600'
        }>
          {task.priority}
        </Badge>
        <Badge className={
          task.status === 'completed' ? 'bg-green-600' : 
          task.status === 'in_progress' ? 'bg-amber-600' : 'bg-slate-600'
        }>
          {task.status.replace('_', ' ')}
        </Badge>
      </div>
      {task.description && (
        <p className="text-puzzle-white/80 mt-2">{task.description}</p>
      )}
    </div>
  );
};
