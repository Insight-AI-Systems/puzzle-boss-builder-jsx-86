
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
  return (
    <TableRow 
      className="border-puzzle-aqua/20 hover:bg-puzzle-aqua/5"
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
      <TableCell className="text-puzzle-white">
        <Select
          value={item.status}
          onValueChange={(value) => onStatusChange(item.id, value)}
        >
          <SelectTrigger className={`w-[130px] 
            ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 
            item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
            'bg-yellow-100 text-yellow-800'}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-puzzle-white">
        <Select
          value={item.priority}
          onValueChange={(value) => onPriorityChange(item.id, value)}
        >
          <SelectTrigger className={`w-[130px]
            ${item.priority === 'high' ? 'bg-red-100 text-red-800' : 
            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-green-100 text-green-800'}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-puzzle-white">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-puzzle-aqua" />
          {new Date(item.updated_at).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell className="text-puzzle-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-puzzle-aqua" />
          {item.progress_comments?.length || 0}
        </div>
      </TableCell>
    </TableRow>
  );
};
