
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, RotateCw, AlertCircle } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: string;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'in-progress': return <RotateCw className="h-3 w-3 mr-1" />;
      case 'failed': return <AlertCircle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <Badge className={`flex items-center ${getTaskStatusColor(status)}`}>
      {getTaskStatusIcon(status)}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </Badge>
  );
};
