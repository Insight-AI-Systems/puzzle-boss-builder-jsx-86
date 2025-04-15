
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Clock, MessageSquare } from "lucide-react";
import { ProgressItem } from '@/hooks/useProgressItems';

interface ProgressItemRowProps {
  item: ProgressItem;
  onToggleComments: (id: string) => void;
  isExpanded: boolean;
}

export const ProgressItemRow: React.FC<ProgressItemRowProps> = ({ 
  item, 
  onToggleComments,
  isExpanded
}) => {
  return (
    <TableRow 
      className="border-puzzle-aqua/20 cursor-pointer"
      onClick={() => onToggleComments(item.id)}
      data-state={isExpanded ? 'expanded' : 'collapsed'}
    >
      <TableCell className="text-puzzle-white font-medium">{item.title}</TableCell>
      <TableCell className="text-puzzle-white">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 
          item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
          'bg-yellow-100 text-yellow-800'}`}>
          {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      </TableCell>
      <TableCell className="text-puzzle-white">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${item.priority === 'high' ? 'bg-red-100 text-red-800' : 
          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'}`}>
          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
        </span>
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
