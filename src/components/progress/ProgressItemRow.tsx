
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Clock, MessageSquare } from "lucide-react";
import { ProgressItem } from '@/hooks/useProgressItems';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ProgressItemRowProps {
  item: ProgressItem;
  onToggleComments: (id: string) => void;
  isExpanded: boolean;
  onStatusChange: (id: string, status: string) => void;
  onPriorityChange: (id: string, priority: string) => void;
}

export const ProgressItemRow: React.FC<ProgressItemRowProps> = ({ 
  item, 
  onToggleComments,
  isExpanded,
  onStatusChange,
  onPriorityChange
}) => {
  const handleStatusChange = async (value: string) => {
    try {
      await onStatusChange(item.id, value);
      toast({
        title: "Status updated",
        description: "Task status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error in status change handler:', error);
    }
  };

  const handlePriorityChange = async (value: string) => {
    try {
      await onPriorityChange(item.id, value);
      toast({
        title: "Priority updated",
        description: "Task priority has been updated successfully.",
      });
    } catch (error) {
      console.error('Error in priority change handler:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <TableRow 
      className="border-puzzle-aqua/20 hover:bg-puzzle-aqua/5 cursor-pointer"
      data-state={isExpanded ? 'expanded' : 'collapsed'}
    >
      <TableCell className="text-puzzle-white font-medium" onClick={() => onToggleComments(item.id)}>
        <div>
          {item.title}
          {item.description && (
            <p className="text-sm text-puzzle-white/70 mt-1">{item.description}</p>
          )}
        </div>
      </TableCell>
      <TableCell className="text-puzzle-white" onClick={(e) => e.stopPropagation()}>
        <Select
          value={item.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className={`w-[130px] ${getStatusColor(item.status)}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-puzzle-white" onClick={(e) => e.stopPropagation()}>
        <Select
          value={item.priority}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className={`w-[130px] ${getPriorityColor(item.priority)}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-puzzle-white" onClick={() => onToggleComments(item.id)}>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-puzzle-aqua" />
          {new Date(item.updated_at).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell className="text-puzzle-white" onClick={() => onToggleComments(item.id)}>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-puzzle-aqua" />
          {item.progress_comments?.length || 0}
        </div>
      </TableCell>
    </TableRow>
  );
};
