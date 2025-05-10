
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProgressItem } from '@/types/progressTypes';
import { TableCell, TableRow } from "@/components/ui/table";
import { GripVertical } from 'lucide-react';

interface DraggableTableRowProps {
  item: ProgressItem;
}

export function DraggableTableRow({ item }: DraggableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    // Add required configuration for newer @dnd-kit versions
    resizeObserverConfig: {
      disabled: false
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
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
      ref={setNodeRef}
      style={style}
      className={`border-puzzle-aqua/20 hover:bg-puzzle-aqua/5 ${isDragging ? 'bg-puzzle-aqua/10' : ''}`}
    >
      <TableCell className="text-puzzle-white flex items-center gap-2">
        <span {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-puzzle-aqua/50 hover:text-puzzle-aqua cursor-grab" />
        </span>
        {item.title}
      </TableCell>
      <TableCell className="text-puzzle-white">
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(item.status)}`}>
          {item.status.replace('_', ' ')}
        </span>
      </TableCell>
      <TableCell className="text-puzzle-white">
        <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(item.priority)}`}>
          {item.priority}
        </span>
      </TableCell>
      <TableCell className="text-puzzle-white">
        {new Date(item.updated_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-puzzle-white">
        {item.progress_comments?.length || 0}
      </TableCell>
    </TableRow>
  );
}
