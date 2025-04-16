
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProgressItem } from '@/hooks/useProgressItems';
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
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
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
      <TableCell className="text-puzzle-white">{item.status}</TableCell>
      <TableCell className="text-puzzle-white">{item.priority}</TableCell>
      <TableCell className="text-puzzle-white">
        {new Date(item.updated_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-puzzle-white">
        {item.progress_comments?.length || 0}
      </TableCell>
    </TableRow>
  );
}
